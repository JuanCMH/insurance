import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Dispatch, SetStateAction } from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { PerformanceBondDataType } from "@/packages/bonds/types";

interface BondPickerProps {
  value?: Id<"bonds">;
  onChange?: Dispatch<SetStateAction<Id<"bonds"> | undefined>>;
  placeholder?: string;
  disabled?: boolean;
  bonds: Array<PerformanceBondDataType>;
}

export function BondPicker({
  bonds,
  value,
  disabled,
  onChange,
  placeholder,
}: BondPickerProps) {
  const onValueChange = (value: string) => {
    if (onChange) {
      onChange(value as Id<"bonds">);
    }
  };

  return (
    <Select disabled={disabled} onValueChange={onValueChange} value={value}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="flex max-h-48">
        {bonds?.map((bond) => (
          <SelectItem key={bond.id} value={bond.id}>
            {bond.name}
          </SelectItem>
        ))}
        {bonds.length === 0 && (
          <div className="p-2 text-sm text-muted-foreground text-center border border-dashed">
            Los amparos que selecciones aparecerán aquí.
          </div>
        )}
      </SelectContent>
    </Select>
  );
}
