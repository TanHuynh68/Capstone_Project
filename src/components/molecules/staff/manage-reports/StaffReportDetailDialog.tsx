"use client";

import ReportBasicInfo from "@/components/atoms/staff/manage-reports/ReportBasicInfo";
import ReportImages from "@/components/atoms/staff/manage-reports/ReportImages";
import ReportResolutionInfo from "@/components/atoms/staff/manage-reports/ReportResolutionInfo";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText } from "lucide-react";
import ShippingReportDetail from "./ShippingReportDetail";
import PaymentReportDetail from "./PaymentReportDetail";
import PostReportDetail from "./PostReportDetail";
import OrderReportDetail from "./OrderReportDetail";

interface DeliveryImage {
  deliveryImageID: string;
  imageUrl: string;
  uploadType: string;
}

interface ShippingTargetDetail {
  deliveryID: string;
  orderID: string;
  senderID: string;
  senderName: string;
  receiverID: string;
  receiverName: string;
  orderCode: string;
  senderAddress: string;
  senderPhoneNumber: string;
  receiverAddress: string;
  receiverPhoneNumber: string;
  deliveryPrice: number;
  length: string;
  width: string;
  height: string;
  weight: string;
  note: string;
  deliveryStatus: string;
  createdAt: string;
  deliveredAt?: string;
  isConfirm: boolean;
  images: DeliveryImage[];
}

interface ProjectImage {
  projectImageID: string;
  imageUrl: string;
  imageType: string;
  createdBy: string;
}

interface PostTargetDetail {
  projectPostID: string;
  accountID: string;
  accountName: string;
  title: string;
  description: string;
  postStatus: string;
  itemValue: number;
  suggestedPrice: number;
  createdAt: string;
  endAt: string;
  finishDate: string;
  isActive: boolean;
  originalImages: ProjectImage[];
  requestedImages: ProjectImage[];
}

interface Order {
  orderID: string;
  customerID: string;
  customerName: string;
  designerID: string;
  designerName: string;
  totalPrice: number;
  orderStatus: string;
  requiredDepositAmount: number;
  designerDepositAmount: number;
  note: string;
  deadlineAt: string;
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface Offer {
  offerID: string;
  projectPostID: string;
  itemValue: number;
  initPrice: number;
  finalPrice: number;
  designerDepositPrice: number;
  note: string;
  sampleImage: string;
  offerStatus: string;
  createdAt: string;
  deadlineEndAt: string;
}

interface OfferPhase {
  offerPhaseID: string;
  phase: number;
  phaseName: string;
  phaseDescription: string;
  offerPhasePrice: number;
  offerPhaseStatus: string;
  progressCount: number;
  startDate: string;
  endDate: string;
  modifyDate: string;
}

interface OrderTargetDetail {
  order: Order;
  offer: Offer;
  offerPhases: OfferPhase[];
}

interface ReportImages {
  reportImageID: string;
  imageURL: string;
  imageNote?: string;
}

interface ReportDetail {
  reportID: string;
  reporter: string;
  targetID: string;
  title: string;
  content: string;
  reportType: string;
  reportStatus: string;
  createdAt: string;
  resolver?: string;
  processNote?: string;
  resolvedAt?: string;
  reportImages: ReportImages[];
  targetDetail?:
    | ShippingTargetDetail
    | PostTargetDetail
    | OrderTargetDetail
    | null;
}

interface StaffReportDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reportDetail: ReportDetail | null;
  loading: boolean;
}

export default function StaffReportDetailDialog({
  isOpen,
  onClose,
  reportDetail,
  loading,
}: StaffReportDetailDialogProps) {
  if (!reportDetail && !loading) return null;

  const renderTargetDetail = () => {
    if (!reportDetail?.targetDetail) {
      if (reportDetail?.reportType === "PaymentReport") {
        return <PaymentReportDetail />;
      }
      return null;
    }

    switch (reportDetail.reportType) {
      case "ShippingReport":
        return (
          <ShippingReportDetail
            targetDetail={reportDetail.targetDetail as ShippingTargetDetail}
          />
        );
      case "PostReport":
        return (
          <PostReportDetail
            targetDetail={reportDetail.targetDetail as PostTargetDetail}
          />
        );
      case "OrderReport":
        return (
          <OrderReportDetail
            targetDetail={reportDetail.targetDetail as OrderTargetDetail}
          />
        );
      case "PaymentReport":
        return <PaymentReportDetail />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[1200px] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            Chi tiết báo cáo vi phạm
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Đang tải...</span>
          </div>
        ) : reportDetail ? (
          <div className="space-y-6 py-2 grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              <ReportBasicInfo reportDetail={reportDetail} />
              <ReportResolutionInfo reportDetail={reportDetail} />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {renderTargetDetail()}
              <ReportImages reportImages={reportDetail.reportImages} />
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
