import {
  useSignTransaction,
  useCurrentAccount,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { fromBase64, toBase64 } from "@mysten/sui/utils";

export function useSponsoredTx() {
  const client = useSuiClient();
  const { mutateAsync: signTransaction } = useSignTransaction();
  const account = useCurrentAccount();

  return async (tx: Transaction) => {
    if (!account) throw new Error("No account connected");

    tx.setSender(account.address);
    const txBytes = await tx.build({ client, onlyTransactionKind: true });
    const txBytesBase64 = toBase64(txBytes);

    // 1. Sponsor (Backend)
    const sponsorRes = await fetch("/api/sponsor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        txBytes: txBytesBase64,
        sender: account.address,
      }),
    });
    const sponsored = await sponsorRes.json();
    if (!sponsorRes.ok)
      throw new Error(sponsored.error || "Sponsorship failed");

    // 2. Sign (Frontend)
    const { signature } = await signTransaction({
      transaction: Transaction.from(fromBase64(sponsored.bytes)),
    });

    // 3. Execute (Backend) <--- NEW STEP
    const executeRes = await fetch("/api/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        digest: sponsored.digest,
        signature: signature,
      }),
    });

    const result = await executeRes.json();
    if (!executeRes.ok) throw new Error(result.error || "Execution failed");

    return result;
  };
}
