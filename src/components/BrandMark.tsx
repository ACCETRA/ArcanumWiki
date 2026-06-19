import type { ImgHTMLAttributes } from "react";

export function BrandMark({
  className,
  ...props
}: ImgHTMLAttributes<HTMLImageElement> & { className?: string }) {
  return (
    <img
      aria-hidden="true"
      alt=""
      src="/brand-logo.png"
      className={`object-cover ${className ?? ""}`.trim()}
      {...props}
    />
  );
}
