'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'pending';
  title: string;
  message: string;
  txHash?: string;
  timestamp: number;
  autoClose?: boolean;
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  notifyTransaction: (type: 'pending' | 'success' | 'error', title: string, message: string, txHash?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: Date.now(),
      autoClose: notification.autoClose ?? true,
      duration: notification.duration ?? 5000
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Auto-remove notification if autoClose is enabled
    if (newNotification.autoClose && newNotification.type !== 'pending') {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const notifyTransaction = useCallback((
    type: 'pending' | 'success' | 'error',
    title: string,
    message: string,
    txHash?: string
  ) => {
    addNotification({
      type,
      title,
      message,
      txHash,
      autoClose: type !== 'pending'
    });
  }, [addNotification]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearAll,
        notifyTransaction
      }}
    >
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.slice(0, 5).map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

interface NotificationCardProps {
  notification: Notification;
  onClose: () => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onClose }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      case 'pending':
        return '⏳';
      default:
        return 'ℹ️';
    }
  };

  const getColors = () => {
    switch (notification.type) {
      case 'success':
        return 'border-green-500/50 bg-green-900/20 shadow-green-500/20';
      case 'error':
        return 'border-red-500/50 bg-red-900/20 shadow-red-500/20';
      case 'warning':
        return 'border-yellow-500/50 bg-yellow-900/20 shadow-yellow-500/20';
      case 'info':
        return 'border-blue-500/50 bg-blue-900/20 shadow-blue-500/20';
      case 'pending':
        return 'border-purple-500/50 bg-purple-900/20 shadow-purple-500/20';
      default:
        return 'border-gray-500/50 bg-gray-900/20 shadow-gray-500/20';
    }
  };

  return (
    <div className={`
      relative bg-slate-900/90 backdrop-blur-sm border rounded-xl p-4 shadow-xl
      transform transition-all duration-300 ease-in-out
      hover:scale-105 ${getColors()}
    `}>
      {/* Close button */}
      {notification.type !== 'pending' && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
        >
          ×
        </button>
      )}

      <div className="flex items-start space-x-3">
        <div className="text-2xl">
          {notification.type === 'pending' ? (
            <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-400 rounded-full animate-spin"></div>
          ) : (
            getIcon()
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-white font-semibold text-sm mb-1">
            {notification.title}
          </h4>
          <p className="text-gray-300 text-xs leading-relaxed">
            {notification.message}
          </p>

          {notification.txHash && (
            <div className="mt-2">
              <a
                href={`https://shannon-explorer.somnia.network/tx/${notification.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 text-xs transition-colors"
              >
                <span>View Transaction</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}

          {/* Progress bar for pending transactions */}
          {notification.type === 'pending' && (
            <div className="mt-2 w-full bg-gray-700 rounded-full h-1">
              <div className="bg-purple-400 h-1 rounded-full animate-pulse w-3/4"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationProvider;