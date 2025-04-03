import { Connection, PublicKey } from '@solana/web3.js';

async function fetchMetadataBuffer(metadataAddress: PublicKey): Promise<Buffer | null> {
  const connection = new Connection('https://api.mainnet-beta.solana.com'); // Using mainnet for your actual token
  try {
    const accountInfo = await connection.getAccountInfo(metadataAddress);
    if (accountInfo && accountInfo.data) {
      return accountInfo.data;
    } else {
      console.log('Metadata account not found or has no data.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return null;
  }
}

async function getMetadataAddress(mint: PublicKey): Promise<PublicKey> {
  const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
    'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
  );
  const [metadataPDA] = await PublicKey.findProgramAddress(
    [
      Buffer.from('metadata'),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );
  return metadataPDA;
}

async function main() {
  const tokenMintAddress = new PublicKey('Bs7k2iTXZLST6JcJr91g2wGjEKm1LwG7L6Kbggkcvxk');
  const metadataAddress = await getMetadataAddress(tokenMintAddress);
  console.log('Metadata Account Address:', metadataAddress.toBase58());

  const metadataBuffer = await fetchMetadataBuffer(metadataAddress);

  if (metadataBuffer) {
    console.log('Real Metadata Buffer (Hex):', metadataBuffer.toString('hex'));
    // You'll use this buffer in the next step to test your decoding function
  }
}

main();