import { useStore } from '@nanostores/react';
import { Wallet } from 'lucide-react';
import { Button } from './Button';
import { Select } from './Select';
import { Input } from './Input';
import {
  $wallets,
  $walletBalances,
  $selectedWallet,
  $transferAmount,
  $transferTo,
  createTransaction,
  type WalletId
} from '../state';

const WalletPanel = () => {
  const wallets = useStore($wallets);
  const walletBalances = useStore($walletBalances);
  const selectedWallet = useStore($selectedWallet);
  const transferAmount = useStore($transferAmount);
  const transferTo = useStore($transferTo);

  return (
    <div className="col-span-12 bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <Wallet className="text-green-400" size={24} />
        Wallet Manager
      </h2>
      
      <div className="grid grid-cols-2 gap-8">
        {/* Wallet Selection */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Your Wallets</h3>
          <div className="space-y-3">
            {Object.entries(wallets).map(([key, wallet]) => (
              <div 
                key={key}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  selectedWallet === key ? 'bg-green-700' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                onClick={() => $selectedWallet.set(key as WalletId)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{key.toUpperCase()}</div>
                    <div className="text-sm text-gray-400">{wallet.address.slice(0, 30)}...</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-400">{walletBalances[key as WalletId]?.toFixed(8) || '0.00000000'} BTC</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction Form */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Send Bitcoin</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">From Wallet</label>
              <div className="bg-gray-700 p-3 rounded-lg">
                <div className="font-semibold">{selectedWallet.toUpperCase()}</div>
                <div className="text-sm text-gray-400">Balance: {walletBalances[selectedWallet]?.toFixed(8) || '0.00000000'} BTC</div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">To Wallet</label>
              <Select
                value={transferTo}
                onValueChange={(value) => $transferTo.set(value[0] as WalletId)}
                placeholder="Select wallet"
                options={Object.entries(wallets)
                  .filter(([key]) => key !== selectedWallet)
                  .map(([key]) => ({ value: key, label: key.toUpperCase() }))}
              />
            </div>
            
            <Input
              label="Amount (BTC)"
              type="number"
              value={transferAmount}
              onChange={(value) => $transferAmount.set(value)}
              placeholder="0.00"
              step="0.01"
            />
            
            <div className="text-sm text-gray-400">
              Network Fee: 0.01 BTC
            </div>
            
            <Button
              onClick={createTransaction}
              variant="success"
              className="w-full"
              size="lg"
            >
              Create Transaction
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { WalletPanel };