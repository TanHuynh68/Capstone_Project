"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Flag } from "lucide-react";
import DateDisplay from "@/components/atoms/post/post-detail/DateDisplay";
import UserInfo from "@/components/molecules/post/post-detail/UserInfo";
import StatusBadge from "@/components/atoms/post/post-list/StatusBadge";
import { Breadcrumb } from "../../custom/breadcrumb/Breadcrumb";
import type { ReportFormData } from "@/schemas/report/reportSchema";
import ReportDialog from "@/components/molecules/customer-and-designer/report/ReportDialog";
import CustomerReportService from "@/services/CustomerReportService";
interface PostDetailHeaderProps {
  post: Post;
  onBack?: () => void;
  className?: string;
}

export default function PostDetailHeader({
  post,
  className = "",
}: PostDetailHeaderProps) {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const { createReport } = CustomerReportService();

  const items = [
    { href: "/", title: "Trang chủ" },
    { href: "/post", title: "Bài đăng" },
    { href: "", title: "Bài đăng chi tiết" },
  ];

  const handleReportSubmit = async (data: ReportFormData): Promise<boolean> => {
    const response = await createReport({
      ...data,
      targetID: post.projectPostID,
      reportType: 2, // Post report type
    });
    return response;
  };

  return (
    <>
      <div
        className={`bg-card text-card-foreground rounded-lg shadow-sm border p-6 ${className}`}
      >
        {/* Navigation và Actions */}
        <div className="flex items-center justify-between mb-6">
          <Breadcrumb items={items} />
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsReportDialogOpen(true)}
              className="hover:bg-red-50 hover:text-red-600"
            >
              <Flag className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Thông tin chính */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {post.title}
              </h1>
              <StatusBadge status={post.postStatus} />
            </div>
          </div>

          {/* Thông tin người đăng */}
          <UserInfo
            fullName={post.fullName}
            avatar={post.avatar}
            accountID={post.accountID}
          />

          {/* Thông tin thời gian */}
          <div className="flex flex-wrap gap-6">
            <DateDisplay
              date={post.createdAt}
              label="Ngày tạo"
              icon="calendar"
            />
            <DateDisplay
              date={post.finishDate}
              label="Ngày hoàn thành:"
              icon="clock"
            />
          </div>
        </div>
      </div>

      {/* Report Dialog */}
      <ReportDialog
        isOpen={isReportDialogOpen}
        onClose={() => setIsReportDialogOpen(false)}
        targetID={post.projectPostID}
        defaultReportType={1}
        onSubmit={handleReportSubmit}
      />
    </>
  );
}
