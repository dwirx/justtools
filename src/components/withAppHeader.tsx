import { ComponentType } from 'react';
import { AppHeader } from './AppHeader';

interface WithAppHeaderProps {
  title: string;
  icon?: string;
  backTo?: string;
}

/**
 * HOC (Higher Order Component) untuk wrap TSX apps dengan AppHeader.
 * Otomatis menambahkan Back & Home button di atas app.
 * 
 * @example
 * // Di file app Anda:
 * import { withAppHeader } from '@/components/withAppHeader';
 * 
 * const MyApp = () => <div>My App Content</div>;
 * 
 * export default withAppHeader(MyApp, {
 *   title: 'My App',
 *   icon: '🎮'
 * });
 */
export function withAppHeader<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithAppHeaderProps
) {
  const WithHeader = (props: P) => {
    return (
      <div className="min-h-screen flex flex-col">
        <AppHeader 
          title={options.title} 
          icon={options.icon}
          backTo={options.backTo}
        />
        <div className="flex-1">
          <WrappedComponent {...props} />
        </div>
      </div>
    );
  };

  WithHeader.displayName = `WithAppHeader(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithHeader;
}

export default withAppHeader;
