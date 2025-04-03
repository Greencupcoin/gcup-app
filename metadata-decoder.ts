import { PublicKey } from '@solana/web3.js';
import { Buffer } from 'buffer';
import * as borsh from '@coral-xyz/borsh';

const METADATA_SCHEMA = borsh.struct([
  borsh.u8('key'),
  borsh.publicKey('updateAuthority'),
  borsh.publicKey('mint'),
  borsh.struct([
    borsh.array(borsh.u8(), 32, 'name'),    // fixed array (corrected)
    borsh.array(borsh.u8(), 10, 'symbol'),  // fixed array (corrected)
    borsh.array(borsh.u8(), 200, 'uri'),    // fixed array (corrected)
    borsh.u16('sellerFeeBasisPoints'),
    borsh.option(
      borsh.vec(borsh.struct([
        borsh.publicKey('address'),
        borsh.bool('verified'),
        borsh.u8('share'),
      ])),
      'creators'
    ),
  ], 'data'),
  borsh.bool('primarySaleHappened'),
  borsh.bool('isMutable'),
  borsh.option(borsh.u8(), 'editionNonce'),
]);

interface Creator {
  address: PublicKey;
  verified: boolean;
  share: number;
}

interface Metadata {
  key: number;
  updateAuthority: PublicKey;
  mint: PublicKey;
  data: {
    name: string;
    symbol: string;
    uri: string;
    sellerFeeBasisPoints: number;
    creators: Creator[] | null;
  };
  primarySaleHappened: boolean;
  isMutable: boolean;
  editionNonce: number | null;
}

export function decodeMetadata(buffer: Buffer): Metadata {
  const decoded = METADATA_SCHEMA.decode(buffer);

  decoded.data.name = Buffer.from(decoded.data.name).toString('utf8').replace(/\0/g, '').trim();
  decoded.data.symbol = Buffer.from(decoded.data.symbol).toString('utf8').replace(/\0/g, '').trim();
  decoded.data.uri = Buffer.from(decoded.data.uri).toString('utf8').replace(/\0/g, '').trim();

  return decoded as Metadata;
}

// --- Test code ---
const realMetadataHex =
  '04ba5eb56769b4c97fe07b51304e6ca6ba35814c7a32cf3880c9f2cc23cd91bcae02c8798628fee33af34b7a7ac329326b86c04f5853dc672ea14d94c4b2ddee5d20000000477265656e2043757000000000000000000000000000000000000000000000000a00000047435550000000000000c800000068747470733a2f2f676174657761792e70696e6174612e636c6f75642f697066732f6261666b726569617a6e7a3772736e61626d7878747479706f756a6667323361646f33613779367368636f7633796573366a787735756b32706b7500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000101000000ba5eb56769b4c97fe07b51304e6ca6ba35814c7a32cf3880c9f2cc23cd91bcae0164000101fd0102';

const buffer = Buffer.from(realMetadataHex, 'hex');
const metadata = decodeMetadata(buffer);

console.log('Decoded Metadata:', metadata);
