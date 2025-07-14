import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Timeline from "@/components/organisms/timeline/Timeline";
import type { TimelineItemData } from "@/components/molecules/timeline/TimelineItem";
import React from "react";

interface ActivityLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading: boolean;
  items: TimelineItemData[];
  onClose?: () => void;
}

const ActivityLogDialog: React.FC<ActivityLogDialogProps> = ({
  open,
  onOpenChange,
  loading,
  items,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Lịch sử đơn hàng</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="py-8 text-center text-gray-500">Đang tải...</div>
        ) : (
          <Timeline items={items} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ActivityLogDialog;
