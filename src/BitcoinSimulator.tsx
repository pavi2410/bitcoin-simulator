import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { Wallet, Blocks, Globe, Users } from 'lucide-react';
import { Tabs, TabPanel } from './components/Tabs';
import { Header } from './components/Header';
import { MempoolPanel } from './components/MempoolPanel';
import { MiningPanel } from './components/MiningPanel';
import { RecentBlocksPanel } from './components/RecentBlocksPanel';
import { WalletPanel } from './components/WalletPanel';
import { ExplorerPanel } from './components/ExplorerPanel';
import { NodesPanel } from './components/NodesPanel';
import {
  $selectedTab,
  $autoMining,
  $txCounter,
  $mempool,
  $mining,
  generateFakeTransaction,
  mineBlock,
  type Transaction,
  type TabId
} from './state';


const BitcoinSimulator = () => {
  // Subscribe to stores
  const selectedTab = useStore($selectedTab);
  const autoMining = useStore($autoMining);

  // Auto mining effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (autoMining) {
      interval = setInterval(async () => {
        // Add 2-4 fake transactions to mempool
        const numTxs = Math.floor(Math.random() * 3) + 2;
        const fakeTxs: Transaction[] = [];
        
        for (let i = 0; i < numTxs; i++) {
          const fakeTx = generateFakeTransaction();
          fakeTxs.push(fakeTx);
          $txCounter.set($txCounter.get() + 1);
        }
        
        $mempool.set([...fakeTxs, ...$mempool.get()]);
        
        // Wait a bit then mine the block
        setTimeout(() => {
          if (!$mining.get() && $mempool.get().length > 0) {
            mineBlock();
          }
        }, 1000);
        
      }, 6000); // Every 6 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoMining]);

  const tabs = [
    { value: 'overview', label: 'Overview', icon: Globe },
    { value: 'wallet', label: 'Wallet', icon: Wallet },
    { value: 'explorer', label: 'Explorer', icon: Blocks },
    { value: 'nodes', label: 'Nodes', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        <Header />

        {/* Tab Navigation */}
        <Tabs 
          value={selectedTab} 
          onValueChange={(value: string) => $selectedTab.set(value as TabId)} 
          tabs={tabs}
          className="mb-6"
        >
          <TabPanel value="overview" className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
            <MempoolPanel />
            <MiningPanel />
            <RecentBlocksPanel />
          </TabPanel>
          
          <TabPanel value="wallet">
            <WalletPanel />
          </TabPanel>

          <TabPanel value="explorer">
            <ExplorerPanel />
          </TabPanel>

          <TabPanel value="nodes">
            <NodesPanel />
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default BitcoinSimulator;