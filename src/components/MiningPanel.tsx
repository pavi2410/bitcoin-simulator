import { useStore } from '@nanostores/react';
import { Hash, Target, TrendingUp, Zap } from 'lucide-react';
import { formatHashRate } from '../pow';
import {
  $currentBlock,
  $currentDifficulty,
  $mempool,
  $mining,
  $miningAttempts,
  $miningProgress,
  $networkHashRate
} from '../state';

const MiningPanel = () => {
  const mempool = useStore($mempool);
  const mining = useStore($mining);
  const currentBlock = useStore($currentBlock);
  const miningProgress = useStore($miningProgress);
  const miningAttempts = useStore($miningAttempts);
  const currentDifficulty = useStore($currentDifficulty);
  const networkHashRate = useStore($networkHashRate);

  return (
    <div className="col-span-4 bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Zap className="text-orange-400" size={20} />
        Proof of Work Mining
      </h2>

      {/* Network Stats */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-gray-700 p-2 rounded">
          <div className="flex items-center gap-1 mb-1">
            <Target className="w-3 h-3 text-blue-400" />
            <span className="text-xs text-gray-400">Difficulty</span>
          </div>
          <div className="text-sm font-bold text-blue-400">{currentDifficulty.toFixed(1)}</div>
        </div>
        <div className="bg-gray-700 p-2 rounded">
          <div className="flex items-center gap-1 mb-1">
            <TrendingUp className="w-3 h-3 text-green-400" />
            <span className="text-xs text-gray-400">Network Hash Rate</span>
          </div>
          <div className="text-sm font-bold text-green-400">{formatHashRate(networkHashRate)}</div>
        </div>
      </div>

      {mining && currentBlock ? (
        <div className="space-y-3">
          <div className="bg-gray-700 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
              <span className="text-orange-400">Mining Block #{currentBlock.height}</span>
            </div>
            <div className="text-sm text-gray-400 space-y-1">
              <div>Miner: {currentBlock.miner}</div>
              <div>Transactions: {currentBlock.transactions.length}</div>
              <div>Target: {currentBlock.target?.substring(0, 20)}...</div>
            </div>
          </div>

          {/* Mining Progress */}
          <div className="bg-gray-700 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Hash className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-400">Proof of Work Progress</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-600 rounded-full h-2 mb-2">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${miningProgress * 100}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-gray-400">Hash Attempts</div>
                <div className="text-white font-mono">{miningAttempts.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-gray-400">Progress</div>
                <div className="text-white font-mono">{(miningProgress * 100).toFixed(1)}%</div>
              </div>
            </div>
          </div>

          {/* Current Hash */}
          <div className="bg-gray-700 p-3 rounded-lg">
            <div className="text-xs text-gray-400 mb-2">Current Hash Attempt</div>
            <div className="font-mono text-xs text-green-400 break-all">
              {currentBlock.hash || 'Computing...'}
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
