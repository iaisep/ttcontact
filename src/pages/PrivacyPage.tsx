
import { useLanguage } from "@/context/LanguageContext";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPage = () => {
  const { t, language } = useLanguage();

  const content = language === 'es' ? {
    title: "Política de Privacidad",
    lastUpdated: "Última actualización: 26 de mayo de 2025",
    sections: [
      {
        title: "1. Información que Recopilamos",
        content: [
          "En Totalcontac, recopilamos diferentes tipos de información para proporcionar y mejorar nuestros servicios:",
          "• **Información de la Cuenta**: Nombre, dirección de correo electrónico, información de facturación y preferencias de cuenta.",
          "• **Datos de Uso**: Información sobre cómo utiliza nuestros servicios, incluyendo registros de llamadas, transcripciones y métricas de rendimiento.",
          "• **Datos de Voz**: Grabaciones de audio y datos de voz procesados por nuestros sistemas de IA para proporcionar servicios de voz sintética.",
          "• **Información Técnica**: Direcciones IP, tipo de navegador, sistema operativo y datos de dispositivos.",
          "• **Cookies y Tecnologías Similares**: Utilizamos cookies para mejorar la experiencia del usuario y analizar el uso del servicio."
        ]
      },
      {
        title: "2. Cómo Utilizamos su Información",
        content: [
          "Utilizamos la información recopilada para:",
          "• Proporcionar, mantener y mejorar nuestros servicios de IA de voz",
          "• Procesar transacciones y gestionar su cuenta",
          "• Entrenar y mejorar nuestros modelos de IA (con datos anonimizados)",
          "• Comunicarnos con usted sobre actualizaciones del servicio y soporte",
          "• Cumplir con obligaciones legales y resolver disputas",
          "• Personalizar su experiencia y proporcionar contenido relevante"
        ]
      },
      {
        title: "3. Procesamiento de Datos de IA",
        content: [
          "Como proveedor de servicios de IA de voz, procesamos datos de audio y voz de manera especial:",
          "• **Procesamiento en Tiempo Real**: Los datos de voz se procesan en tiempo real para generar respuestas",
          "• **Retención Temporal**: Las grabaciones de audio pueden conservarse temporalmente para control de calidad",
          "• **Mejora del Modelo**: Podemos usar datos anonimizados para mejorar nuestros algoritmos de IA",
          "• **Seguridad de Datos**: Todos los datos de voz se cifran durante la transmisión y el almacenamiento"
        ]
      },
      {
        title: "4. Compartir Información",
        content: [
          "No vendemos, alquilamos ni compartimos su información personal, excepto en las siguientes circunstancias:",
          "• **Proveedores de Servicios**: Con terceros que nos ayudan a operar nuestros servicios",
          "• **Cumplimiento Legal**: Cuando sea requerido por ley o para proteger nuestros derechos",
          "• **Consentimiento**: Cuando haya dado su consentimiento explícito",
          "• **Transferencia Comercial**: En caso de fusión, adquisición o venta de activos"
        ]
      },
      {
        title: "5. Seguridad de Datos",
        content: [
          "Implementamos medidas de seguridad técnicas y organizativas apropiadas:",
          "• Cifrado de datos en tránsito y en reposo",
          "• Controles de acceso estrictos y autenticación multifactor",
          "• Auditorías de seguridad regulares y pruebas de penetración",
          "• Capacitación del personal en protección de datos",
          "• Planes de respuesta a incidentes de seguridad"
        ]
      },
      {
        title: "6. Sus Derechos",
        content: [
          "Dependiendo de su ubicación, puede tener los siguientes derechos:",
          "• **Acceso**: Solicitar una copia de sus datos personales",
          "• **Rectificación**: Corregir datos inexactos o incompletos",
          "• **Eliminación**: Solicitar la eliminación de sus datos personales",
          "• **Portabilidad**: Recibir sus datos en un formato estructurado",
          "• **Oposición**: Oponerse al procesamiento de sus datos",
          "• **Limitación**: Restringir el procesamiento de sus datos"
        ]
      },
      {
        title: "7. Retención de Datos",
        content: [
          "Conservamos sus datos personales solo durante el tiempo necesario:",
          "• **Datos de Cuenta**: Mientras su cuenta esté activa o según sea necesario para proporcionar servicios",
          "• **Datos de Voz**: Típicamente eliminados dentro de 30 días, a menos que se especifique lo contrario",
          "• **Registros de Transacciones**: Conservados según los requisitos legales y fiscales",
          "• **Datos Anonimizados**: Pueden conservarse indefinidamente para mejoras del servicio"
        ]
      },
      {
        title: "8. Transferencias Internacionales",
        content: [
          "Sus datos pueden transferirse y procesarse en países fuera de su jurisdicción:",
          "• Implementamos salvaguardas apropiadas como cláusulas contractuales estándar",
          "• Nos aseguramos de que los países receptores tengan protecciones de datos adecuadas",
          "• Puede solicitar información sobre las salvaguardas específicas aplicadas"
        ]
      },
      {
        title: "9. Menores de Edad",
        content: [
          "Nuestros servicios no están dirigidos a menores de 18 años:",
          "• No recopilamos intencionalmente información de menores",
          "• Si descubrimos que hemos recopilado datos de un menor, los eliminaremos inmediatamente",
          "• Los padres pueden contactarnos para solicitar la eliminación de datos de sus hijos"
        ]
      },
      {
        title: "10. Actualizaciones de esta Política",
        content: [
          "Podemos actualizar esta política de privacidad ocasionalmente:",
          "• Le notificaremos sobre cambios significativos por correo electrónico o en nuestro servicio",
          "• La fecha de 'Última actualización' en la parte superior refleja cuándo se revisó por última vez",
          "• El uso continuado de nuestros servicios constituye aceptación de la política actualizada"
        ]
      },
      {
        title: "11. Contacto",
        content: [
          "Si tiene preguntas sobre esta política de privacidad, contáctenos:",
          "• **Correo electrónico**: privacy@totalcontac.com",
          "• **Dirección**: San Francisco, CA, Estados Unidos",
          "• **Teléfono**: +1 (555) 123-4567",
          "• **Oficial de Protección de Datos**: dpo@totalcontac.com"
        ]
      }
    ]
  } : {
    title: "Privacy Policy",
    lastUpdated: "Last updated: May 26, 2025",
    sections: [
      {
        title: "1. Information We Collect",
        content: [
          "At Totalcontac, we collect different types of information to provide and improve our services:",
          "• **Account Information**: Name, email address, billing information, and account preferences.",
          "• **Usage Data**: Information about how you use our services, including call logs, transcripts, and performance metrics.",
          "• **Voice Data**: Audio recordings and voice data processed by our AI systems to provide synthetic voice services.",
          "• **Technical Information**: IP addresses, browser type, operating system, and device data.",
          "• **Cookies and Similar Technologies**: We use cookies to enhance user experience and analyze service usage."
        ]
      },
      {
        title: "2. How We Use Your Information",
        content: [
          "We use the collected information to:",
          "• Provide, maintain, and improve our voice AI services",
          "• Process transactions and manage your account",
          "• Train and improve our AI models (with anonymized data)",
          "• Communicate with you about service updates and support",
          "• Comply with legal obligations and resolve disputes",
          "• Personalize your experience and provide relevant content"
        ]
      },
      {
        title: "3. AI Data Processing",
        content: [
          "As a voice AI service provider, we process audio and voice data in special ways:",
          "• **Real-time Processing**: Voice data is processed in real-time to generate responses",
          "• **Temporary Retention**: Audio recordings may be temporarily retained for quality control",
          "• **Model Improvement**: We may use anonymized data to improve our AI algorithms",
          "• **Data Security**: All voice data is encrypted during transmission and storage"
        ]
      },
      {
        title: "4. Information Sharing",
        content: [
          "We do not sell, rent, or share your personal information, except in the following circumstances:",
          "• **Service Providers**: With third parties who help us operate our services",
          "• **Legal Compliance**: When required by law or to protect our rights",
          "• **Consent**: When you have given explicit consent",
          "• **Business Transfer**: In case of merger, acquisition, or asset sale"
        ]
      },
      {
        title: "5. Data Security",
        content: [
          "We implement appropriate technical and organizational security measures:",
          "• Encryption of data in transit and at rest",
          "• Strict access controls and multi-factor authentication",
          "• Regular security audits and penetration testing",
          "• Staff training on data protection",
          "• Security incident response plans"
        ]
      },
      {
        title: "6. Your Rights",
        content: [
          "Depending on your location, you may have the following rights:",
          "• **Access**: Request a copy of your personal data",
          "• **Rectification**: Correct inaccurate or incomplete data",
          "• **Erasure**: Request deletion of your personal data",
          "• **Portability**: Receive your data in a structured format",
          "• **Objection**: Object to processing of your data",
          "• **Restriction**: Restrict processing of your data"
        ]
      },
      {
        title: "7. Data Retention",
        content: [
          "We retain your personal data only as long as necessary:",
          "• **Account Data**: While your account is active or as needed to provide services",
          "• **Voice Data**: Typically deleted within 30 days unless otherwise specified",
          "• **Transaction Records**: Retained per legal and tax requirements",
          "• **Anonymized Data**: May be retained indefinitely for service improvements"
        ]
      },
      {
        title: "8. International Transfers",
        content: [
          "Your data may be transferred to and processed in countries outside your jurisdiction:",
          "• We implement appropriate safeguards such as standard contractual clauses",
          "• We ensure recipient countries have adequate data protections",
          "• You may request information about specific safeguards applied"
        ]
      },
      {
        title: "9. Children's Privacy",
        content: [
          "Our services are not directed to individuals under 18:",
          "• We do not knowingly collect information from minors",
          "• If we discover we have collected data from a minor, we will delete it immediately",
          "• Parents may contact us to request deletion of their child's data"
        ]
      },
      {
        title: "10. Updates to This Policy",
        content: [
          "We may update this privacy policy from time to time:",
          "• We will notify you of significant changes via email or in our service",
          "• The 'Last updated' date at the top reflects when it was last revised",
          "• Continued use of our services constitutes acceptance of the updated policy"
        ]
      },
      {
        title: "11. Contact Us",
        content: [
          "If you have questions about this privacy policy, contact us:",
          "• **Email**: privacy@totalcontac.com",
          "• **Address**: San Francisco, CA, United States",
          "• **Phone**: +1 (555) 123-4567",
          "• **Data Protection Officer**: dpo@totalcontac.com"
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
                  ? 'En Totalcontac, nos comprometemos a proteger su privacidad y datos personales. Esta política explica cómo recopilamos, utilizamos y protegemos su información cuando utiliza nuestros servicios de IA de voz.'
                  : 'At Totalcontac, we are committed to protecting your privacy and personal data. This policy explains how we collect, use, and protect your information when you use our voice AI services.'
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
                {language === 'es' ? 'Información Importante' : 'Important Information'}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                {language === 'es'
                  ? 'Esta política de privacidad forma parte de nuestros términos de servicio. Al utilizar nuestros servicios, usted acepta las prácticas descritas en esta política. Si no está de acuerdo con esta política, no utilice nuestros servicios.'
                  : 'This privacy policy is part of our terms of service. By using our services, you agree to the practices described in this policy. If you do not agree with this policy, please do not use our services.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
