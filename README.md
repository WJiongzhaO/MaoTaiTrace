# 茅台酒溯源系统 (MaoTaiTrace)

基于区块链技术的茅台酒批次全程溯源 Demo 系统。通过以太坊智能合约实现溯源数据的不可篡改存证，消费者可通过批次号查询一瓶酒从生产到销售的全流程信息。

---

## 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 智能合约 | Solidity | 0.8.20 |
| 开发框架 | Hardhat | 3.4.4 |
| 前端框架 | React + Vite | 19 / 8.0.10 |
| 样式方案 | Tailwind CSS | 3.4 |
| Web3 交互 | ethers.js | 6.16.0 |
| 测试网络 | Hardhat Local Node | chainId: 31337 |

---

## 项目结构

```
MaoTaiTrace/
├── contracts/              # Solidity 智能合约
│   └── MoutaiTrace.sol     # 核心溯源合约
├── scripts/                # 部署脚本
│   └── deploy.js           # 合约部署脚本
├── frontend/               # React 前端应用
│   ├── src/
│   │   ├── components/     # UI 组件 (WalletButton, Toast, Loading 等)
│   │   ├── hooks/          # 自定义 Hooks (useWeb3)
│   │   ├── pages/          # 页面 (Add, Query, MyRecords, Home, About)
│   │   └── utils/          # 合约 ABI 配置
│   └── package.json
├── hardhat.config.js       # Hardhat 配置
└── package.json            # 根目录依赖
```

---

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0
- MetaMask 浏览器插件

### 1. 安装依赖

```bash
# 安装根目录依赖（Hardhat 工具链）
npm install

# 安装前端依赖
cd frontend && npm install
```

### 2. 启动本地区块链节点

```bash
npx hardhat node
```

启动成功后将看到以下输出：

```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
...
```

> **重要说明**：Hardhat node 使用的是本地测试私钥，**仅用于开发调试**。不要将这些私钥用于任何公网环境（包括主网、测试网）。
>
> 默认账户私钥：
> - Account #0: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
> - Account #1: `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`
> - ...（共 20 个预置账户）

### 3. 部署智能合约

在**新开一个终端窗口**执行：

```bash
npx hardhat run scripts/deploy.js --network localhost
```

部署成功后会自动将合约地址和 ABI 同步到 `frontend/src/utils/contractInfo.json`。

### 4. 启动前端应用

```bash
cd frontend
npm run dev
```

默认访问地址：http://localhost:5173

### 5. 配置 MetaMask 连接本地网络

如果 MetaMask 没有自动识别 Hardhat 网络，需要手动添加：

| 配置项 | 值 |
|--------|-----|
| 网络名称 | Hardhat Localhost |
| RPC URL | http://127.0.0.1:8545 |
| 链 ID | 31337 |
| 货币符号 | ETH |

**注意**：本系统会**自动强制切换**到 Hardhat Localhost 网络。如果用户在 MetaMask 中手动切换到其他网络（如 Ethereum 主网），系统将清空合约实例并提示用户切回本地链。

### 6. 使用系统

1. 打开浏览器访问 http://localhost:5173
2. 点击右上角「连接钱包」，在 MetaMask 中授权连接
3. 连接后会自动切换到 Hardhat Localhost 网络
4. 在「添加记录」页面填写批次号、环节、详情后提交
5. 在「查询溯源」页面输入相同批次号查看时间线

---

## 网络配置说明

### 开发网络 (Hardhat Localhost)

- **网络类型**：本地模拟区块链（内存/文件级）
- **链 ID**：31337
- **RPC URL**：http://127.0.0.1:8545
- **特点**：交易即时确认，无需 gas 费用，使用预置测试账户

### 切换网络场景

| 场景 | 系统行为 |
|------|---------|
| 用户首次连接钱包 | 自动切换到 Hardhat Localhost |
| 用户切换账户 | 自动切换到 Hardhat Localhost |
| 用户手动切换到主网/其他网络 | 清空合约实例，显示警告提示"请切换到 Hardhat Localhost 网络" |
| MetaMask 断开连接 | 重置应用状态，清空账户信息 |

### 关于私钥的说明

> **警告**：Hardhat node 的默认账户私钥是公开的，任何人都可以访问。这些账户**仅用于本地开发**，不应包含任何真实资产。

**安全建议**：
1. 不要将 Hardhat 默认私钥配置到任何生产环境
2. 不要在代码仓库中提交包含真实私钥的配置文件
3. 如需使用真实钱包测试，请在 `.env` 文件中配置（参考 hardhat dotenv 插件）
4. 生产部署建议使用硬件钱包或专业的密钥管理服务

---

## 智能合约接口

`MoutaiTrace` 合约位于 `contracts/MoutaiTrace.sol`，提供以下接口：

### addRecord

```solidity
function addRecord(
    string calldata batchId,
    string calldata stage,
    string calldata details
) external
```

为指定批次添加一条溯源记录。

| 参数 | 类型 | 说明 |
|------|------|------|
| batchId | string | 批次号，唯一标识一批茅台酒 |
| stage | string | 溯源环节（制曲/发酵/蒸馏/窖藏/勾兑/灌装/入库/质检/物流/销售）|
| details | string | 环节详情描述 |

### getRecords

```solidity
function getRecords(
    string calldata batchId
) external view returns (Record[] memory)
```

查询指定批次的完整溯源记录数组。

| 参数 | 类型 | 说明 |
|------|------|------|
| batchId | string | 批次号 |

返回 `Record` 结构体数组，每个 Record 包含：
- `stage`: 环节名称
- `operator`: 操作人地址
- `timestamp`: 上链时间戳
- `details`: 详情描述

---

## 功能特性

| 功能 | 说明 |
|------|------|
| 区块链存证 | 溯源记录上链后不可篡改，具备时间戳和操作人签名 |
| 添加记录 | 支持选择 10 种溯源环节，填写批次号和详情 |
| 查询溯源 | 输入批次号查看完整的区块链时间线 |
| 钱包连接 | 支持 MetaMask 连接，支持切换账户/断开 |
| 网络保护 | 自动切换到本地测试网，防止误连主网 |
| 我的记录 | 查看当前钱包用户添加的所有记录 |

---

## 常见问题

### Q: 端口 8545 被占用

```bash
# Windows 查找占用进程
netstat -ano | findstr :8545

# 结束进程（替换 PID 为实际值）
taskkill /PID <PID> /F
```

### Q: MetaMask 连接失败

1. 确认 Hardhat node 正在运行
2. 确认 MetaMask 连接的是 Hardhat Localhost 网络（chainId: 31337）
3. 尝试在 MetaMask 设置中重置账户

### Q: 交易失败或无响应

1. 确认 Hardhat node 已启动
2. 检查浏览器控制台错误信息
3. 尝试刷新页面后重试

### Q: 查询不到已上链的数据

1. 确认添加记录时使用的是同一个批次号
2. 确认网络保持在 Hardhat Localhost
3. ethers.js v6 返回的是 Result 对象，需要用 `Array.from()` 转换

---

## 生产环境注意事项

本项目为 **Demo 版本**，用于技术验证。生产部署需考虑：

1. **角色权限控制**：添加管理员/操作员角色验证
2. **数据存储**：大文件/图片建议存储在 IPFS，链上只存哈希
3. **Oracle 预言机**：外部数据（如物流信息）需通过 Oracle 写入
4. **Gas 优化**：降低批量操作的链上成本
5. **网络选择**：从本地测试网迁移到 Sepolia 或主网
6. **私钥管理**：使用硬件钱包或 KMS 服务

---

## 测试

```bash
# 运行 Hardhat 测试
npx hardhat test
```

---

## 许可证

ISC