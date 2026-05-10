import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useWeb3 } from './hooks/useWeb3';
import { WalletButton } from './components/WalletButton';
import { TabBar } from './components/TabBar';
import { ToastContainer } from './components/Toast';
import { Home } from './pages/Home';
import { Add } from './pages/Add';
import { Query } from './pages/Query';
import { MyRecords } from './pages/MyRecords';
import { About } from './pages/About';
import contractInfo from './utils/contractInfo.json';
import './App.css';

function App() {
  const { account, contract, isConnecting, connect, disconnect } = useWeb3(contractInfo);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/20 to-amber-50/10">
        <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-40">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-700 to-red-800 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">茅</span>
              </div>
              <span className="text-base font-bold text-gray-800">茅台溯源</span>
            </div>
            <WalletButton
              account={account}
              isConnecting={isConnecting}
              onConnect={connect}
              onDisconnect={disconnect}
            />
          </div>
        </header>

        <main className="pt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<Add contract={contract} account={account} />} />
            <Route path="/query" element={<Query contract={contract} />} />
            <Route path="/my" element={<MyRecords contract={contract} account={account} />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>

        <TabBar />
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
}

export default App;