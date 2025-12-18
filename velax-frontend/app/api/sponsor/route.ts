import { EnokiClient } from "@mysten/enoki";
import { NextResponse } from "next/server";

// Initialize Enoki with the SECRET Key (Server-side only)
const enoki = new EnokiClient({
  apiKey: process.env.ENOKI_SECRET_KEY!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { txBytes, sender } = body;

    if (!txBytes || !sender) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    // 1. Ask Enoki to sponsor the transaction
    const sponsored = await enoki.createSponsoredTransaction({
      network: "testnet",
      transactionKindBytes: txBytes, // Expecting Base64 string
      sender: sender,
    });

    // 2. Return the sponsored details to the frontend
    return NextResponse.json(sponsored);
  } catch (error: any) {
    console.error("Sponsorship failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
