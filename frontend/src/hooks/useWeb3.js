import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

const HARDHAT_CHAIN_ID = '0x7a69'; // 31337 in hex
const HARDHAT_CHAIN_ID_DECIMAL = 31337;

function getWalletErrorMessage(err) {
  if (err?.code === 4001) {
    return '已取消 MetaMask 连接请求';
  }

  if (err?.code === -32002) {
    return '请求过多，请稍后重试或检查网络连接';
  }

  if (err?.code === -32000) {
    return 'RPC 请求失败，请确认 Hardhat 节点已启动 (npx hardhat node)';
  }

  return err?.shortMessage || err?.reason || err?.message || '连接钱包失败';
}

export function useWeb3(contractInfo) {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isWrongChain, setIsWrongChain] = useState(false);

  const clearContractAndWarn = useCallback(() => {
    setContract(null);
    setIsWrongChain(true);
  }, []);

  const setupWallet = useCallback(async (accounts, currentChainId) => {
    const isWrong = currentChainId && currentChainId !== HARDHAT_CHAIN_ID_DECIMAL;
    
    const browserProvider = new ethers.BrowserProvider(window.ethereum);

    if (!accounts?.[0]) {
      setError('未获取到钱包账户，请在 MetaMask 中解锁账户');
      return;
    }

    let signer;
    try {
      signer = await browserProvider.getSigner();
    } catch (signerErr) {
      setError('无法获取签名者，请确认 Hardhat 节点正在运行');
      return;
    }

    if (contractInfo?.address && contractInfo?.abi && !isWrong) {
      try {
        const traceContract = new ethers.Contract(
          contractInfo.address,
          contractInfo.abi,
          signer
        );
        setContract(traceContract);
      } catch (contractErr) {
        console.warn('创建合约实例失败:', contractErr);
        setContract(null);
      }
    } else {
      setContract(null);
    }

    setProvider(browserProvider);
    setAccount(accounts[0]);
    setChainId(currentChainId);
    setIsWrongChain(!!isWrong);
  }, [contractInfo]);

  const switchToLocalhost = useCallback(async () => {
    try {
      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
      if (parseInt(chainIdHex, 16) === HARDHAT_CHAIN_ID_DECIMAL) {
        return;
      }
    } catch {}

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: HARDHAT_CHAIN_ID }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: HARDHAT_CHAIN_ID,
              chainName: 'Hardhat Localhost',
              nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
              rpcUrls: ['http://127.0.0.1:8545'],
              blockExplorerUrls: [],
            }],
          });
        } catch (addError) {
          console.warn('添加 Hardhat 网络失败:', addError);
        }
      } else {
        console.warn('切换网络失败:', switchError);
      }
    }
  }, []);

  const connect = useCallback(async () => {
    if (isConnecting) return;

    if (typeof window === 'undefined' || !window.ethereum) {
      setError('请先安装 MetaMask 钱包');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      await switchToLocalhost();
      
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await browserProvider.send('eth_requestAccounts', []);
      
      let currentChainId = HARDHAT_CHAIN_ID_DECIMAL;
      try {
        const network = await browserProvider.getNetwork();
        currentChainId = Number(network.chainId);
      } catch {
        try {
          const chainIdHex = await browserProvider.send('eth_chainId', []);
          currentChainId = parseInt(chainIdHex, 16);
        } catch {}
      }
      await setupWallet(accounts, currentChainId);
    } catch (err) {
      setError(getWalletErrorMessage(err));
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting, switchToLocalhost, setupWallet]);

  const switchAccount = useCallback(async () => {
    if (isConnecting) return;

    if (typeof window === 'undefined' || !window.ethereum) {
      setError('请先安装 MetaMask 钱包');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      await switchToLocalhost();

      await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }],
      });

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      let currentChainId = HARDHAT_CHAIN_ID_DECIMAL;
      try {
        const chainIdHex = await browserProvider.send('eth_chainId', []);
        currentChainId = parseInt(chainIdHex, 16);
      } catch {}
      await setupWallet(accounts, currentChainId);
    } catch (err) {
      setError(getWalletErrorMessage(err));
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting, switchToLocalhost, setupWallet]);

  const disconnect = useCallback(() => {
    setAccount(null);
    setProvider(null);
    setContract(null);
    setChainId(null);
    setIsWrongChain(false);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          setAccount(accounts[0]);
        }
      };

      const handleChainChanged = (newChainId) => {
        const chainIdNum = parseInt(newChainId, 16);
        setChainId(chainIdNum);
        
        if (chainIdNum !== HARDHAT_CHAIN_ID_DECIMAL) {
          clearContractAndWarn();
        } else {
          setIsWrongChain(false);
          if (account) {
            setupWallet([account], chainIdNum);
          }
        }
      };

      const handleDisconnect = () => {
        disconnect();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('disconnect', handleDisconnect);

      return () => {
        window.ethereum.removeListener?.('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener?.('chainChanged', handleChainChanged);
        window.ethereum.removeListener?.('disconnect', handleDisconnect);
      };
    }
  }, [disconnect, clearContractAndWarn, setupWallet, account, chainId]);

  return {
    account,
    provider,
    contract,
    isConnecting,
    error,
    chainId,
    isWrongChain,
    connect,
    disconnect,
    switchAccount,
    switchToLocalhost,
  };
}
