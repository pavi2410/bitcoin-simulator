import { useStore } from '@nanostores/react';
import { Activity, Hash, Zap } from 'lucide-react';
import { Button } from './Button';
import { $mempool, $mining, $autoMining, resetNetwork, mineBlock } from '../state';

const Header = () => {
  const mempool = useStore($mempool);
  const mining = useStore($mining);
  const autoMining = useStore($autoMining);

  const toggleAutoMining = (): void => {
    $autoMining.set(!autoMining);
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold text-orange-500">Bitcoin Simulator</h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg">
          <Activity className="text-green-400" size={16} />
          <span className="text-sm">Network Active</span>
        </div>
        <Button onClick={resetNetwork}>
          <Hash size={16} />
          Reset Network
        </Button>
        <Button onClick={toggleAutoMining}>
          <Activity size={16} />
          {autoMining ? 'Stop Auto Mining' : 'Start Auto Mining'}
        </Button>
        <Button
          onClick={mineBlock}
          disabled={mempool.length === 0 || mining}
        >
          <Zap size={16} />
          {mining ? 'Mining...' : 'Mine Block'}
        </Button>
      </div>
    </div>
  );
};

export { Header };