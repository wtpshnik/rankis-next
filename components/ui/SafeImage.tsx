"use client";
import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { BASE_PATH } from "@/lib/base-path";

export function SafeImage(props: ImageProps) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <Image {...props} src={`${BASE_PATH}/placeholder.svg`} unoptimized alt={props.alt} />;
  }
  return <Image {...props} alt={props.alt} onError={() => setFailed(true)} />;
}
