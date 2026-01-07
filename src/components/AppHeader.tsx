import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AppHeaderProps {
  title: string;
  icon?: string;
  backTo?: string;
  backLabel?: string;
}

/**
 * Header standar untuk semua apps dengan tombol Back dan Home.
 * 
 * @example
 * <AppHeader title="My App" icon="🎮" />
 * <AppHeader title="Calculator" icon="🧮" backTo="/myapps" backLabel="Apps" />
 */
export const AppHeader = ({ 
  title, 
  icon, 
  backTo,
  backLabel = 'Back' 
}: AppHeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Back Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleBack}
          className="h-8 sm:h-9 px-2.5 sm:px-3 gap-1.5 text-xs sm:text-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden xs:inline">{backLabel}</span>
        </Button>

        {/* Title */}
        <div className="flex items-center gap-2">
          {icon && <span className="text-lg sm:text-xl">{icon}</span>}
          <h1 className="text-sm sm:text-base font-semibold truncate max-w-[150px] sm:max-w-none">
            {title}
          </h1>
        </div>
      </div>

      {/* Home Button */}
      <Link to="/">
        <Button 
          variant="default" 
          size="sm"
          className="h-8 sm:h-9 px-2.5 sm:px-3 gap-1.5 text-xs sm:text-sm"
        >
          <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Home</span>
        </Button>
      </Link>
    </header>
  );
};

export default AppHeader;
