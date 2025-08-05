"use client"

import DashboardService from "@/services/DashboardService"
import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"

export function useStaffManagement() {
  const [staffs, setStaffs] = useState<Staff[]>([])
  const [loading, setLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
    const  {adminGetStaffs, adminChangeActiveStaff , createStaff} = DashboardService()
  const [filters, setFilters] = useState<StaffFilters>({
    fullName: "",
    page: 1,
    size: 10,
  })

  const fetchStaffs = useCallback(async () => {
    setLoading(true)
    try {
      const response = await adminGetStaffs(filters)
      setStaffs(response.data)
      setTotalPages(response.totalPages)
      setTotalElements(response.totalElements)
    } catch (error) {
      toast.error("Không thể tải danh sách nhân viên")
      console.error("Error fetching staffs:", error)
    } finally {
      setLoading(false)
    }
  }, [filters])

  const createNewStaff = async (staffData: CreateStaffRequest): Promise<boolean> => {
    try {
      await createStaff(staffData)
      toast.success("Tạo tài khoản nhân viên thành công!")
      await fetchStaffs() // Refresh the list
      return true
    } catch (error) {
      toast.error("Không thể tạo tài khoản nhân viên")
      console.error("Error creating staff:", error)
      return false
    }
  }

  const updateStaffActive = async (accountID: string, isActive: boolean): Promise<boolean> => {
    try {
      await adminChangeActiveStaff({ accountID, isActive })
      toast.success(`${isActive ? "Kích hoạt" : "Vô hiệu hóa"} tài khoản thành công!`)
      await fetchStaffs() // Refresh the list
      return true
    } catch (error) {
      toast.error("Không thể cập nhật trạng thái tài khoản")
      console.error("Error updating staff active status:", error)
      return false
    }
  }

  const updateFilters = (newFilters: Partial<StaffFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const resetFilters = () => {
    setFilters({
      fullName: "",
      page: 1,
      size: 10,
    })
  }

  useEffect(() => {
    fetchStaffs()
  }, [fetchStaffs])

  return {
    staffs,
    loading,
    totalPages,
    totalElements,
    filters,
    updateFilters,
    resetFilters,
    createNewStaff,
    updateStaffActive,
    refetch: fetchStaffs,
  }
}
