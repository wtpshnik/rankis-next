"use client";
import Image, { type ImageProps } from "next/image";
import { useState } from "react";

export function SafeImage(props: ImageProps) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <Image {...props} src="/placeholder.svg" unoptimized alt={props.alt} />;
  }
  return <Image {...props} alt={props.alt} onError={() => setFailed(true)} />;
}
