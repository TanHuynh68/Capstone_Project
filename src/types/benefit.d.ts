interface Benefit {
    benefitID: string;
    benefitType: string;
    title: string;
    description?: string;
    version: number;
    createdAt: string;
    isActive: boolean;
    customerScoreChange: number;
    designerScoreChange: number;
    customerCompensationRate: number;
    designerCompensationRate: number;
    listVersion?: Array<{
        benefitID: string;
        version: number;
        createdAt: string;
    }>;
}

interface CreateBenefitRequest {
    benefitType: number;
    title: string;
    description: string;
    customerScoreChange: string;
    designerScoreChange: string;
    customerCompensationRate: string;
    designerCompensationRate: string;
}

interface BenefitFilters {
    title: string;
    benefitType?: number;
    page: number;
    size: number;
}

enum BenefitType {
    General = 0,
    Deposit = 1,
    Delivery = 2,
    Penalty = 3,
    Warranty = 4,
}
