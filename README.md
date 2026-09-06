# 🍧 Paradice - Plataforma de Juegos y Premios Granizados (Arquitectura MVC)

Plataforma Web interactiva estilo Arcade / Casino para puntos de venta y fidelización universitaria de **Paradice - El Paraíso del Hielo & el Buen Ritmo**. 

El sistema incluye **5 minijuegos interactivos**, un **Centro Oficial de Verificación Anti-Fraude**, un **Reproductor de Música Eurodance/Latina** con **116 canciones de los 90s/00s** y arquitectura desacoplada en **Model-View-Controller (MVC)** para despliegue web inmediato.

---

## 🏛️ Arquitectura del Sistema (MVC + Core Services)

La plataforma no depende de compiladores pesados ni bundlers propietarios (Webpack, Vite, Rollup). Todo el código está escrito en **JavaScript nativo modular**, permitiendo que funcione al 100% tanto en hosting estático en la nube como en modo offline local mediante doble clic (`file:///`).

```
c:\Users\TC\Documents\Paradice\Juegos\
├── css\
│   └── style.css                      # Estilos visuales neón, degradados de escarcha y animaciones
├── images\
│   └── bg-granizados.jpg              # Fondos y texturas
├── music\                             # Catálogo de 116 canciones (Eurodance, House, Merengue House, Reggaeton clásico)
├── js\
│   ├── libs\
│   │   └── qrcode.min.js              # Generación autónoma de códigos QR de canje
│   ├── core\
│   │   ├── AudioManager.js            # Reproductor universal con 116 canciones, SFX arcade y temas de victoria
│   │   ├── SecurityService.js         # Algoritmo de firma criptográfica SHA/Dual-hash y generador de MACs
│   │   └── StorageService.js          # Persistencia unificada de vidas (3 vidas por juego), historial y settings
│   └── mvc\
│       ├── slot\                      # Tragamonedas / Reels (index.html)
│       │   ├── SlotConfig.js          # Catálogo de 9 símbolos, pesos RNG y tabla de pagos
│       │   ├── SlotModel.js           # Matriz 5x3, evaluador de aciertos y vidas
│       │   ├── SlotView.js            # Animación de 5 rodillos, desenfoque de giro, confeti y modales
│       │   └── SlotController.js      # Orquestación de tiradas, atajo de teclado y supervisor
│       ├── minas\                     # Minas Paradice (minas.html)
│       │   ├── MinasModel.js          # Tablero 5x5, dispersión de minas, aciertos seguros y vidas
│       │   ├── MinasView.js           # Baldosas de hielo 3D, animación de flip, explosión y voucher
│       │   └── MinasController.js     # Selección de hielos, botón de asegurar premio (cash-out)
│       ├── hitbar\                    # Hit Bar Rush 2.0 (hitbar.html)
│       │   ├── HitbarModel.js         # Niveles 1-6, objetivos dinámicos, velocidades y vidas
│       │   ├── HitbarView.js          # Cinta deslizante horizontal, detección de zona láser y modales
│       │   └── HitbarController.js    # Frenado de precisión al milisegundo y cobro
│       ├── dados\                     # Dice Battle (dados.html)
│       │   ├── DadosModel.js          # 3 dados, evaluación de tríos, escaleras, pares y sumas
│       │   ├── DadosView.js           # Caras de dados 3D con puntos neón y animación de agitado
│       │   └── DadosController.js     # Lanzamiento, re-tiro gastando vidas y voucher
│       ├── ruleta\                    # Ruleta Paradice (ruleta.html)
│       │   ├── RuletaModel.js         # 12 sectores ponderados, física angular y vidas
│       │   ├── RuletaView.js          # Canvas 2D en alta resolución, aguja con desaceleración
│       │   └── RuletaController.js    # Giro físico, detección de clavijas y cobro
│       └── verificar\                 # Centro de Verificación (verificar.html)
│           ├── VerificarModel.js      # Lectura de parámetros URL, validación contra firma digital y KPIs
│           ├── VerificarView.js       # Tarjetas de estado (Válido / Inválido / Canjeado) y tabla filtrable
│           └── VerificarController.js # Registro de canjes en caja y auditoría anti-fraude
├── index.html                         # Página Principal: Landing Page Paradice Oficial
├── tragamonedas.html                  # Juego 1: Tragamonedas Paradice (Slots)
├── slot.html                          # Alias alternativo: Tragamonedas Paradice
├── minas.html                         # Juego 2: Minas Paradice
├── hitbar.html                        # Juego 3: Hit Bar Rush 2.0
├── dados.html                         # Juego 4: Dice Battle
├── ruleta.html                        # Juego 5: Ruleta Paradice
├── verificar.html                     # Módulo de Auditoría de Caja / Supervisor
└── README.md                          # Este manual
```

---

## 🎵 Sistema Universal de Música y Audio (`AudioManager.js`)

Todos los juegos cuentan con el reproductor de audio integrado que reproduce los 116 temas MP3 de la carpeta `music/`:

- **Controles en barra superior de todos los juegos**:
  - 🔊 **SFX Toggle**: Silencia o activa los sonidos de impacto, dados, ruleta y clics.
  - 🎵 **Music Toggle**: Reproduce o pausa la música de fondo.
  - ⏭️ **Next Track**: Salta inmediatamente a la siguiente pista de la lista.
  - 🎶 **Indicador de Canción**: Muestra el nombre limpio del tema actual (ej: *Haddaway - What Is Love*, *Dr. Alban - It's My Life*).
- **Temas de Victoria Automáticos (`WIN_TRACKS`)**: Al ganar un premio mayor (2x1, granizado gratis) o al cobrar en cash-out, el sistema cambia automáticamente a una canción enérgica de celebración (*Sing Hallelujah*, *Everybody Dance Now*, *No Limit*, *Ven Bailalo*, etc.).
- **Desbloqueo de Autoplay**: Respeta las políticas de navegadores modernos iniciando suavemente en la primera interacción del usuario (clic, toque o teclado).

---

## 🔒 Sistema de Seguridad Anti-Fraude (`SecurityService.js`)

Cada vez que un jugador asegura un premio en cualquiera de los juegos:
1. Se genera una firma criptográfica hash dual única basada en:
   `intento + premio + fecha + hora + terminalId + CLAVE_SECRETA`
2. Se genera un **Código QR local** que apunta a `verificar.html` con la firma cifrada.
3. El cajero o supervisor escanea el código en el punto de venta.
4. Si alguien intenta alterar el premio en la URL (ej: cambiar `-$500` por `2x1`), la firma matemática no coincide y la pantalla de verificación muestra inmediatamente **TICKET NO AUTORIZADO (FIRMA INVÁLIDA)**.
5. Al pulsar "Canjear", el ticket queda registrado como **YA REDIMIDO**, evitando que se use dos veces.

---

## 🚀 Guía de Despliegue y Publicación Web

### Opción 1: GitHub Pages (Gratis y Recomendado)
1. Sube los archivos al repositorio de GitHub:
   ```bash
   git add .
   git commit -m "Reorganización MVC y música en todos los juegos"
   git push origin main
   ```
2. En GitHub, ve a **Settings** > **Pages**.
3. En **Branch**, selecciona `main` y la carpeta `/ (root)`.
4. Pulsa **Save**. En 1 minuto tendrás tu enlace público:
   `https://tu-usuario.github.io/tu-repositorio/index.html`

### Opción 2: Netlify o Vercel
- **Netlify**: Simplemente arrastra y suelta la carpeta `Juegos` en [Netlify Drop](https://app.netlify.com/drop).
- **Vercel**: Conecta tu repositorio de GitHub e indica como raíz la carpeta del proyecto.

### Opción 3: Servidor Local / Pruebas
Puedes abrir cualquier archivo HTML (`index.html`, `minas.html`, etc.) directamente con doble clic en tu explorador de archivos, o iniciar un servidor web local:
- Con Python: `python -m http.server 8080`
- Con Node: `npx serve .`

---

## 🎮 Catálogo de Juegos

| Archivo | Sección / Juego | Mecánica Principal | Premio Mayor |
| :--- | :--- | :--- | :--- |
| `index.html` | **Landing Page Oficial** | Portal de marca, carta de sabores, combos y acceso al arcade | N/A (Portal Principal) |
| `tragamonedas.html` | **Tragamonedas Paradice** | 5 rodillos x 3 filas con parada secuencial | Granizado Gratis (⭐) |
| `slot.html` | **Tragamonedas (Alias)** | Idéntico a tragamonedas.html para compatibilidad | Granizado Gratis (⭐) |
| `minas.html` | **Minas Paradice** | Tablero 5x5 de hielos, esquivar minas y cash-out | ¡Super Promo 2x1! |
| `hitbar.html` | **Hit Bar Rush 2.0** | Velocidad y reflejo al milisegundo en cinta láser | ¡Super Promo 2x1! |
| `dados.html` | **Dice Battle** | Duelo de 3 dados de hielo en 3D (Tríos y escaleras) | ¡Super Promo 2x1! |
| `ruleta.html` | **Ruleta Paradice** | Ruleta de 12 sectores con física de inercia y aguja | ¡Super Promo 2x1! |
| `verificar.html`| **Auditoría de Caja** | Verificación criptográfica de vouchers y registro POS | N/A (Administración) |

---

© 2026 **PARADICE** • El Paraíso del Hielo & el Buen Ritmo. Todos los derechos reservados.
