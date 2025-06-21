// Proof of Work implementation for Bitcoin simulator

// Simple SHA-256-like hash function for simulation
export const sha256Simulate = (data: string): string => {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert to hex and pad with zeros
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  // Add more randomness to make it look more like a real hash
  const random = Math.random().toString(16).substring(2, 10);
  return '000000' + hex + random + '000000000000000000000000';
};

// Calculate difficulty target from difficulty number
export const calculateTarget = (difficulty: number): string => {
  // Higher difficulty = more leading zeros required
  const leadingZeros = Math.floor(difficulty);
  const target = '0'.repeat(leadingZeros) + 'f'.repeat(64 - leadingZeros);
  return target;
};

// Check if hash meets difficulty target
export const meetsTarget = (hash: string, target: string): boolean => {
  return hash <= target;
};

// Calculate difficulty adjustment based on block times
export const calculateDifficultyAdjustment = (
  lastBlocks: { timestamp: number }[], 
  targetBlockTime: number = 10000 // 10 seconds in ms
): number => {
  if (lastBlocks.length < 2) return 4; // Starting difficulty
  
  // Calculate average time of last few blocks
  const times = lastBlocks.slice(-Math.min(10, lastBlocks.length));
  let totalTime = 0;
  
  for (let i = 1; i < times.length; i++) {
    totalTime += times[i].timestamp - times[i - 1].timestamp;
  }
  
  const avgBlockTime = totalTime / (times.length - 1);
  const currentDifficulty = lastBlocks.length;
  
  // Adjust difficulty based on how far off we are from target
  const ratio = avgBlockTime / targetBlockTime;
  
  if (ratio > 1.5) {
    // Blocks too slow, decrease difficulty
    return Math.max(1, currentDifficulty - 0.5);
  } else if (ratio < 0.5) {
    // Blocks too fast, increase difficulty
    return Math.min(8, currentDifficulty + 0.5);
  }
  
  return currentDifficulty;
};

// Proof of Work mining simulation
export interface MiningResult {
  nonce: number;
  hash: string;
  attempts: number;
  success: boolean;
}

export const mineBlock = async (
  blockData: string,
  difficulty: number,
  maxAttempts: number = 100000,
  onProgress?: (attempts: number) => void
): Promise<MiningResult> => {
  const target = calculateTarget(difficulty);
  let nonce = 0;
  let attempts = 0;
  
  return new Promise((resolve) => {
    const mine = () => {
      const batchSize = 1000; // Process in batches to avoid blocking UI
      
      for (let i = 0; i < batchSize && attempts < maxAttempts; i++) {
        const data = blockData + nonce.toString();
        const hash = sha256Simulate(data);
        attempts++;
        
        if (meetsTarget(hash, target)) {
          resolve({
            nonce,
            hash,
            attempts,
            success: true
          });
          return;
        }
        
        nonce++;
      }
      
      // Update progress
      if (onProgress) {
        onProgress(attempts);
      }
      
      // Continue mining in next tick
      if (attempts < maxAttempts) {
        setTimeout(mine, 1);
      } else {
        // Failed to find valid hash
        resolve({
          nonce: 0,
          hash: sha256Simulate(blockData + '0'),
          attempts,
          success: false
        });
      }
    };
    
    mine();
  });
};

// Calculate estimated hash rate based on difficulty and time
export const calculateHashRate = (difficulty: number, timeMs: number): number => {
  // Rough estimation: 2^difficulty attempts needed on average
  const expectedAttempts = Math.pow(2, difficulty * 4);
  const hashRate = expectedAttempts / (timeMs / 1000); // hashes per second
  return hashRate;
};

// Format hash rate for display
export const formatHashRate = (hashRate: number): string => {
  if (hashRate >= 1e12) return `${(hashRate / 1e12).toFixed(2)} TH/s`;
  if (hashRate >= 1e9) return `${(hashRate / 1e9).toFixed(2)} GH/s`;
  if (hashRate >= 1e6) return `${(hashRate / 1e6).toFixed(2)} MH/s`;
  if (hashRate >= 1e3) return `${(hashRate / 1e3).toFixed(2)} KH/s`;
  return `${hashRate.toFixed(0)} H/s`;
};