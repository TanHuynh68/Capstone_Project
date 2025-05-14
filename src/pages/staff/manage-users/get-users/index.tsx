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
import { User } from "@/types/user";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import ChangeActiveUserButton from "../change-active-user";

const ROLES = [
  // { value: "all", label: "Tất cả" },
  { value: "0", label: "Customer" },
  { value: "1", label: "Designer" },
];

const PAGE_SIZE = 10;

const ManagerUsersByStaff: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("all");

  const { getUserByStaff } = StaffService();

  const fetchUsers = useCallback(
    async (showToast: boolean = false) => {
      setLoading(true);
      try {
        const query = {
          fullName: fullName || undefined,
          role: role === "all" ? undefined : Number(role),
          page,
          size: PAGE_SIZE,
        };

        // console.log("🔍 Query gửi đi:", query);

        const res = await getUserByStaff(query);
        const items = res?.responseRequestModel?.responseList?.items || [];
        const total = res?.responseRequestModel?.responseList?.totalPages || 1;

        setUsers(items);
        setTotalPages(total);

        if (showToast) toast.success(MESSAGE.GET_USERS_SUCCESSFULLY);
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
  }, [page, role, fetchUsers]);

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <h2 className="text-xl font-semibold">Quản lý người dùng</h2>
        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <Input
            placeholder="Tìm theo tên"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setPage(1);
                fetchUsers(true);
              }
            }}
          />
          <Select
            value={role}
            onValueChange={(val) => {
              setRole(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn vai trò" />
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
              <TableHead>Họ tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>SĐT</TableHead>
              <TableHead>Giới tính</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={user.accountID}>
                <TableCell className="text-center">
                  {(page - 1) * PAGE_SIZE + index + 1}
                </TableCell>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>
                  {user.genderDisplay === "Male"
                    ? "Nam"
                    : user.genderDisplay === "Female"
                    ? "Nữ"
                    : "Khác"}
                </TableCell>
                <TableCell>
                  {user.isActive ? (
                    <span className="text-green-600">Hoạt động</span>
                  ) : (
                    <span className="text-red-500">Tạm khóa</span>
                  )}
                </TableCell>
                <TableCell>
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
            <PaginationItem>
              <PaginationPrevious
                onClick={() => page > 1 && setPage(page - 1)}
                className={page <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
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
            <PaginationItem>
              <PaginationNext
                onClick={() => page < totalPages && setPage(page + 1)}
                className={
                  page >= totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default ManagerUsersByStaff;
