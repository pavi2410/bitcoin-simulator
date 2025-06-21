import { atom, computed } from 'nanostores';
import { persistentAtom } from '@nanostores/persistent';

// UTXO Type definitions
export interface UTXO {
  txId: string;
  outputIndex: number;
  address: string;
  amount: number;
  spent: boolean;
  spentInTx?: string;
  blockHeight?: number;
}

export interface TransactionInput {
  txId: string;
  outputIndex: number;
  signature: string; // Simplified signature
}

export interface TransactionOutput {
  address: string;
  amount: number;
  index: number;
}

export interface Transaction {
  id: string;
  inputs: TransactionInput[];
  outputs: TransactionOutput[];
  fee: number;
  timestamp: number;
  hash: string;
  type: 'regular' | 'coinbase';
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
  reward: number;
}

export interface WalletData {
  address: string;
  privateKey: string; // Simplified for demo
}

export type WalletId = 'wallet1' | 'wallet2' | 'wallet3';

export type Wallets = Record<WalletId, WalletData>;

export interface Validator {
  id: number;
  name: string;
  status: 'active' | 'inactive';
  blocks: number;
}

export type TabId = 'overview' | 'wallet' | 'explorer' | 'nodes' | 'chain-info';

// Initial data
const initialWallets: Wallets = {
  wallet1: { address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', privateKey: 'key1' },
  wallet2: { address: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2', privateKey: 'key2' },
  wallet3: { address: '1Lbcfr7sAHTD9CgdQo3HTMTkV8LK4ZnX71', privateKey: 'key3' }
};

// Initial UTXOs to give wallets starting balances
const initialUTXOs: UTXO[] = [
  {
    txId: 'genesis-1',
    outputIndex: 0,
    address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    amount: 100,
    spent: false,
    blockHeight: 0
  },
  {
    txId: 'genesis-2', 
    outputIndex: 0,
    address: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
    amount: 50,
    spent: false,
    blockHeight: 0
  },
  {
    txId: 'genesis-3',
    outputIndex: 0, 
    address: '1Lbcfr7sAHTD9CgdQo3HTMTkV8LK4ZnX71',
    amount: 25,
    spent: false,
    blockHeight: 0
  }
];

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

export const $utxos = persistentAtom<UTXO[]>('bitcoin-utxos', initialUTXOs, {
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

// UTXO Helper functions
export const generateHash = (data: string): string => {
  // Simple hash simulation based on data + random elements
  const hashSeed = data.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return '0x' + hashSeed.toString(36) + Math.random().toString(36).substring(2, 8);
};

export const getUTXOsForAddress = (address: string): UTXO[] => {
  const utxos = $utxos.get();
  return utxos.filter(utxo => utxo.address === address && !utxo.spent);
};

export const getWalletBalance = (address: string): number => {
  const utxos = getUTXOsForAddress(address);
  return utxos.reduce((total, utxo) => total + utxo.amount, 0);
};

export const selectUTXOs = (address: string, amount: number): { utxos: UTXO[], total: number } => {
  const availableUTXOs = getUTXOsForAddress(address);
  const selectedUTXOs: UTXO[] = [];
  let total = 0;
  
  // Simple UTXO selection - just take UTXOs until we have enough
  for (const utxo of availableUTXOs) {
    selectedUTXOs.push(utxo);
    total += utxo.amount;
    if (total >= amount) break;
  }
  
  return { utxos: selectedUTXOs, total };
};

export const createCoinbaseTransaction = (minerAddress: string, blockHeight: number, reward: number): Transaction => {
  const txId = generateHash(`coinbase-${blockHeight}-${Date.now()}`);
  
  return {
    id: txId,
    inputs: [], // Coinbase has no inputs
    outputs: [{
      address: minerAddress,
      amount: reward,
      index: 0
    }],
    fee: 0,
    timestamp: Date.now(),
    hash: txId,
    type: 'coinbase'
  };
};

export const generateFakeTransaction = (): Transaction => {
  const wallets = $wallets.get();
  const txCounter = $txCounter.get();
  
  const walletKeys = Object.keys(wallets) as WalletId[];
  const fromKey = walletKeys[Math.floor(Math.random() * walletKeys.length)];
  const toKey = walletKeys.filter(k => k !== fromKey)[Math.floor(Math.random() * (walletKeys.length - 1))];
  const amount = Math.round((Math.random() * 5 + 1) * 100) / 100; // Random amount between 1-5 BTC
  const fee = 0.01;
  
  const fromAddress = wallets[fromKey].address;
  const toAddress = wallets[toKey].address;
  
  // Try to select UTXOs for this transaction
  const { utxos: selectedUTXOs, total } = selectUTXOs(fromAddress, amount + fee);
  
  // If not enough UTXOs, return a minimal transaction
  if (total < amount + fee) {
    return createCoinbaseTransaction(fromAddress, 0, 5); // Fallback to coinbase
  }
  
  const txId = txCounter.toString();
  const inputs: TransactionInput[] = selectedUTXOs.map(utxo => ({
    txId: utxo.txId,
    outputIndex: utxo.outputIndex,
    signature: `sig-${fromKey}-${utxo.txId}`
  }));
  
  const outputs: TransactionOutput[] = [];
  
  // Output to recipient
  outputs.push({
    address: toAddress,
    amount: amount,
    index: 0
  });
  
  // Change output (if any)
  const change = total - amount - fee;
  if (change > 0) {
    outputs.push({
      address: fromAddress,
      amount: change,
      index: 1
    });
  }
  
  return {
    id: txId,
    inputs,
    outputs,
    fee,
    timestamp: Date.now(),
    hash: generateHash(`${fromKey}-${toKey}-${amount}-${Date.now()}`),
    type: 'regular'
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
  const fee = 0.01;
  const fromAddress = wallets[selectedWallet].address;
  const toAddress = wallets[transferTo].address;
  const balance = getWalletBalance(fromAddress);
  
  if (!amount || amount <= 0 || amount + fee > balance) return;

  // Select UTXOs for this transaction
  const { utxos: selectedUTXOs, total } = selectUTXOs(fromAddress, amount + fee);
  
  if (total < amount + fee) return; // Not enough UTXOs
  
  const txId = txCounter.toString();
  const inputs: TransactionInput[] = selectedUTXOs.map(utxo => ({
    txId: utxo.txId,
    outputIndex: utxo.outputIndex,
    signature: `sig-${selectedWallet}-${utxo.txId}`
  }));
  
  const outputs: TransactionOutput[] = [];
  
  // Output to recipient
  outputs.push({
    address: toAddress,
    amount: amount,
    index: 0
  });
  
  // Change output (if any)
  const change = total - amount - fee;
  if (change > 0) {
    outputs.push({
      address: fromAddress,
      amount: change,
      index: 1
    });
  }

  const transaction: Transaction = {
    id: txId,
    inputs,
    outputs,
    fee,
    timestamp: Date.now(),
    hash: generateHash(`${selectedWallet}-${transferTo}-${amount}`),
    type: 'regular'
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
  const utxos = $utxos.get();

  if (mempool.length === 0 || mining) return;
  
  $mining.set(true);
  const miner = validators[Math.floor(Math.random() * validators.length)];
  const blockHeight = blockchain.length + 1;
  const blockReward = 6.25; // Bitcoin block reward
  
  // Create coinbase transaction for mining reward
  const coinbaseTx = createCoinbaseTransaction(miner.name, blockHeight, blockReward);
  
  // Take some transactions from mempool
  const regularTxs = mempool.slice(0, 3);
  const allTransactions = [coinbaseTx, ...regularTxs];
  
  // Calculate total fees from regular transactions
  const totalFees = regularTxs.reduce((acc, tx) => acc + tx.fee, 0);
  
  // Update coinbase transaction to include fees
  coinbaseTx.outputs[0].amount = blockReward + totalFees;
  
  // Simulate mining process
  const blockData: Block = {
    height: blockHeight,
    hash: generateHash(`block-${blockHeight}`),
    previousHash: blockchain.length > 0 ? blockchain[blockchain.length - 1].hash : '0x0000000000000000',
    timestamp: Date.now(),
    transactions: allTransactions,
    miner: miner.name,
    nonce: Math.floor(Math.random() * 1000000),
    difficulty: '0000',
    reward: blockReward + totalFees
  };

  $currentBlock.set(blockData);

  // Simulate mining delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Process UTXOs - spend inputs and create new outputs
  const updatedUTXOs = [...utxos];
  
  regularTxs.forEach((tx: Transaction) => {
    // Mark input UTXOs as spent
    tx.inputs.forEach(input => {
      const utxoIndex = updatedUTXOs.findIndex(
        utxo => utxo.txId === input.txId && utxo.outputIndex === input.outputIndex && !utxo.spent
      );
      if (utxoIndex !== -1) {
        updatedUTXOs[utxoIndex] = {
          ...updatedUTXOs[utxoIndex],
          spent: true,
          spentInTx: tx.id
        };
      }
    });
    
    // Create new UTXOs from outputs
    tx.outputs.forEach(output => {
      updatedUTXOs.push({
        txId: tx.id,
        outputIndex: output.index,
        address: output.address,
        amount: output.amount,
        spent: false,
        blockHeight: blockHeight
      });
    });
  });
  
  // Create UTXO for coinbase transaction
  coinbaseTx.outputs.forEach(output => {
    updatedUTXOs.push({
      txId: coinbaseTx.id,
      outputIndex: output.index,
      address: output.address,
      amount: output.amount,
      spent: false,
      blockHeight: blockHeight
    });
  });

  // Update stores
  $utxos.set(updatedUTXOs);
  $blockchain.set([...blockchain, blockData]);
  $mempool.set(mempool.slice(regularTxs.length));
  
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
  $utxos.set(initialUTXOs);
  $validators.set(initialValidators);
  $txCounter.set(1);
  $selectedWallet.set('wallet1');
  $selectedTab.set('overview');
  $autoMining.set(false);
};

// Computed stores for derived statistics
export const $totalBlocks = computed($blockchain, (blockchain) => blockchain.length);

export const $totalTransactions = computed($blockchain, (blockchain) =>
  blockchain.reduce((acc, block) => acc + block.transactions.length, 0)
);

export const $mempoolSize = computed($mempool, (mempool) => mempool.length);

export const $totalSupply = computed([$utxos], (utxos) => {
  return utxos.filter(utxo => !utxo.spent).reduce((acc, utxo) => acc + utxo.amount, 0);
});

export const $avgBlockTime = computed($blockchain, (blockchain) => {
  if (blockchain.length <= 1) return 0;
  const firstBlock = blockchain[0];
  const lastBlock = blockchain[blockchain.length - 1];
  return (lastBlock.timestamp - firstBlock.timestamp) / (blockchain.length - 1) / 1000;
});

export const $networkHashrate = computed($validators, (validators) =>
  validators.filter(v => v.status === 'active').length * 1000000
);

export const $avgTxFee = computed($blockchain, (blockchain) => {
  const totalFees = blockchain.reduce((acc, block) => 
    acc + block.transactions.reduce((txAcc, tx) => txAcc + tx.fee, 0), 0
  );
  const totalTransactions = blockchain.reduce((acc, block) => acc + block.transactions.length, 0);
  return totalTransactions > 0 ? totalFees / totalTransactions : 0;
});

export const $latestBlock = computed($blockchain, (blockchain) =>
  blockchain.length > 0 ? blockchain[blockchain.length - 1] : null
);

export const $timeSinceLastBlock = computed($latestBlock, (latestBlock) =>
  latestBlock ? Math.floor((Date.now() - latestBlock.timestamp) / 1000) : 0
);

export const $mempoolStats = computed($mempool, (mempool) => ({
  size: mempool.length,
  totalValue: mempool.reduce((acc, tx) => 
    acc + tx.outputs.reduce((outputAcc, output) => outputAcc + output.amount, 0), 0
  ),
  avgFee: mempool.length > 0 ? mempool.reduce((acc, tx) => acc + tx.fee, 0) / mempool.length : 0
}));

// Computed wallet balances from UTXOs
export const $walletBalances = computed([$wallets, $utxos], (wallets) => {
  const balances: Record<WalletId, number> = {} as Record<WalletId, number>;
  
  Object.keys(wallets).forEach(walletId => {
    const wallet = wallets[walletId as WalletId];
    balances[walletId as WalletId] = getWalletBalance(wallet.address);
  });
  
  return balances;
});