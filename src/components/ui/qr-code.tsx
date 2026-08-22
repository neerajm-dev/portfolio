"use client";

import { useMemo } from "react";
import QRCode from "qrcode";

interface QrCodeProps {
  value: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
  margin?: number;
  className?: string;
}

export function QrCode({
  value,
  size = 52,
  fgColor = "#00ff66",
  bgColor = "transparent",
  margin = 1,
  className = "",
}: QrCodeProps) {
  const { pathData, totalSize } = useMemo(() => {
    try {
      const qr = QRCode.create(value, { errorCorrectionLevel: "M" });
      const moduleCount = qr.modules.size;
      const total = moduleCount + margin * 2;
      let path = "";

      for (let r = 0; r < moduleCount; r++) {
        for (let c = 0; c < moduleCount; c++) {
          if (qr.modules.get(r, c)) {
            path += `M${c + margin} ${r + margin}h1v1h-1z `;
          }
        }
      }

      return { pathData: path, totalSize: total };
    } catch {
      return { pathData: "", totalSize: 25 };
    }
  }, [value, margin]);

  return (
    <svg
      viewBox={`0 0 ${totalSize} ${totalSize}`}
      width={size}
      height={size}
      className={className}
      shapeRendering="crispEdges"
    >
      {bgColor !== "transparent" && (
        <rect width={totalSize} height={totalSize} fill={bgColor} />
      )}
      <path d={pathData} fill={fgColor} />
    </svg>
  );
}
