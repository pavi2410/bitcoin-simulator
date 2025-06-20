import { useStore } from '@nanostores/react';
import { Blocks } from 'lucide-react';
import { $blockchain, type Block, type Transaction } from '../state';

const ExplorerPanel = () => {
  const blockchain = useStore($blockchain);

  return (
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
  );
};

export { ExplorerPanel };