import { useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';

export function PageWrapper({ children }) {
  const location = useLocation();
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    if (location.pathname !== prevPath.current) {
      prevPath.current = location.pathname;
    }
  }, [location.pathname]);

  const isForward = true;

  return (
    <div
      className={`page-transition-enter ${
        isForward ? 'animate-slide-in-right' : 'animate-slide-in-left'
      }`}
      style={{
        animation: 'pageIn 0.3s ease-out forwards',
      }}
    >
      {children}
    </div>
  );
}