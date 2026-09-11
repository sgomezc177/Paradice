# 🎵 Cómo Agregar Más Música, Géneros y Álbumes en Paradice

El reproductor universal de **Paradice Juegos** cuenta con un sistema inteligente de organización por **Géneros** y **Álbumes**. Puedes añadir tantas carpetas y canciones como desees; el sistema las detectará y organizará automáticamente.

---

## 🚀 Método Rápido (En 3 Pasos)

### Paso 1: Crea tu carpeta dentro de `music/`
Para crear un nuevo género o álbum, simplemente crea una carpeta dentro del directorio `music/`:

**Ejemplos de organización recomendada:**

- **Por Género directo:**
  ```text
  music/
  ├── Eurodance 90s/
  │   └── 001 Dr. Alban - It's My Life.mp3
  ├── Reggaeton Clasico/
  │   └── Daddy Yankee - Gasolina.mp3
  ├── Rock en Espanol/
  │   ├── Soda Stereo - De Musica Ligera.mp3
  │   └── Enanitos Verdes - Lamento Boliviano.mp3
  ├── Tech House/
  │   └── Fisher - Losing It.mp3
  └── Salsa Baul/
      └── Frankie Ruiz - Desnudate Mujer.mp3
  ```

- **Por Género y Álbum (Opcional):**
  ```text
  music/
  └── Rock en Espanol/
      ├── Cancion Animal/
      │   └── Soda Stereo - De Musica Ligera.mp3
      └── Big Yuyo/
          └── Los Pericos - Waitin.mp3
  ```

> [!TIP]
> **Nombrado de archivos:** Para que el reproductor muestre limpiamente el artista y la canción, nombra tus archivos con el formato:  
> `Artista - Nombre de la Canción.mp3`  
> *(Si el archivo tiene números al inicio como `001` o `042 - `, el sistema los limpiará automáticamente).*

---

### Paso 2: Ejecuta el actualizador de 1 solo clic

En la carpeta principal del proyecto (`Paradice/Juegos/`), haz doble clic en:

```text
actualizar_musica.bat
```

Este script escaneará automáticamente todas las carpetas y subcarpetas, extraerá los nombres de los géneros, artistas y canciones, y regenerará el catálogo universal (`js/config/music-catalog.js`) en menos de 2 segundos.

---

### Paso 3: ¡Listo! Abre o recarga la página

Al abrir `index.html` o cualquiera de los juegos (`hitbar.html`, `minas.html`, `battleround.html`, etc.):
1. El selector de género mostrará tus nuevas categorías con sus iconos correspondientes.
2. Podrás cambiar de género en tiempo real desde la barra de navegación o desde el panel lateral (Drawer) de cualquier juego.
3. El reproductor respetará tu filtro seleccionado y recordará tu elección entre páginas.

---

## 🎛️ Formatos de Audio Compatibles

El sistema admite los siguientes formatos de audio estándar:
- `.mp3` *(Recomendado para máxima compatibilidad y peso ligero)*
- `.wav`
- `.ogg`
- `.m4a`
- `.aac`
- `.flac`

---

## 🛡️ Compatibilidad con la Música Actual

- Las **116 canciones originales** de Paradice se mantienen 100% funcionales.
- El catálogo las tiene clasificadas automáticamente en:
  - **✨ Todos los Géneros**: Rotación aleatoria completa.
  - **🪩 Eurodance 90s**: Pistas de la época dorada eurodance (001 a 100).
  - **🔥 Reggaetón Clásico**: Clásicos urbanos de la raíz.
- Si en cualquier momento agregas nuevas carpetas, se sumarán sin afectar a las existentes.
