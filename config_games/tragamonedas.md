# Documento de Especificación Técnica: Actualización de Recompensas Minijuego PARADICE

**Descripción:** Configuración de la tabla de *drop rates* (probabilidades de aparición) y reglas de negocio para el minijuego promocional estilo casino de PARADICE. Los parámetros están optimizados para maximizar la rentabilidad priorizando la rotación del inventario de 16 oz.

---

## 1. Tabla de Drop Rates (Configuración del Gacha/Ruleta)

El sistema debe configurarse sobre una base de probabilidad del 100%. A continuación se detallan los 10 niveles de premios ordenados por rareza.

| Tier / Rareza | ID Promoción | Etiqueta en Interfaz (Premio) | Drop Rate |
| :--- | :--- | :--- | :--- |
| **Jackpot** | `PROMO_2X1_16OZ` | ¡SUPER PROMO 2x1! (Solo Vaso 16 oz) | **1.0%** |
| **Épico** | `PROMO_2X16_22K` | 2 Vasos de 16 oz x $22.000 | **4.0%** |
| **Épico** | `PROMO_1X16_11K` | Granizado de 16 oz a $11.000 | **5.0%** |
| **Raro** | `PROMO_COMBO_16_9` | Combo Amigos: 16 oz + 9 oz x $19.000 | **10.0%** |
| **Raro** | `PROMO_JERINGA_FREE` | Jeringa de Alcohol GRATIS con tu 16 oz | **10.0%** |
| **Poco Común** | `PROMO_1X16_13K` | Granizado doble (16 oz) por $13.000 | **15.0%** |
| **Poco Común** | `PROMO_2X9_14K` | Combo 2 de 9 oz x $14.000 | **15.0%** |
| **Común** | `DESC_1500_16OZ` | -$1.500 de descuento en vaso de 16 oz | **15.0%** |
| **Común** | `DESC_1000_9OZ` | -$1.000 de descuento en vaso de 9 oz | **15.0%** |
| **Consolación**| `DESC_500_ANY` | -$500 en cualquier compra | **10.0%** |

*Nota para desarrollo: La sumatoria de Drop Rates es exactamente 100.0%.*

---

## 2. Reglas de Negocio (Validaciones de Frontend/Backend)

Para asegurar la rentabilidad calculada, el sistema (o el operario al redimir) debe aplicar estrictamente las siguientes restricciones lógicas para cada ID de promoción:

### Restricciones Críticas (Evitar pérdida operativa)
*   **`PROMO_2X1_16OZ`:** La validación de este premio **debe bloquear** su aplicación en vasos de 9 oz. Si el usuario selecciona el tamaño de 9 oz, la promoción no debe ser válida. 
*   **`PROMO_JERINGA_FREE`:** El descuento del 100% en el aditivo (jeringa) solo se activa si en el carrito de compras existe al menos un (1) vaso de 16 oz a precio regular ($15.000).

### Lógica de Combos y Descuentos Directos
*   **Combos (IDs `PROMO_2X16_22K`, `PROMO_COMBO_16_9`, `PROMO_2X9_14K`):** El sistema debe establecer el precio fijo final indicado. No son acumulables con otros descuentos de fidelización.
*   **Descuentos Específicos por Tamaño (IDs `PROMO_1X16_11K`, `PROMO_1X16_13K`, `DESC_1500_16OZ`, `DESC_1000_9OZ`):** El descuento está anclado a un SKU/Tamaño específico. El premio debe indicar claramente en la interfaz el tamaño al que aplica para evitar fricciones con el cliente al momento del cobro.
*   **`DESC_500_ANY`:** Es el único descuento global. Aplica como un valor absoluto restado del total de la factura, sin importar el tamaño o la cantidad de vasos.

---

## 3. Notas de Interfaz de Usuario (UI) para el Minijuego

*   **Jerarquía Visual:** Los premios de categoría *Jackpot* y *Épico* deben tener efectos visuales destacados (brillos, animaciones) para generar expectativa, aunque su probabilidad combinada sea solo del 10%.
*   **Claridad del Premio:** En la pantalla de victoria, el texto debe especificar las condiciones. Por ejemplo, en lugar de mostrar solo "¡SUPER PROMO 2x1!", mostrar "¡SUPER PROMO 2x1! *(Aplica solo para presentación de 16 oz)*".