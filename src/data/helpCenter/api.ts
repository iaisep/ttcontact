
export const api = [
  {
    id: 'api-1',
    categoryName: 'API',
    title: 'Introducción a la API de UISEP',
    excerpt: 'Aprende cómo interactuar con UISEP AI de forma programática através de nuestra API',
    content: `
        <h2>Introducción a la API de UISEP</h2>
        <p>La API de UISEP permite a los desarrolladores integrar agentes de voz con IA en sus propias aplicaciones y flujos de trabajo de forma programática.</p>
        
        <h3>Descripción General de la API</h3>
        <p>La API de UISEP proporciona endpoints para:</p>
        <ul>
          <li>Crear y gestionar agentes</li>
          <li>Iniciar y controlar conversaciones de voz</li>
          <li>Gestionar números telefónicos y llamadas</li>
          <li>Construir y actualizar bases de conocimiento</li>
          <li>Obtener analíticas y datos de conversaciones</li>
        </ul>
        
        <h3>Autenticación</h3>
        <p>Todas las solicitudes de API requieren autenticación usando claves API:</p>
        <pre>
        curl -X GET https://api.uisepai.com/v1/agents \\
        -H "Authorization: Bearer TU_CLAVE_API"
        </pre>
        
        <h3>Endpoints Principales</h3>
        <h4>Agentes</h4>
        <ul>
          <li><code>GET /v1/agents</code> - Listar todos los agentes</li>
          <li><code>GET /v1/agents/:id</code> - Obtener un agente específico</li>
          <li><code>POST /v1/agents</code> - Crear un nuevo agente</li>
          <li><code>PUT /v1/agents/:id</code> - Actualizar un agente</li>
          <li><code>DELETE /v1/agents/:id</code> - Eliminar un agente</li>
        </ul>
        
        <h4>Llamadas</h4>
        <ul>
          <li><code>POST /v1/calls</code> - Iniciar una nueva llamada</li>
          <li><code>GET /v1/calls/:id</code> - Obtener estado de la llamada</li>
          <li><code>POST /v1/calls/:id/end</code> - Finalizar una llamada</li>
        </ul>
        
        <p>Para la documentación completa de la API y ejemplos de código, visita nuestra <a href="https://docs.uisepai.com/api-reference/introduction" target="_blank" rel="noopener noreferrer">Referencia de API</a>.</p>
      `
  }
];
