const web3 = require('@solana/web3.js');

async function airdropSOL() {
  const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');

  // CLI wallet address clearly here:
  const publicKey = new web3.PublicKey('DYWbNN7hnPueFhzahRNGZhiK7MyXwo8baffue6ErcfgR');

  console.log('Requesting airdrop...');
  const signature = await connection.requestAirdrop(publicKey, web3.LAMPORTS_PER_SOL);

  await connection.confirmTransaction(signature);
  console.log(`Airdrop successful! Tx signature: ${signature}`);
}

airdropSOL().catch(console.error);

