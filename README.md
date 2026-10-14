# Analytics QL (Next.js · Vercel Free)
Next.js 14 App Router. Backend = API Routes (`app/api/*` + `lib/*`), Frontend = `components/*`. Sin servidores externos.

## Despliegue (todo gratis, sin tarjeta)
1. **Google OAuth**: console.cloud.google.com → APIs y servicios → Credenciales → ID de cliente OAuth (Web). URI de redirección: `https://TU-APP.vercel.app/api/auth/callback/google` (y `http://localhost:3000/api/auth/callback/google` para local).
2. **Gemini**: aistudio.google.com → Get API key → `GEMINI_API_KEY`. (Si el modelo cambia, ajusta `GEMINI_MODEL`.)
3. **Resend (correo, 100/día y 3.000/mes gratis)**: resend.com → API Keys → crea una clave → `RESEND_API_KEY`. Sin dominio verificado solo puedes enviar desde `onboarding@resend.dev` y **únicamente al correo con el que creaste tu cuenta de Resend**. Para enviar a cualquier usuario: Domains → Add Domain, añade los registros DNS y usa un remitente de ese dominio en `MAIL_FROM`.
4. **Secretos**: `openssl rand -base64 32` dos veces → `NEXTAUTH_SECRET` y `ENCRYPTION_KEY`.
5. Sube esta carpeta a un repo de GitHub → vercel.com/new → importa el repo → pega las variables de `.env.example` → Deploy. (O: `npx vercel --prod`.) Actualiza `NEXTAUTH_URL` con tu URL final y redeploya.
6. Local: `cp .env.example .env.local && npm i && npm run dev`.

## Conectar tu BD
Vercel necesita un host **público**. Para una BD en tu PC usa un túnel TCP (`ngrok tcp 5432` o `cloudflared`) y pon ese host/puerto. Crea un usuario de solo lectura (`GRANT SELECT`). Privilegios y rol se muestran al conectar.
## Notas
- Credenciales de BD: cifradas AES-256-GCM en cookie httpOnly (8 h), nunca en servidor.
- La IA recibe solo esquema y agregados mensuales, no filas.
- DQL: subconjunto (SELECT x FROM Entidad x WHERE/ORDER BY/GROUP BY/LIMIT); entidad = tabla.
- Hobby de Vercel limita funciones a 10–60 s; las consultas tienen timeout de 8 s.

## Novedades v2 (UI/UX)
- Diseño 3D por capas + glassmorphism + paleta multicolor (violeta, azul, cian, magenta/coral, esmeralda) basado en la skill ui-ux-pro-max.
- Modo Oscuro/Claro (sigue el sistema al inicio; se guarda en `localStorage`, sin parpadeo al cargar).
- Selector ES/EN con diccionario en `lib/dict.js`; la IA, el PDF y el correo respetan el idioma elegido.
- Landing pre-login: Hero 3D interactivo, métricas, Bento Grid, "cómo funciona" y CTA. Íconos SVG, foco visible, `prefers-reduced-motion` y objetivos táctiles ≥44px.
- Fuentes Fira Sans / Fira Code autohospedadas por `next/font` (sin peticiones externas).

## Sitio multipágina (v3)
Rutas: `/` inicio · `/about` quiénes somos · `/login` (iniciar sesión / crear cuenta, `?mode=register`) · `/app` panel (protegido por `middleware.js`).
**Registro con correo (gratis, sin tarjeta):** crea una base Redis en upstash.com (o Vercel → Storage → Upstash) y pega `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN`. Guarda solo nombre, correo y hash bcrypt, con límite de intentos. Sin esas variables, el registro con correo se desactiva y Google sigue funcionando. No hay verificación de correo.
