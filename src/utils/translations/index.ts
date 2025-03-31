
import { mergeDeep } from "@/lib/utils";
import navigationTranslations from "./navigation";
import accountTranslations from "./account";
import landingTranslations from "./landing";
import formsTranslations from "./forms";
import featuresTranslations from "./features";
import dashboardTranslations from "./dashboard";
import contactTranslations from "./contact";

// Define a type for our translations
export type TranslationsType = {
  [language: string]: {
    [key: string]: string;
  };
};

// Merge all translation files together
const translations: TranslationsType = mergeDeep(
  {},
  navigationTranslations,
  accountTranslations,
  landingTranslations,
  formsTranslations,
  featuresTranslations,
  dashboardTranslations,
  contactTranslations
);

export default translations;
