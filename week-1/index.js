import {
  Keypair,
  Connection,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  sendAndConfirmRawTransaction,
} from "@solana/web3.js";

async function main() {
  const connection = new Connection("https://api.devnet.solana.com");
  const payer = Keypair.fromSecretKey(
    Uint8Array.from([
      161, 116, 183, 144, 196, 104, 130, 173, 148, 10, 243, 133, 176, 212, 53,
      205, 63, 133, 64, 153, 249, 4, 108, 2, 93, 162, 103, 116, 184, 15, 174,
      29, 234, 138, 73, 220, 167, 146, 167, 123, 117, 169, 92, 169, 215, 246,
      203, 130, 39, 125, 45, 56, 80, 245, 99, 61, 127, 210, 165, 71, 161, 181,
      194, 166,
    ])
  );
  console.log("payer ", payer.publicKey.toBase58());

  const transferTo = Keypair.generate();
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: transferTo.publicKey,
      lamports: LAMPORTS_PER_SOL * 0.1,
    })
  );
  transaction.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash;
  transaction.feePayer = payer.publicKey;
  transaction.partialSign(payer);

  const serializedTransaction = transaction.serialize();
  const signature = await connection.sendRawTransaction(serializedTransaction);
  console.log("Transfer Signature", signature);
}

main()

