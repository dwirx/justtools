import { Suspense, ComponentType } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAppById, tsxModules, type AppMeta } from '@/lib/appRegistry';

// Loading component
const AppLoading = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-muted-foreground text-sm">Loading app...</p>
    </div>
  </div>
);

// Not Found component
const AppNotFound = ({ appId }: { appId: string }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <p className="text-6xl mb-4">🔍</p>
        <h1 className="text-2xl font-bold mb-2">App Not Found</h1>
        <p className="text-muted-foreground mb-4">App "{appId}" tidak ditemukan</p>
        <Link to="/">
          <Button>
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

// Header component
const AppHeader = ({ app }: { app: AppMeta }) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="flex items-center gap-2 sm:gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="h-8 sm:h-9 px-2.5 sm:px-3 gap-1.5 text-xs sm:text-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Back</span>
        </Button>

        <div className="flex items-center gap-2">
          {app.icon && <span className="text-lg sm:text-xl">{app.icon}</span>}
          <h1 className="text-sm sm:text-base font-semibold truncate max-w-[150px] sm:max-w-none">
            {app.name}
          </h1>
        </div>
      </div>

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

/**
 * Wrapper untuk TSX Apps dengan header Back & Home otomatis.
 * Route: /apps/:appId
 */
const TsxAppWrapper = () => {
  const { appId } = useParams<{ appId: string }>();
  
  if (!appId) {
    return <AppNotFound appId="unknown" />;
  }

  // Find app in registry
  const app = getAppById(`tsx-${appId}`);
  
  if (!app) {
    return <AppNotFound appId={appId} />;
  }

  // Find the component from tsxModules
  const modulePath = app.path;
  const importFn = tsxModules[modulePath];

  if (!importFn) {
    return <AppNotFound appId={appId} />;
  }

  // Lazy load the component
  const LazyComponent = ({ importFn }: { importFn: () => Promise<{ default: ComponentType }> }) => {
    const Component = require('react').lazy(importFn);
    return (
      <Suspense fallback={<AppLoading />}>
        <Component />
      </Suspense>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Auto Header */}
      <AppHeader app={app} />
      
      {/* App Content */}
      <div className="flex-1 relative">
        <LazyComponent importFn={importFn} />
      </div>
    </div>
  );
};

export default TsxAppWrapper;
