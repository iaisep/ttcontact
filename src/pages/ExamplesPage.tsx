
import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import HelpCenterLayout from "@/components/help-center/HelpCenterLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, Code, MessageSquare, PlayCircle } from "lucide-react";

const ExamplesPage = () => {
  const { t } = useLanguage();

  const examples = [
    {
      id: "voice-demos",
      title: "Voice SDK Demos",
      description: "Interactive demonstrations of our Voice SDK capabilities",
      icon: <PlayCircle className="h-6 w-6 text-indigo-500" />,
    },
    {
      id: "code-samples",
      title: "Code Samples",
      description: "Ready-to-use code snippets for common use cases",
      icon: <Code className="h-6 w-6 text-indigo-500" />,
    },
    {
      id: "conversation-flows",
      title: "Conversation Flows",
      description: "Example conversation flows to inspire your AI agent design",
      icon: <MessageSquare className="h-6 w-6 text-indigo-500" />,
    },
  ];

  return (
    <HelpCenterLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">{t("examples")}</h1>
            <p className="text-lg text-muted-foreground">
              {t("examples_description")}
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {examples.map((example) => (
              <Card key={example.id} className="transition-all hover:shadow-md">
                <CardHeader>
                  <div className="mb-2">{example.icon}</div>
                  <CardTitle>{example.title}</CardTitle>
                  <CardDescription>{example.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link 
                    to={`/examples/${example.id}`} 
                    className="flex items-center text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                  >
                    {t("explore")} <ArrowRight className="ml-1 h-4 w-4" />
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

export default ExamplesPage;
