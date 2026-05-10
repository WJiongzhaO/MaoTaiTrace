import { useState } from 'react';
import { showToast } from '../utils/showToast';

const STAGES = [
  { value: '制曲', icon: '🌾', desc: '酿酒用大曲制作' },
  { value: '发酵', icon: '🧪', desc: '酒醅发酵过程' },
  { value: '蒸馏', icon: '🔥', desc: '蒸馏取酒' },
  { value: '窖藏', icon: '🏚️', desc: '陶坛储存陈酿' },
  { value: '勾兑', icon: '🫗', desc: '基酒调配' },
  { value: '灌装', icon: '📦', desc: '成品灌装' },
  { value: '入库', icon: '🏭', desc: '成品入库' },
  { value: '质检', icon: '✅', desc: '质量检验' },
  { value: '物流', icon: '🚚', desc: '运输配送' },
  { value: '销售', icon: '🏪', desc: '终端销售' },
];

export function Add({ contract, account }) {
  const [batchId, setBatchId] = useState('');
  const [stage, setStage] = useState('灌装');
  const [details, setDetails] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contract) {
      showToast('请先连接钱包', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const tx = await contract.addRecord(batchId, stage, details);
      showToast('提交成功，等待确认...', 'info');
      await tx.wait();
      showToast('溯源记录已上链！', 'success');
      setBatchId('');
      setDetails('');
    } catch (err) {
      showToast(err.message || '提交失败', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pb-24 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-gray-800">添加溯源记录</h1>
          <p className="text-gray-500 text-sm mt-1">为茅台酒批次添加区块链存证</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">批次号</label>
              <input
                type="text"
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                placeholder="例如：MT202605060001"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
                required
              />
              <p className="text-xs text-gray-400 mt-1">建议使用统一格式的批次号</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">溯源环节</label>
              <div className="grid grid-cols-5 gap-2">
                {STAGES.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setStage(s.value)}
                    className={`p-2 rounded-xl text-center transition-all ${
                      stage === s.value
                        ? 'bg-red-600 text-white shadow-md scale-105'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-lg block mb-1">{s.icon}</span>
                    <span className="text-[10px] font-medium">{s.value}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">详情说明</label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="填写该环节的具体信息，如质检结果、仓库位置等..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50 resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !account}
              className="w-full py-4 bg-gradient-to-r from-red-700 to-red-800 text-white font-semibold rounded-xl hover:from-red-800 hover:to-red-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  提交中...
                </span>
              ) : (
                '提交记录'
              )}
            </button>

            {!account && (
              <p className="text-center text-sm text-amber-600 bg-amber-50 py-2 rounded-lg">
                ⚠️ 请先连接钱包后再操作
              </p>
            )}
          </form>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <h4 className="text-sm font-medium text-gray-700 mb-2">💡 提示</h4>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>• 提交后数据将永久存储在区块链上</li>
            <li>• 每条记录会记录操作人地址和时间戳</li>
            <li>• 同一个批次可以多次添加不同环节的记录</li>
          </ul>
        </div>
      </div>
    </div>
  );
}