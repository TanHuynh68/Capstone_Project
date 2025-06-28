import { useState, useEffect } from "react";
import { SelectField } from "../../atoms/delivery/select-field";

interface PickShiftProps {
  onChange?: (data: Record<string, unknown>) => void;
  errors?: Record<string, string>;
  selected?: number;
}

interface Shift {
  id: number;
  title: string;
  from_time: number;
  to_time: number;
}

const GHN_TOKEN = import.meta.env.VITE_GHN_TOKEN;

export function PickShift({ onChange, errors, selected }: PickShiftProps) {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [selectedShift, setSelectedShift] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://online-gateway.ghn.vn/shiip/public-api/v2/shift/date",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              token: GHN_TOKEN,
            },
          }
        );

        const data = await response.json();
        if (data.code === 200) {
          setShifts(data.data || []);
        } else {
          console.error("Error fetching shifts:", data.message);
        }
      } catch (error) {
        console.error("Error fetching shifts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShifts();
  }, []);

  useEffect(() => {
    if (onChange && selectedShift) {
      const shift = shifts.find((s) => String(s.id) === selectedShift);
      if (shift) {
        onChange({ pickShiftId: shift.id, pickShiftTitle: shift.title });
      }
    }
  }, [selectedShift, onChange, shifts]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium">Ca lấy hàng</label>
        <div className="h-10 bg-gray-100 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-2 hover:border-primary">
      <SelectField
        label="Ca lấy hàng"
        placeholder="Chọn ca lấy hàng"
        value={selectedShift || (selected ? String(selected) : "")}
        required
        options={shifts.map((shift) => ({
          value: String(shift.id),
          label: shift.title,
        }))}
        onValueChange={setSelectedShift}
      />
      {errors?.pickShift && (
        <div className="text-red-500 text-sm mt-1">{errors.pickShift}</div>
      )}
    </div>
  );
}
