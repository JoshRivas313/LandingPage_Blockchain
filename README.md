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

El botón hace tres cosas, en este orden: descarga el pase en PNG, copia el
texto al portapapeles y abre el compositor de LinkedIn con ese mismo texto ya
escrito. La persona solo arrastra la imagen y publica.

```
Compartir en LinkedIn
  → descarga el pase
  → copia el texto
  → abre linkedin.com/feed/?shareActive=true&text=...
```

`shareActive` + `text` no están documentados por LinkedIn, pero es lo que usan
las webs que abren el compositor "con el mensaje listo". La imagen no puede
prellenarse: LinkedIn no acepta adjuntos por URL, y por eso el pase se descarga
justo antes.

La copia al portapapeles es la red de seguridad por si el prellenado falla. Si
la copia no ocurre —algunos navegadores la bloquean sin gesto de usuario— la
interfaz omite esa línea en vez de afirmar algo falso.

Sin OAuth, sin app de LinkedIn, sin backend y sin variables de entorno. El
texto está en `src/constants/site.ts`.

## Despliegue

Vercel, con `vercel.json` ya configurado (build `npm run build`, salida `dist/`,
cache inmutable para `/assets` y `/fonts`). Sitio estático puro: sin funciones
serverless, sin variables de entorno y sin backend.

## Material de origen

Los originales sin comprimir de las imágenes viven en `assets/`, fuera del
build; son la fuente de `npm run images`.

El proyecto anterior (`uploads/`), la implementación previa del sitio
(`*.dc.html` + `support.js`) y la integración con la API de LinkedIn (`api/` y
`lib/`) se eliminaron al quedar sin uso. Siguen en el historial de git:

```bash
git log --oneline --diff-filter=D --name-only
```
