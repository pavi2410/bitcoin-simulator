import { atom } from 'nanostores';
import { persistentAtom } from '@nanostores/persistent';

// Type definitions
export interface Transaction {
  id: number;
  from: string;
  to: string;
  amount: number;
  fee: number;
  timestamp: number;
  hash: string;
}

export interface Block {
  height: number;
  hash: string;
  previousHash: string;
  timestamp: number;
  transactions: Transaction[];
  miner: string;
  nonce: number;
  difficulty: string;
}

export interface WalletData {
  address: string;
  balance: number;
}

export type WalletId = 'wallet1' | 'wallet2' | 'wallet3';

export type Wallets = Record<WalletId, WalletData>;

export interface Validator {
  id: number;
  name: string;
  status: 'active' | 'inactive';
  blocks: number;
}

export type TabId = 'overview' | 'wallet' | 'explorer' | 'nodes';

// Initial data
const initialWallets: Wallets = {
  wallet1: { address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', balance: 100 },
  wallet2: { address: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2', balance: 50 },
  wallet3: { address: '1Lbcfr7sAHTD9CgdQo3HTMTkV8LK4ZnX71', balance: 25 }
};

const initialValidators: Validator[] = [
  { id: 1, name: 'Node Alpha', status: 'active', blocks: 0 },
  { id: 2, name: 'Node Beta', status: 'active', blocks: 0 },
  { id: 3, name: 'Node Gamma', status: 'active', blocks: 0 }
];

// Persistent stores (will be saved to localStorage)
export const $blockchain = persistentAtom<Block[]>('bitcoin-blockchain', [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export const $mempool = persistentAtom<Transaction[]>('bitcoin-mempool', [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export const $wallets = persistentAtom<Wallets>('bitcoin-wallets', initialWallets, {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export const $validators = persistentAtom<Validator[]>('bitcoin-validators', initialValidators, {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export const $txCounter = persistentAtom<number>('bitcoin-txcounter', 1, {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export const $selectedWallet = persistentAtom<WalletId>('bitcoin-selectedwallet', 'wallet1', {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export const $selectedTab = persistentAtom<TabId>('bitcoin-selectedtab', 'overview', {
  encode: JSON.stringify,
  decode: JSON.parse,
});

// Non-persistent UI state
export const $transferAmount = atom<string>('');
export const $transferTo = atom<WalletId>('wallet2');
export const $mining = atom<boolean>(false);
export const $currentBlock = atom<Block | null>(null);
export const $autoMining = atom<boolean>(false);

// Helper functions
export const generateHash = (_data: string): string => {
  return '0x' + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
};

export const generateFakeTransaction = (): Transaction => {
  const wallets = $wallets.get();
  const txCounter = $txCounter.get();
  
  const walletKeys = Object.keys(wallets) as WalletId[];
  const fromKey = walletKeys[Math.floor(Math.random() * walletKeys.length)];
  const toKey = walletKeys.filter(k => k !== fromKey)[Math.floor(Math.random() * (walletKeys.length - 1))];
  const amount = Math.round((Math.random() * 10 + 1) * 100) / 100; // Random amount between 1-10 BTC
  
  return {
    id: txCounter,
    from: wallets[fromKey].address,
    to: wallets[toKey].address,
    amount: amount,
    fee: 0.01,
    timestamp: Date.now(),
    hash: generateHash(`${fromKey}-${toKey}-${amount}-${Date.now()}`)
  };
};

export const createTransaction = (): void => {
  const transferAmount = $transferAmount.get();
  const transferTo = $transferTo.get();
  const selectedWallet = $selectedWallet.get();
  const wallets = $wallets.get();
  const txCounter = $txCounter.get();
  const mempool = $mempool.get();

  const amount = parseFloat(transferAmount);
  if (!amount || amount <= 0 || amount > wallets[selectedWallet].balance) return;

  const transaction: Transaction = {
    id: txCounter,
    from: wallets[selectedWallet].address,
    to: wallets[transferTo].address,
    amount: amount,
    fee: 0.01,
    timestamp: Date.now(),
    hash: generateHash(`${selectedWallet}-${transferTo}-${amount}`)
  };

  $mempool.set([transaction, ...mempool]);
  $txCounter.set(txCounter + 1);
  $transferAmount.set('');
};

export const mineBlock = async (): Promise<void> => {
  const mempool = $mempool.get();
  const mining = $mining.get();
  const blockchain = $blockchain.get();
  const validators = $validators.get();
  const wallets = $wallets.get();

  if (mempool.length === 0 || mining) return;
  
  $mining.set(true);
  const miner = validators[Math.floor(Math.random() * validators.length)];
  
  // Simulate mining process
  const blockData: Block = {
    height: blockchain.length + 1,
    hash: generateHash(`block-${blockchain.length + 1}`),
    previousHash: blockchain.length > 0 ? blockchain[blockchain.length - 1].hash : '0x0000000000000000',
    timestamp: Date.now(),
    transactions: mempool.slice(0, 3), // Take up to 3 transactions
    miner: miner.name,
    nonce: Math.floor(Math.random() * 1000000),
    difficulty: '0000'
  };

  $currentBlock.set(blockData);

  // Simulate mining delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Process transactions
  const processedTxs = blockData.transactions;
  const updatedWallets = { ...wallets };

  processedTxs.forEach((tx: Transaction) => {
    const fromWallet = Object.keys(wallets).find(key => wallets[key as WalletId].address === tx.from) as WalletId | undefined;
    const toWallet = Object.keys(wallets).find(key => wallets[key as WalletId].address === tx.to) as WalletId | undefined;
    
    if (fromWallet && toWallet) {
      updatedWallets[fromWallet] = { 
        ...updatedWallets[fromWallet], 
        balance: updatedWallets[fromWallet].balance - tx.amount - tx.fee 
      };
      updatedWallets[toWallet] = { 
        ...updatedWallets[toWallet], 
        balance: updatedWallets[toWallet].balance + tx.amount 
      };
    }
  });

  // Update stores
  $wallets.set(updatedWallets);
  $blockchain.set([...blockchain, blockData]);
  $mempool.set(mempool.slice(processedTxs.length));
  
  // Update validator stats
  $validators.set(validators.map(v => 
    v.id === miner.id ? { ...v, blocks: v.blocks + 1 } : v
  ));

  $mining.set(false);
  $currentBlock.set(null);
};

export const resetNetwork = (): void => {
  $blockchain.set([]);
  $mempool.set([]);
  $wallets.set(initialWallets);
  $validators.set(initialValidators);
  $txCounter.set(1);
  $selectedWallet.set('wallet1');
  $selectedTab.set('overview');
  $autoMining.set(false);
};