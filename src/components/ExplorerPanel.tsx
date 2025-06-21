import { useStore } from '@nanostores/react';
import { Blocks, ChevronDown } from 'lucide-react';
import { Accordion } from '@base-ui-components/react/accordion';
import { $blockchain, type Block, type Transaction } from '../state';
import { TransactionDetails } from './TransactionDetails';

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
                <Accordion.Root className="space-y-2" openMultiple={false}>
                  {block.transactions.map((tx: Transaction) => {
                    const totalOutputAmount = tx.outputs.reduce((acc, output) => acc + output.amount, 0);
                    const fromAddress = tx.inputs.length > 0 ? `${tx.inputs.length} inputs` : 'Coinbase';
                    const toAddress = tx.outputs.length > 0 ? tx.outputs[0].address : 'Unknown';
                    
                    return (
                      <Accordion.Item key={tx.id} value={tx.id}>
                        <Accordion.Header>
                          <Accordion.Trigger className="w-full bg-gray-600 p-3 rounded hover:bg-gray-500 transition-colors group">
                            <div className="flex justify-between items-center">
                              <div className="text-sm text-left">
                                <div>From: {fromAddress}</div>
                                <div>To: {toAddress.slice(0, 30)}...</div>
                                <div>Type: {tx.type}</div>
                              </div>
                              <div className="text-right flex items-center gap-3">
                                <div>
                                  <div className="text-green-400 font-bold">{totalOutputAmount.toFixed(8)} BTC</div>
                                  <div className="text-xs text-gray-400">Fee: {tx.fee} BTC</div>
                                  {tx.outputs.length > 1 && (
                                    <div className="text-xs text-blue-400">{tx.outputs.length} outputs</div>
                                  )}
                                </div>
                                <ChevronDown className="w-4 h-4 text-gray-400 group-data-[state=open]:rotate-180 transition-transform" />
                              </div>
                            </div>
                          </Accordion.Trigger>
                        </Accordion.Header>
                        <Accordion.Panel className="overflow-hidden">
                          <TransactionDetails transaction={tx} />
                        </Accordion.Panel>
                      </Accordion.Item>
                    );
                  })}
                </Accordion.Root>
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