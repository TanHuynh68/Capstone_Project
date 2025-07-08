"use client";

import React, { useCallback, useEffect, useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { MESSAGE } from "@/constants/message";
import StaffService from "@/services/StaffService";
import ChangeActiveUserButton from "../change-active-user";
import { Search } from "lucide-react";
import { formatFullDateWithDistance2 } from "@/utils/date";
import {
  DataTable,
  Column,
} from "@/components/organisms/manager-withdrawal-by-staff";
import {
  getGenderBadge,
  getRoleBadge,
  getUserStatusBadge,
} from "@/utils/badge-utils";

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
  const [role, setRole] = useState("0");
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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
          fullName: params?.searchName || searchTerm || undefined,
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
    [getUserByStaff, searchTerm, role, page]
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

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    const keyword = searchTerm.trim().toLowerCase();
    return users.filter((user) =>
      Object.values(user).some((value) =>
        String(value).toLowerCase().includes(keyword)
      )
    );
  }, [users, searchTerm]);

  const columns: Column<User>[] = [
    {
      header: "STT",
      className: "text-center w-12",
      cell: (_row: User, index?: number) => (
        <span>
          {index !== undefined ? index + 1 + (page - 1) * PAGE_SIZE : ""}
        </span>
      ),
    },
    {
      header: "Họ tên",
      accessorKey: "fullName",
      sortable: true,
      className: "text-center",
      cell: (row) => highlightMatch(row.fullName, searchTerm),
    },
    {
      header: "Email",
      accessorKey: "email",
      sortable: true,
      className: "text-center",
      cell: (row) => highlightMatch(row.email, searchTerm),
    },
    {
      header: "Số điện thoại",
      accessorKey: "phoneNumber",
      sortable: true,
      className: "text-center",
      cell: (row) => highlightMatch(row.phoneNumber, searchTerm),
    },
    {
      header: "Giới tính",
      accessorKey: "genderDisplay",
      className: "text-center",
      cell: (row) => getGenderBadge(row.genderDisplay),
    },
    {
      header: "Vai trò",
      accessorKey: "roleDisplay",
      className: "text-center",
      cell: (row) => getRoleBadge(row.roleDisplay || ""),
    },
    {
      header: "Ngày tạo",
      accessorKey: "createdAt",
      sortable: true,
      className: "text-center",
      cell: (row) => formatFullDateWithDistance2(row.createdAt),
    },
    {
      header: "Xác minh email",
      accessorKey: "isVerify",
      className: "text-center",
      cell: (row) =>
        getUserStatusBadge(row.isVerify ? "Verified" : "Unverified"),
    },
    {
      header: "Trạng thái",
      accessorKey: "isActive",
      className: "text-center",
      cell: (row) => getUserStatusBadge(row.isActive),
    },
    {
      header: "Thao tác",
      accessorKey: "accountID",
      className: "text-center",
      cell: (row) => (
        <ChangeActiveUserButton
          accountID={row.accountID}
          isActive={row.isActive}
          onSuccess={fetchUsers}
        />
      ),
    },
  ];

  return (
    <div className="px-4 space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-end">
        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <div className="relative w-full max-w-xs">
            <Input
              placeholder="Tìm theo tên, email, số điện thoại..."
              className="pl-10"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSearchTerm(searchInput);
                  setPage(1);
                }
              }}
            />
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
              size={18}
              onClick={() => {
                setSearchTerm(searchInput);
                setPage(1);
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

      <DataTable
        columns={columns}
        data={filteredUsers}
        loading={loading}
        emptyMessage="Không có người dùng nào."
        pagination={{ currentPage: page, totalPages, onPageChange: setPage }}
        getRowId={(row) => row.accountID}
      />
    </div>
  );
};

export default ManagerUsersByStaff;
