"use client"

import { Table } from "@tanstack/react-table"
import { X } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
    filterableColumns?: {
        id: string
        title: string
        options: {
            label: string
            value: string
        }[]
    }[]
    searchField?: string
    globalFilter: string
    setGlobalFilter: (value: string) => void
}

export function DataTableToolbar<TData>({
    table,
    filterableColumns = [],
    searchField,
    globalFilter,
    setGlobalFilter,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0 || globalFilter !== ""

    return (
        <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-1 items-center space-x-2">
                {searchField && (
                    <Input
                        placeholder={`Search by ${searchField}...`}
                        value={globalFilter}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                        className="h-8 w-[150px] lg:w-[250px]"
                    />
                )}
                {filterableColumns.map(
                    (column) =>
                        table.getColumn(column.id) && (
                            <DataTableFacetedFilter
                                key={column.id}
                                column={table.getColumn(column.id)}
                                title={column.title}
                                options={column.options}
                            />
                        )
                )}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => {
                            table.resetColumnFilters()
                            setGlobalFilter("")
                        }}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <DataTableViewOptions table={table} />
        </div>
    )
}
