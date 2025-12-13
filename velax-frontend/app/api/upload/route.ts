import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 1. Prepare the buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Send to Walrus Publisher (Testnet)
    // epochs=5 means it stays stored for a decent amount of time
    const response = await fetch(
      "https://publisher.walrus-testnet.walrus.space/v1/store?epochs=5",
      {
        method: "PUT",
        body: buffer,
      }
    );

    if (!response.ok) {
      throw new Error(`Walrus error: ${response.statusText}`);
    }

    const data = await response.json();

    // 3. Extract the Blob ID securely
    // Walrus returns different JSON depending on if the file is new or already exists
    let blobId = "";
    if (data.newlyCreated) {
      blobId = data.newlyCreated.blobObject.blobId;
    } else if (data.alreadyCertified) {
      blobId = data.alreadyCertified.blobId;
    } else {
      throw new Error("Invalid response from Walrus");
    }

    return NextResponse.json({ blobId });
  } catch (error) {
    console.error("Upload handler error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
