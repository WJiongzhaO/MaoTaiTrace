import { useState } from 'react';

const STAGE_ICONS = {
  '制曲': '🌾', '发酵': '🧪', '蒸馏': '🔥', '窖藏': '🏚️', '勾兑': '🫗',
  '灌装': '📦', '入库': '🏭', '质检': '✅', '物流': '🚚', '销售': '🏪'
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

export function QueryRecords({ contract }) {
  const [batchId, setBatchId] = useState('');
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!contract || !batchId.trim()) return;

    setError(null);
    setIsLoading(true);
    setHasSearched(true);

    try {
      const result = await contract.getRecords(batchId);
      setRecords(result || []);
    } catch {
      setError('查询失败，请检查批次号是否正确');
      setRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-amber-500">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center mr-2 text-sm">🔍</span>
        查询溯源信息
      </h2>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            placeholder="输入批次号查询..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-lg hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 transition-all"
          >
            {isLoading ? '查询中...' : '查询'}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-4">
          {error}
        </div>
      )}

      {hasSearched && records.length === 0 && !error && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-4xl mb-2">📭</p>
          <p>未找到该批次的溯源记录</p>
        </div>
      )}

      {records.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">
              共 {records.length} 条记录
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
              ✓ 区块链确权
            </span>
          </div>

          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-700 via-amber-500 to-gray-300"></div>

            {records.map((record, index) => (
              <div key={index} className="relative pl-12 pb-6 last:pb-0">
                <div className="absolute left-2 w-4 h-4 rounded-full border-4 border-white shadow-md bg-gradient-to-br from-red-700 to-red-800"></div>
                
                <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{STAGE_ICONS[record.stage] || '📋'}</span>
                      <span className="font-semibold text-gray-800">{record.stage}</span>
                    </div>
                    <span className="text-xs text-gray-400">{formatTime(record.timestamp)}</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-2">{record.details}</p>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">👤</span>
                    <span>操作人: {shortenAddress(record.operator)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}