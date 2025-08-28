"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, RefreshCw, Settings, Filter } from "lucide-react";
import { toast } from "sonner";
import CreateSettingDialog from "@/components/molecules/admin/setting-system/CreateSettingDialog";
import SettingsTable from "@/components/organisms/admin/setting-system/SettingsTable";
import SettingService from "@/services/SettingSerivce";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const { getSettings } = SettingService();

  // Fetch settings
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await getSettings();
      if (response && response.responseRequestModel.responseList) {
        setSettings(response.responseRequestModel.responseList || []);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Filter settings based on search term and type
  const filteredSettings = settings.filter((setting) => {
    const matchesSearch =
      setting.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      setting.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      filterType === "all" ||
      (filterType === "level" && setting.key.toLowerCase().includes("level")) ||
      (filterType === "fee" && setting.key.toLowerCase().includes("fee"));

    return matchesSearch && matchesType;
  });

  const handleRefresh = () => {
    fetchSettings();
    toast.success("Đã làm mới danh sách settings");
  };

  const getStatsData = () => {
    const totalSettings = settings.length;
    const levelSettings = settings.filter((s) =>
      s.key.toLowerCase().includes("level")
    ).length;
    const feeSettings = settings.filter((s) =>
      s.key.toLowerCase().includes("fee")
    ).length;
    const otherSettings = totalSettings - levelSettings - feeSettings;

    return { totalSettings, levelSettings, feeSettings, otherSettings };
  };

  const stats = getStatsData();

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Settings className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Quản lý Cài đặt Hệ thống</h1>
            <p className="text-gray-600">
              Cấu hình và quản lý các thiết lập hệ thống
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
          <CreateSettingDialog onSettingCreated={fetchSettings} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Settings</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSettings}</div>
            <p className="text-xs text-muted-foreground">
              Tất cả settings trong hệ thống
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Level Settings
            </CardTitle>
            <div className="h-4 w-4 bg-blue-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.levelSettings}</div>
            <p className="text-xs text-muted-foreground">
              Cấu hình theo cấp độ người dùng
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fee Settings</CardTitle>
            <div className="h-4 w-4 bg-green-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.feeSettings}</div>
            <p className="text-xs text-muted-foreground">
              Cấu hình phí và hoa hồng
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khác</CardTitle>
            <div className="h-4 w-4 bg-gray-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.otherSettings}</div>
            <p className="text-xs text-muted-foreground">Settings khác</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Danh sách Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo key hoặc mô tả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Lọc theo loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="level">Level Settings</SelectItem>
                <SelectItem value="fee">Fee Settings</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <SettingsTable
            settings={filteredSettings}
            loading={loading}
            onRefresh={fetchSettings}
          />
        </CardContent>
      </Card>
    </div>
  );
}
