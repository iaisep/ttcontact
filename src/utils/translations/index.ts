
import accountTranslations from './account';
import contactTranslations from './contact';
import dashboardTranslations from './dashboard';
import featuresTranslations from './features';
import formsTranslations from './forms';
import landingTranslations from './landing';
import navigationTranslations from './navigation';
import helpCenterTranslations from './help-center';

const translations = {
  en: {
    ...accountTranslations.en,
    ...contactTranslations.en,
    ...dashboardTranslations.en,
    ...featuresTranslations.en,
    ...formsTranslations.en,
    ...landingTranslations.en,
    ...navigationTranslations.en,
    ...helpCenterTranslations.en,
    // Additional core translations
    hero_subtitle: 'Create AI agents with natural voices for your product or service',
    all_rights_reserved: 'All rights reserved.',
    voice_agent_hub: 'Voice Agent Hub',
    processing: 'Processing...',
    login_success: 'Login successful!',
    registration_success: 'Registration successful! Please check your email for confirmation.',
    auth_error: 'Authentication error. Please try again.',
    registration_error: 'Registration failed. Please try again.'
  },
  es: {
    ...accountTranslations.es,
    ...contactTranslations.es,
    ...dashboardTranslations.es,
    ...featuresTranslations.es,
    ...formsTranslations.es,
    ...landingTranslations.es,
    ...navigationTranslations.es,
    ...helpCenterTranslations.es,
    // Additional core translations
    hero_subtitle: 'Crea agentes de IA con voces naturales para tu producto o servicio',
    all_rights_reserved: 'Todos los derechos reservados.',
    voice_agent_hub: 'Portal de Agentes de Voz',
    processing: 'Procesando...',
    login_success: '¡Inicio de sesión exitoso!',
    registration_success: '¡Registro exitoso! Por favor revisa tu correo electrónico para confirmar tu cuenta.',
    auth_error: 'Error en la autenticación. Inténtalo de nuevo.',
    registration_error: 'Error al registrarse. Por favor intente nuevamente.'
  },
};

export default translations;
