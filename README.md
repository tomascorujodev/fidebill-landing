# Fidebill Landing + Registro de Empresas

Landing en React + Vite con un flujo nuevo de registro de empresas y una API minima en .NET para verificar correo y crear el alta inicial en SQL Server local.

## Que incluye

- CTA destacado `Registrate gratis` en el navbar y en la landing.
- Pagina `/registro-empresa` con formulario por pasos.
- Verificacion de correo por codigo.
- Alta de usuario administrador y usuario operativo.
- API .NET en `D:\Desarrollo\fidebill\fidebill-landing-back`.
- Alta real en `empresas` y creacion de filas base en `funcionalidades_empresa`, `estilos_empresas`, `usuarios_administradores` y `usuarios_empresas`.

## Requisitos locales

- Node.js
- .NET SDK 10
- SQL Server local con la base `fidebill-sd`

## Como levantarlo

1. `npm install`
2. `npm run dev`

Eso levanta solo el frontend Vite en `http://localhost:5173`.

Si necesitas el backend de registro, se corre por separado desde `D:\Desarrollo\fidebill\fidebill-landing-back`.

## Base local

La API usa solo la connection string local definida en:

- `D:\Desarrollo\fidebill\fidebill-landing-back\appsettings.Development.json`

Al iniciar en `Development`, la API crea automaticamente:

- La tabla `verificaciones_registro_empresas`
- La columna `empresas.url_clientes` como nullable
- El indice unico filtrado de `empresas.url_clientes` para permitir multiples `NULL`

## Correo en desarrollo

En local el envio sale por SMTP con las credenciales de Fidebill configuradas igual que en `fidebill-clientes-back`.

La API sigue usando solo la base local `fidebill-sd`; no hay ninguna connection string de produccion en este proyecto.
