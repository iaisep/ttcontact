
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
  },
};

export default translations;
