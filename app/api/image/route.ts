import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image");

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const response = await fetch(
      "https://screenshot-thing-production.up.railway.app/analyze-image/",
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 },
    );
  }
}
