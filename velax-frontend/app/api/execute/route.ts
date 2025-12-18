import { EnokiClient } from "@mysten/enoki";
import { NextResponse } from "next/server";

const enoki = new EnokiClient({
  apiKey: process.env.ENOKI_SECRET_KEY!, // Uses the Private Key
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { digest, signature } = body;

    if (!digest || !signature) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    // executeSponsoredTransaction requires the Secret Key too!
    const result = await enoki.executeSponsoredTransaction({
      digest,
      signature,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Execution failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
