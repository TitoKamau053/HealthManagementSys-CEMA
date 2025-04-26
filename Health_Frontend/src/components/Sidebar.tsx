import { Home, Clipboard, Users, UserPlus, Activity, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Programs', path: '/programs', icon: Clipboard },
    { name: 'Clients', path: '/clients', icon: Users },
    { name: 'Register Client', path: '/register', icon: UserPlus },
  ];
  
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4 mb-5">
          <Activity className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Health System</span>
        </div>
        
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md transition duration-150 ease-in-out
                  ${isActive(item.path) 
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'}
                `}
              >
                <Icon 
                  className={`mr-3 h-5 w-5 transition duration-150 ease-in-out ${
                    isActive(item.path) 
                      ? 'text-primary-600 dark:text-primary-400' 
                      : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300'
                  }`} 
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
        <button className="flex-shrink-0 group block">
          <div className="flex items-center">
            <div className="inline-block h-9 w-9 rounded-full overflow-hidden bg-gray-200">
              <span className="flex h-full w-full items-center justify-center text-sm font-medium text-gray-700">
                DR
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Dr. Titus</p>
            </div>
          </div>
        </button>
      </div>
      
      <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
        <button className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
          <Settings className="mr-2 h-5 w-5" />
          Settings
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
