"use client";

import { useSocket } from "@/components/providers/socket-providers";
import { Badge } from "@/components/ui/badge";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <Badge variant="outline" className="bg-yellow-600 text-white border-none">
        {/* Disconnected */}
        Fallback: Polling every 1s
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="bg-emerald-600 text-white border-none">
      {/* Disconnected */}
      Live: Real-time updates
    </Badge>
  );
};
