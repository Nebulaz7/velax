import { useSignTransaction, useCurrentAccount } from "@mysten/dapp-kit";
import { useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { enokiClient } from "@/lib/enoki";
import { toBase64 } from "@mysten/sui/utils";

export function useSponsoredTx() {
  const client = useSuiClient();
  const { mutateAsync: signTransaction } = useSignTransaction();
  const account = useCurrentAccount();

  return async (tx: Transaction) => {
    if (!account) throw new Error("No account connected");

    // 1. Set the sender to the current user
    tx.setSender(account.address);

    // 2. Get the raw bytes
    const txBytes = await tx.build({ client, onlyTransactionKind: true });

    // 3. Ask Enoki to SPONSOR the transaction (Pay the gas)
    const sponsored = await enokiClient.createSponsoredTransaction({
      network: "testnet",
      transactionKindBytes: toBase64(txBytes), // Convert Uint8Array to Base64 string
      sender: account.address,
      allowedMoveCallTargets: [
        "0x...::auction::create_auction",
        "0x...::auction::place_bid",
      ], // Optional security
    });

    // 4. User SIGNS the transaction (Securely via zkLogin)
    const { signature } = await signTransaction({
      transaction: Transaction.from(sponsored.bytes),
    });

    // 5. Execute the transaction via Enoki
    return enokiClient.executeSponsoredTransaction({
      digest: sponsored.digest,
      signature: signature,
    });
  };
}
