import {
  useSignTransaction,
  useCurrentAccount,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { EnokiClient } from "@mysten/enoki";
import { fromBase64, toBase64 } from "@mysten/sui/utils";

// Initialize public client for execution only
const publicEnoki = new EnokiClient({
  apiKey: process.env.NEXT_PUBLIC_ENOKI_API_KEY!,
});

export function useSponsoredTx() {
  const client = useSuiClient();
  const { mutateAsync: signTransaction } = useSignTransaction();
  const account = useCurrentAccount();

  return async (tx: Transaction) => {
    if (!account) throw new Error("No account connected");

    // 1. Set Sender
    tx.setSender(account.address);

    // 2. Build the transaction bytes
    const txBytes = await tx.build({ client, onlyTransactionKind: true });

    // Convert bytes to Base64 string to send over JSON
    const txBytesBase64 = toBase64(txBytes);

    // 3. Call YOUR Backend API to sponsor (Secure Step)
    const response = await fetch("/api/sponsor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        txBytes: txBytesBase64,
        sender: account.address,
      }),
    });

    const sponsored = await response.json();

    if (!response.ok) {
      throw new Error(sponsored.error || "Sponsorship failed");
    }

    // 4. User Signs the sponsored transaction
    // 'sponsored.bytes' comes back as Base64 string
    const { signature } = await signTransaction({
      transaction: Transaction.from(fromBase64(sponsored.bytes)),
    });

    // 5. Execute via Enoki (Public execution is fine)
    return publicEnoki.executeSponsoredTransaction({
      digest: sponsored.digest,
      signature: signature,
    });
  };
}
