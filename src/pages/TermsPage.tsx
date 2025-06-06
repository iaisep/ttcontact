
import { useLanguage } from "@/context/LanguageContext";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TermsPage = () => {
  const { t, language } = useLanguage();

  const content = language === 'es' ? {
    title: "Términos de Servicio",
    lastUpdated: "Última actualización: 26 de mayo de 2025",
    sections: [
      {
        title: "1. Aceptación de los Términos",
        content: [
          "Al acceder y utilizar los servicios de Totalcontac ('el Servicio'), usted acepta estar legalmente vinculado por estos Términos de Servicio ('Términos'). Si no acepta estos términos, no utilice nuestros servicios.",
          "Totalcontac se reserva el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación en nuestro sitio web."
        ]
      },
      {
        title: "2. Descripción del Servicio",
        content: [
          "Totalcontac proporciona servicios de inteligencia artificial de voz que permiten a los usuarios:",
          "• Crear agentes de voz con IA personalizados",
          "• Integrar capacidades de voz en sus aplicaciones mediante API y SDK",
          "• Procesar llamadas telefónicas automatizadas",
          "• Generar transcripciones y análisis de conversaciones",
          "• Acceder a herramientas de desarrollo y monitoreo"
        ]
      },
      {
        title: "3. Elegibilidad y Registro de Cuenta",
        content: [
          "Para utilizar nuestros servicios, debe:",
          "• Tener al menos 18 años de edad",
          "• Proporcionar información precisa y completa durante el registro",
          "• Mantener la confidencialidad de sus credenciales de acceso",
          "• Notificar inmediatamente cualquier uso no autorizado de su cuenta",
          "• Cumplir con todas las leyes aplicables en su jurisdicción"
        ]
      },
      {
        title: "4. Uso Aceptable",
        content: [
          "Al utilizar nuestros servicios, usted se compromete a:",
          "• Utilizar el servicio únicamente para fines legales y legítimos",
          "• No violar derechos de propiedad intelectual de terceros",
          "• No intentar acceder a sistemas no autorizados",
          "• No transmitir contenido malicioso, spam o material inapropiado",
          "• No usar el servicio para actividades fraudulentas o engañosas",
          "• Cumplir con las regulaciones de telecomunicaciones aplicables"
        ]
      },
      {
        title: "5. Restricciones de Uso",
        content: [
          "Está prohibido:",
          "• Realizar ingeniería inversa del software",
          "• Revender o redistribuir nuestros servicios sin autorización",
          "• Usar el servicio para llamadas de acoso o spam",
          "• Intentar sobrecargar o interrumpir nuestros sistemas",
          "• Crear cuentas múltiples para evadir limitaciones",
          "• Utilizar el servicio para actividades ilegales o no éticas"
        ]
      },
      {
        title: "6. Facturación y Pagos",
        content: [
          "• Los servicios se facturan según el plan seleccionado y el uso",
          "• Los pagos se procesan mediante procesadores de pago seguros",
          "• Las tarifas están sujetas a cambios con previo aviso",
          "• Los reembolsos se procesan según nuestra política de reembolsos",
          "• Los cargos por uso excesivo se aplican según las tarifas publicadas",
          "• La falta de pago puede resultar en la suspensión del servicio"
        ]
      },
      {
        title: "7. Propiedad Intelectual",
        content: [
          "• Totalcontac retiene todos los derechos sobre su plataforma y tecnología",
          "• Los usuarios conservan los derechos sobre su contenido y datos",
          "• Se otorga una licencia limitada para usar nuestros servicios",
          "• Las marcas comerciales de Totalcontac están protegidas",
          "• Los usuarios garantizan tener derechos sobre el contenido que suben",
          "• Se prohíbe el uso no autorizado de nuestra propiedad intelectual"
        ]
      },
      {
        title: "8. Privacidad y Protección de Datos",
        content: [
          "• El manejo de datos personales se rige por nuestra Política de Privacidad",
          "• Implementamos medidas de seguridad apropiadas",
          "• Los datos se procesan según las leyes de protección de datos aplicables",
          "• Los usuarios pueden solicitar acceso, corrección o eliminación de sus datos",
          "• Las grabaciones de audio se manejan con estricta confidencialidad",
          "• Se requiere consentimiento para el procesamiento de datos personales"
        ]
      },
      {
        title: "9. Disponibilidad del Servicio",
        content: [
          "• Nos esforzamos por mantener un 99.9% de tiempo de actividad",
          "• El mantenimiento programado se notifica con anticipación",
          "• No garantizamos disponibilidad continua sin interrupciones",
          "• Los tiempos de inactividad por mantenimiento no se consideran violaciones",
          "• Proporcionamos actualizaciones sobre el estado del servicio",
          "• Los créditos por tiempo de inactividad se otorgan según el SLA"
        ]
      },
      {
        title: "10. Limitación de Responsabilidad",
        content: [
          "• Los servicios se proporcionan 'tal como están'",
          "• No garantizamos resultados específicos o precisión perfecta",
          "• Nuestra responsabilidad se limita al monto pagado por los servicios",
          "• No somos responsables de daños indirectos o consecuenciales",
          "• Los usuarios son responsables del cumplimiento de las leyes locales",
          "• Las limitaciones pueden no aplicar donde esté prohibido por ley"
        ]
      },
      {
        title: "11. Terminación",
        content: [
          "• Cualquiera de las partes puede terminar el acuerdo con aviso previo",
          "• Podemos suspender cuentas por violaciones de términos",
          "• Los datos pueden ser eliminados después de la terminación",
          "• Las obligaciones de pago permanecen después de la terminación",
          "• Se proporcionará un período de gracia para la exportación de datos",
          "• Algunos términos pueden sobrevivir a la terminación del acuerdo"
        ]
      },
      {
        title: "12. Ley Aplicable y Jurisdicción",
        content: [
          "• Estos términos se rigen por las leyes de California, Estados Unidos",
          "• Las disputas se resolverán en los tribunales de San Francisco, CA",
          "• Se prefiere la resolución alternativa de disputas cuando sea posible",
          "• Los usuarios renuncian al derecho a demandas colectivas",
          "• Se aplicará arbitraje vinculante para ciertas disputas",
          "• Las leyes locales pueden proporcionar derechos adicionales"
        ]
      },
      {
        title: "13. Modificaciones del Servicio",
        content: [
          "• Podemos modificar o discontinuar características con aviso previo",
          "• Los cambios significativos se comunicarán a los usuarios",
          "• Los precios pueden ajustarse con notificación de 30 días",
          "• Se proporcionará migración para características discontinuadas",
          "• Los términos actualizados prevalecen sobre versiones anteriores",
          "• El uso continuo implica aceptación de los cambios"
        ]
      },
      {
        title: "14. Contacto e Información Legal",
        content: [
          "Para consultas sobre estos términos, contáctenos:",
          "• **Correo electrónico**: legal@totalcontac.com",
          "• **Dirección**: San Francisco, CA, Estados Unidos",
          "• **Departamento Legal**: +1 (555) 123-4567",
          "• **Horario de atención**: Lunes a Viernes, 9:00 AM - 6:00 PM PST"
        ]
      }
    ]
  } : {
    title: "Terms of Service",
    lastUpdated: "Last updated: May 26, 2025",
    sections: [
      {
        title: "1. Acceptance of Terms",
        content: [
          "By accessing and using Totalcontac services ('the Service'), you agree to be legally bound by these Terms of Service ('Terms'). If you do not agree to these terms, do not use our services.",
          "Totalcontac reserves the right to modify these terms at any time. Modifications will take effect immediately upon posting on our website."
        ]
      },
      {
        title: "2. Service Description",
        content: [
          "Totalcontac provides voice artificial intelligence services that enable users to:",
          "• Create custom voice AI agents",
          "• Integrate voice capabilities into their applications via API and SDK",
          "• Process automated phone calls",
          "• Generate transcriptions and conversation analytics",
          "• Access development and monitoring tools"
        ]
      },
      {
        title: "3. Eligibility and Account Registration",
        content: [
          "To use our services, you must:",
          "• Be at least 18 years of age",
          "• Provide accurate and complete information during registration",
          "• Maintain the confidentiality of your access credentials",
          "• Immediately notify of any unauthorized use of your account",
          "• Comply with all applicable laws in your jurisdiction"
        ]
      },
      {
        title: "4. Acceptable Use",
        content: [
          "By using our services, you agree to:",
          "• Use the service only for legal and legitimate purposes",
          "• Not violate third-party intellectual property rights",
          "• Not attempt to access unauthorized systems",
          "• Not transmit malicious content, spam, or inappropriate material",
          "• Not use the service for fraudulent or deceptive activities",
          "• Comply with applicable telecommunications regulations"
        ]
      },
      {
        title: "5. Usage Restrictions",
        content: [
          "It is prohibited to:",
          "• Reverse engineer the software",
          "• Resell or redistribute our services without authorization",
          "• Use the service for harassment or spam calls",
          "• Attempt to overload or disrupt our systems",
          "• Create multiple accounts to evade limitations",
          "• Use the service for illegal or unethical activities"
        ]
      },
      {
        title: "6. Billing and Payments",
        content: [
          "• Services are billed according to the selected plan and usage",
          "• Payments are processed through secure payment processors",
          "• Rates are subject to change with prior notice",
          "• Refunds are processed according to our refund policy",
          "• Overage charges apply according to published rates",
          "• Failure to pay may result in service suspension"
        ]
      },
      {
        title: "7. Intellectual Property",
        content: [
          "• Totalcontac retains all rights to its platform and technology",
          "• Users retain rights to their content and data",
          "• A limited license is granted to use our services",
          "• Totalcontac trademarks are protected",
          "• Users warrant having rights to content they upload",
          "• Unauthorized use of our intellectual property is prohibited"
        ]
      },
      {
        title: "8. Privacy and Data Protection",
        content: [
          "• Personal data handling is governed by our Privacy Policy",
          "• We implement appropriate security measures",
          "• Data is processed according to applicable data protection laws",
          "• Users may request access, correction, or deletion of their data",
          "• Audio recordings are handled with strict confidentiality",
          "• Consent is required for personal data processing"
        ]
      },
      {
        title: "9. Service Availability",
        content: [
          "• We strive to maintain 99.9% uptime",
          "• Scheduled maintenance is notified in advance",
          "• We do not guarantee continuous availability without interruptions",
          "• Maintenance downtime is not considered violations",
          "• We provide service status updates",
          "• Downtime credits are granted according to SLA"
        ]
      },
      {
        title: "10. Limitation of Liability",
        content: [
          "• Services are provided 'as is'",
          "• We do not guarantee specific results or perfect accuracy",
          "• Our liability is limited to the amount paid for services",
          "• We are not responsible for indirect or consequential damages",
          "• Users are responsible for compliance with local laws",
          "• Limitations may not apply where prohibited by law"
        ]
      },
      {
        title: "11. Termination",
        content: [
          "• Either party may terminate the agreement with prior notice",
          "• We may suspend accounts for terms violations",
          "• Data may be deleted after termination",
          "• Payment obligations remain after termination",
          "• A grace period will be provided for data export",
          "• Some terms may survive agreement termination"
        ]
      },
      {
        title: "12. Applicable Law and Jurisdiction",
        content: [
          "• These terms are governed by California law, United States",
          "• Disputes will be resolved in San Francisco, CA courts",
          "• Alternative dispute resolution is preferred when possible",
          "• Users waive the right to class action lawsuits",
          "• Binding arbitration will apply for certain disputes",
          "• Local laws may provide additional rights"
        ]
      },
      {
        title: "13. Service Modifications",
        content: [
          "• We may modify or discontinue features with prior notice",
          "• Significant changes will be communicated to users",
          "• Prices may be adjusted with 30 days' notice",
          "• Migration will be provided for discontinued features",
          "• Updated terms prevail over previous versions",
          "• Continued use implies acceptance of changes"
        ]
      },
      {
        title: "14. Contact and Legal Information",
        content: [
          "For inquiries about these terms, contact us:",
          "• **Email**: legal@totalcontac.com",
          "• **Address**: San Francisco, CA, United States",
          "• **Legal Department**: +1 (555) 123-4567",
          "• **Business Hours**: Monday to Friday, 9:00 AM - 6:00 PM PST"
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {language === 'es' ? 'Volver al inicio' : 'Back to home'}
          </Link>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {content.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {content.lastUpdated}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="prose dark:prose-invert max-w-none">
            <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                {language === 'es' 
                  ? 'Estos términos de servicio rigen el uso de la plataforma Totalcontac. Al utilizar nuestros servicios, usted acepta cumplir con estos términos y condiciones. Por favor, léalos cuidadosamente.'
                  : 'These terms of service govern the use of the Totalcontac platform. By using our services, you agree to comply with these terms and conditions. Please read them carefully.'
                }
              </p>
            </div>

            {content.sections.map((section, index) => (
              <div key={index} className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                  {section.title}
                </h2>
                <div className="space-y-3">
                  {section.content.map((paragraph, pIndex) => (
                    <p key={pIndex} className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                {language === 'es' ? 'Acuerdo Legal' : 'Legal Agreement'}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                {language === 'es'
                  ? 'Al utilizar los servicios de Totalcontac, usted reconoce que ha leído, entendido y acepta estar legalmente vinculado por estos términos de servicio. Si tiene preguntas, contáctenos antes de usar nuestros servicios.'
                  : 'By using Totalcontac services, you acknowledge that you have read, understood, and agree to be legally bound by these terms of service. If you have questions, contact us before using our services.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
