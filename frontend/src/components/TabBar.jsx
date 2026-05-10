import { NavLink } from 'react-router-dom';

const tabs = [
  { path: '/', icon: '🏠', label: '首页' },
  { path: '/add', icon: '➕', label: '添加' },
  { path: '/query', icon: '🔍', label: '查询' },
  { path: '/my', icon: '📋', label: '我的' },
  { path: '/about', icon: 'ℹ️', label: '关于' },
];

export function TabBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg z-50 safe-area-bottom">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-16 h-full transition-all duration-200 ${
                isActive
                  ? 'text-red-700 scale-105'
                  : 'text-gray-400 hover:text-gray-600'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`text-xl mb-0.5 transition-transform ${isActive ? 'scale-110' : ''}`}>
                  {tab.icon}
                </span>
                <span className="text-[10px] font-medium">{tab.label}</span>
                {isActive && (
                  <div className="absolute top-0 w-8 h-0.5 bg-red-700 rounded-full" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}