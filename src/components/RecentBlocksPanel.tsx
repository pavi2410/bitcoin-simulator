import { useStore } from '@nanostores/react';
import { Blocks } from 'lucide-react';
import { $blockchain, type Block } from '../state';

const RecentBlocksPanel = () => {
  const blockchain = useStore($blockchain);

  return (
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
  );
};

export { RecentBlocksPanel };