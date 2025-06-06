
export const technicalDocumentation = [
  {
    id: 'tech-overview',
    categoryName: 'Technical Documentation',
    title: 'UISEP AI - Documentación Técnica del Sistema',
    excerpt: 'Descripción técnica completa de la arquitectura y módulos del sistema UISEP AI',
    content: `
        <h2>UISEP AI - Documentación Técnica del Sistema</h2>
        <p>Esta documentación proporciona una visión técnica detallada de la plataforma UISEP AI, incluyendo la arquitectura del sistema, módulos funcionales y especificaciones técnicas.</p>
        
        <h3>Arquitectura General del Sistema</h3>
        <p>UISEP AI está construido como una aplicación web moderna basada en React con TypeScript, implementando una arquitectura modular y escalable que facilita el mantenimiento y la extensibilidad del código.</p>
        
        <h4>Stack Tecnológico Principal</h4>
        <ul>
          <li><strong>Frontend:</strong> React 18.3.1 con TypeScript</li>
          <li><strong>Bundler:</strong> Vite para desarrollo y construcción optimizada</li>
          <li><strong>Styling:</strong> Tailwind CSS con Shadcn/UI Components</li>
          <li><strong>Estado:</strong> React Query (TanStack Query) para gestión de estado servidor</li>
          <li><strong>Routing:</strong> React Router DOM v6</li>
          <li><strong>Iconografía:</strong> Lucide React</li>
        </ul>
        
        <h3>Estructura Modular del Sistema</h3>
        <p>El sistema está organizado en módulos especializados que manejan diferentes aspectos de la funcionalidad:</p>
        
        <h4>1. Módulo de Agentes (Agents)</h4>
        <p><strong>Propósito:</strong> Gestión completa del ciclo de vida de agentes de IA conversacional.</p>
        <ul>
          <li>Creación y configuración de agentes</li>
          <li>Gestión de prompts y configuraciones de LLM</li>
          <li>Selección y configuración de voces</li>
          <li>Configuración de funciones personalizadas</li>
          <li>Panel de pruebas en tiempo real</li>
        </ul>
        
        <h4>2. Módulo de Números Telefónicos (Phone Numbers)</h4>
        <p><strong>Propósito:</strong> Administración de números telefónicos y configuraciones de telefonía.</p>
        <ul>
          <li>Compra y gestión de números telefónicos</li>
          <li>Asignación de agentes a números específicos</li>
          <li>Configuración de webhooks de entrada y salida</li>
          <li>Gestión de proveedores de telefonía</li>
        </ul>
        
        <h4>3. Módulo de Historial de Llamadas (Call History)</h4>
        <p><strong>Propósito:</strong> Registro y análisis de interacciones telefónicas.</p>
        <ul>
          <li>Almacenamiento de transcripciones completas</li>
          <li>Análisis de sentimientos y rendimiento</li>
          <li>Filtrado y búsqueda avanzada</li>
          <li>Exportación de datos para análisis</li>
        </ul>
        
        <h4>4. Módulo de Analíticas (Analytics)</h4>
        <p><strong>Propósito:</strong> Análisis de rendimiento y métricas operacionales.</p>
        <ul>
          <li>Métricas de llamadas en tiempo real</li>
          <li>Análisis de rendimiento por agente</li>
          <li>Distribución temporal de llamadas</li>
          <li>Análisis de costos operacionales</li>
        </ul>
      `
  },
  {
    id: 'tech-modules-detail',
    categoryName: 'Technical Documentation', 
    title: 'Especificaciones Técnicas de Módulos',
    excerpt: 'Descripción detallada de la implementación técnica de cada módulo del sistema',
    content: `
        <h2>Especificaciones Técnicas de Módulos</h2>
        
        <h3>Módulo de Agentes - Implementación Técnica</h3>
        
        <h4>Arquitectura del Componente</h4>
        <p>El módulo de agentes sigue un patrón de hooks personalizados para la gestión de estado y lógica de negocio:</p>
        <ul>
          <li><code>useAgentDetails</code> - Gestión del estado del agente</li>
          <li><code>useAgentCreation</code> - Lógica de creación de agentes</li>
          <li><code>useVoiceSettings</code> - Configuración de voces</li>
          <li><code>useTestPanel</code> - Funcionalidades de prueba</li>
        </ul>
        
        <h4>Integración con APIs Externas</h4>
        <ul>
          <li><strong>Retell AI:</strong> Integración para LLM y gestión de conversaciones</li>
          <li><strong>ElevenLabs:</strong> Síntesis de voz y clonación de voces</li>
          <li><strong>OpenAI:</strong> Modelos de lenguaje GPT-4 y GPT-3.5</li>
        </ul>
        
        <h4>Configuraciones Avanzadas</h4>
        <ul>
          <li>Configuración de interrupciones y sensibilidad</li>
          <li>Gestión de análisis post-llamada</li>
          <li>Configuración de funciones personalizadas (transferencias, calendario)</li>
          <li>Variables dinámicas para personalización</li>
        </ul>
        
        <h3>Módulo de Telefonía - Implementación Técnica</h3>
        
        <h4>Gestión de Números Telefónicos</h4>
        <p>Implementación basada en hooks especializados:</p>
        <ul>
          <li><code>usePhoneNumbers</code> - Estado principal de números</li>
          <li><code>useFetchPhoneNumbers</code> - Obtención de datos</li>
          <li><code>usePhoneNumberPurchase</code> - Compra y liberación</li>
          <li><code>useAgentAssignment</code> - Asignación de agentes</li>
        </ul>
        
        <h4>Integración con Proveedores</h4>
        <ul>
          <li>Soporte para múltiples proveedores de telefonía</li>
          <li>Gestión automática de webhooks</li>
          <li>Configuración de parámetros de llamada</li>
        </ul>
        
        <h3>Módulo de Historial - Implementación Técnica</h3>
        
        <h4>Gestión de Datos</h4>
        <p>Sistema de hooks modular para manejo eficiente de grandes volúmenes de datos:</p>
        <ul>
          <li><code>useCallHistory</code> - Hook principal unificado</li>
          <li><code>useCallFilters</code> - Filtrado y búsqueda</li>
          <li><code>useCallPagination</code> - Paginación optimizada</li>
          <li><code>useCallDetails</code> - Detalles específicos de llamadas</li>
          <li><code>useColumnVisibility</code> - Configuración de vistas</li>
        </ul>
        
        <h4>Optimizaciones de Rendimiento</h4>
        <ul>
          <li>Paginación virtual para grandes conjuntos de datos</li>
          <li>Debouncing en filtros de búsqueda</li>
          <li>Caching inteligente con React Query</li>
          <li>Lazy loading de transcripciones</li>
        </ul>
        
        <h3>Módulo de Analíticas - Implementación Técnica</h3>
        
        <h4>Procesamiento de Datos</h4>
        <p>Sistema refactorizado para análisis eficiente:</p>
        <ul>
          <li><code>useAnalyticsData</code> - Hook principal de analíticas</li>
          <li><code>useAnalyticsDataFetcher</code> - Obtención de datos</li>
          <li><code>useBatchCallData</code> - Datos de llamadas en lote</li>
          <li><code>useAnalyticsMockData</code> - Datos de prueba</li>
        </ul>
        
        <h4>Visualización de Datos</h4>
        <ul>
          <li>Integración con Recharts para gráficos interactivos</li>
          <li>Componentes especializados por tipo de métrica</li>
          <li>Actualizaciones en tiempo real</li>
          <li>Exportación de reportes en múltiples formatos</li>
        </ul>
      `
  },
  {
    id: 'tech-patterns',
    categoryName: 'Technical Documentation',
    title: 'Patrones de Desarrollo y Arquitectura',
    excerpt: 'Patrones de diseño, mejores prácticas y convenciones utilizadas en el desarrollo',
    content: `
        <h2>Patrones de Desarrollo y Arquitectura</h2>
        
        <h3>Patrones de Hooks Personalizados</h3>
        
        <h4>Separación de Responsabilidades</h4>
        <p>Cada módulo implementa una separación clara de responsabilidades mediante hooks especializados:</p>
        <ul>
          <li><strong>Data Fetching:</strong> Hooks dedicados a la obtención de datos (<code>useFetch*</code>)</li>
          <li><strong>State Management:</strong> Gestión local de estado por dominio</li>
          <li><strong>Business Logic:</strong> Lógica de negocio encapsulada en hooks específicos</li>
          <li><strong>UI State:</strong> Estado de interfaz separado del estado de datos</li>
        </ul>
        
        <h4>Composición de Hooks</h4>
        <p>Patrón de composición donde hooks complejos combinan múltiples hooks más simples:</p>
        <pre>
        // Ejemplo del patrón de composición
        export const useCallHistory = () => {
          const filters = useCallFilters();
          const pagination = useCallPagination();
          const visibility = useColumnVisibility();
          const details = useCallDetails();
          const data = useCallData(/* ... */);
          
          return {
            ...filters,
            ...pagination,
            ...visibility,
            ...details,
            ...data
          };
        };
        </pre>
        
        <h3>Gestión de Estado</h3>
        
        <h4>React Query para Estado del Servidor</h4>
        <ul>
          <li>Cache automático con invalidación inteligente</li>
          <li>Refetch en background para datos actualizados</li>
          <li>Optimistic updates para mejor UX</li>
          <li>Error handling centralizado</li>
        </ul>
        
        <h4>Estado Local con useState y useReducer</h4>
        <ul>
          <li>Estado de UI mantenido localmente</li>
          <li>useReducer para lógica compleja de estado</li>
          <li>Context API para estado compartido específico</li>
        </ul>
        
        <h3>Arquitectura de Componentes</h3>
        
        <h4>Principio de Responsabilidad Única</h4>
        <p>Cada componente tiene una responsabilidad específica y bien definida:</p>
        <ul>
          <li><strong>Container Components:</strong> Gestión de estado y lógica</li>
          <li><strong>Presentation Components:</strong> Renderizado y UI</li>
          <li><strong>Layout Components:</strong> Estructura y disposición</li>
          <li><strong>Utility Components:</strong> Funcionalidades reutilizables</li>
        </ul>
        
        <h4>Composición sobre Herencia</h4>
        <ul>
          <li>Componentes altamente reutilizables</li>
          <li>Props drilling minimizado</li>
          <li>Render props y children como patrones principales</li>
        </ul>
        
        <h3>Gestión de Errores</h3>
        
        <h4>Error Boundaries</h4>
        <ul>
          <li>Captura de errores a nivel de componente</li>
          <li>Fallbacks elegantes para fallos de renderizado</li>
          <li>Logging centralizado de errores</li>
        </ul>
        
        <h4>Manejo de Errores Asíncronos</h4>
        <ul>
          <li>Try-catch en operaciones críticas</li>
          <li>Toast notifications para feedback inmediato</li>
          <li>Retry logic automático para operaciones de red</li>
        </ul>
        
        <h3>Optimización de Rendimiento</h3>
        
        <h4>Memoización</h4>
        <ul>
          <li>React.memo para componentes puros</li>
          <li>useMemo para cálculos costosos</li>
          <li>useCallback para estabilidad de referencias</li>
        </ul>
        
        <h4>Lazy Loading</h4>
        <ul>
          <li>Code splitting a nivel de ruta</li>
          <li>Lazy loading de componentes pesados</li>
          <li>Suspense para manejo de estados de carga</li>
        </ul>
      `
  }
];
