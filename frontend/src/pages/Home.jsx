import { Link } from 'react-router-dom';

const features = [
  { icon: '📝', title: '添加记录', desc: '录入生产流通信息', path: '/add', color: 'from-red-500 to-red-600' },
  { icon: '🔍', title: '查询溯源', desc: '验证产品真伪', path: '/query', color: 'from-amber-500 to-amber-600' },
  { icon: '📋', title: '我的记录', desc: '查看操作历史', path: '/my', color: 'from-green-500 to-green-600' },
];

const steps = [
  { num: '01', title: '生产', desc: '制曲发酵蒸馏' },
  { num: '02', title: '仓储', desc: '窖藏入库质检' },
  { num: '03', title: '物流', desc: '全程冷链配送' },
  { num: '04', title: '销售', desc: '终端门店溯源' },
];

export function Home() {
  return (
    <div className="pb-24">
      <div className="bg-gradient-to-b from-red-50 to-white px-6 py-10 -mx-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-700 to-red-800 rounded-2xl shadow-xl mb-4">
            <span className="text-white text-3xl font-bold">茅</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">茅台酒溯源系统</h1>
          <p className="text-gray-500">区块链技术 · 全程可追溯</p>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            区块链确权
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            数据防伪
          </span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-4">
        <div className="grid grid-cols-3 gap-3">
          {features.map((feature) => (
            <Link
              key={feature.path}
              to={feature.path}
              className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:-translate-y-1 group"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <span className="text-xl">{feature.icon}</span>
              </div>
              <h3 className="font-semibold text-gray-800 text-sm">{feature.title}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{feature.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-red-700 to-red-800 px-6 py-4">
            <h2 className="text-white font-semibold">溯源流程</h2>
          </div>
          <div className="p-6">
            <div className="flex justify-between relative">
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-100" />
              <div className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-red-600 to-amber-500 w-1/4 animate-pulse" />
              {steps.map((step) => (
                <div key={step.num} className="relative flex flex-col items-center z-10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-700 text-white flex items-center justify-center text-sm font-bold shadow-md">
                    {step.num}
                  </div>
                  <div className="mt-3 text-center">
                    <p className="text-sm font-semibold text-gray-800">{step.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-8">
        <div className="bg-gradient-to-br from-gray-50 to-red-50/30 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span>💡</span> 为什么选择区块链溯源？
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 text-xs">✓</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">数据不可篡改</p>
                <p className="text-xs text-gray-500">区块链存证，确保信息真实可信</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-xs">✓</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">全程可追溯</p>
                <p className="text-xs text-gray-500">从原料到终端，每个环节清晰可见</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-amber-600 text-xs">✓</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">消费者验真</p>
                <p className="text-xs text-gray-500">输入批次号即可验证真伪，打击假冒</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-8 pb-4">
        <div className="bg-gradient-to-r from-red-700 to-amber-500 rounded-xl p-6 text-white">
          <h3 className="font-bold text-lg mb-2">立即体验</h3>
          <p className="text-white/80 text-sm mb-4">连接钱包，开始使用区块链溯源功能</p>
          <Link
            to="/add"
            className="inline-flex items-center gap-2 bg-white text-red-700 px-5 py-2.5 rounded-lg font-medium hover:bg-white/90 transition-colors"
          >
            <span>开始添加</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}