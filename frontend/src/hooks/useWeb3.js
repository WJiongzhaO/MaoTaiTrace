import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

export function useWeb3(contractInfo) {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setError('请先安装 MetaMask 钱包');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await browserProvider.send('eth_requestAccounts', []);
      const signer = await browserProvider.getSigner();

      if (contractInfo?.address && contractInfo?.abi) {
        const traceContract = new ethers.Contract(
          contractInfo.address,
          contractInfo.abi,
          signer
        );
        setContract(traceContract);
      }

      setProvider(browserProvider);
      setAccount(accounts[0]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsConnecting(false);
    }
  }, [contractInfo]);

  const disconnect = useCallback(() => {
    setAccount(null);
    setProvider(null);
    setContract(null);
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          setAccount(accounts[0]);
        }
      });
    }
  }, [disconnect]);

  return { account, provider, contract, isConnecting, error, connect, disconnect };
}