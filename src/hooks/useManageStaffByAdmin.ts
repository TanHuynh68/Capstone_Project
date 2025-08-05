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

  console.log("staffs: ", staffs)

  const fetchStaffs = useCallback(async () => {
    setLoading(true)
    try {
      const response = await adminGetStaffs(filters)
      if (response) {
        const newStaffs = [...response?.responseRequestModel?.responseList?.items]
        setStaffs(newStaffs)
        setTotalPages(response?.responseRequestModel?.responseList?.totalPages)
        setTotalElements(response?.responseRequestModel?.responseList?.totalItems)
        console.log("Fetched staffs:", newStaffs)
      }
    } catch (error) {
      toast.error("Không thể tải danh sách nhân viên")
      console.error("Error fetching staffs:", error)
    } finally {
      setLoading(false)
    }
  }, [filters, adminGetStaffs, refreshTrigger]) // Thêm refreshTrigger vào dependency

  const createNewStaff = async (staffData: CreateStaffRequest): Promise<boolean> => {
    try {
      await createStaff(staffData)
      toast.success("Tạo tài khoản nhân viên thành công!")
      setRefreshTrigger((prev) => prev + 1) // Trigger refresh
      return true
    } catch (error) {
      toast.error("Không thể tạo tài khoản nhân viên")
      console.error("Error creating staff:", error)
      return false
    }
  }

  const updateStaffActive = async (accountID: string, isActive: boolean) => {
    console.log("Updating staff active:", accountID, isActive)

    try {
      const response = await adminChangeActiveStaff({ accountID, isActive })
      if (response && response.responseRequestModel) {
        console.log("updateStaffActive response: ", response)

        // Cập nhật state ngay lập tức
        setStaffs((prevStaffs) => {
          const updatedStaffs = prevStaffs.map((staff) =>
            staff.accountID === accountID ? { ...staff, isActive: isActive } : staff,
          )
          console.log("Updated staffs state:", updatedStaffs)
          return updatedStaffs
        })

        toast.success(`${isActive ? "Kích hoạt" : "Vô hiệu hóa"} tài khoản thành công!`)

        // Force refresh sau một khoảng thời gian ngắn
        setTimeout(() => {
          setRefreshTrigger((prev) => prev + 1)
        }, 100)
      }
    } catch (error) {
      toast.error("Không thể cập nhật trạng thái tài khoản")
      console.error("Error updating staff active status:", error)

      // Nếu có lỗi, force refresh để đảm bảo UI đúng
      setRefreshTrigger((prev) => prev + 1)
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
