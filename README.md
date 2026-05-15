# SkyAtlas

Aplicacion movil para explorar eventos astronomicos, consultar detalles y gestionar un perfil de usuario. Construida con Expo y React Native.

## Integrantes
- Por definir (comparte los nombres para actualizar esta seccion).

## Descripcion general
SkyAtlas es una aplicación móvil dirigida a los entusiastas de la astronomía, permitiendo explorar eventos astronómicos, perfiles personalizados, navegación fluida y tutoriales interactivos. Diseñado con un enfoque en la simplicidad y escalabilidad, combina tecnologías modernas como React Native, Firebase y AsyncStorage para entregar una experiencia excepcional.

## Tecnologias utilizadas
- JavaScript
- React Native
- Expo
- React Navigation
- Node.js y npm

## Requisitos
- Node.js 18+ (recomendado)
- npm 9+ (o yarn/pnpm)
- Expo Go en el dispositivo movil (opcional para pruebas fisicas)

## Instalacion
1. Clona el repositorio.
2. Instala dependencias del sistema y paquetes npm:

```bash
bash scripts/setup.sh
```

## Ejecucion
Para iniciar el entorno de desarrollo de Expo:

```bash
npx expo start
```

## Estructura del proyecto
- App.js y index.js: punto de entrada de la app
- src/components: componentes reutilizables
- src/screens: pantallas de la aplicacion
- src/navigation: navegacion y rutas
- src/context: estado global y autenticacion
- src/data: datos estaticos y usuarios de ejemplo
- src/utils: helpers y persistencia local

## Funcionalidades principales
- Listado de eventos astronomicos con tarjetas informativas
- Vista de detalle por evento
- Registro e inicio de sesion local
- Perfil de usuario con informacion basica
- Tutorial introductorio dentro de la aplicacion
