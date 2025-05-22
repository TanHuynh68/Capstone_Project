"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { MESSAGE } from "@/constants/message";
import StaffService from "@/services/StaffService";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import ChangeActiveUserButton from "../change-active-user";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { formatFullDateWithDistance2 } from "@/components/utils/date";

interface User {
  accountID: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  genderDisplay: string;
  roleDisplay?: string;
  isActive: boolean;
  isVerify: boolean;
  createdAt: string;
}

const ROLES = [
  { value: "0", label: "Khách hàng" },
  { value: "1", label: "Nhà thiết kế" },
];

const PAGE_SIZE = 10;

const ManagerUsersByStaff: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("0");

  const { getUserByStaff } = StaffService();

  const fetchUsers = useCallback(
    async (params?: {
      showToast?: boolean;
      searchName?: string;
      currentPage?: number;
    }) => {
      setLoading(true);
      try {
        const query = {
          fullName: params?.searchName || fullName || undefined,
          role: role === "all" ? undefined : Number(role),
          page: params?.currentPage || page,
          size: PAGE_SIZE,
        };

        const res = await getUserByStaff(query);
        const items = res?.responseRequestModel?.responseList?.items || [];
        const total = res?.responseRequestModel?.responseList?.totalPages || 1;

        setUsers(items);
        setTotalPages(total);

        // if (params?.showToast) toast.success(MESSAGE.GET_USERS_SUCCESSFULLY);
      } catch {
        toast.error(MESSAGE.GET_USERS_FAILED);
      } finally {
        setLoading(false);
      }
    },
    [getUserByStaff, fullName, role, page]
  );

  useEffect(() => {
    fetchUsers();
  }, [page, role]);

  const highlightMatch = (text: string, keyword: string) => {
    if (!text || !keyword) return text;
    const parts = text.split(new RegExp(`(${keyword})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 text-black px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <h2 className="text-xl font-semibold">Quản lý người dùng</h2>
        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <div className="relative w-full max-w-xs">
            <Input
              placeholder="Nhập họ tên để tìm kiếm"
              value={fullName}
              className="pl-10"
              onChange={(e) => setFullName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setPage(1);
                  fetchUsers({
                    showToast: true,
                    searchName: e.currentTarget.value,
                    currentPage: 1,
                  });
                }
              }}
            />
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
              size={18}
              onClick={() => {
                setPage(1);
                fetchUsers({
                  showToast: true,
                  searchName: fullName,
                  currentPage: 1,
                });
              }}
            />
          </div>

          <Select
            value={role}
            onValueChange={(val) => {
              setRole(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn vai trò người dùng" />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-5 w-[60px]" />
              <Skeleton className="h-5 w-[200px]" />
              <Skeleton className="h-5 w-[200px]" />
              <Skeleton className="h-5 w-[150px]" />
              <Skeleton className="h-5 w-[100px]" />
              <Skeleton className="h-5 w-[100px]" />
            </div>
          ))}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px] text-center">STT</TableHead>
              <TableHead className="text-center">Họ tên</TableHead>
              <TableHead className="text-center">Email</TableHead>
              <TableHead className="text-center">Số điện thoại</TableHead>
              <TableHead className="text-center">Giới tính</TableHead>
              <TableHead className="text-center">Vai trò</TableHead>
              <TableHead className="text-center">Ngày tạo</TableHead>
              <TableHead className="text-center">Xác minh email</TableHead>
              <TableHead className="text-center">Trạng thái</TableHead>
              <TableHead className="text-center">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={user.accountID}>
                <TableCell className="text-center">
                  {(page - 1) * PAGE_SIZE + index + 1}
                </TableCell>
                <TableCell className="text-center">
                  {highlightMatch(user.fullName, fullName)}
                </TableCell>

                <TableCell className="text-center">{user.email}</TableCell>
                <TableCell className="text-center">
                  {user.phoneNumber}
                </TableCell>
                <TableCell className="text-center">
                  {user.genderDisplay === "Male"
                    ? "Nam"
                    : user.genderDisplay === "Female"
                    ? "Nữ"
                    : "Khác"}
                </TableCell>
                <TableCell className="text-center">
                  {user.roleDisplay === "Customer"
                    ? "Khách hàng"
                    : user.roleDisplay === "Designer"
                    ? "Nhà thiết kế"
                    : "Không rõ"}
                </TableCell>
                <TableCell className="text-center">
                  {formatFullDateWithDistance2(user.createdAt)}
                </TableCell>
                <TableCell className="text-center">
                  {user.isVerify ? (
                    <span className="text-green-600 font-medium">
                      Đã xác minh
                    </span>
                  ) : (
                    <span className="text-red-500">Chưa xác minh</span>
                  )}
                </TableCell>

                <TableCell className="text-center">
                  {user.isActive ? (
                    <span className="text-green-600 text-center">
                      Hoạt động
                    </span>
                  ) : (
                    <span className="text-red-500 text-center">Tạm khóa</span>
                  )}
                </TableCell>

                <TableCell className="text-center">
                  <ChangeActiveUserButton
                    accountID={user.accountID}
                    isActive={user.isActive}
                    onSuccess={fetchUsers}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="flex justify-center pt-4">
        <Pagination>
          <PaginationContent>
            {/* Icon lùi trang */}
            <PaginationItem>
              <button
                onClick={() => page > 1 && setPage(page - 1)}
                disabled={page <= 1}
                className={`p-2 rounded-full hover:bg-gray-100 transition ${
                  page <= 1 ? "opacity-30 pointer-events-none" : ""
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </PaginationItem>

            {/* Các số trang */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    onClick={() => setPage(pageNum)}
                    isActive={pageNum === page}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            {/* Icon tiến trang */}
            <PaginationItem>
              <button
                onClick={() => page < totalPages && setPage(page + 1)}
                disabled={page >= totalPages}
                className={`p-2 rounded-full hover:bg-gray-100 transition ${
                  page >= totalPages ? "opacity-30 pointer-events-none" : ""
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default ManagerUsersByStaff;
