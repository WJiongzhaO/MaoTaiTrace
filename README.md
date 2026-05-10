# 茅台酒溯源系统 (MaoTaiTrace)

基于区块链技术的茅台酒全程溯源 Demo 系统。

## 项目简介

本项目是一个用于茅台酒批次溯源的区块链 DApp，通过以太坊智能合约实现溯源数据的不可篡改存证。消费者可通过批次号查询一瓶酒从生产到销售的全流程信息。

## 技术栈

| 层级 | 技术 |
|------|------|
| 智能合约 | Solidity 0.8.20 |
| 开发框架 | Hardhat |
| 前端框架 | React 19 + Vite 8 |
| 样式方案 | Tailwind CSS 3.4 |
| Web3 交互 | ethers.js 6 |
| 测试网络 | Hardhat Local Node |

## 功能特性

- 🔗 **区块链存证** - 溯源记录上链后不可篡改
- 📝 **添加记录** - 录入生产、仓储、物流、销售各环节信息
- 🔍 **查询溯源** - 输入批次号查看完整时间线
- 👛 **钱包连接** - 支持 MetaMask 钱包交互
- 🎨 **茅台风格 UI** - 红金配色，品牌设计

## 项目结构

```
MaoTaiTrace/
├── contracts/           # 智能合约
│   └── MoutaiTrace.sol
├── scripts/             # 部署脚本
│   └── deploy.js
├── test/                # 合约测试
│   └── MoutaiTrace.test.js
├── frontend/            # 前端应用
│   ├── src/
│   │   ├── components/  # React 组件
│   │   ├── hooks/       # 自定义 Hooks
│   │   └── utils/       # 合约 ABI
│   └── package.json
├── hardhat.config.js
└── package.json
```

## 快速开始

### 1. 安装依赖

```bash
npm install
cd frontend && npm install
```

### 2. 启动本地区块链

```bash
npx hardhat node
```

### 3. 部署智能合约

```bash
npx hardhat run scripts/deploy.js --network localhost
```

### 4. 启动前端

```bash
cd frontend
npm run dev
```

### 5. 使用系统

1. 打开浏览器访问 http://localhost:5173
2. 点击右上角「连接钱包」，使用 MetaMask 连接
3. 在左侧表单添加溯源记录（填写批次号、环节、详情）
4. 在右侧输入相同批次号查询溯源时间线

## 智能合约

`MoutaiTrace` 合约提供以下接口：

| 函数 | 功能 |
|------|------|
| `addRecord(batchId, stage, details)` | 添加溯源记录 |
| `getRecords(batchId)` | 查询指定批次的全部记录 |

**溯源环节**: 制曲 → 发酵 → 蒸馏 → 窖藏 → 勾兑 → 灌装 → 入库 → 质检 → 物流 → 销售

## 测试

```bash
npx hardhat test
```

## 注意事项

- 本项目为 Demo，仅用于技术验证
- 生产环境需考虑：角色权限控制、IPFS 存储、Oracle 预言机等
- 部署到公网前需配置合适的网络（如 Sepolia）

## 许可证

ISC