# SkyAtlas

Aplicacion movil para explorar eventos astronomicos, consultar detalles y gestionar un perfil de usuario. Construida con Expo y React Native.

## Integrantes
- Juan Pablo Mosquera Hinestroza
- Alexandra Marroquin Solis
- Samuel David Montenegro Gomez
- Lina Vanesa Mena Victoria


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

## Contribuciones

| Integrante | Aportes realizados | Evidencia |
|---|---|---|
| Juan Pablo Mosquera Hinestroza | Pre-repo (VS Code Live Share): creación/bootstrapping del proyecto (Expo), configuración base (App.js, app.json, index.js), preparación de assets y estructura inicial.<br>En repo (commits): documentación (README), actualización de dependencias, navegación (src/navigation/AppNavigator.js) y ajustes en detalle del evento (src/screens/DetailsScreen.js). | Trabajo colaborativo previo hecho por Live Share; subida/versionado inicial realizada desde cuenta Git “Jupamohi2” (commit 22ad47c) y posteriores commits como “Juan Pablo Mosquera Hinestroza”. Total atribuible: 11 commits (10 + 1). |
| Alexandra Marroquin Solis | Pre-repo (VS Code Live Share): creación de flujo de autenticación (Login/Registro) y reglas de validación/mensajes de error.<br>En repo (commits): mejoras de validación y manejo de errores; ajustes en src/context/AuthContext.js y persistencia en src/utils/userStore.js. | Trabajo colaborativo previo hecho por Live Share; 4 commits como “alexandramarroquinsolis1997-cmd” (cambios en LoginScreen, RegisterScreen, AuthContext y userStore). |
| Samuel David Montenegro Gomez | Pre-repo (VS Code Live Share): creación de la pantalla Home (listado de eventos) y su flujo de interacción (selección y navegación a detalle), además de ajustes de lógica para manejo de eventos/usuario.<br>En repo (commits): optimizaciones y mantenimiento en src/screens/HomeScreen.js y ajustes relacionados en Profile/Details/Auth/userStore. | Trabajo colaborativo previo hecho por Live Share; 3 commits como “sdmontenegro1” (cambios en HomeScreen y módulos relacionados). Parte del código inicial fue subido en bloque por Juan Pablo (commit 052c15f). |
| Lina Vanesa Mena Victoria | Pre-repo (VS Code Live Share): diseño e implementación del tutorial interactivo y su persistencia (lógica para mostrar/ocultar tutorial).<br>En repo (commits): creación de src/components/TutorialOverlay.js y src/utils/tutorialStore.js, más ajustes en helpers/fechas, datos de eventos y refactor de AuthHeaderActions. | Trabajo colaborativo previo hecho por Live Share; 3 commits como “lvmena” (TutorialOverlay, tutorialStore, helpers, astronomicalEvents, AuthHeaderActions). |

Nota: El trabajo previo a los commits se realizó colaborativamente mediante la extensión Live Share de Visual Studio Code; por eso, parte del código fue subido al repositorio en bloques (p. ej., commit 052c15f) aunque su autoría de desarrollo corresponda a distintos integrantes.
