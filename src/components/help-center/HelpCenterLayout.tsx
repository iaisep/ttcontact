
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface HelpCenterLayoutProps {
  children: ReactNode;
}

const HelpCenterLayout = ({ children }: HelpCenterLayoutProps) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-background border-b">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary">
              <ArrowLeft size={16} className="mr-1" />
              {t('back_to_dashboard')}
            </Link>
            <Link to="/" className="text-xl font-bold">
              UISEP
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle variant="switch" />
            <Link to="/login" className="text-sm font-medium hover:text-primary">
              {t('login')}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-background border-t py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} UISEP. {t('all_rights_reserved')}
              </p>
            </div>
            <div className="flex gap-6">
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary">
                {t('terms')}
              </Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                {t('privacy')}
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary">
                {t('contact')}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HelpCenterLayout;
