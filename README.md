# micesfam
# Proyecto de Gestión de Reservas

Este proyecto es una aplicación de gestión de reservas desarrollada con Angular e Ionic. Permite a los usuarios registrarse, iniciar sesión y gestionar reservas según su rol (Administrativo, Médico o Paciente).

## Estructura del Proyecto
. ├── .angular/ ├── .vscode/ ├── src/ │ ├── app/ │ │ ├── roles/ │ │ │ ├── administrativo/ │ │ │ ├── medico/ │ │ │ ├── paciente/ │ │ ├── reservas/ │ │ │ ├── reservas-medico/ │ │ │ ├── crud-reservas/ │ │ ├── services/ │ │ ├── home/ │ │ ├── auth.guard.ts │ │ ├── app-routing.module.ts │ │ ├── app.component.ts │ │ ├── app.module.ts │ ├── assets/ │ ├── environments/ │ ├── global.scss │ ├── index.html │ ├── main.ts │ ├── polyfills.ts │ ├── test.ts │ ├── theme/ │ ├── zone-flags.ts ├── angular.json ├── capacitor.config.ts ├── ionic.config.json ├── karma.conf.js ├── package.json ├── tsconfig.app.json ├── tsconfig.json ├── tsconfig.spec.json

## Instalación

1. Clona el repositorio:
    ```sh
    git clone https://github.com/tu-usuario/tu-repositorio.git
    ```
2. Navega al directorio del proyecto:
    ```sh
    cd tu-repositorio
    ```
3. Instala las dependencias:
    ```sh
    npm install
    ```

## Configuración

1. Configura Firebase en el archivo `src/environments/environment.ts`:
    ```typescript
    export const environment = {
      production: false,
      firebaseConfig: {
        apiKey: "TU_API_KEY",
        authDomain: "TU_AUTH_DOMAIN",
        projectId: "TU_PROJECT_ID",
        storageBucket: "TU_STORAGE_BUCKET",
        messagingSenderId: "TU_MESSAGING_SENDER_ID",
        appId: "TU_APP_ID"
      }
    };
    ```

## Ejecución

Para ejecutar la aplicación en modo desarrollo:
```sh
ionic serve

Estructura de Código
Guardias de Autenticación
El archivo auth.guard.ts contiene la lógica para proteger rutas basadas en la autenticación del usuario.

Servicios
AuthService: Maneja la autenticación y la gestión de usuarios.
ReservaService: Maneja las operaciones CRUD para las reservas.
Componentes
ReservasMedicoComponent: Componente para la gestión de reservas por parte de los médicos.
CrudReservasComponent: Componente para la creación y edición de reservas.
Módulos
AdministrativoPageModule: Módulo para la página de administrativo.
MedicoPageModule: Módulo para la página de médico.
PacientePageModule: Módulo para la página de paciente.
HomePageModule: Módulo para la página principal.
