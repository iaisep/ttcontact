
import { useState, useEffect } from "react";
import MobileMenu from "./navigation/MobileMenu";
import NavLogo from "./navigation/NavLogo";
import NavActions from "./navigation/NavActions";
import MobileMenuToggle from "./navigation/MobileMenuToggle";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { ChevronDown, ExternalLink } from "lucide-react";

const LandingNav = () => {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 dark:bg-gray-950/90 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <NavLogo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
                    {t("products")}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-indigo-50 to-white dark:from-indigo-900/20 dark:to-gray-900 p-6 no-underline outline-none focus:shadow-md"
                            href="/#features"
                          >
                            <div className="mb-2 mt-4 text-lg font-medium text-gray-900 dark:text-white">
                              {t("voice_sdk")}
                            </div>
                            <p className="text-sm leading-tight text-gray-600 dark:text-gray-400">
                              {t("voice_sdk_desc")}
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <a
                          href="/#industries"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100"
                        >
                          <div className="text-sm font-medium leading-none text-gray-900 dark:text-white">{t("ai_agents")}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-gray-600 dark:text-gray-400">
                            {t("ai_agents_desc")}
                          </p>
                        </a>
                      </li>
                      <li>
                        <a
                          href="/#features"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100"
                        >
                          <div className="text-sm font-medium leading-none text-gray-900 dark:text-white">{t("features")}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-gray-600 dark:text-gray-400">
                            {t("discover_features")}
                          </p>
                        </a>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <a 
                    href="/help-center" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-1 text-sm font-medium px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {t("documentation")}
                    <ExternalLink size={14} className="ml-0.5" />
                  </a>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
                    {t("resources")}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] md:grid-cols-2">
                      <li>
                        <Link
                          to="/blog"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100"
                        >
                          <div className="text-sm font-medium leading-none text-gray-900 dark:text-white">{t("blog")}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-gray-600 dark:text-gray-400">
                            {t("blog_desc")}
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/guides"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100"
                        >
                          <div className="text-sm font-medium leading-none text-gray-900 dark:text-white">{t("guides")}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-gray-600 dark:text-gray-400">
                            {t("guides_desc")}
                          </p>
                        </Link>
                      </li>
                      <li>
                        <a
                          href="/#features"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100"
                        >
                          <div className="text-sm font-medium leading-none text-gray-900 dark:text-white">{t("examples")}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-gray-600 dark:text-gray-400">
                            {t("examples_desc")}
                          </p>
                        </a>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <a href="/#pricing" className="flex items-center gap-1 text-sm font-medium px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                    {t("pricing")}
                  </a>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Language Selector and CTA Buttons */}
          <NavActions />

          {/* Mobile Menu Toggle */}
          <MobileMenuToggle 
            isMobileMenuOpen={isMobileMenuOpen} 
            setIsMobileMenuOpen={setIsMobileMenuOpen} 
          />
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />
    </header>
  );
};

export default LandingNav;
