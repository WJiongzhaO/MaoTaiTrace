export function Loading({ fullScreen, text = '加载中...' }) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-100 border-t-red-600 rounded-full animate-spin" />
          <p className="text-gray-600 font-medium">{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-3 border-red-100 border-t-red-600 rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">{text}</p>
      </div>
    </div>
  );
}