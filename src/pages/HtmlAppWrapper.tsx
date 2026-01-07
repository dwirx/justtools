import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Home, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAppById } from '@/lib/appRegistry';

/**
 * Wrapper untuk HTML apps dengan header Back & Home.
 * HTML app ditampilkan dalam iframe dengan header di atas.
 * Jika ?standalone=true, tampil full tanpa header.
 */
const HtmlAppWrapper = () => {
  const { appId } = useParams<{ appId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if opened in standalone mode (new tab tanpa header)
  const searchParams = new URLSearchParams(location.search);
  const isStandalone = searchParams.get('standalone') === 'true';
  
  const app = getAppById(`html-${appId}`);
  
  if (!app) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🔍</p>
          <h1 className="text-2xl font-bold mb-2">App Not Found</h1>
          <p className="text-muted-foreground mb-4">HTML app "{appId}" tidak ditemukan</p>
          <Link to="/">
            <Button>
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const iframeSrc = `/justhtml/${app.path}`;

  const handleOpenInNewTab = () => {
    // Open dengan ?standalone=true agar tanpa header (full app)
    window.open(`${location.pathname}?standalone=true`, '_blank');
  };

  // Jika standalone mode, render iframe full screen tanpa header
  if (isStandalone) {
    return (
      <div className="h-screen w-screen">
        <iframe
          src={iframeSrc}
          className="w-full h-full border-0"
          title={app.name}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex-shrink-0 flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-background/95 backdrop-blur-xl border-b border-border/50 z-50">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Back Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="h-8 sm:h-9 px-2.5 sm:px-3 gap-1.5 text-xs sm:text-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>

          {/* Title */}
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl">{app.icon}</span>
            <h1 className="text-sm sm:text-base font-semibold truncate max-w-[120px] sm:max-w-none">
              {app.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Open in new tab */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleOpenInNewTab}
            className="h-8 sm:h-9 px-2 sm:px-2.5 text-muted-foreground hover:text-foreground"
            title="Open in new tab"
          >
            <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Button>

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
        </div>
      </header>

      {/* Iframe Container */}
      <div className="flex-1 relative">
        <iframe
          src={iframeSrc}
          className="absolute inset-0 w-full h-full border-0"
          title={app.name}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    </div>
  );
};

export default HtmlAppWrapper;
