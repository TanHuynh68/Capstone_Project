"use client"

import DashboardService from "@/services/DashboardService"
import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"

interface Staff {
  accountID: string
  fullName: string
  phoneNumber: string
  email: string
  genderDisplay: string
  roleDisplay: string
  isActive: boolean
  isVerify: boolean
  createdAt: string
}

interface StaffFilters {
  fullName: string
  page: number
  size: number
}

interface CreateStaffRequest {
  fullName: string
  phoneNumber: string
  email: string
  password: string
  confirmPassword: string
  gender: string
  role: string
}

export function useStaffManagement() {
  const [staffs, setStaffs] = useState<Staff[]>([])
  const [loading, setLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [refreshTrigger, setRefreshTrigger] = useState(0) // Thêm trigger để force refresh

  const { adminGetStaffs, adminChangeActiveStaff, createStaff } = DashboardService()

  const [filters, setFilters] = useState<StaffFilters>({
    fullName: "",
    page: 1,
    size: 10,
  })

  const fetchStaffs = useCallback(async () => {
    setLoading(true)
    try {
      const response = await adminGetStaffs(filters)
      if (response) {
        const newStaffs = [...response?.responseRequestModel?.responseList?.items]
        setStaffs(newStaffs)
        setTotalPages(response?.responseRequestModel?.responseList?.totalPages)
        setTotalElements(response?.responseRequestModel?.responseList?.totalItems)
      }
    } catch (error) {
      toast.error("Không thể tải danh sách nhân viên")
      console.error("Error fetching staffs:", error)
    } finally {
      setLoading(false)
    }
  }, [filters, adminGetStaffs, refreshTrigger]) // Thêm refreshTrigger vào dependency

  const createNewStaff = async (staffData: CreateStaffRequest) => {
    try {
      const response = await createStaff(staffData)
      if (response && response.isSuccess) {
        toast.success("Tạo tài khoản nhân viên thành công!")
        setRefreshTrigger((prev) => prev + 1) // Trigger refresh
        return response
      }
      return null
    } catch (error) {
      toast.error("Không thể tạo tài khoản nhân viên")
      console.error("Error creating staff:", error)
      return null
    }
  }

  const updateStaffActive = async (accountID: string, isActive: boolean) => {
    console.log("Updating staff active:", accountID, isActive)
    try {
      const response = await adminChangeActiveStaff({ accountID, isActive })
      if (response && response.responseRequestModel) {
        toast.success(`${isActive ? "Kích hoạt" : "Vô hiệu hóa"} tài khoản thành công!`)
        setRefreshTrigger((prev) => prev + 1) // Trigger refresh
        window.location.reload()
        return response.responseRequestModel
      }
      return null
    } catch (error) {
      toast.error("Không thể cập nhật trạng thái tài khoản")
      console.error("Error updating staff active status:", error)
      return null
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
    refreshTrigger, // Export trigger để component có thể sử dụng
  }
}
