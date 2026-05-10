import { useState, useCallback } from 'react';
import { showToast } from '../utils/showToast';
import { Loading } from '../components/Loading';

const STAGE_ICONS = {
  '制曲': '🌾', '发酵': '🧪', '蒸馏': '🔥', '窖藏': '🏚️', '勾兑': '🫗',
  '灌装': '📦', '入库': '🏭', '质检': '✅', '物流': '🚚', '销售': '🏪'
};

function formatTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleString('zh-CN', {
    month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
  });
}

export function MyRecords({ contract, account }) {
  const [myRecords, setMyRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadMyRecords = useCallback(async () => {
    if (!contract || !account) return;
    
    setIsLoading(true);
    try {
      const allRecords = [];
      const sampleBatches = ['MT202605060001', 'MT202605060002', 'MT202605060003', 'MT202605060004', 'MT202605060005'];
      
      for (const batchId of sampleBatches) {
        try {
          const records = await contract.getRecords(batchId);
          const myOps = (records || []).filter(r => r.operator.toLowerCase() === account.toLowerCase());
          if (myOps.length > 0) {
            myOps.forEach(record => {
              allRecords.push({ batchId, ...record });
            });
          }
        } catch {
          // 批次不存在，继续下一个
        }
      }
      
      setMyRecords(allRecords);
    } catch {
      showToast('加载记录失败', 'error');
    } finally {
      setIsLoading(false);
      setHasLoaded(true);
    }
  }, [contract, account]);

  if (!account) {
    return (
      <div className="pb-24 px-4">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-800">我的记录</h1>
            <p className="text-gray-500 text-sm mt-1">查看您添加的溯源历史</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">👛</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">请先连接钱包</h3>
            <p className="text-gray-500 text-sm">连接钱包后可查看您的操作记录</p>
          </div>
        </div>
      </div>
    );
  }

  if (!hasLoaded && !isLoading) {
    loadMyRecords();
  }

  if (isLoading) {
    return <Loading text="加载中..." />;
  }

  return (
    <div className="pb-24 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-gray-800">我的记录</h1>
          <p className="text-gray-500 text-sm mt-1">您已添加的溯源记录</p>
        </div>

        <div className="bg-gradient-to-r from-red-700 to-red-800 rounded-2xl p-4 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">我的记录数</p>
              <p className="text-3xl font-bold">{myRecords.length}</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-2xl">
              📋
            </div>
          </div>
        </div>

        {myRecords.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">暂无记录</h3>
            <p className="text-gray-500 text-sm">您还没有添加过溯源记录</p>
          </div>
        ) : (
          <div className="space-y-4">
            {myRecords.map((record, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition-shadow animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">{STAGE_ICONS[record.stage] || '📋'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-gray-800">{record.stage}</span>
                      <span className="text-xs text-gray-400">{formatTime(record.timestamp)}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate mb-1">{record.details}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded">批次: {record.batchId}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}