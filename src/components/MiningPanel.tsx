import { useStore } from '@nanostores/react';
import { Zap } from 'lucide-react';
import { $mempool, $mining, $currentBlock } from '../state';

const MiningPanel = () => {
  const mempool = useStore($mempool);
  const mining = useStore($mining);
  const currentBlock = useStore($currentBlock);

  return (
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
  );
};

export { MiningPanel };