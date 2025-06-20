import { useStore } from '@nanostores/react';
import { Users } from 'lucide-react';
import { $blockchain, $validators, $mempool, type Validator } from '../state';

const NodesPanel = () => {
  const blockchain = useStore($blockchain);
  const validators = useStore($validators);
  const mempool = useStore($mempool);

  return (
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
  );
};

export { NodesPanel };