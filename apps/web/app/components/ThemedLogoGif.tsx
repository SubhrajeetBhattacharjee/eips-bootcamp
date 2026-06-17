"use client";

import Image, { type ImageProps } from "next/image";

const LIGHT_LOGO_SRC = "/brand/ethshala_logo_black.svg";
const DARK_LOGO_SRC = "/brand/ethshala_logo_white.svg";

type ThemedLogoGifProps = Omit<ImageProps, "src"> & {
  lightSrc?: string;
  darkSrc?: string;
  lightClassName?: string;
  darkClassName?: string;
};

export function ThemedLogoGif({
  alt,
  lightSrc = LIGHT_LOGO_SRC,
  darkSrc = DARK_LOGO_SRC,
  className,
  lightClassName,
  darkClassName,
  ...props
}: ThemedLogoGifProps) {
  return (
    <>
      <Image
        {...props}
        src={lightSrc}
        alt={alt}
        className={`${className ?? ""} dark:hidden ${lightClassName ?? ""}`}
      />
      <Image
        {...props}
        src={darkSrc}
        alt={alt}
        className={`hidden dark:block ${className ?? ""} ${darkClassName ?? ""}`}
      />
    </>
  );
}