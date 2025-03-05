export interface Lender {
  id: string;
  name: string;
  logo?: string;
  logoFile?: File;
  websiteLink: string;
  phone: string;
  email: string;
  minRate: number;
  maxRate: number;
  minLoan: number;
  maxLoan: number;
  minTerm: number;
  maxTerm: number;
  minAge: number;
  maxAge: number;
  minLoanProcessingTime: number;
  maxLoanProcessingTime: number;
  minDecisionTime: number;
  maxDecisionTime: number;
  minTradingPeriod: number;
  maxLoanToValue: number;
  personalGuarantee: boolean;
  earlyRepaymentCharges: boolean;
  interestTreatment: string;
  coveredLocation: string[];
  loanTypes: LoanType[];
  criteriaSheets: CriteriaSheet[];
  additionalInfo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CriteriaSheet {
  id: string;
  name: string;
  file?: File;
  url: string;
  uploadDate: Date;
}

export type LoanType = 
  | 'Business Loans'
  | 'Invoice Finance'
  | 'Trade Finance'
  | 'Asset Finance'
  | 'Commercial Mortgages'
  | 'Bridging Loans'
  | 'BTL Mortgages'
  | 'Development Finance';

export interface FilterOptions {
  minLoan?: number;
  maxLoan?: number;
  minRate?: number;
  maxRate?: number;
  minTerm?: number;
  maxTerm?: number;
  maxLTV?: number;
  loanTypes?: LoanType[];
  searchTerm?: string;
  location?: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  is_admin: boolean;
  created_at: Date;
  last_login: Date | null;
}

export type AuthUser = Omit<User, 'password'> | null;