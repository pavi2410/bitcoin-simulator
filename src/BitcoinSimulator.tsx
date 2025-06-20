import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { Wallet, Blocks, Globe, Users, Activity, Hash, Zap, type LucideIcon } from 'lucide-react';
import {
  $blockchain,
  $mempool,
  $wallets,
  $validators,
  $txCounter,
  $selectedWallet,
  $selectedTab,
  $transferAmount,
  $transferTo,
  $mining,
  $currentBlock,
  $autoMining,
  createTransaction,
  mineBlock,
  resetNetwork,
  generateFakeTransaction,
  type Transaction,
  type Block,
  type Validator,
  type TabId,
  type WalletId
} from './state';

interface TabButtonProps {
  id: TabId;
  label: string;
  icon: LucideIcon;
}

const BitcoinSimulator = () => {
  // Subscribe to stores
  const blockchain = useStore($blockchain);
  const mempool = useStore($mempool);
  const wallets = useStore($wallets);
  const validators = useStore($validators);
  // const txCounter = useStore($txCounter); // Not directly used in component
  const selectedWallet = useStore($selectedWallet);
  const selectedTab = useStore($selectedTab);
  const transferAmount = useStore($transferAmount);
  const transferTo = useStore($transferTo);
  const mining = useStore($mining);
  const currentBlock = useStore($currentBlock);
  const autoMining = useStore($autoMining);

  const toggleAutoMining = (): void => {
    $autoMining.set(!autoMining);
  };

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

  const TabButton = ({ id, label, icon: Icon }: TabButtonProps) => (
    <button
      onClick={() => $selectedTab.set(id)}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
        selectedTab === id ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-orange-500">Bitcoin Simulator</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg">
              <Activity className="text-green-400" size={16} />
              <span className="text-sm">Network Active</span>
            </div>
            <button
              onClick={resetNetwork}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              <Hash size={16} />
              Reset Network
            </button>
            <button
              onClick={toggleAutoMining}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                autoMining 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              <Activity size={16} />
              {autoMining ? 'Stop Auto Mining' : 'Start Auto Mining'}
            </button>
            <button
              onClick={mineBlock}
              disabled={mempool.length === 0 || mining}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
            >
              <Zap size={16} />
              {mining ? 'Mining...' : 'Mine Block'}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <TabButton id="overview" label="Overview" icon={Globe} />
          <TabButton id="wallet" label="Wallet" icon={Wallet} />
          <TabButton id="explorer" label="Explorer" icon={Blocks} />
          <TabButton id="nodes" label="Nodes" icon={Users} />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
          {selectedTab === 'overview' && (
            <>
              {/* Mempool */}
              <div className="col-span-4 bg-gray-800 rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Hash className="text-yellow-400" size={20} />
                  Mempool ({mempool.length})
                </h2>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {mempool.map((tx: Transaction) => (
                    <div key={tx.id} className="bg-gray-700 p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-yellow-400 text-sm">TX #{tx.id}</span>
                        <span className="text-green-400 text-sm">{tx.amount} BTC</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        <div>From: {tx.from.slice(0, 20)}...</div>
                        <div>To: {tx.to.slice(0, 20)}...</div>
                        <div>Fee: {tx.fee} BTC</div>
                      </div>
                    </div>
                  ))}
                  {mempool.length === 0 && (
                    <div className="text-gray-500 text-center py-8">No pending transactions</div>
                  )}
                </div>
              </div>

              {/* Mining Process */}
              <div className="col-span-4 bg-gray-800 rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Zap className="text-orange-400" size={20} />
                  Mining Process
                </h2>
                {mining && currentBlock ? (
                  <div className="space-y-4">
                    <div className="bg-gray-700 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                        <span className="text-orange-400">Mining Block #{currentBlock.height}</span>
                      </div>
                      <div className="text-sm text-gray-400">
                        <div>Miner: {currentBlock.miner}</div>
                        <div>Transactions: {currentBlock.transactions.length}</div>
                        <div>Difficulty: {currentBlock.difficulty}</div>
                      </div>
                    </div>
                    <div className="bg-gray-700 p-3 rounded-lg">
                      <div className="text-sm text-gray-400 mb-2">Hash Calculation</div>
                      <div className="font-mono text-xs text-green-400 break-all">
                        {currentBlock.hash}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 text-center py-8">
                    {mempool.length === 0 ? 'No transactions to mine' : 'Ready to mine'}
                  </div>
                )}
              </div>

              {/* Recent Blocks */}
              <div className="col-span-4 bg-gray-800 rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Blocks className="text-blue-400" size={20} />
                  Recent Blocks
                </h2>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {blockchain.slice(-5).reverse().map((block: Block) => (
                    <div key={block.height} className="bg-gray-700 p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-blue-400 text-sm">Block #{block.height}</span>
                        <span className="text-green-400 text-sm">{block.transactions.length} TXs</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        <div>Miner: {block.miner}</div>
                        <div>Hash: {block.hash.slice(0, 20)}...</div>
                        <div>Time: {new Date(block.timestamp).toLocaleTimeString()}</div>
                      </div>
                    </div>
                  ))}
                  {blockchain.length === 0 && (
                    <div className="text-gray-500 text-center py-8">No blocks mined yet</div>
                  )}
                </div>
              </div>
            </>
          )}

          {selectedTab === 'wallet' && (
            <div className="col-span-12 bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Wallet className="text-green-400" size={24} />
                Wallet Manager
              </h2>
              
              <div className="grid grid-cols-2 gap-8">
                {/* Wallet Selection */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Your Wallets</h3>
                  <div className="space-y-3">
                    {Object.entries(wallets).map(([key, wallet]) => (
                      <div 
                        key={key}
                        className={`p-4 rounded-lg cursor-pointer transition-colors ${
                          selectedWallet === key ? 'bg-green-700' : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                        onClick={() => $selectedWallet.set(key as WalletId)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold">{key.toUpperCase()}</div>
                            <div className="text-sm text-gray-400">{wallet.address.slice(0, 30)}...</div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-400">{wallet.balance} BTC</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Transaction Form */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Send Bitcoin</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">From Wallet</label>
                      <div className="bg-gray-700 p-3 rounded-lg">
                        <div className="font-semibold">{selectedWallet.toUpperCase()}</div>
                        <div className="text-sm text-gray-400">Balance: {wallets[selectedWallet].balance} BTC</div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">To Wallet</label>
                      <select
                        value={transferTo}
                        onChange={(e) => $transferTo.set(e.target.value as WalletId)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
                      >
                        {Object.entries(wallets).map(([key]) => (
                          key !== selectedWallet && (
                            <option key={key} value={key}>{key.toUpperCase()}</option>
                          )
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Amount (BTC)</label>
                      <input
                        type="number"
                        value={transferAmount}
                        onChange={(e) => $transferAmount.set(e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
                      />
                    </div>
                    
                    <div className="text-sm text-gray-400">
                      Network Fee: 0.01 BTC
                    </div>
                    
                    <button
                      onClick={createTransaction}
                      className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Create Transaction
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'explorer' && (
            <div className="col-span-12 bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Blocks className="text-blue-400" size={24} />
                Block Explorer
              </h2>
              
              <div className="space-y-4">
                {blockchain.map((block: Block) => (
                  <div key={block.height} className="bg-gray-700 p-4 rounded-lg">
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-400">Height</div>
                        <div className="text-lg font-bold text-blue-400">#{block.height}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Timestamp</div>
                        <div className="text-sm">{new Date(block.timestamp).toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Miner</div>
                        <div className="text-sm">{block.miner}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Transactions</div>
                        <div className="text-lg font-bold text-green-400">{block.transactions.length}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-400">Block Hash</div>
                        <div className="font-mono text-xs text-blue-400 break-all">{block.hash}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Previous Hash</div>
                        <div className="font-mono text-xs text-gray-400 break-all">{block.previousHash}</div>
                      </div>
                    </div>
                    
                    {block.transactions.length > 0 && (
                      <div>
                        <div className="text-sm text-gray-400 mb-2">Transactions</div>
                        <div className="space-y-2">
                          {block.transactions.map((tx: Transaction) => (
                            <div key={tx.id} className="bg-gray-600 p-3 rounded">
                              <div className="flex justify-between items-center">
                                <div className="text-sm">
                                  <div>From: {tx.from.slice(0, 30)}...</div>
                                  <div>To: {tx.to.slice(0, 30)}...</div>
                                </div>
                                <div className="text-right">
                                  <div className="text-green-400 font-bold">{tx.amount} BTC</div>
                                  <div className="text-xs text-gray-400">Fee: {tx.fee} BTC</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {blockchain.length === 0 && (
                  <div className="text-gray-500 text-center py-12">
                    No blocks have been mined yet. Create a transaction and mine a block to see it here.
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedTab === 'nodes' && (
            <div className="col-span-12 bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Users className="text-purple-400" size={24} />
                Validator Nodes
              </h2>
              
              <div className="grid grid-cols-3 gap-6">
                {validators.map((validator: Validator) => (
                  <div key={validator.id} className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">{validator.name}</h3>
                      <div className={`w-3 h-3 rounded-full ${
                        validator.status === 'active' ? 'bg-green-400' : 'bg-red-400'
                      }`}></div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className={validator.status === 'active' ? 'text-green-400' : 'text-red-400'}>
                          {validator.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Blocks Mined:</span>
                        <span className="text-blue-400 font-bold">{validator.blocks}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Node ID:</span>
                        <span className="text-gray-300">#{validator.id}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-600">
                      <div className="text-sm text-gray-400">Network Participation</div>
                      <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                        <div 
                          className="bg-purple-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, (validator.blocks / Math.max(1, blockchain.length)) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Network Statistics</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-400">Total Blocks</div>
                    <div className="text-2xl font-bold text-blue-400">{blockchain.length}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Active Nodes</div>
                    <div className="text-2xl font-bold text-green-400">{validators.filter((v: Validator) => v.status === 'active').length}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Pending TXs</div>
                    <div className="text-2xl font-bold text-yellow-400">{mempool.length}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Network Hash Rate</div>
                    <div className="text-2xl font-bold text-purple-400">12.5 TH/s</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BitcoinSimulator;