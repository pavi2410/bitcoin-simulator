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
      <div className="space-y-2 overflow-y-auto">
        {mempool.map((tx: Transaction) => {
          const totalOutputAmount = tx.outputs.reduce((acc, output) => acc + output.amount, 0);
          const fromAddress = tx.inputs.length > 0 ? 'Multiple Inputs' : 'Coinbase';
          const toAddress = tx.outputs.length > 0 ? tx.outputs[0].address : 'Unknown';
          
          return (
            <div key={tx.id} className="bg-gray-700 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-yellow-400 text-sm">TX #{tx.id}</span>
                <span className="text-green-400 text-sm">{totalOutputAmount.toFixed(8)} BTC</span>
              </div>
              <div className="text-xs text-gray-400">
                <div>From: {fromAddress}</div>
                <div>To: {toAddress.slice(0, 20)}...</div>
                <div>Fee: {tx.fee} BTC</div>
                <div>Type: {tx.type}</div>
              </div>
            </div>
          );
        })}
        {mempool.length === 0 && (
          <div className="text-gray-500 text-center py-8">No pending transactions</div>
        )}
      </div>
    </div>
  );
};

export { MempoolPanel };