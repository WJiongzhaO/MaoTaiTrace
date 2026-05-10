import { useState, useEffect } from 'react';
import { registerToast, unregisterToast } from '../utils/showToast';

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    registerToast(({ message, type, duration }) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    });
    return () => unregisterToast();
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium animate-toast-in ${
            toast.type === 'success'
              ? 'bg-green-600 text-white'
              : toast.type === 'error'
              ? 'bg-red-600 text-white'
              : 'bg-gray-700 text-white'
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}