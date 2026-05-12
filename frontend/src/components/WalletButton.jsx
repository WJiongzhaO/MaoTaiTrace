function shortenAddress(addr) {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function WalletButton({
  account,
  isConnecting,
  isWrongChain,
  onConnect,
  onDisconnect,
  onSwitchAccount,
  onSwitchToLocalhost,
}) {
  if (account) {
    return (
      <div className="flex items-center gap-3">
        {isWrongChain && (
          <button
            onClick={onSwitchToLocalhost}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-full hover:from-amber-100 hover:to-orange-100 transition-all"
          >
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
            <span className="text-sm text-amber-700 font-medium">切回本地网络</span>
          </button>
        )}
        {!isWrongChain && (
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm text-gray-700">{shortenAddress(account)}</span>
          </div>
        )}
        <button
          onClick={onSwitchAccount}
          disabled={isConnecting}
          className="px-3 py-2 text-sm text-gray-600 hover:text-red-700 disabled:opacity-60 transition-colors"
        >
          切换账户
        </button>
        <button
          onClick={onDisconnect}
          className="px-4 py-2 text-sm text-gray-600 hover:text-red-700 transition-colors"
        >
          断开连接
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onConnect}
      disabled={isConnecting}
      className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-700 to-red-800 text-white font-medium rounded-full hover:from-red-800 hover:to-red-900 disabled:opacity-70 transition-all shadow-md hover:shadow-lg"
    >
      <span className="text-lg" aria-hidden="true">🦊</span>
      {isConnecting ? '连接中...' : '连接钱包'}
    </button>
  );
}
