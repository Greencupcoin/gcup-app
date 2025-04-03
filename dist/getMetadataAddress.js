"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
// Metaplex Token Metadata Program ID (constant)
const TOKEN_METADATA_PROGRAM_ID = new web3_js_1.PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
// Green Cup (GCUP) Token Mint Address
const TOKEN_MINT_ADDRESS = new web3_js_1.PublicKey("Bs7k2iTXZLST6JcJr91g2wGjEKm1LwG7L6Kbggkcvxk");
async function getMetadataAddress(mint) {
    const [metadataPDA] = await web3_js_1.PublicKey.findProgramAddress([
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
    ], TOKEN_METADATA_PROGRAM_ID);
    console.log("Metadata PDA:", metadataPDA.toBase58());
    return metadataPDA;
}
getMetadataAddress(TOKEN_MINT_ADDRESS);
