# Linear CLI

Una herramienta de línea de comandos (CLI) profesional para interactuar con Linear.

---

## 💻 Para Desarrolladores (Instalación Local)

Si quieres contribuir al código o probar cambios en tiempo real:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/DanmerCC/linear-cli.git
   cd linear-cli
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Compilar y enlazar (Symlink):**
   ```bash
   npm run build
   npm link
   ```
   *Nota: Al usar `npm link`, cualquier cambio que compiles con `npm run build` se reflejará inmediatamente en el comando `linear-cli`.*

---

## 🚀 Para Usuarios Regulares (Instalación Global)

Si solo quieres usar la herramienta sin modificar el código:

1. **Instalar directamente desde el repositorio:**
   ```bash
   npm install -g git+https://github.com/DanmerCC/linear-cli.git
   ```

2. **Actualizar la herramienta:**
   Para obtener las últimas funcionalidades y correcciones, simplemente vuelve a ejecutar el comando de instalación:
   ```bash
   npm install -g git+https://github.com/DanmerCC/linear-cli.git
   ```

3. **Verificar instalación:**
   ```bash
   linear-cli --version
   ```

### 💡 Solución de Problemas (Comando no encontrado)

Si después de instalar globalmente recibes un error tipo `command not found` o `no se reconoce como un comando interno`, es probable que la carpeta de binarios de npm no esté en tu **PATH**.

- **En Windows (PowerShell):**
  Para probarlo en la sesión actual:
  ```powershell
  $env:Path += ";$(npm config get prefix)"
  ```
  *Nota: Para que sea permanente, debes añadir el resultado de `npm config get prefix` a las **Variables de Entorno del Sistema** en el Panel de Control.*

- **En macOS/Linux (Bash/Zsh):**
  ```bash
  export PATH=$PATH:$(npm config get prefix)/bin
  ```
  Añade esa línea a tu `.bashrc` o `.zshrc` para que sea permanente.

---

## 🔄 Sistema de Actualizaciones

La CLI incluye un sistema de notificación automática. Si hay una nueva versión disponible en el repositorio, verás un mensaje al final de la ejecución sugiriéndote la actualización.

---

## 🔐 Gestión de Autenticación

La CLI requiere un **API Key** de Linear. Consíguelo en: `Settings > API > Personal Access Tokens`.

### ¿Cómo configurar o cambiar el Token?
- **Primer uso:** La CLI te pedirá el token automáticamente si no existe.
- **Sobrescribir Token:** Si quieres usar una nueva clave, simplemente ejecuta:
  ```bash
  linear-cli login
  ```
- **Eliminar sesión:** Para borrar el token de tu PC:
  ```bash
  linear-cli logout
  ```

## 🛠️ Comandos Rápidos

- `linear-cli ping`: Prueba la conexión y el estado del token.
- `linear-cli login`: Configura o actualiza tu API Key.
- `linear-cli logout`: Cierra la sesión local.

---

**Nota:** El token se guarda de forma persistente en la carpeta de configuración de tu sistema operativo.
