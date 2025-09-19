# My Gym Tracker

Una aplicación móvil para gestionar tus rutinas y ejercicios en el gimnasio, desarrollada con React Native y Expo.

![Gym Tracker Logo](./assets/images/Screenshot_1.jpg)

## 📱 Características Principales

- **Inicialización automática**: La aplicación carga automáticamente un conjunto de ejercicios predefinidos al iniciarse por primera vez.
- **Gestión de rutinas**: Crea, modifica y ejecuta tus rutinas personalizadas. Puedes habilitar o deshabilitar rutinas según tus necesidades.
- **Seguimiento de ejercicios**: Registra series, repeticiones y peso para cada ejercicio.
- **Interfaz intuitiva**: Navegación sencilla entre rutinas y configuración.
- **Autenticación de usuario**: Sistema de login para mantener tus datos seguros.

## 🎬 Video Tutorial

En la carpeta `video/` encontrarás un tutorial completo que muestra cómo utilizar todas las funcionalidades de la aplicación. Este video te guiará paso a paso por:
- Configuración inicial
- Navegación entre pantallas
- Gestión de rutinas y ejercicios
- Ejecución de una sesión de entrenamiento
- Consejos y trucos adicionales

## 🚀 Primeros Pasos

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn
- Expo CLI
- Un dispositivo móvil o emulador para pruebas

### Instalación

1. Clona este repositorio
2. Instala las dependencias:
   ```bash
   npm install
   # o
   yarn install
   ```
3. Inicia la aplicación:
   ```bash
   npx expo start
   ```

## 🧠 Datos Precargados

Al iniciar la aplicación por primera vez, se ejecuta un proceso de "seed" que carga automáticamente una base de datos de ejercicios predefinidos. Este proceso:

- Verifica si ya existen ejercicios en la base de datos local
- Si no hay ejercicios, carga los datos desde `src/data/exercises.json` mediante la función `seedExercisesFromJson`
- Registra en la consola el resultado de la inicialización

La función `seedExercisesFromJson` procesa cada ejercicio, normalizando sus datos y asegurando valores predeterminados para series y repeticiones cuando sea necesario. Esta característica asegura que los usuarios tengan acceso inmediato a un catálogo completo de ejercicios sin necesidad de crearlos manualmente.

## 📋 Funcionalidades

### 1. Pantalla de Rutinas

La pantalla principal muestra tus rutinas habilitadas. Solo las rutinas marcadas como "habilitadas" aparecerán en esta pantalla principal. Para cada rutina podrás ver:

- Nombre de la rutina
- Cantidad de ejercicios que contiene
- Fecha de la última vez que se completó
- Imagen ilustrativa

Al seleccionar una rutina, puedes:
- Ver los detalles de cada ejercicio
- Comenzar la ejecución de la rutina
- Ver tu historial de sesiones para esta rutina

### 2. Ejecución de Rutinas

Al ejecutar una rutina:

- Se muestran todos los ejercicios en orden
- Puedes marcar como completadas las series de cada ejercicio
- Sistema de celebración con confetti y sonido al completar todos los ejercicios
- Registro automático de la sesión con fecha y hora

### 3. Configuración

En la sección de configuración puedes:

#### Gestión de Ejercicios (ABM Ejercicios)

- **Listado completo**: Ver todos los ejercicios disponibles
- **Creación**: Añadir nuevos ejercicios con nombre, imagen y detalles
- **Edición**: Modificar los datos de ejercicios existentes
- **Eliminación**: Borrar ejercicios que ya no uses

#### Gestión de Rutinas (ABM Rutinas)

- **Listado**: Ver todas las rutinas creadas
- **Creación**: Crear nuevas rutinas con nombre personalizado
- **Asignación**: Añadir ejercicios a una rutina específica
- **Edición**: Modificar los detalles de una rutina (nombre, estado, etc.)
- **Ordenamiento**: Reorganizar el orden de los ejercicios dentro de una rutina
- **Activación/Desactivación**: Habilitar o deshabilitar rutinas sin eliminarlas. Solo las rutinas habilitadas aparecerán en la pantalla principal para su ejecución

## 💾 Estructura de Datos

### Ejercicios

Los ejercicios incluyen información como:

- Nombre del ejercicio
- Imagen asociada
- Series recomendadas
- Repeticiones recomendadas
- Peso recomendado (si aplica)

### Rutinas

Las rutinas almacenan:

- Nombre de la rutina
- Estado (habilitada/deshabilitada)
- Lista de ejercicios asignados con orden específico
- Historial de sesiones completadas

## 🧪 Tecnologías Utilizadas

- **React Native**: Framework para desarrollo móvil
- **Expo**: Plataforma para simplificar el desarrollo de aplicaciones React Native
- **Redux**: Gestión del estado de la aplicación
- **SQLite**: Base de datos local para almacenar ejercicios y rutinas
- **React Navigation**: Sistema de navegación entre pantallas
- **Firebase**: Autenticación de usuarios (opcional)

## 📱 Navegación

La aplicación está organizada en:

1. **TabNavigator**: Navegación principal entre secciones
   - Rutinas: Visualización y ejecución de rutinas
   - Configuración: Gestión de ejercicios y rutinas

2. **ConfigStack**: Navegación dentro de la sección de configuración
   - Pantalla principal de configuración
   - ABM de ejercicios
   - ABM de rutinas

3. **AuthStack**: Navegación para la autenticación de usuarios
   - Inicio de sesión
   - Registro (si está habilitado)

## 🛠️ Personalización

Esta aplicación está diseñada para ser fácilmente personalizable:

- **Ejercicios personalizados**: Añade tus propios ejercicios con imágenes
- **Rutinas a medida**: Crea rutinas adaptadas a tus necesidades
- **Temas de colores**: Los colores principales pueden modificarse en `src/global/colors.js`

## ⚙️ Configuración Avanzada

Para desarrolladores que deseen ampliar la funcionalidad:

- La estructura de base de datos se define en `src/lib/db.js`
- Los estilos globales se encuentran en `src/global/colors.js`
- La lógica de autenticación está en `src/store/slices/authSlice.js`

## 📝 Notas Adicionales

- La aplicación utiliza almacenamiento local para guardar tus datos
- Se recomienda hacer copias de seguridad periódicas de tus rutinas
- El sistema de autenticación es opcional y puede configurarse según tus necesidades

---

Desarrollado con ❤️ para hacer tu experiencia en el gimnasio más organizada y efectiva.

---

**Agradecimiento especial**: En los últimos minutos del desarrollo, cuando el proyecto se hizo cuesta arriba, ChatGPT y GitHub Copilot fueron una ayuda invaluable que me permitieron completar el proyecto a tiempo. ¡Gracias a estas herramientas de IA por su asistencia!