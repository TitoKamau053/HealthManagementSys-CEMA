import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';
import { useState, useEffect } from 'react';

type AlertType = 'success' | 'error' | 'info' | 'warning';

interface AlertMessageProps {
  type: AlertType;
  message: string;
  autoClose?: boolean;
  duration?: number;
  onClose?: () => void;
}

const AlertMessage = ({ 
  type, 
  message, 
  autoClose = true, 
  duration = 5000, 
  onClose 
}: AlertMessageProps) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);
  
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };
  
  if (!isVisible) return null;
  
  const getAlertStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-green-400 dark:border-green-800',
          text: 'text-green-800 dark:text-green-100',
          icon: <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />,
        };
      case 'error':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-400 dark:border-red-800',
          text: 'text-red-800 dark:text-red-100',
          icon: <XCircle className="h-5 w-5 text-red-500 dark:text-red-400" />,
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          border: 'border-yellow-400 dark:border-yellow-800',
          text: 'text-yellow-800 dark:text-yellow-100',
          icon: <AlertCircle className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />,
        };
      default:
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-400 dark:border-blue-800',
          text: 'text-blue-800 dark:text-blue-100',
          icon: <Info className="h-5 w-5 text-blue-500 dark:text-blue-400" />,
        };
    }
  };
  
  const styles = getAlertStyles();
  
  return (
    <div className={`rounded-md border ${styles.bg} ${styles.border} p-4 animate-fade-in`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {styles.icon}
        </div>
        <div className="ml-3 flex-1">
          <p className={`text-sm font-medium ${styles.text}`}>{message}</p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              onClick={handleClose}
              className={`inline-flex rounded-md p-1.5 ${styles.text} hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${type}-50 focus:ring-${type}-500`}
            >
              <span className="sr-only">Dismiss</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertMessage;