import { NextResponse } from "next/server";
import { getNavRoots } from "@/lib/nav";

// Exported as a static file (out/nav.json): the two-level category tree, loaded by the menus on demand
// so it is not embedded in every page's payload.
export const dynamic = "force-static";

export function GET() {
  return NextResponse.json(getNavRoots());
}
