"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

// next/image with a shimmer until the photo has decoded, then a fade-in.
// For `fill` images the parent must be `relative`; the shimmer fills it too.
export function StayHWImage({ alt, className = "", onLoad, skeletonClassName = "", ...props }: ImageProps & { skeletonClassName?: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && <span aria-hidden className={`sk !rounded-none ${props.fill ? "absolute inset-0" : "block"} ${skeletonClassName}`} />}
      <Image
        {...props}
        alt={alt}
        // A cached photo can finish before hydration, when no load event reaches React.
        ref={(img) => { if (img?.complete && img.naturalWidth > 0) setLoaded(true); }}
        onLoad={(event) => { setLoaded(true); onLoad?.(event); }}
        className={`${className} transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </>
  );
}
