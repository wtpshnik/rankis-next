import { NextRequest, NextResponse } from "next/server";
import { getProduct } from "@/lib/catalog";

export function GET(req: NextRequest) {
  const slugs = (req.nextUrl.searchParams.get("slugs") ?? "").split(",").filter(Boolean).slice(0, 100);
  return NextResponse.json(slugs.map(getProduct).filter(Boolean));
}
