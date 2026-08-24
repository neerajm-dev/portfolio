"use client";

import { Phone3D } from "./phone-3d";
import { WorkstationTheme, DEFAULT_THEME } from "@/lib/theme-colors";

interface PhoneModalProps {
  onClose: () => void;
  theme?: WorkstationTheme;
  onOpenTerminal?: () => void;
  onOpenIdCard?: () => void;
}

export function PhoneModal({
  onClose,
  theme = DEFAULT_THEME,
  onOpenTerminal,
  onOpenIdCard,
}: PhoneModalProps) {
  return (
    <Phone3D
      onClose={onClose}
      theme={theme}
      onOpenTerminal={onOpenTerminal}
      onOpenIdCard={onOpenIdCard}
    />
  );
}

// Backward compatibility alias
export const KtccModal = PhoneModal;
export { Phone3D };
