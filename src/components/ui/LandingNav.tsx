
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const LandingNav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

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
          <Link to="/" className="flex items-center">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mr-2">
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 text-primary"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.5 12C19.5 13.3807 18.3807 14.5 17 14.5H13.5C13.0069 14.5 12.615 14.8969 12.615 15.39V15.39C12.615 15.8831 13.0069 16.28 13.5 16.28H16C16.2761 16.28 16.5 16.5039 16.5 16.78V16.78C16.5 17.0561 16.2761 17.28 16 17.28H13.5C12.3954 17.28 11.5 16.3846 11.5 15.28"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14.4141 8.03751C14.8799 8.30328 15.2547 8.7205 15.4502 9.25M16.5 12C16.5 10.067 14.933 8.5 13 8.5H10.5C9.94772 8.5 9.5 8.94772 9.5 9.5V13.5C9.5 14.0523 9.94772 14.5 10.5 14.5H13C14.933 14.5 16.5 12.933 16.5 11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 18H7.4C6.07452 18 5 16.9255 5 15.6V8.4C5 7.07452 6.07452 6 7.4 6H16.6C17.9255 6 19 7.07452 19 8.4V15.6C19 16.9255 17.9255 18 16.6 18H16M12 18V21M9 21H15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">{t("voice_agent_hub")}</span>
          </Link>

          {/* Desktop Navigation */}
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
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-primary/50 to-primary p-6 no-underline outline-none focus:shadow-md"
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
                    to="/docs"
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary transition-colors"
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
                  <Link
                    to="#pricing"
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary transition-colors"
                  >
                    {t("pricing")}
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Language Selector and CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSelector />
            <Link to="/login">
              <Button variant="outline">{t("login")}</Button>
            </Link>
            <Link to="/login">
              <Button className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">{t("get_started")}</Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSelector />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-950 border-t dark:border-gray-800">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <div className="py-2">
              <div className="font-medium text-gray-800 dark:text-gray-200 mb-2">{t("products")}</div>
              <ul className="pl-4 space-y-2">
                <li>
                  <Link
                    to="/voice-sdk"
                    className="text-gray-600 dark:text-gray-400 hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t("voice_sdk")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/ai-agents"
                    className="text-gray-600 dark:text-gray-400 hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t("ai_agents")}
                  </Link>
                </li>
                <li>
                  <a
                    href="#features"
                    className="text-gray-600 dark:text-gray-400 hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t("features")}
                  </a>
                </li>
              </ul>
            </div>
            <Link
              to="/docs"
              className="block py-2 text-gray-800 dark:text-gray-200 hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("documentation")}
            </Link>
            <div className="py-2">
              <div className="font-medium text-gray-800 dark:text-gray-200 mb-2">{t("resources")}</div>
              <ul className="pl-4 space-y-2">
                <li>
                  <Link
                    to="/blog"
                    className="text-gray-600 dark:text-gray-400 hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t("blog")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/guides"
                    className="text-gray-600 dark:text-gray-400 hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t("guides")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/examples"
                    className="text-gray-600 dark:text-gray-400 hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t("examples")}
                  </Link>
                </li>
              </ul>
            </div>
            <a
              href="#pricing"
              className="block py-2 text-gray-800 dark:text-gray-200 hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("pricing")}
            </a>
            <div className="pt-4 flex flex-col space-y-3">
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">{t("login")}</Button>
              </Link>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">{t("get_started")}</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingNav;
