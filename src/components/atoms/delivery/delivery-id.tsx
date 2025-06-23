"use client";

import type React from "react";

import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DeliveryIdProps {
  id: string;
  label?: string;
}

export const DeliveryId: React.FC<DeliveryIdProps> = ({ id, label }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(id);
    toast.success(`${label || "ID"} đã được sao chép vào clipboard`);
  };

  return (
    <div className="flex items-center gap-2">
      <code className="px-2 py-1 bg-muted rounded text-sm font-mono">{id}</code>
      <Button
        variant="ghost"
        size="sm"
        onClick={copyToClipboard}
        className="h-6 w-6 p-0"
      >
        <Copy className="h-3 w-3" />
      </Button>
    </div>
  );
};
