
export const systemArchitecture = [
  {
    id: 'arch-overview',
    categoryName: 'System Architecture',
    title: 'Arquitectura del Sistema UISEP AI',
    excerpt: 'Descripción detallada de la arquitectura técnica y componentes del sistema',
    content: `
        <h2>Arquitectura del Sistema UISEP AI</h2>
        
        <h3>Visión General de la Arquitectura</h3>
        <p>UISEP AI implementa una arquitectura de aplicación web moderna basada en componentes, diseñada para escalabilidad, mantenibilidad y rendimiento óptimo.</p>
        
        <h4>Principios Arquitectónicos</h4>
        <ul>
          <li><strong>Modularidad:</strong> Separación clara de responsabilidades por módulos</li>
          <li><strong>Escalabilidad:</strong> Diseño que permite crecimiento horizontal y vertical</li>
          <li><strong>Mantenibilidad:</strong> Código limpio y bien documentado</li>
          <li><strong>Testabilidad:</strong> Componentes y funciones fácilmente testeable</li>
          <li><strong>Reutilización:</strong> Componentes y hooks reutilizables</li>
        </ul>
        
        <h3>Estructura de Directorios</h3>
        <pre>
        src/
        ├── components/           # Componentes React reutilizables
        │   ├── ui/              # Componentes base de Shadcn/UI
        │   ├── dashboard/       # Componentes específicos del dashboard
        │   │   └── sections/    # Módulos funcionales del sistema
        │   │       ├── agents/           # Gestión de agentes
        │   │       ├── analytics/        # Analíticas y métricas
        │   │       ├── call-history/     # Historial de llamadas
        │   │       ├── phone-numbers/    # Números telefónicos
        │   │       ├── api-keys/         # Gestión de API keys
        │   │       └── batch-call/       # Llamadas en lote
        │   └── help-center/     # Sistema de ayuda y documentación
        ├── pages/               # Componentes de página (rutas)
        ├── hooks/               # Hooks personalizados globales
        ├── context/             # Contextos de React para estado global
        ├── data/               # Datos estáticos y configuraciones
        ├── lib/                # Utilidades y configuraciones
        └── types/              # Definiciones de tipos TypeScript
        </pre>
        
        <h3>Capa de Presentación</h3>
        
        <h4>Componentes de UI Base</h4>
        <p>Basados en Shadcn/UI, proporcionan una base sólida y consistente:</p>
        <ul>
          <li>Componentes accesibles por defecto</li>
          <li>Theming consistente con CSS variables</li>
          <li>Variantes tipadas para seguridad en tiempo de compilación</li>
          <li>Compatibilidad con modo oscuro</li>
        </ul>
        
        <h4>Componentes de Dominio</h4>
        <p>Componentes especializados para cada módulo funcional:</p>
        <ul>
          <li>Componentes de agentes con configuración compleja</li>
          <li>Tablas especializadas para historial de llamadas</li>
          <li>Gráficos y visualizaciones para analíticas</li>
          <li>Formularios dinámicos para configuraciones</li>
        </ul>
        
        <h3>Capa de Lógica de Negocio</h3>
        
        <h4>Hooks Personalizados</h4>
        <p>Encapsulan la lógica de negocio y proporcionan interfaces limpias:</p>
        <ul>
          <li>Gestión de estado específico por dominio</li>
          <li>Lógica de validación y transformación de datos</li>
          <li>Interacciones con APIs externas</li>
          <li>Manejo de efectos secundarios</li>
        </ul>
        
        <h4>Servicios</h4>
        <p>Abstracciones para operaciones complejas:</p>
        <ul>
          <li>Servicios de comunicación con APIs</li>
          <li>Procesamiento de datos y transformaciones</li>
          <li>Validaciones de negocio</li>
          <li>Cache y persistencia local</li>
        </ul>
        
        <h3>Capa de Datos</h3>
        
        <h4>React Query (TanStack Query)</h4>
        <p>Gestión avanzada del estado del servidor:</p>
        <ul>
          <li>Cache automático con invalidación inteligente</li>
          <li>Sincronización en background</li>
          <li>Optimistic updates</li>
          <li>Retry logic configurable</li>
          <li>Garbage collection automático</li>
        </ul>
        
        <h4>Estado Local</h4>
        <p>Gestión de estado de UI y temporal:</p>
        <ul>
          <li>useState para estado simple de componentes</li>
          <li>useReducer para lógica de estado compleja</li>
          <li>Context API para estado compartido específico</li>
          <li>LocalStorage para persistencia de preferencias</li>
        </ul>
      `
  },
  {
    id: 'arch-data-flow',
    categoryName: 'System Architecture',
    title: 'Flujo de Datos y Comunicación',
    excerpt: 'Descripción del flujo de datos entre componentes y comunicación con servicios externos',
    content: `
        <h2>Flujo de Datos y Comunicación</h2>
        
        <h3>Patrón de Flujo de Datos</h3>
        
        <h4>Flujo Unidireccional</h4>
        <p>El sistema implementa un flujo de datos unidireccional siguiendo las mejores prácticas de React:</p>
        <ol>
          <li><strong>Acción del Usuario:</strong> Interacción en la UI</li>
          <li><strong>Llamada a Hook:</strong> Invocación de lógica de negocio</li>
          <li><strong>Comunicación con API:</strong> Solicitud a servicios externos</li>
          <li><strong>Actualización de Cache:</strong> React Query actualiza el cache</li>
          <li><strong>Re-renderizado:</strong> Componentes se actualizan automáticamente</li>
        </ol>
        
        <h4>Gestión de Estado Reactivo</h4>
        <ul>
          <li>Actualizaciones automáticas basadas en dependencias</li>
          <li>Invalidación inteligente de cache</li>
          <li>Sincronización entre múltiples componentes</li>
          <li>Optimistic updates para mejor UX</li>
        </ul>
        
        <h3>Comunicación con APIs Externas</h3>
        
        <h4>Retell AI API</h4>
        <p><strong>Propósito:</strong> Gestión de agentes conversacionales y LLM</p>
        <ul>
          <li><strong>Endpoints:</strong> Agentes, LLMs, llamadas</li>
          <li><strong>Autenticación:</strong> API Key en headers</li>
          <li><strong>Rate Limiting:</strong> Gestión automática de límites</li>
          <li><strong>Webhooks:</strong> Eventos en tiempo real</li>
        </ul>
        
        <h4>ElevenLabs API</h4>
        <p><strong>Propósito:</strong> Síntesis de voz y clonación</p>
        <ul>
          <li><strong>Endpoints:</strong> Voces, generación, clonación</li>
          <li><strong>Streaming:</strong> Audio en tiempo real</li>
          <li><strong>Models:</strong> Múltiples modelos de voz</li>
        </ul>
        
        <h4>OpenAI API</h4>
        <p><strong>Propósito:</strong> Modelos de lenguaje y análisis</p>
        <ul>
          <li><strong>Models:</strong> GPT-4, GPT-3.5-turbo</li>
          <li><strong>Functions:</strong> Tool calling para agentes</li>
          <li><strong>Embeddings:</strong> Para knowledge base</li>
        </ul>
        
        <h3>Gestión de Errores y Resilencia</h3>
        
        <h4>Estrategias de Manejo de Errores</h4>
        <ul>
          <li><strong>Retry Automático:</strong> Reintentos exponenciales para fallos de red</li>
          <li><strong>Circuit Breaker:</strong> Prevención de cascadas de fallos</li>
          <li><strong>Fallbacks:</strong> Datos alternativos cuando APIs fallan</li>
          <li><strong>Error Boundaries:</strong> Aislamiento de errores de componentes</li>
        </ul>
        
        <h4>Monitoreo y Logging</h4>
        <ul>
          <li>Logging estructurado de errores</li>
          <li>Métricas de rendimiento de APIs</li>
          <li>Tracking de experiencia de usuario</li>
          <li>Alertas automáticas para fallos críticos</li>
        </ul>
        
        <h3>Optimización de Rendimiento</h3>
        
        <h4>Estrategias de Cache</h4>
        <ul>
          <li><strong>Stale-While-Revalidate:</strong> Datos frescos con fallback inmediato</li>
          <li><strong>Background Refetch:</strong> Actualización sin bloquear UI</li>
          <li><strong>Selective Invalidation:</strong> Invalidación granular por tipo de dato</li>
          <li><strong>Prefetching:</strong> Carga anticipada de datos probables</li>
        </ul>
        
        <h4>Optimización de Bundle</h4>
        <ul>
          <li>Code splitting por ruta y características</li>
          <li>Tree shaking automático</li>
          <li>Lazy loading de componentes pesados</li>
          <li>Dynamic imports para funcionalidades opcionales</li>
        </ul>
        
        <h3>Seguridad y Autenticación</h3>
        
        <h4>Gestión de API Keys</h4>
        <ul>
          <li>Almacenamiento seguro de credenciales</li>
          <li>Rotación automática de tokens</li>
          <li>Scopes limitados por funcionalidad</li>
          <li>Auditoría de uso de APIs</li>
        </ul>
        
        <h4>Validación de Datos</h4>
        <ul>
          <li>Validación en cliente con Zod</li>
          <li>Sanitización de inputs de usuario</li>
          <li>Validación de tipos en tiempo de compilación</li>
          <li>Escape de contenido dinámico</li>
        </ul>
      `
  },
  {
    id: 'arch-deployment',
    categoryName: 'System Architecture',
    title: 'Despliegue y Configuración',
    excerpt: 'Guía de despliegue, configuración de entorno y mejores prácticas',
    content: `
        <h2>Despliegue y Configuración</h2>
        
        <h3>Configuración de Entorno</h3>
        
        <h4>Variables de Entorno</h4>
        <p>El sistema utiliza variables de entorno para configuración:</p>
        <ul>
          <li><code>VITE_API_BASE_URL</code> - URL base de la API backend</li>
          <li><code>VITE_RETELL_API_KEY</code> - Clave de API de Retell</li>
          <li><code>VITE_ELEVENLABS_API_KEY</code> - Clave de API de ElevenLabs</li>
          <li><code>VITE_OPENAI_API_KEY</code> - Clave de API de OpenAI</li>
          <li><code>VITE_ENVIRONMENT</code> - Entorno de ejecución (dev/staging/prod)</li>
        </ul>
        
        <h4>Configuración por Entorno</h4>
        <ul>
          <li><strong>Desarrollo:</strong> Hot reload, debugging habilitado</li>
          <li><strong>Staging:</strong> Configuración similar a producción con logging extendido</li>
          <li><strong>Producción:</strong> Optimizaciones máximas, error reporting</li>
        </ul>
        
        <h3>Proceso de Build</h3>
        
        <h4>Vite Build Process</h4>
        <p>Configuración optimizada para producción:</p>
        <ul>
          <li>Minificación y compresión automática</li>
          <li>Tree shaking para eliminar código no utilizado</li>
          <li>Code splitting automático</li>
          <li>Asset optimization (imágenes, fuentes, etc.)</li>
        </ul>
        
        <h4>Análisis de Bundle</h4>
        <ul>
          <li>Bundle analyzer para identificar dependencias pesadas</li>
          <li>Métricas de rendimiento automatizadas</li>
          <li>Alerts para regresiones de tamaño</li>
        </ul>
        
        <h3>Estrategia de Despliegue</h3>
        
        <h4>CI/CD Pipeline</h4>
        <ol>
          <li><strong>Commit:</strong> Código push a repositorio</li>
          <li><strong>Test:</strong> Ejecución de tests automatizados</li>
          <li><strong>Build:</strong> Compilación optimizada</li>
          <li><strong>Deploy:</strong> Despliegue a ambiente target</li>
          <li><strong>Verify:</strong> Smoke tests post-deploy</li>
        </ol>
        
        <h4>Blue-Green Deployment</h4>
        <ul>
          <li>Despliegue sin downtime</li>
          <li>Rollback instantáneo en caso de problemas</li>
          <li>Testing en ambiente idéntico a producción</li>
        </ul>
        
        <h3>Monitoreo y Observabilidad</h3>
        
        <h4>Métricas de Aplicación</h4>
        <ul>
          <li><strong>Performance:</strong> Core Web Vitals, tiempo de carga</li>
          <li><strong>Errores:</strong> Rate de errores por página/función</li>
          <li><strong>Uso:</strong> Funcionalidades más utilizadas</li>
          <li><strong>APIs:</strong> Latencia y disponibilidad de servicios</li>
        </ul>
        
        <h4>Alertas y Notificaciones</h4>
        <ul>
          <li>Alertas automáticas para errores críticos</li>
          <li>Notificaciones de degradación de rendimiento</li>
          <li>Reportes automáticos de disponibilidad</li>
        </ul>
        
        <h3>Mantenimiento y Actualizaciones</h3>
        
        <h4>Gestión de Dependencias</h4>
        <ul>
          <li>Auditorías regulares de seguridad</li>
          <li>Actualizaciones incrementales y testing</li>
          <li>Lockfiles para reproducibilidad</li>
          <li>Deprecation warnings y migración gradual</li>
        </ul>
        
        <h4>Estrategia de Versionado</h4>
        <ul>
          <li>Semantic versioning para releases</li>
          <li>Changelog automático</li>
          <li>Feature flags para rollout gradual</li>
          <li>Backward compatibility cuando es posible</li>
        </ul>
        
        <h3>Recomendaciones de Configuración</h3>
        
        <h4>Optimizaciones de Producción</h4>
        <ul>
          <li>Configurar CDN para assets estáticos</li>
          <li>Habilitar compresión gzip/brotli</li>
          <li>Configurar cache headers apropiados</li>
          <li>Implementar service worker para cache offline</li>
        </ul>
        
        <h4>Seguridad</h4>
        <ul>
          <li>Headers de seguridad (CSP, HSTS, etc.)</li>
          <li>Sanitización de todas las entradas de usuario</li>
          <li>Rate limiting en APIs públicas</li>
          <li>Auditorías regulares de dependencias</li>
        </ul>
      `
  }
];
