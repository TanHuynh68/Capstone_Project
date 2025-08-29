interface SystemSetting {
    settingId: string
    key: string
    value: number
    description: string
    createdAt: string
    updatedAt: string
}

interface CreateSettingRequest {
    key: string
    value: number
    description: string
}

interface UpdateSettingRequest {
    settingId: string
    value: number
    description: string
}

interface SettingsResponse {
    data: SystemSetting[]
    total: number
    page: number
    limit: number
}
