import { Link } from 'react-router-dom';
import contractInfo from '../utils/contractInfo.json';

const techStack = [
  { name: 'Solidity', desc: '智能合约', icon: '🔷' },
  { name: 'Hardhat', desc: '开发框架', icon: '🔨' },
  { name: 'React', desc: '前端框架', icon: '⚛️' },
  { name: 'Ethers.js', desc: 'Web3交互', icon: '⛓️' },
];

const features = [
  { title: '区块链存证', desc: '数据上链后不可篡改', icon: '🔗' },
  { title: '全程追溯', desc: '从生产到销售全记录', icon: '📊' },
  { title: '防伪验证', desc: '消费者可验真伪', icon: '🛡️' },
  { title: '去中心化', desc: '无单点故障风险', icon: '🌐' },
];

export function About() {
  return (
    <div className="pb-24 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-700 to-red-800 rounded-2xl shadow-xl mb-4">
            <span className="text-white text-3xl font-bold">茅</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">茅台酒溯源系统</h1>
          <p className="text-gray-500">区块链技术全程溯源 Demo</p>
          <p className="text-xs text-gray-400 mt-2">Version 1.0.0</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-red-700 to-red-800 px-6 py-4">
            <h2 className="text-white font-semibold">合约信息</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">合约地址</p>
              <p className="text-sm font-mono text-gray-700 break-all bg-gray-50 p-2 rounded-lg">
                {contractInfo?.address || '未部署'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">区块链网络</p>
              <p className="text-sm text-gray-700">Hardhat Local Node (localhost:8545)</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Ethereum</p>
              <p className="text-sm text-gray-700">测试网络</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-4">
            <h2 className="text-white font-semibold">技术栈</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              {techStack.map((tech) => (
                <div key={tech.name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <span className="text-2xl">{tech.icon}</span>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{tech.name}</p>
                    <p className="text-xs text-gray-400">{tech.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
            <h2 className="text-white font-semibold">功能特性</h2>
          </div>
          <div className="p-6 space-y-4">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">{feature.icon}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">{feature.title}</p>
                  <p className="text-xs text-gray-400">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-red-50/30 rounded-2xl p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">📝 使用说明</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p>1. 点击右下角「连接钱包」连接 MetaMask</p>
            <p>2. 进入「添加」页面录入溯源信息</p>
            <p>3. 进入「查询」页面输入批次号验证</p>
            <p>4. 在「我的」页面查看您的操作历史</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-700 to-amber-500 rounded-2xl p-6 text-white text-center">
          <h3 className="font-bold text-lg mb-2">开始体验</h3>
          <p className="text-white/80 text-sm mb-4">连接钱包，使用区块链溯源功能</p>
          <div className="flex justify-center gap-3">
            <Link
              to="/add"
              className="px-5 py-2.5 bg-white text-red-700 rounded-lg font-medium hover:bg-white/90 transition-colors"
            >
              添加记录
            </Link>
            <Link
              to="/query"
              className="px-5 py-2.5 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-colors"
            >
              查询溯源
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          本项目为技术 Demo · 仅供参考
        </p>
      </div>
    </div>
  );
}