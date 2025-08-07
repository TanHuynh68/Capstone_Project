interface PolicyRule {
    id: string;
    category: string;
    scenario: string;
    description: string;
    customerScore: number;
    designerScore: number;
    customerCompensation: number;
    designCompensation: number;
}

interface PolicyCategory {
    id: string;
    name: string;
    rules: PolicyRule[];
}
