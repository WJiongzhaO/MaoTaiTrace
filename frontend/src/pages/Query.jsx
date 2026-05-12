import { useState } from 'react';
import { showToast } from '../utils/showToast';

const STAGE_ICONS = {
  '制曲': '🌾', '发酵': '🧪', '蒸馏': '🔥', '窖藏': '🏚️', '勾兑': '🫗',
  '灌装': '📦', '入库': '🏭', '质检': '✅', '物流': '🚚', '销售': '🏪'
};

const STAGE_COLORS = {
  '制曲': 'from-amber-500 to-amber-600',
  '发酵': 'from-green-500 to-green-600',
  '蒸馏': 'from-orange-500 to-red-500',
  '窖藏': 'from-purple-500 to-purple-600',
  '勾兑': 'from-pink-500 to-pink-600',
  '灌装': 'from-blue-500 to-blue-600',
  '入库': 'from-cyan-500 to-cyan-600',
  '质检': 'from-emerald-500 to-emerald-600',
  '物流': 'from-indigo-500 to-indigo-600',
  '销售': 'from-red-500 to-red-600',
};

function formatTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  });
}

function shortenAddress(addr) {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function Query({ contract }) {
  const [batchId, setBatchId] = useState('');
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!contract || !batchId.trim()) {
      showToast('请输入批次号', 'error');
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const result = await contract.getRecords(batchId);
      const recordsArray = Array.from(result || []);
      setRecords(recordsArray);
      if (recordsArray.length === 0) {
        showToast('未找到该批次的溯源记录', 'info');
      }
    } catch (err) {
      console.error('Query error:', err);
      showToast('查询失败，请稍后重试', 'error');
      setRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pb-24 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-gray-800">查询溯源</h1>
          <p className="text-gray-500 text-sm mt-1">输入批次号，查看区块链存证的溯源信息</p>
        </div>

        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              placeholder="输入批次号，例如：MT202605060001"
              className="w-full px-5 py-4 pr-24 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white shadow-lg"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-xl hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 transition-all"
            >
              {isLoading ? '...' : '查询'}
            </button>
          </div>
        </form>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-amber-100 border-t-amber-500 rounded-full animate-spin" />
              <p className="text-gray-500">正在查询区块链...</p>
            </div>
          </div>
        )}

        {hasSearched && !isLoading && records.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">未找到记录</h3>
            <p className="text-gray-500 text-sm">请检查批次号是否正确，或该批次尚未添加溯源记录</p>
          </div>
        )}

        {records.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <span className="text-sm text-gray-500">
                共 {records.length} 条记录
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                区块链确权
              </span>
            </div>

            <div className="relative pl-6">
              <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-500 via-amber-500 to-gray-300 rounded-full" />

              {records.map((record, index) => {
                const colorClass = STAGE_COLORS[record.stage] || 'from-gray-500 to-gray-600';
                return (
                  <div key={index} className="relative pb-6 last:pb-0">
                    <div className={`absolute left-[-14px] w-7 h-27 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-lg`}>
                      <span className="text-sm">{STAGE_ICONS[record.stage] || '📋'}</span>
                    </div>
                    
                    <div className="ml-2 bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-shadow animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full bg-gradient-to-r ${colorClass} text-white text-sm font-medium`}>
                            {record.stage}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">{formatTime(record.timestamp)}</span>
                      </div>
                      
                      <p className="text-gray-700 text-sm leading-relaxed mb-3">{record.details}</p>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
                        <span className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">👤</span>
                        <span>{shortenAddress(record.operator)}</span>
                        <span className="text-gray-300">|</span>
                        <span>操作人</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}