import { EnokiClient } from "@mysten/enoki";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Check if Secret Key is set
  if (!process.env.ENOKI_SECRET_KEY) {
    console.error("❌ Missing ENOKI_SECRET_KEY in .env.local");
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 }
    );
  }

  try {
    const { network, txBytes, sender } = await req.json();

    const enoki = new EnokiClient({
      apiKey: process.env.ENOKI_SECRET_KEY!,
    });

    console.log("⚡ Sponsoring transaction for:", sender);

    const sponsored = await enoki.createSponsoredTransaction({
      network: network || "testnet",
      transactionKindBytes: txBytes,
      sender: sender,
      allowedAddresses: [sender],
    });

    return NextResponse.json(sponsored);
  } catch (error: any) {
    console.error("❌ Sponsorship Failed:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
