import { useState } from 'react';

const STAGES = [
  '制曲', '发酵', '蒸馏', '窖藏', '勾兑', '灌装', '入库', '质检', '物流', '销售'
];

export function AddRecordForm({ contract, account, onSuccess }) {
  const [batchId, setBatchId] = useState('');
  const [stage, setStage] = useState('灌装');
  const [details, setDetails] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contract) return;

    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const tx = await contract.addRecord(batchId, stage, details);
      await tx.wait();
      setSuccess('溯源记录已成功上链！');
      setBatchId('');
      setDetails('');
      onSuccess?.();
    } catch (err) {
      setError(err.message || '提交失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-red-700">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="w-8 h-8 bg-red-700 text-white rounded-full flex items-center justify-center mr-2 text-sm">+</span>
        添加溯源记录
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">批次号</label>
          <input
            type="text"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            placeholder="例如：MT202605060001"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">溯源环节</label>
          <select
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            {STAGES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">详情说明</label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="填写该环节的具体信息..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            required
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !account}
          className="w-full py-3 px-4 bg-gradient-to-r from-red-700 to-red-800 text-white font-semibold rounded-lg hover:from-red-800 hover:to-red-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? '提交中...' : '提交记录'}
        </button>

        {!account && (
          <p className="text-center text-sm text-gray-500">请先连接钱包</p>
        )}
      </form>
    </div>
  );
}