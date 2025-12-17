import { EnokiClient } from "@mysten/enoki";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { digest, signature } = await req.json();

    const enoki = new EnokiClient({
      apiKey: process.env.ENOKI_SECRET_KEY!,
    });

    const result = await enoki.executeSponsoredTransaction({
      digest,
      signature,
    });

    console.log("✅ Transaction Executed:", result.digest);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("❌ Execution Failed:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
