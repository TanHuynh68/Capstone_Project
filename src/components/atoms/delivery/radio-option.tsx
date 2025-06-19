import type React from "react";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface RadioOptionProps {
  value: string;
  id: string;
  children: React.ReactNode;
}

export function RadioOption({ value, id, children }: RadioOptionProps) {
  return (
    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
      <RadioGroupItem value={value} id={id} />
      <Label htmlFor={id} className="flex-1 cursor-pointer">
        {children}
      </Label>
    </div>
  );
}
