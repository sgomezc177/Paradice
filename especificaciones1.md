# Especificación Técnica y de Implementación: Tragamonedas / Ruleta de Granizados (Web JS)

Documento formal de requerimientos técnicos, arquitectura lógica, sistema de probabilidades ponderadas (RNG) y pautas de diseño responsive para implementar en JavaScript Frontend / Anti Gravity.

---

## 1. Visión General y Modelo Operativo

- **Tipo de Sistema:** Web Application interactiva (Single Page Application - SPA) estilo máquina tragamonedas (5 rodillos x 3 filas).
- **Entorno de Despliegue:** Acceso directo mediante URL pública (sin sistema de autenticación ni login de clientes).
- **Control Presencial (Juez / Supervisor):** El tiro se realiza en el mostrador frente al encargado o juez del punto de venta. Esto permite validar el premio en tiempo real antes de entregar el beneficio en caja.
- **Mecánica de Participación:** Cada tiro genera un resultado inmediato. La gran mayoría de tiradas otorgan descuentos o combos para incentivar el consumo, mientras que los premios mayores están regulados por probabilidad controlada. Si el jugador no alcanza la combinación mínima (se "blanquea" o "mojarro"), el sistema reproduce un sonido característico de fallo.

---

## 2. Especificaciones de UI / UX y Responsive Design

### 2.1. Adaptabilidad y Layout
- **Mobile First:** Orientación vertical (estilo pantalla de smartphone / casino digital), ocupando el 100% de la altura de pantalla visible (`100dvh`).
- **Escritorio / Tablet:** Contenedor centralizado con relación de aspecto móvil fija (ej. max-width: 450px) y fondo ambiental con degradados de hielo/neón.

### 2.2. Distribución de Pantalla
1. **Header / Tabla de Pagos (Superior):**
   - Escala visual vertical con los premios disponibles (Descuentos, Combos, Bonus y Granizado Gratis).
   - Capacidad de iluminar/resaltar (`glow effect`) el nivel obtenido al finalizar la tirada.
2. **Viewport de Rodillos (Central):**
   - Matriz de 5 rodillos (columnas) con 3 filas visibles (5x3 = 15 símbolos visibles).
   - Máscara de cristal con efecto hielo / condensación transparente.
   - Animación de scroll vertical con efecto de desenfoque de movimiento (*motion blur*) y parada secuencial de izquierda a derecha.
3. **Panel de Control y Disparo (Inferior):**
   - Botón principal de **GIRAR / SPIN** (flechas circulares de recarga).
   - Bloqueo inmediato del botón durante el giro para evitar dobles peticiones.
   - Panel de estado: Indicador de premio / mensaje final.
   - Botón discreto de reinicio para el supervisor tras validar el premio.

---

## 3. Catálogo de Símbolos y Assets

| ID Símbolo | Nombre | Categoría | Icono Temporal / Referencia | Peso RNG |
| :--- | :--- | :--- | :--- | :--- |
| `SYM_LIMON` | Limón Cítrico | Fruta Base | 🍋 | 28 |
| `SYM_NARANJA` | Naranja Dulce | Fruta Base | 🍊 | 26 |
| `SYM_COPA_AZUL` | Granizado Azul | Bebida Estándar | 🍧 | 20 |
| `SYM_COPA_VERDE`| Granizado Menta/Verde | Bebida Estándar | 🍹 | 18 |
| `SYM_SHOT` | Shot de Licor | Alcohol | 🥃 | 14 |
| `SYM_COCTEL_ROJO`| Frozen Berries Rojo | Especial | 🍸 | 10 |
| `SYM_VODKA` | Vaso Vodka Frozen | Premium | 🍷 | 8 |
| `SYM_BONUS` | Jeringa / Coctelera Bonus | Bonus Especial | 💉 | 5 |
| `SYM_GRATIS` | Sello Granizado Gratis | Jackpot / Scatter | ⭐ | 2 |

---

## 4. Tabla de Premios y Lógica de Evaluación

### 4.1. Criterio de Conteo
Al detenerse el quinto rodillo, se realiza el escrutinio de los 15 símbolos presentes en pantalla:
- **Premios por Coincidencia:** Se cuentan las repeticiones del mismo símbolo en toda la cuadrícula (o por líneas activas, según configuración).
- **Mínimo Requerido:** 3 símbolos iguales para acceder a descuentos o bonus.
- **Condición de Blanqueo / Mojarro:** Menos de 3 símbolos iguales o ausencia de combinaciones registradas.

### 4.2. Escala de Pagos

| Rango / Nivel | Condición de Acierto | Beneficio / Descuento | Acción de Feedback |
| :--- | :--- | :--- | :--- |
| **Nivel 13 (Jackpot)** | 5+ Sellos `SYM_GRATIS` | **Granizado Gratis** | Fanfarria épica + Confeti |
| **Nivel 12** | 5 Cócteles Especiales | **2 Granizados Dobles x $23.000** | Sonido Victoria |
| **Nivel 11** | 4 Cócteles Especiales | **Granizado Doble x $13.000** | Sonido Victoria |
| **Nivel 10** | 5 Granizados (Azul/Verde) | **-$1.000 COP** | Sonido Victoria |
| **Nivel 9** | 5 Frutas (Limón/Naranja) | **-$900 COP** | Sonido Victoria |
| **Nivel 8** | 4 Granizados Estándar | **-$600 COP** | Sonido Victoria |
| **Bonus Alcohol** | 3+ Símbolos `SYM_BONUS` | **Jeringa de Alcohol Gratis** | Alerta Bonus especial |
| **Nivel 7** | 4 Frutas (Limón/Naranja) | **-$800 COP** | Sonido Victoria |
| **Nivel 5** | 3 Granizados Estándar | **-$600 COP** | Sonido Victoria |
| **Bonus 2x3** | 3 Shots de Licor | **Pague 2 Lleve 3** | Alerta Promo |
| **Nivel 4** | 3 Limones | **-$500 COP** | Sonido Descuento |
| **Nivel 3** | 3 Naranjas | **-$400 COP** | Sonido Descuento |
| **Nivel 2** | Pareja alta (2 especiales) | **-$300 COP** | Sonido Descuento |
| **Nivel 1** | Pareja básica (2 frutas) | **-$150 COP** | Sonido Descuento |
| **Nivel 0 (Mojarro)** | Sin combinaciones válidas | **Sin premio ("Mojarro / Blanqueado")** | Audio cómico de fallo |

---

## 5. Algoritmo de Probabilidad Ponderada (RNG)

```javascript
/**
 * Motor de probabilidad ponderada para la ruleta
 */
const CONFIG_SIMBOLOS = [
  { id: 'SYM_LIMON', peso: 28, valor: 'Limon' },
  { id: 'SYM_NARANJA', peso: 26, valor: 'Naranja' },
  { id: 'SYM_COPA_AZUL', peso: 20, valor: 'Granizado Azul' },
  { id: 'SYM_COPA_VERDE', peso: 18, valor: 'Granizado Verde' },
  { id: 'SYM_SHOT', peso: 14, valor: 'Shot Licor' },
  { id: 'SYM_COCTEL_ROJO', peso: 10, valor: 'Coctel Rojo' },
  { id: 'SYM_VODKA', peso: 8, valor: 'Vodka Frozen' },
  { id: 'SYM_BONUS', peso: 5, valor: 'Bonus Jeringa' },
  { id: 'SYM_GRATIS', peso: 2, valor: 'Granizado Gratis' } // Muy baja probabilidad
];

function obtenerSimboloAleatorio() {
  const pesoTotal = CONFIG_SIMBOLOS.reduce((acc, s) => acc + s.peso, 0);
  let random = Math.random() * pesoTotal;

  for (const s of CONFIG_SIMBOLOS) {
    if (random < s.peso) return s;
    random -= s.peso;
  }
  return CONFIG_SIMBOLOS[0];
}
```

---

## 6. Arquitectura del Código Frontend (Anti Gravity / JS)

### 6.1. Máquina de Estados del Juego
- `ESTADO_ESPERA (IDLE)`: Esperando interacción del cliente frente al supervisor.
- `ESTADO_GIRO (SPINNING)`: Rodillos girando, botón deshabilitado, audio de giro activo.
- `ESTADO_FRENADO (STOPPING)`: Parada progresiva rodillo por rodillo (intervalos de 300ms entre cada uno).
- `ESTADO_EVALUACION (RESOLVED)`: Conteo de coincidencias, resaltado en tabla superior y activación de audio (Victoria / Blanqueo).
- `ESTADO_BLOQUEO (LOCKED)`: Pantalla fija mostrando el resultado hasta que el supervisor presione restablecer.

### 6.2. Sistema de Audio Requerido
Configurar un gestor de sonido con soporte para precarga:
1. `sfx_spin.mp3`: Ruido cíclico mecánico / ruleta en movimiento.
2. `sfx_reel_stop.mp3`: Golpe seco al detenerse cada rodillo.
3. `sfx_win_discount.mp3`: Efecto positivo para descuentos leves.
4. `sfx_jackpot.mp3`: Fanfarria festiva de premio mayor.
5. `sfx_blanqueo.mp3`: Sonido humorístico de derrota / trompeta desafinada cuando no hay premio.

---

## 7. Plan de Validación y Pruebas
1. **Prueba de Rendimiento:** Asegurar fluidez constante (60 FPS) en animaciones CSS mediante `translateY` en dispositivos móviles estándar.
2. **Prueba de Concurrencia:** Verificar que recargar el navegador mantenga el estado o solicite validación de un nuevo tiro supervisado.
3. **Ajuste de Balance:** Si tras las primeras 50 tiradas de prueba el premio mayor sale con demasiada frecuencia, reducir el peso de `SYM_GRATIS` a 1 o ajustar el número mínimo de aciertos a 5.