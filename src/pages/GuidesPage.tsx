
import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import HelpCenterLayout from "@/components/help-center/HelpCenterLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, Book, Code, Lightbulb } from "lucide-react";

const GuidesPage = () => {
  const { t } = useLanguage();

  const guides = [
    {
      id: "getting-started",
      title: "Getting Started",
      description: "Learn the basics of using our platform",
      icon: <Book className="h-6 w-6 text-indigo-500" />,
    },
    {
      id: "voice-sdk",
      title: "Voice SDK Implementation",
      description: "Step-by-step guide to implementing the Voice SDK",
      icon: <Code className="h-6 w-6 text-indigo-500" />,
    },
    {
      id: "best-practices",
      title: "AI Agents Best Practices",
      description: "Tips and recommendations for optimal AI agent configuration",
      icon: <Lightbulb className="h-6 w-6 text-indigo-500" />,
    },
  ];

  return (
    <HelpCenterLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">{t("guides")}</h1>
            <p className="text-lg text-muted-foreground">
              Detailed guides to help you get the most out of our platform
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {guides.map((guide) => (
              <Card key={guide.id} className="transition-all hover:shadow-md">
                <CardHeader>
                  <div className="mb-2">{guide.icon}</div>
                  <CardTitle>{guide.title}</CardTitle>
                  <CardDescription>{guide.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link 
                    to={`/guides/${guide.id}`} 
                    className="flex items-center text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                  >
                    {t("read_more")} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="bg-muted p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">{t("need_help")}</h2>
            <p className="mb-4 text-muted-foreground">
              {t("cant_find_what_looking_for")}
            </p>
            <Link 
              to="/contact" 
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              {t("contact_us")}
            </Link>
          </div>
        </div>
      </div>
    </HelpCenterLayout>
  );
};

export default GuidesPage;
