
# Despliegue con Docker

## Variables de Entorno Requeridas

Para el despliegue en producción, necesitas configurar las siguientes variables de entorno:

- `VITE_RETELL_API_KEY`: Tu API key de Retell AI
- `VITE_RETELL_BASE_URL`: URL base de la API de Retell AI (por defecto: https://api.retellai.com)

## Opciones de Despliegue

### Opción 1: Docker Build con argumentos

```bash
docker build \
  --build-arg VITE_RETELL_API_KEY=tu_api_key_aqui \
  --build-arg VITE_RETELL_BASE_URL=https://api.retellai.com \
  -t voice-agent-hub .

docker run -p 80:80 voice-agent-hub
```

### Opción 2: Docker Compose

1. Copia `docker-compose.example.yml` como `docker-compose.yml`
2. Crea un archivo `.env` con tus credenciales:
```
RETELL_API_KEY=tu_api_key_aqui
RETELL_BASE_URL=https://api.retellai.com
```
3. Ejecuta:
```bash
docker-compose up --build
```

### Opción 3: Variables de entorno del sistema

Si prefieres usar variables de entorno del sistema directamente:

```bash
export VITE_RETELL_API_KEY="tu_api_key_aqui"
export VITE_RETELL_BASE_URL="https://api.retellai.com"

docker build -t voice-agent-hub .
docker run -p 80:80 voice-agent-hub
```

## Notas de Seguridad

- Nunca incluyas las API keys directamente en el código
- Usa un archivo `.env` para desarrollo local (no lo subas al repositorio)
- En producción, configura las variables de entorno en tu plataforma de despliegue
- Las variables `VITE_*` son compiladas en tiempo de build y serán visibles en el frontend
