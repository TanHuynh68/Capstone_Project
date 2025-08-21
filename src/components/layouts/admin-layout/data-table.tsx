"use client";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  CheckCircle2Icon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ColumnsIcon,
  MoreVerticalIcon,
  PlusIcon,
  XCircleIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useStaffManagement } from "@/hooks/useManageStaffByAdmin";
import { CreateStaffForm } from "@/components/organisms/staff/create-staff";

interface Staff {
  accountID: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  genderDisplay: string;
  roleDisplay: string;
  isActive: boolean;
  isVerify: boolean;
  createdAt: string;
}

// Component riêng cho Actions Menu để tránh re-render toàn bộ table
function StaffActionsMenu({ staff }: { staff: Staff }) {
  const { updateStaffActive } = useStaffManagement();
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleToggleActive = async () => {
    setIsUpdating(true);
    const response = await updateStaffActive(staff.accountID, !staff.isActive);
    if (response && response.accountID ) {
      console.log('handleToggleActive: ', response)
      setIsUpdating(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          variant="ghost"
          className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
          size="icon"
          disabled={isUpdating}
        >
          <MoreVerticalIcon />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={handleToggleActive} disabled={isUpdating}>
          {isUpdating
            ? "Đang cập nhật..."
            : staff.isActive
            ? "Vô hiệu hóa"
            : "Kích hoạt"}
        </DropdownMenuItem>
        {/* <DropdownMenuSeparator />
        <DropdownMenuItem>Xem chi tiết</DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const createColumns = (): ColumnDef<Staff>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value: any) =>
            table.toggleAllPageRowsSelected(!!value)
          }
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: any) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "fullName",
    header: "Họ và tên",
    cell: ({ row }) => (
      <div className="">
        <div className="font-medium">{row.original.fullName}</div>
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">{row.original.email}</div>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: "Số điện thoại",
    cell: ({ row }) => (
      <div className="text-sm">{row.original.phoneNumber}</div>
    ),
  },
  {
    accessorKey: "genderDisplay",
    header: "Giới tính",
    cell: ({ row }) => (
      <Badge variant="outline" className="px-2 text-xs">
        {row.original.genderDisplay === "Male" ? "Nam" : "Nữ"}
      </Badge>
    ),
  },
  {
    accessorKey: "roleDisplay",
    header: "Vai trò",
    cell: ({ row }) => (
      <Badge variant="secondary" className="px-2 text-xs">
        {row.original.roleDisplay === "Staff" && "Nhân viên"}
      </Badge>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Trạng thái",
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Badge
          variant={row.original.isActive ? "default" : "destructive"}
          className="flex gap-1 px-2 text-xs [&_svg]:size-3"
        >
          {row.original.isActive ? (
            <CheckCircle2Icon className="text-green-500" />
          ) : (
            <XCircleIcon className="text-red-500" />
          )}
          {row.original.isActive ? "Hoạt động" : "Vô hiệu hóa"}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Ngày tạo",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {new Date(row.original.createdAt).toLocaleDateString("vi-VN")}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <StaffActionsMenu staff={row.original} />,
  },
];

export function DataTable() {
  const {
    staffs,
    loading,
    totalPages,
    totalElements,
    filters,
    updateFilters,
    createNewStaff,
    refreshTrigger,
  } = useStaffManagement();

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);

  // Tạo columns mới mỗi khi refreshTrigger thay đổi
  const columns = React.useMemo(() => createColumns(), [refreshTrigger]);

  // Log để debug
  React.useEffect(() => {
    console.log("DataTable re-render, staffs:", staffs);
    console.log("RefreshTrigger:", refreshTrigger);
  }, [staffs, refreshTrigger]);

  const table = useReactTable({
    data: staffs,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    getRowId: (row) => row.accountID,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true,
    pageCount: totalPages,
  });

  const handleCreateStaff = async (data: any) => {
    const success = await createNewStaff(data);
    if (success) {
      setIsCreateDialogOpen(false);
    }
    return success;
  };

  const handleSearchChange = (value: string) => {
    updateFilters({ fullName: value, page: 1 });
  };

  const handlePageChange = (page: number) => {
    updateFilters({ page: page + 1 });
  };

  const handlePageSizeChange = (size: number) => {
    updateFilters({ size, page: 1 });
  };

  return (
    <Tabs
      defaultValue="staff-list"
      className="flex w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Quản lý nhân viên</h1>
          <Badge variant="secondary" className="px-2 py-1">
            {totalElements} nhân viên
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" size="sm">
                <ColumnsIcon />
                <span className="hidden lg:inline">Tùy chỉnh cột</span>
                <span className="lg:hidden">Cột</span>
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value: any) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="default" size="sm">
                <PlusIcon />
                <span className="hidden lg:inline">Thêm nhân viên</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Tạo tài khoản nhân viên mới</DialogTitle>
              </DialogHeader>
              <CreateStaffForm
                onSubmit={handleCreateStaff}
                onSuccess={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <TabsContent
        value="staff-list"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-sm">
            <Input
              placeholder="Tìm kiếm theo tên..."
              value={filters.fullName}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="h-9"
            />
          </div>
        </div>

        {/* Debug info */}
        <div className="text-xs text-muted-foreground">
          Debug: Staffs count: {staffs.length}, Refresh trigger:{" "}
          {refreshTrigger}
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border">
          <Table key={`table-${refreshTrigger}`}>
            <TableHeader className="sticky top-0 z-10 bg-muted">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Đang tải dữ liệu...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={`${row.id}-${refreshTrigger}-${row.original.isActive}`}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={`${cell.id}-${refreshTrigger}`}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Không có dữ liệu.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4">
          <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} trong{" "}
            {totalElements} nhân viên được chọn.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Số dòng mỗi trang
              </Label>
              <Select
                value={`${filters.size}`}
                onValueChange={(value: any) =>
                  handlePageSizeChange(Number(value))
                }
              >
                <SelectTrigger className="w-20" id="rows-per-page">
                  <SelectValue placeholder={filters.size} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Trang {filters.page} trong {totalPages}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex bg-transparent"
                onClick={() => handlePageChange(0)}
                disabled={filters.page === 1}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeftIcon />
              </Button>
              <Button
                variant="outline"
                className="size-8 bg-transparent"
                size="icon"
                onClick={() => handlePageChange(filters.page - 2)}
                disabled={filters.page === 1}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeftIcon />
              </Button>
              <Button
                variant="outline"
                className="size-8 bg-transparent"
                size="icon"
                onClick={() => handlePageChange(filters.page)}
                disabled={filters.page === totalPages}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRightIcon />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex bg-transparent"
                size="icon"
                onClick={() => handlePageChange(totalPages - 1)}
                disabled={filters.page === totalPages}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRightIcon />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
