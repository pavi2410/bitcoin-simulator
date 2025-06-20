import { useStore } from '@nanostores/react';
import { Hash } from 'lucide-react';
import { $mempool, type Transaction } from '../state';

const MempoolPanel = () => {
  const mempool = useStore($mempool);

  return (
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
  );
};

export { MempoolPanel };