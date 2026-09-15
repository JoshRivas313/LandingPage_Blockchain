# Blockchain Conf — web

Landing del evento + páginas de FAQ y Código de Conducta. React 19 + Vite, sin
framework de estilos ni router: es una **MPA**, cada página es su propia entrada
HTML.

```bash
npm install
npm run dev       # servidor de desarrollo
npm run build     # typecheck + build de produccion a dist/
npm run preview   # sirve dist/ localmente
```

## Estructura

```
index.html                  entrada de la landing (React)
faq/index.html              FAQ — HTML estatico, 0 JS
codigo-de-conducta/         Codigo de Conducta — HTML estatico, 0 JS
src/
  main.tsx                  monta la landing
  pages/Home.tsx            composicion de la landing
  sections/                 Hero, Partners, Speakers, Schedule, Credential
  components/               Navbar, Footer, SpeakerCard
  hooks/useCarousel.ts      carrusel de speakers (autoplay, swipe, teclado)
  utils/credential.ts       composicion maestra del pase + exportacion a PNG
  data/                     speakers, cronograma, partners
  constants/site.ts         URLs, textos compartidos
  assets/                   imagenes optimizadas (WebP)
  styles/                   tokens.css, base.css, home.css, docs.css, fonts.css
api/linkedin/               funciones serverless (una por archivo)
lib/                        codigo compartido por las funciones, fuera de api/
public/fonts/               Inter + Manrope self-hosted (woff2)
scripts/                    herramientas locales (Python), no forman parte del build
```

## Por qué FAQ y Código de Conducta no usan React

Son contenido estático: un acordeón `<details>` nativo y prosa. Servirlas como
HTML plano les ahorra el runtime completo de React. Si alguna necesitara estado
en el futuro, se convierte en una entrada más de Vite con su propio `main`.

## La credencial

`src/utils/credential.ts` define `CREDENTIAL`: la composición maestra de
1122×1402 en fracciones. **Es la única fuente de verdad.** El preview del DOM la
lee como porcentajes CSS (con `container-type` + `cqw` para que el texto escale
solo) y la exportación la lee como coordenadas de canvas. Cambiar una posición
ahí la cambia en ambos sitios a la vez.

El PNG a resolución completa **solo** se genera al pulsar Descargar o Compartir,
nunca mientras se escribe.

## Assets

Los originales viven en `assets/` (fuera del build). Para regenerar las
versiones optimizadas:

```bash
npm run images    # assets/ -> src/assets/ en WebP, al tamano de uso real
npm run fonts     # vuelve a bajar los woff2 de Google y regenera fonts.css
```

Ambos scripts necesitan Python con Pillow. No se ejecutan en el despliegue.

## Compartir en LinkedIn

El botón publica **texto + credencial** directamente en el perfil del asistente,
sin copiar ni pegar nada. El Share URL público de LinkedIn no permite rellenar el
cuadro de comentario, así que se usa la API real:

```
Compartir en LinkedIn
  → OAuth en ventana emergente (scope w_member_social)
  → pantalla de confirmación con la imagen y el texto exactos
  → Publicar  →  POST /v2/assets → subida del PNG → POST /v2/ugcPosts
```

La emergente evita recargar la página: con una redirección se perderían el
nombre, el usuario de X y la fotografía ya cargados.

### Funciones (`api/linkedin/`) y código compartido (`lib/`)

| Endpoint | Qué hace |
| --- | --- |
| `start` | Genera el `state`, lo guarda en cookie y redirige a LinkedIn |
| `callback` | Valida el `state`, canjea el `code`, guarda la sesión cifrada |
| `session` | Dice si está configurado/autorizado y devuelve el texto a publicar |
| `publish` | Sube el PNG a LinkedIn y crea la publicación |

Decisiones que conviene no deshacer:

- **El código compartido vive en `lib/`, fuera de `api/`.** Vercel convierte en
  función *cada* archivo dentro de `api/`, así que un `api/_lib/` acabaría
  desplegado como endpoints sin handler. Desde `lib/` se incrusta en el bundle
  de cada función al seguir los imports.
- **El texto vive en el servidor** (`lib/config.ts`). `publish` ignora
  cualquier texto que mande el cliente, así que el endpoint no puede usarse para
  escribir cosas arbitrarias en el perfil de alguien.
- **El access token nunca llega al navegador.** Va en una cookie `HttpOnly`,
  `Secure`, `SameSite=Lax` y además cifrada con AES-256-GCM.
- **`SameSite=Lax` + comprobación de `Origin`** es lo que protege `publish` de
  CSRF. La cookie sigue viajando al volver de `linkedin.com` porque esa es una
  navegación GET de nivel superior.

### Puesta en marcha

1. Crear una app en <https://www.linkedin.com/developers/apps>, asociada a la
   página de LinkedIn de DSC UTP (hay que verificarla desde la página).
2. En **Products**, añadir *Sign In with LinkedIn using OpenID Connect* y
   *Share on LinkedIn*.
3. En **Auth → Redirect URLs**, añadir exactamente
   `https://TU-DOMINIO/api/linkedin/callback`. LinkedIn exige coincidencia
   literal, así que cada dominio de preview necesitaría su propia entrada; lo
   normal es fijar el de producción con `LINKEDIN_REDIRECT_ORIGIN`.
4. Configurar en Vercel las variables de `.env.example`.

Mientras falte cualquiera de las tres variables, `session` responde
`configured: false` y **el botón no se muestra**: solo queda «Descargar mi pase».
Así nadie se topa con un flujo a medias.

Límite de LinkedIn: 150 publicaciones por miembro y día, 100 000 por app y día.

### Desarrollo local

`npm run dev` levanta solo el frontend, sin las funciones, así que el botón de
LinkedIn no aparecerá. Para probarlo entero hace falta `vercel dev` con las
variables de entorno puestas.

## Despliegue

Vercel, con `vercel.json` ya configurado (build `npm run build`, salida `dist/`,
cache inmutable para `/assets` y `/fonts`). Las funciones de `api/` las detecta
Vercel automáticamente. Las variables de entorno están en `.env.example`.

## Material de origen

`uploads/` guarda el proyecto anterior de Figma Make y los prompts de diseño
originales. No entra en el build ni se despliega (`.vercelignore`); se conserva
como referencia.

La implementación anterior del sitio (`*.dc.html` + `support.js`) se eliminó al
quedar sustituida por esta build. Sigue en el historial de git:

```bash
git checkout 1c3279b -- "Blockchain Conf.dc.html" support.js
```
