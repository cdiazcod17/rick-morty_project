# Rick and Morty - Aplicación de Favoritos

Aplicación web en Vue 3 que permite a los usuarios explorar personajes de Rick and Morty y guardarlos como favoritos, con autenticación mediante Firebase.

## 🚀 Características

- Listado de personajes de la API pública de Rick and Morty
- Autenticación de usuarios con email y contraseña
- Verificación de email obligatoria antes de gestionar favoritos
- Sistema de favoritos personalizado por usuario
- Paginación de personajes
- Notificaciones en tiempo real con vue-toastification
- Diseño responsive con Tailwind CSS

## 🛠️ Tecnologías utilizadas

- **Vue 3** - Framework JavaScript progresivo
- **Vue Router** - Enrutamiento SPA
- **Firebase Authentication** - Autenticación con email/password
- **Firebase Firestore** - Base de datos NoSQL para almacenar favoritos
- **Axios** - Cliente HTTP para consumir API REST
- **Tailwind CSS** - Framework CSS utility-first
- **vue-toastification** - Sistema de notificaciones
- **Rick and Morty API** - API pública de personajes

## 📋 Requisitos previos

- Node.js (versión 16 o superior)
- npm o yarn
- Cuenta de Firebase con proyecto configurado

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/rick-morty-favorites.git
cd rick-morty-favorites
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Instalar dependencias específicas del proyecto

```bash
npm install vue-toastification@next
npm install axios
npm install firebase
```

## ⚙️ Configuración de Firebase

### 1. Crear proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita **Authentication** con método Email/Password
4. Habilita **Firestore Database** en modo producción

### 2. Configurar credenciales

Crea el archivo `src/firebase/config.js`:

```javascript
// src/firebase/config.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

export { auth, db }
export default app
```

### 3. Configurar Firestore (Reglas de seguridad)

En Firebase Console > Firestore > Reglas, añade:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/favorites/{favoriteId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🎨 Configuración de Tailwind CSS

Si no tienes Tailwind configurado, ejecuta:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Configura `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

En tu archivo `src/style.css` o `src/main.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 🚀 Ejecución

### Modo desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Build para producción

```bash
npm run build
```

### Preview de producción

```bash
npm run preview
```

## 📁 Estructura del proyecto

```
src/
├── components/
│   └── CharacterCard.vue       # Tarjeta de personaje individual
├── views/
│   ├── PersonajesView.vue      # Vista principal (lista de personajes)
│   ├── LoginView.vue           # Vista de inicio de sesión
│   ├── RegisterView.vue        # Vista de registro
│   └── FavoritosView.vue       # Vista de favoritos del usuario
├── router/
│   └── index.js                # Configuración de rutas
├── firebase/
│   └── config.js               # Configuración de Firebase
├── App.vue                     # Componente raíz
└── main.js                     # Punto de entrada
```

## 🔐 Flujo de autenticación

### Registro de usuario
1. Usuario completa formulario en `/register`
2. Se crea cuenta en Firebase Authentication
3. Se envía email de verificación automáticamente
4. Usuario debe verificar email antes de usar favoritos

### Inicio de sesión
1. Usuario ingresa credenciales en `/login`
2. Firebase valida las credenciales
3. Si el email NO está verificado:
   - Se muestra advertencia
   - NO puede gestionar favoritos
4. Si el email está verificado:
   - Acceso completo a la aplicación

### Gestión de favoritos
1. Usuario navega por personajes en `/`
2. Al hacer clic en "Añadir a favoritos":
   - Si NO está autenticado → redirige a `/login`
   - Si está autenticado pero SIN verificar → muestra alerta
   - Si está autenticado Y verificado → guarda en Firestore y redirige a `/favoritos`

## 🌐 Rutas de la aplicación

| Ruta | Componente | Descripción | Requiere Auth |
|------|-----------|-------------|---------------|
| `/` o `/personajes` | PersonajesView | Lista de personajes | No |
| `/login` | LoginView | Inicio de sesión | No |
| `/register` | RegisterView | Registro de usuario | No |
| `/favoritos` | FavoritosView | Favoritos del usuario | Sí |

## 🎯 Funcionalidades principales

### Vista Personajes (`/`)
- Grid responsive de personajes
- Información: imagen, nombre, estado, especie, género
- Botón para añadir a favoritos
- Paginación (anterior/siguiente)
- Navegación condicional (muestra "Iniciar Sesión" o "Ver Favoritos")

### Vista Login (`/login`)
- Formulario de email y contraseña
- Validación de credenciales
- Manejo de errores específicos
- Enlaces a registro y vista principal

### Vista Register (`/register`)
- Formulario de registro
- Validación de contraseñas coincidentes
- Envío automático de email de verificación
- Redirección automática al login

### Vista Favoritos (`/favoritos`)
- Lista personalizada de favoritos del usuario
- Alerta si email no está verificado
- Opción de reenviar email de verificación
- Eliminar favoritos
- Cerrar sesión

## 🔌 API utilizada

**Rick and Morty API**: `https://rickandmortyapi.com/api/character`

Endpoints principales:
- `GET /api/character` - Lista de personajes
- `GET /api/character?page={page}` - Paginación

## 📦 Dependencias principales

```json
{
  "dependencies": {
    "vue": "^3.x",
    "vue-router": "^4.x",
    "firebase": "^10.x",
    "axios": "^1.x",
    "vue-toastification": "^2.0.0-rc.5"
  },
  "devDependencies": {
    "tailwindcss": "^3.x",
    "vite": "^5.x"
  }
}
```

## 🐛 Solución de problemas comunes

### Error: "Firebase not initialized"
- Verifica que `src/firebase/config.js` esté correctamente configurado
- Asegúrate de importar la configuración en `main.js`

### No se envía email de verificación
- Revisa la configuración de Firebase Authentication
- Verifica que el método Email/Password esté habilitado
- Revisa la bandeja de spam del email

### Favoritos no se guardan
- Verifica las reglas de seguridad de Firestore
- Asegúrate de que el usuario esté autenticado y verificado
- Revisa la consola del navegador para errores

### Error de CORS con la API
- La API de Rick and Morty permite CORS por defecto
- Si hay problemas, verifica tu conexión a internet

## 📝 Notas de desarrollo

- El proyecto usa Vue 3 Composition API con `<script setup>`
- Los estilos son completamente con Tailwind (utility-first)
- Firebase maneja tanto autenticación como base de datos
- La verificación de email es obligatoria para usar favoritos
- Los favoritos se almacenan en Firestore con estructura: `users/{userId}/favorites/{characterId}`

## 👥 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Añade nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la [Licencia MIT](LICENSE).

## 👨‍💻 Autor

Desarrollado como proyecto educativo para demostración en clases de DAW (Desarrollo de Aplicaciones Web).

## 🙏 Agradecimientos

- [Rick and Morty API](https://rickandmortyapi.com/) por proporcionar la API pública
- [Firebase](https://firebase.google.com/) por los servicios de backend
- [Tailwind CSS](https://tailwindcss.com/) por el framework de estilos
- [Vue.js](https://vuejs.org/) por el framework frontend

---

⭐ Si te ha gustado este proyecto, dale una estrella en GitHub!
