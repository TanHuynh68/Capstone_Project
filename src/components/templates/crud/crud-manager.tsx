"use client"

import { useState, useEffect } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"

import { DataTable } from "./data-table"
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { EntityForm } from "./entity-form"
import { Dialog, DialogContent } from "@/components/ui/dialog"



export function CrudManager<T>({
    service,
    columns,
    title,
    formFields,
    idField = "id",
    searchField,
    filterableColumns,
    onSuccess,
}: CrudManagerProps<T>) {
    const [data, setData] = useState<T[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [totalItems, setTotalItems] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
    const [currentItem, setCurrentItem] = useState<T | null>(null)
    const [itemToDelete, setItemToDelete] = useState<T | null>(null)

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const response = await service.getAll({
                page,
                pageSize,
            })
            setData(response.data)
            setTotalItems(response.total)
        } catch (error) {
            console.error("Error fetching data:", error)
            toast.error("Failed to fetch data")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [page, pageSize])

    const handlePaginationChange = (newPage: number, newPageSize: number) => {
        setPage(newPage)
        setPageSize(newPageSize)
    }

    const handleAdd = () => {
        setCurrentItem(null)
        setIsFormDialogOpen(true)
    }

    const handleEdit = (item: T) => {
        setCurrentItem(item)
        setIsFormDialogOpen(true)
    }

    const handleDelete = (item: T) => {
        setItemToDelete(item)
        setIsDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (!itemToDelete) return

        setIsLoading(true)
        try {
            // @ts-ignore - We know that itemToDelete has an id field
            await service.delete(itemToDelete[idField as keyof T])
            toast.success("Item deleted successfully")
            fetchData()
            if (onSuccess) onSuccess()
        } catch (error) {
            console.error("Error deleting item:", error)
            toast.error("Failed to delete item")
        } finally {
            setIsLoading(false)
            setIsDeleteDialogOpen(false)
            setItemToDelete(null)
        }
    }

    const handleFormSubmit = async (formData: any) => {
        setIsLoading(true)
        try {
            if (currentItem) {
                // @ts-ignore - We know that currentItem has an id field
                await service.update(currentItem[idField as keyof T], formData)
                toast.success("Item updated successfully")
            } else {
                await service.create(formData)
                toast.success("Item created successfully")
            }
            fetchData()
            setIsFormDialogOpen(false)
            if (onSuccess) onSuccess()
        } catch (error) {
            console.error("Error saving item:", error)
            toast.error("Failed to save item")
        } finally {
            setIsLoading(false)
        }
    }

    // Add action column to the columns
    const columnsWithActions: ColumnDef<T, any>[] = [
        ...columns,
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const item = row.original
                return (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                handleEdit(item)
                            }}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            Edit
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(item)
                            }}
                            className="text-red-600 hover:text-red-800"
                        >
                            Delete
                        </button>
                    </div>
                )
            },
        },
    ]

    return (
        <div className="container mx-auto py-6">
            <DataTable
                columns={columnsWithActions}
                data={data}
                onAdd={handleAdd}
                searchField={searchField}
                filterableColumns={filterableColumns}
                isLoading={isLoading}
                pageCount={Math.ceil(totalItems / pageSize)}
                onPaginationChange={handlePaginationChange}
                title={title}
            />

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the selected item.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Create/Edit Form Dialog */}
            <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <EntityForm
                        fields={formFields}
                        onSubmit={handleFormSubmit}
                        initialData={currentItem}
                        isLoading={isLoading}
                        title={currentItem ? `Edit ${title}` : `Add New ${title}`}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}
