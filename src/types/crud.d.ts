interface CrudService<T> {
    getAll: (params?: any) => Promise<{ data: T[]; total: number }>
    getById: (id: string | number) => Promise<T>
    create: (data: Partial<T>) => Promise<T>
    update: (id: string | number, data: Partial<T>) => Promise<T>
    delete: (id: string | number) => Promise<void>
}

interface FormField {
    name: string
    label: string
    type: 'text' | 'number' | 'email' | 'password' | 'textarea' | 'select' | 'date' | 'checkbox'
    placeholder?: string
    required?: boolean
    options?: { label: string; value: string | number }[],
    description: string
    validation?: {
        required?: string
        min?: number
        max?: number
        minLength?: number
        maxLength?: number
        pattern?: {
            value: RegExp
            message: string
        }
    },
}

interface CrudManagerProps<T> {
    service: CrudService<T>
    columns: ColumnDef<T, any>[]
    title: string
    formFields: FormField[]
    idField?: string
    searchField?: string
    filterableColumns?: {
        id: string
        title: string
        options: {
            label: string
            value: string
        }[]
    }[]
    onSuccess?: () => void
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    onAdd?: () => void
    searchField?: string
    filterableColumns?: {
        id: string
        title: string
        options: {
            label: string
            value: string
        }[]
    }[]
    isLoading?: boolean
    pageCount?: number
    onPaginationChange?: (page: number, pageSize: number) => void
    title?: string
}

interface EntityFormProps {
    fields: FormField[]
    onSubmit: (data: any) => void
    initialData?: any | null
    isLoading?: boolean
    title?: string
}

interface DataTableFacetedFilterProps<TData, TValue> {
    column?: Column<TData, TValue>
    title?: string
    options: {
        label: string
        value: string
    }[]
}