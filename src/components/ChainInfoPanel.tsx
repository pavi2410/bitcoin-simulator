import { useStore } from '@nanostores/react';
import { Activity, Hash, Clock, Coins, TrendingUp, Database } from 'lucide-react';
import { 
  $totalBlocks,
  $totalTransactions,
  $totalSupply,
  $avgBlockTime,
  $networkHashrate,
  $avgTxFee,
  $latestBlock,
  $timeSinceLastBlock,
  $mempoolStats,
  $validators
} from '../state';
import { StatCard } from './StatCard';
import { formatNumber, formatTime } from '../utils';

export const ChainInfoPanel = () => {
  // Use computed stores for derived statistics
  const totalBlocks = useStore($totalBlocks);
  const totalTransactions = useStore($totalTransactions);
  const totalSupply = useStore($totalSupply);
  const avgBlockTime = useStore($avgBlockTime);
  const networkHashrate = useStore($networkHashrate);
  const avgTxFee = useStore($avgTxFee);
  const latestBlock = useStore($latestBlock);
  const timeSinceLastBlock = useStore($timeSinceLastBlock);
  const mempoolStats = useStore($mempoolStats);
  const validators = useStore($validators);

  return (
    <div className="col-span-12 space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Chain Information</h2>
        <div className="text-sm text-gray-400">
          Live Network Statistics
        </div>
      </div>

      {/* Network Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Database}
          title="Total Blocks"
          value={totalBlocks.toString()}
          subtitle={`Height: ${totalBlocks}`}
          color="blue"
        />
        <StatCard
          icon={Activity}
          title="Total Transactions"
          value={totalTransactions.toString()}
          subtitle={`${avgTxFee.toFixed(4)} BTC avg fee`}
          color="green"
        />
        <StatCard
          icon={Coins}
          title="Total Supply"
          value={`${formatNumber(totalSupply)} BTC`}
          subtitle={`${totalBlocks * 6.25} BTC mined`}
          color="orange"
        />
        <StatCard
          icon={TrendingUp}
          title="Network Hashrate"
          value={`${formatNumber(networkHashrate)} TH/s`}
          subtitle={`${validators.filter(v => v.status === 'active').length} active miners`}
          color="purple"
        />
      </div>

      {/* Block Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-400" />
            Block Timing
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Average Block Time</span>
              <span className="text-white font-mono">
                {avgBlockTime > 0 ? formatTime(Math.round(avgBlockTime)) : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Time Since Last Block</span>
              <span className="text-white font-mono">
                {latestBlock ? formatTime(timeSinceLastBlock) : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Target Block Time</span>
              <span className="text-white font-mono">10m 0s</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Hash className="w-5 h-5 mr-2 text-green-400" />
            Latest Block
          </h3>
          {latestBlock ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Block Height</span>
                <span className="text-white font-mono">#{latestBlock.height}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Block Hash</span>
                <span className="text-white font-mono text-sm">
                  {latestBlock.hash.substring(0, 16)}...
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Transactions</span>
                <span className="text-white font-mono">{latestBlock.transactions.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Miner</span>
                <span className="text-white">{latestBlock.miner}</span>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-center py-8">
              No blocks mined yet
            </div>
          )}
        </div>
      </div>

      {/* Mempool Information */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-purple-400" />
          Mempool Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{mempoolStats.size}</div>
            <div className="text-sm text-gray-400">Pending Transactions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {formatNumber(mempoolStats.totalValue)}
            </div>
            <div className="text-sm text-gray-400">Total Value (BTC)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {mempoolStats.avgFee.toFixed(4)}
            </div>
            <div className="text-sm text-gray-400">Avg Fee (BTC)</div>
          </div>
        </div>
      </div>
    </div>
  );
};