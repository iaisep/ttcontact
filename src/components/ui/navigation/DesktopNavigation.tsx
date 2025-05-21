
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const DesktopNavigation = () => {
  const { t } = useLanguage();

  return (
    <div className="hidden md:flex items-center space-x-2">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent text-gray-700 dark:text-gray-200">
              {t("products")}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 w-[400px]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-indigo-500/50 to-indigo-600 p-6 no-underline outline-none focus:shadow-md"
                      href="#features"
                    >
                      <div className="mt-4 mb-2 text-lg font-medium text-white">
                        {t("features")}
                      </div>
                      <p className="text-sm leading-tight text-white/90">
                        {t("discover_features")}
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <li>
                  <Link
                    to="/voice-sdk"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">{t("voice_sdk")}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      {t("voice_sdk_desc")}
                    </p>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/ai-agents"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">{t("ai_agents")}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      {t("ai_agents_desc")}
                    </p>
                  </Link>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              to="/help-center"
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {t("documentation")}
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent text-gray-700 dark:text-gray-200">
              {t("resources")}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 w-[400px]">
                <li>
                  <Link
                    to="/blog"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">{t("blog")}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      {t("blog_desc")}
                    </p>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/guides"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">{t("guides")}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      {t("guides_desc")}
                    </p>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/examples"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">{t("examples")}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      {t("examples_desc")}
                    </p>
                  </Link>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <a
              href="#pricing"
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {t("pricing")}
            </a>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default DesktopNavigation;
