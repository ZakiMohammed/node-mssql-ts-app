export interface Summary {
    Department: SummaryDetail;
    Job: SummaryDetail;
}

export interface SummaryDetail {
    Job: string;
    EmployeeCount: number;
    Salary: number;
    Annual: number;
}