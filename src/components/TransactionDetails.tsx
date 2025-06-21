import { ArrowRight, Coins } from 'lucide-react';
import { type Transaction } from '../state';

interface TransactionDetailsProps {
  transaction: Transaction;
}

export const TransactionDetails = ({ transaction }: TransactionDetailsProps) => {
  const totalOutputAmount = transaction.outputs.reduce((acc, output) => acc + output.amount, 0);

  return (
    <div className="space-y-4 p-4 bg-gray-600 rounded-lg">
      {/* Transaction Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Coins className="w-4 h-4 text-yellow-400" />
          <span className="font-semibold">Transaction Details</span>
        </div>
        <div className="text-xs text-gray-400">
          Type: <span className="text-white">{transaction.type}</span>
        </div>
      </div>

      {/* Transaction Hash */}
      <div>
        <div className="text-xs text-gray-400 mb-1">Transaction Hash</div>
        <div className="font-mono text-xs bg-gray-700 p-2 rounded break-all">
          {transaction.hash}
        </div>
      </div>

      {/* Inputs and Outputs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Inputs */}
        <div className="space-y-2">
          <div className="text-sm font-semibold text-red-400">
            Inputs ({transaction.inputs.length})
          </div>
          {transaction.inputs.length === 0 ? (
            <div className="bg-gray-700 p-3 rounded text-center">
              <div className="text-yellow-400 text-sm">Coinbase</div>
              <div className="text-xs text-gray-400">New coins created</div>
            </div>
          ) : (
            <div className="space-y-2">
              {transaction.inputs.map((input, index) => (
                <div key={index} className="bg-gray-700 p-3 rounded">
                  <div className="text-xs text-gray-400 mb-1">Previous TX</div>
                  <div className="font-mono text-xs break-all mb-2">
                    {input.txId}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Output #{input.outputIndex}</span>
                    <span className="text-xs text-blue-400">Signed</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Arrow */}
        <div className="flex items-center justify-center">
          <ArrowRight className="w-6 h-6 text-gray-400" />
        </div>

        {/* Outputs */}
        <div className="space-y-2">
          <div className="text-sm font-semibold text-green-400">
            Outputs ({transaction.outputs.length})
          </div>
          <div className="space-y-2">
            {transaction.outputs.map((output, index) => (
              <div key={index} className="bg-gray-700 p-3 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-400">Output #{output.index}</span>
                  <span className="text-green-400 font-semibold">
                    {output.amount.toFixed(8)} BTC
                  </span>
                </div>
                <div className="text-xs text-gray-400 mb-1">Address</div>
                <div className="font-mono text-xs break-all">
                  {output.address}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction Summary */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-500">
        <div className="text-center">
          <div className="text-lg font-bold text-green-400">
            {totalOutputAmount.toFixed(8)}
          </div>
          <div className="text-xs text-gray-400">Total Output</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-red-400">
            {transaction.fee.toFixed(8)}
          </div>
          <div className="text-xs text-gray-400">Fee</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-400">
            {new Date(transaction.timestamp).toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">Timestamp</div>
        </div>
      </div>
    </div>
  );
};