
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageSelector from "@/components/LanguageSelector";

interface MobileMenuToggleProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const MobileMenuToggle = ({ isMobileMenuOpen, setIsMobileMenuOpen }: MobileMenuToggleProps) => {
  return (
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
  );
};

export default MobileMenuToggle;
