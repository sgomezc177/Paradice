# 🎮 Guía Técnica: Conectividad Multijugador WebRTC en GitHub Pages
## BattleRound Paradice — Diagnóstico, Correcciones y Recomendaciones

---

## 1. El Reto de GitHub Pages: Entorno Estático vs Servidor Dedicado

### ¿Por qué GitHub Pages es especial?
**GitHub Pages es un hosting estático** (`https://sgomezc177.github.io/Paradice/battleround.html`). Esto implica que:
- **No existe un backend ejecutable**: No hay servidor Node.js, Python, Ruby ni base de datos activa corriendo detrás.
- **No se pueden crear WebSockets propios en el host**: GitHub Pages únicamente entrega archivos HTML, CSS y JavaScript a los navegadores de los clientes.
- **Todo el multijugador debe ser cliente a cliente (Peer-to-Peer - WebRTC)**: Para que dos o más personas jueguen simultáneamente, sus navegadores deben comunicarse directamente entre sí utilizando la tecnología **WebRTC (Web Real-Time Communication)** con la librería **PeerJS**.

---

## 2. Diagnóstico del Error: `ERROR: Tiempo de espera agotado`

Al probar el juego a distancia desde GitHub Pages (un usuario en PC o Wi-Fi y otro en datos móviles 4G/5G, o en redes Wi-Fi diferentes), se producía el error `"Tiempo de espera agotado"` debido a cuatro factores técnicos críticos:

### A. Falla de Autenticación en Servidores TURN (OpenRelay / Metered)
- En la configuración previa se habían agregado los servidores `turn:openrelay.metered.ca:80` y `443` con credenciales genéricas `openrelay / openrelay`.
- **Metered.ca descontinuó el acceso público anónimo**. Al intentar autenticarse sin una API Key individual, el servidor TURN rechazaba o ignoraba los paquetes.
- El navegador web (ICE Agent) pasaba entre **15 y 30 segundos** esperando respuesta de estos servidores TURN fallidos antes de descartarlos.

### B. Supresión de los Servidores TURN Oficiales de PeerJS
- Al definir manualmente el arreglo `iceServers`, se sobrescribieron y eliminaron los servidores de retransmisión nativos y funcionales que PeerJS 1.5.4 incluye por defecto (`eu-0.turn.peerjs.com` y `us-0.turn.peerjs.com`).

### C. Temporizador Rígido de 14 Segundos
- En el código anterior había un temporizador destructivo:
  ```javascript
  state.connectionTimeoutTimer = setTimeout(() => {
    if (!state.hostConnection || !state.hostConnection.open) {
      mostrarEstadoConexion('⚠️ Tiempo de espera agotado...', 'error');
    }
  }, 14000);
  ```
- En redes celulares (4G/LTE de operadores como Claro, Movistar, Tigo) con CGNAT (Carrier-Grade NAT), la resolución DNS, el descubrimiento STUN y el intercambio de candidatos ICE pueden tardar entre **12 y 22 segundos**. A los 14 segundos exactos, el juego se declaraba erróneo y bloqueaba la pantalla.

### D. Suspensión de Pestañas en Navegadores Móviles (Mobile Background Sleep)
- Cuando el creador de la sala pulsa **"Compartir por WhatsApp"**, los sistemas operativos móviles (**iOS Safari** y **Android Chrome**) ponen en reposo la pestaña del navegador para ahorrar batería.
- Al pausar el JavaScript de la pestaña en segundo plano, la conexión WebSocket de señalización con `0.peerjs.com` se congela o se cierra.
- Cuando el amigo abre el enlace en WhatsApp e intenta conectarse, el anfitrión está "dormido" en segundo plano, provocando que la invitación no reciba respuesta a tiempo.

---

## 3. Soluciones Implementadas en el Código

En esta actualización se realizaron las siguientes correcciones de fondo en [`battleround.html`](file:///c:/Users/TC/Documents/Paradice/Juegos/battleround.html):

### 1. Limpieza y Reconfiguración de Red (`PEER_CONFIG`)
- **Eliminación de endpoints rotos**: Se removió por completo `openrelay.metered.ca` con credenciales no autorizadas.
- **Servidores STUN de Ultra Baja Latencia**:
  - `stun.l.google.com:19302` (y espejos 1 y 2).
  - `stun.cloudflare.com:3478`.
  - `global.stun.twilio.com:3478`.
- **Servidores TURN Relay Oficiales**: Se incorporaron explícitamente los servidores de retransmisión oficiales y activos de PeerJS (`turn:eu-0.turn.peerjs.com:3478` y `turn:us-0.turn.peerjs.com:3478`, con usuario `peerjs` y clave `peerjsp`).
- **Espacio para Servidores TURN Privados**: Se dejó declarada la constante `CUSTOM_TURN_SERVERS = []` para conectar fácilmente credenciales privadas gratuitas si se desea.

### 2. Flujo de Conexión Progresivo sin Bloqueo
En lugar de un temporizador de 14 segundos que cancela la sala con un mensaje de error:
1. **0s - 7s**: Muestra `📡 Conectando a distancia con la sala #XXXX...`.
2. **7s - 20s**: Muestra `⚡ Enlazando con el anfitrión vía WebRTC / Relay... En redes móviles (4G/5G) esto puede tardar unos segundos`.
3. **20s+**: Si el anfitrión no ha respondido porque minimizó la pestaña, el sistema **NO aborta la conexión**, sino que muestra un aviso amigable y un botón interactivo: **`🔄 Reintentar Conexión Ahora`**.
4. En cuanto el anfitrión vuelve al navegador y la conexión se establece, la pantalla pasa automáticamente a **`✅ ¡Conectado con éxito!`**.

### 3. Screen Wake Lock API (Evita que el Celular se Apague)
- Al crear una sala o iniciar una partida, el juego activa automáticamente la **Screen Wake Lock API** (`navigator.wakeLock.request('screen')`).
- Esto impide que la pantalla del anfitrión se bloquee mientras espera a que sus amigos escaneen el QR o ingresen el código.

### 4. Reconexión Automática al Volver de WhatsApp (`visibilitychange`)
- Se implementó un escuchador del ciclo de vida del navegador:
  ```javascript
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      if (state.peer && state.peer.disconnected && !state.peer.destroyed) {
        state.peer.reconnect(); // Restaura la conexión con 0.peerjs.com inmediatamente
      }
    }
  });
  ```
- Tan pronto el anfitrión regresa de WhatsApp al navegador, la conexión con el servidor de señalización se restablece de forma instantánea.

### 5. Banner de Invitación Inteligente por Enlace Directo
- Cuando un invitado abre `https://sgomezc177.github.io/Paradice/battleround.html?room=1234`, la interfaz detecta el parámetro y muestra un banner destacado:
  **"🎉 ¡Invitación a Sala #1234! Ingresa tu apodo abajo y pulsa UNIRME para entrar directamente a la partida."**

---

## 4. Cómo Configurar tu Propio Servidor TURN Dedicado 100% Gratuito (Opcional)

Los servidores comunitarios de PeerJS funcionan para partidas casuales. Sin embargo, para eventos, torneos o cuando hay decenas de jugadores en simultáneo detrás de cortafuegos corporativos o redes móviles estrictas, se recomienda tener credenciales TURN privadas.

### Pasos para obtener 50 GB/mes gratis en Metered.ca:
1. Ingresa a **[https://www.metered.ca/tools/openrelay/](https://www.metered.ca/tools/openrelay/)** y crea una cuenta gratuita con tu correo (no requiere tarjeta de crédito).
2. Ve a la pestaña **Dashboard** y copia tu configuración de ICE Servers o tu API Key.
3. Abre [`battleround.html`](file:///c:/Users/TC/Documents/Paradice/Juegos/battleround.html), busca la línea que dice:
   ```javascript
   const CUSTOM_TURN_SERVERS = [];
   ```
4. Pega allí tus servidores TURN generados por Metered, por ejemplo:
   ```javascript
   const CUSTOM_TURN_SERVERS = [
     {
       urls: "turn:a.relay.metered.ca:80",
       username: "TU_API_KEY_DE_METERED",
       credential: "TU_PASSWORD_DE_METERED"
     },
     {
       urls: "turn:a.relay.metered.ca:443",
       username: "TU_API_KEY_DE_METERED",
       credential: "TU_PASSWORD_DE_METERED"
     },
     {
       urls: "turn:a.relay.metered.ca:443?transport=tcp",
       username: "TU_API_KEY_DE_METERED",
       credential: "TU_PASSWORD_DE_METERED"
     }
   ];
   ```
5. Guarda el archivo y súbelo a GitHub (`git commit` y `git push`). A partir de ese momento, el 100% del tráfico de retransmisión irá por tus propios servidores de alta velocidad.

---

## 5. Buenas Prácticas para Jugar en Móviles

| Rol | Buena Práctica |
| :--- | :--- |
| **Anfitrión (Host)** | Al tocar **"WhatsApp"** para invitar amigos, envía el mensaje y **regresa inmediatamente a la pestaña de Paradice**. Mantén la pantalla del juego visible. |
| **Anfitrión (Host)** | Si tardas en la sala de espera y ves que tus amigos no conectan, simplemente revisa que tengas el aviso `💡 Mantén esta pantalla activa mientras tus amigos se unen`. |
| **Invitados (Guests)** | Si entraste mediante un link de WhatsApp pero el anfitrión aún no había regresado a su pestaña, pulsa el botón **`🔄 Reintentar Conexión Ahora`** en cuanto tu amigo confirme que ya tiene abierta la pantalla. |
| **Redes Restrictivas** | Si juegas desde redes Wi-Fi universitarias o de empresas que bloquean el tráfico UDP (juegos y videollamadas), la conexión se negociará automáticamente por el puerto 443 TCP vía TURN Relay. |

---

## 6. Alternativas de Arquitectura a Futuro

Si en el futuro deseas que las salas sigan abiertas incluso si el anfitrión cierra su navegador o apaga su teléfono, la arquitectura debe migrar de **WebRTC P2P** a un **Servidor de Sockets Dedicado**:

1. **Servidor Node.js + Socket.io en Render / Railway / Fly.io**:
   - Permite que el servidor mantenga el estado de la partida en memoria.
   - Las conexiones son WebSockets estándar hacia un único backend.
   - Planes gratuitos disponibles en Render y Railway.
2. **Supabase Realtime (Serverless)**:
   - Permite sincronizar canales de presencia y broadcast en tiempo real sin administrar servidores.
   - 100% compatible con sitios alojados en GitHub Pages.
   - Plan gratuito con hasta 200 conexiones simultáneas.

Para el estado actual en **GitHub Pages**, la solución WebRTC P2P optimizada con STUN global y TURN Relay implementada en esta versión proporciona una experiencia rápida, sin costo de infraestructura y con baja latencia.
