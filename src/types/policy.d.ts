interface PolicyRule {
    benefitID: string
    benefitType: string
    title: string
    customerScoreChange: number
    designerScoreChange: number
    customerCompensationRate: number
    designerCompensationRate: number
    version: number
    createdAt: string
}

interface PolicyCategory {
    id: string
    name: string
    rules: PolicyRule[]
}
