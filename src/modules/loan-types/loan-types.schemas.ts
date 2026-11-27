import { z } from 'zod';

export const loanTypeSlugSchema = z.object({
  slug: z.string({ error: 'Indica un tipo de préstamo.' }).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'El tipo de préstamo no es válido.').max(80),
});

export interface LoanTypeSummaryResponse {
  slug: string;
  title: string;
  icon: string;
  summary: string;
}

export interface LoanTypeQuestionResponse {
  question: string;
  answer: string;
}

export interface RelatedLoanTypeResponse {
  slug: string;
  title: string;
}

export interface LoanTypeLenderResponse {
  id: string;
  name: string;
  initials: string;
  minAmount: number;
  maxAmount: number;
  minTermDays: number;
  maxTermDays: number;
  minAge: number;
  maxAge: number;
  firstLoanFree: boolean;
  acceptsAsnef: boolean;
  noPayslip: boolean;
  responseMinutes: number;
  recommended: boolean;
}

export interface LoanTypeResponse extends LoanTypeSummaryResponse {
  subtitle: string;
  tags: string[];
  criterion: string;
  requirements: string[];
  advantages: string[];
  disadvantages: string[];
  questions: LoanTypeQuestionResponse[];
  related: RelatedLoanTypeResponse[];
  metaTitle: string;
  metaDescription: string;
  lenders: LoanTypeLenderResponse[];
}
