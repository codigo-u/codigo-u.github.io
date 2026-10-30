# CÓDIGO U · Página de presentación

Landing de presentación de CÓDIGO U (Pre-ICFES): origen y cofundadores, qué hacemos, cómo lo hacemos, planes y preguntas frecuentes.
Usa los colores, las fuentes y el búho de la plataforma, y animaciones con GSAP + ScrollTrigger.

## Archivos

| Archivo | Qué tiene |
|---|---|
| `index.html` | Todo el contenido de la página |
| `css/styles.css` | Colores (arriba, en `:root`), diseño y versión para celular |
| `js/main.js` | WhatsApp, búhos, menú, preguntas y animaciones |
| `assets/owl.svg` | El búho (también es el ícono de la pestaña) |
| `assets/team/` | Fotos de los cofundadores |

## Cambios rápidos

**Número de WhatsApp**: en `js/main.js`, llena `WHATSAPP_NUMBER` con el indicativo y sin `+` ni espacios, por ejemplo `'573001234567'`. Los mensajes que se envían están justo debajo, en `WA_MESSAGES`.

**Fotos de los cofundadores**: guarda las fotos en `assets/team/` con estos nombres y, en `index.html`, quita el `<!-- -->` que rodea cada `<img>`:

- `angel-parra.jpg`
- `angel-castro.jpg`
- `steven-fonseca.jpg`

Funcionan mejor si son casi cuadradas (por ejemplo 800 × 840 px).

## Verla en tu computador

Desde esta carpeta:

```bash
python -m http.server 5500
```

y abre http://localhost:5500

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub (por ejemplo `codigo-u-web`).
2. Sube todos los archivos de esta carpeta: con **Add file → Upload files** desde la web, o con `git push` si tienes Git instalado.
3. En el repositorio ve a **Settings → Pages**, y en *Branch* elige `main` y la carpeta `/ (root)`. Guarda.
4. En uno o dos minutos la página queda en `https://TU-USUARIO.github.io/codigo-u-web/`.
