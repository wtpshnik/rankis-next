import { NextResponse } from "next/server";
import { getAllCards } from "@/lib/catalog";

// Exported as a static file (out/search-index.json); used by client-side search and the cart.
export const dynamic = "force-static";

export function GET() {
  return NextResponse.json(getAllCards());
}
