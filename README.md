# 🧪 Prueba Amaris Frontend

Este es el frontend de la prueba técnica desarrollada con **React + TypeScript + Bootstrap**, diseñado para consumir una API desplegada en AWS.

---

## 🚀 Tecnologías utilizadas

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Bootstrap](https://getbootstrap.com/)
- [Axios](https://axios-http.com/)
- [Serverless Framework](https://www.serverless.com/)
- [AWS S3 + CloudFormation](https://aws.amazon.com/s3/)

---

## 📦 Clonar el proyecto

```bash
git clone https://github.com/itachi364/pruebaamaris-front.git
cd pruebaamaris-front
```

---

## 📁 Estructura de carpetas principal

```
.
├── build/                # Carpeta generada con la app compilada
├── public/               # Archivos estáticos públicos
├── src/                  # Código fuente de React
├── serverless.yml        # Configuración Serverless para despliegue en AWS S3
├── package.json          # Dependencias y scripts
└── .env                  # Variables de entorno
```

---

## 📥 Instalación de dependencias

Asegúrate de tener instalado `Node.js` (versión recomendada: 18.x o superior) y luego ejecuta:

```bash
npm install
```

---

## 🧪 Correr en local

Para correr el frontend en modo desarrollo:

```bash
npm start
```

La aplicación se abrirá en [http://localhost:3000](http://localhost:3000)

---

## 📤 Despliegue con Serverless Framework (AWS S3)

### 1. Instalar Serverless Framework

```bash
npm install -g serverless
```

### 2. Configurar credenciales de AWS

Asegúrate de tener configuradas tus credenciales AWS:

```bash
aws configure
```

### 3. Construir el proyecto

```bash
npm run build
```

### 4. Desplegar en AWS S3

```bash
serverless deploy
```

El archivo `serverless.yml` está configurado para:

- Crear un bucket S3 si no existe
- Subir los archivos compilados a S3
- Hacer el bucket público para servir como hosting estático

---

## ✅ Resultado esperado

Una vez desplegado, el terminal mostrará la **URL pública del sitio web** alojado en AWS S3.

---

## 🔐 Variables de entorno

Si tu proyecto requiere una URL base para el backend, puedes crear un archivo `.env` con:

```env
REACT_APP_API_BASE_URL=https://tudominioapi.com/api
```

Asegúrate de **reiniciar el servidor** después de cualquier cambio en `.env`.

---

## 🧹 Scripts útiles

```bash
npm run build     # Compila el proyecto para producción
npm run start     # Inicia servidor local en desarrollo
serverless deploy # Despliega en AWS S3
```

---

## 📄 Licencia

Este proyecto es parte de una prueba técnica y su uso es exclusivamente con fines educativos o evaluativos.
