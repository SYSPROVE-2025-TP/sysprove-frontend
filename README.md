# 🎨 SYSFUN-FRONTEND: Aplicación Web de Gestión de Ventas para Hitss Perú 🎨

![Quasar Framework](https://img.shields.io/badge/Quasar_Framework-105374?style=for-the-badge&logo=quasar&logoColor=white)
![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

---

## 🎯 **Objetivo del Proyecto**

Este repositorio contiene la **interfaz de usuario (Frontend)** para el `Sistema de Gestión de Ventas de la empresa Hitss Perú`. Su propósito principal es proporcionar una experiencia de usuario intuitiva y dinámica, permitiendo a los usuarios interactuar con el backend de forma fluida para gestionar las operaciones de venta, administración de áreas, roles, usuarios y más. Es la cara visible del sistema.

## 📝 **Descripción General**

`SYSPROVE-FRONTEND` está desarrollado utilizando **Quasar Framework**, un potente framework basado en **Vue.js** que permite construir aplicaciones web responsivas y de alto rendimiento desde una única base de código. Aprovecha las capacidades reactivas de Vue.js para una UI interactiva y utiliza JavaScript moderno para la lógica del lado del cliente. Está diseñado para ser escalable y adaptable a diferentes dispositivos.

### **Características Principales:**

- **Interfaz de Usuario Intuitiva:** Diseño centrado en el usuario para una navegación y gestión sencillas.
- **Gestión de Datos:** Interacción con la API del backend para la gestión de áreas, roles, usuarios y futuras entidades.
- **Componentes Reutilizables:** Construido con componentes Vue.js para modularidad y mantenimiento.
- **Responsivo:** Adaptable a diferentes tamaños de pantalla (escritorio, tabletas, móviles).
- **Validación de Formularios:** Asegura la integridad de los datos ingresados por el usuario.
- **Integración con APIs RESTful:** Consumo eficiente de los endpoints del backend.

## ⚙️ **Tecnologías Utilizadas**

- **Quasar Framework**: Framework UI basado en Vue.js para aplicaciones multiplataforma.
- **Vue.js**: Framework progresivo para construir interfaces de usuario.
- **JavaScript (ES6+)**: Lenguaje de programación principal.
- **HTML5 / CSS3**: Para la estructura y estilos de la interfaz.
- **Axios**: Cliente HTTP basado en promesas para hacer solicitudes a la API.
- `Vuex` (futuro): Para la gestión de estado centralizada.
- `Vue Router` (futuro): Para la navegación de la aplicación.

## 🚀 **Guía de Configuración y Ejecución (Frontend)**

Sigue estos pasos para poner en marcha el frontend en tu entorno local.

### **1. Requisitos Previos**

Asegúrate de tener instalado lo siguiente:

- [**Node.js**](https://nodejs.org/es/download/) (versión 14 o superior recomendada)
- [**npm**](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) (viene con Node.js)
- Un editor de código (ej. [**VS Code**](https://code.visualstudio.com/))
- **Asegúrate de que el backend esté corriendo** (ver `README.md` del backend).

### **2. Clonar el Repositorio**

```bash
git clone [https://github.com/tu-nueva-cuenta/sysfun-frontend.git](https://github.com/tu-nueva-cuenta/sysfun-frontend.git)
cd sysfun-frontend
```

### **3. Configuración del Entorno**

1. Si tu frontend necesita saber la URL del backend, puedes configurarlo en un archivo .env o similar (dependiendo de cómo Quasar maneje las variables de entorno para APIs).
   Crea un archivo .env en la raíz del proyecto (al mismo nivel que package.json).

2. Añade la URL base de tu backend:

# .env

VITE_API_URL=http://localhost:4000

4. Instalar Dependencias

```bash
npm install
```

5. Instalar Previamente Quasar CLI

```bash
npm i -g @quasar/cli
```

6. Ejecutar la Aplicación en Modo Desarrollo

```bash
quasar dev
#o
npm run dev

```

La aplicación se abrirá automáticamente en tu navegador predeterminado, generalmente en http://localhost:8080 (o un puerto similar).

7. Compilar para Producción

```bash
quasar build

```

Esto creará una carpeta dist en la raíz del proyecto con los archivos estáticos listos para ser desplegados en un servidor web.

🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si deseas mejorar este proyecto, por favor sigue estos pasos:

1.  Haz un fork de este repositorio.
2.  Crea una nueva branch (git checkout -b feature/nueva-funcionalidad).
3.  Realiza tus cambios y commit (git commit -m "feat: Añade nueva funcionalidad").
4.  Empuja tus cambios a la branch (git push origin feature/nueva-funcionalidad).
5.  Abre un Pull Request explicando tus cambios.

📄 Licencia
Este proyecto está bajo la Licencia MIT.
