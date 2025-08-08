"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Star, Trophy, Calendar, User } from "lucide-react";
import { formatFullDateWithDistance2 } from "@/utils";
import ReputationService from "@/services/ReputationService";

interface ViewReputationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  accountID: string;
  accountName: string;
}

export default function ViewReputationDialog({
  isOpen,
  onClose,
  accountID,
  accountName,
}: ViewReputationDialogProps) {
  const [reputation, setReputation] = useState<Reputation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { staffGetReputation } = ReputationService();
  const fetchReputation = async () => {
    if (!accountID) return;

    setLoading(true);
    setError(null);

    try {
      const response = await staffGetReputation(accountID);

      const items = response.responseRequestModel;
      if (items) {
        setReputation(items);
      } else {
        setError("Không tìm thấy thông tin reputation");
      }
    } catch (error) {
      console.error("Error fetching reputation:", error);
      setError("Lỗi khi tải thông tin reputation");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && accountID) {
      fetchReputation();
    }
  }, [isOpen, accountID]);

  const getLevelColor = (level: number) => {
    if (level >= 5) return "bg-gradient-to-r from-yellow-400 to-orange-500";
    if (level >= 3) return "bg-gradient-to-r from-blue-400 to-purple-500";
    if (level >= 1) return "bg-gradient-to-r from-green-400 to-blue-500";
    return "bg-gradient-to-r from-gray-400 to-gray-500";
  };

  const getLevelText = (level: number) => {
    if (level >= 5) return "Chuyên gia";
    if (level >= 3) return "Thành thạo";
    if (level >= 1) return "Tốt";
    return "Mới bắt đầu";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Thông tin Reputation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-600">Đang tải thông tin...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-500 mb-2">{error}</div>
              <p className="text-gray-500 text-sm">
                Vui lòng thử lại sau hoặc liên hệ quản trị viên
              </p>
            </div>
          ) : reputation ? (
            <>
              {/* User Info Card */}
              <Card className="shadow-sm border-gray-200">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    Thông tin người dùng
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {reputation.accountName}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Tài khoản: {accountName}
                      </p>
                    </div>
                    <Badge
                      className={`px-3 py-1 text-white font-medium ${getLevelColor(
                        reputation.level
                      )}`}
                    >
                      Level {reputation.level} -{" "}
                      {getLevelText(reputation.level)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Reputation Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current Score */}
                <Card className="shadow-sm border-gray-200">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Star className="h-5 w-5 text-green-600" />
                      Điểm hiện tại
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div
                        className={`text-4xl font-bold ${getScoreColor(
                          reputation.currentScore
                        )}`}
                      >
                        {reputation.currentScore}
                      </div>
                      <p className="text-gray-500 text-sm mt-2">
                        Điểm reputation
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Last Updated */}
                <Card className="shadow-sm border-gray-200">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-purple-600" />
                      Cập nhật lần cuối
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-800">
                        {formatFullDateWithDistance2(reputation.updatedAt)}
                      </div>
                      <p className="text-gray-500 text-sm mt-2">
                        Thời gian cập nhật
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Level Progress */}
              <Card className="shadow-sm border-gray-200">
                <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-t-lg">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                    Tiến độ Level
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">
                        Level {reputation.level}
                      </span>
                      <span className="text-sm text-gray-500">
                        {reputation.currentScore} điểm
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${getLevelColor(
                          reputation.level
                        )}`}
                        style={{
                          width: `${Math.min(
                            (reputation.currentScore / 100) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0</span>
                      <span>100</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Không có dữ liệu reputation</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
