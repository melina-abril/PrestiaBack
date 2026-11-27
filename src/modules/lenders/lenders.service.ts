import { BusinessRuleError } from '../../shared/errors/http-errors.js';
import { toPageResponse, type PageResponse } from '../../shared/http/page.js';
import { lendersRepository, type Lender } from './lenders.repository.js';
import type { LenderListQuery, LenderResponse } from './lenders.schemas.js';

/** Interés al euro más cercano, con los 0,50 € hacia arriba. */
const interest = (amount: number, days: number): number => Math.floor(amount * 0.01 * days + 0.5);

const totals = (lender: Lender, amount: number, termDays: number): { totalNew: number; totalReturning: number } => ({
  totalNew: amount + interest(amount, lender.firstLoanFree ? Math.max(0, termDays - 30) : termDays),
  totalReturning: amount + interest(amount, termDays),
});

const toResponse = (lender: Lender, amount?: number, termDays?: number): LenderResponse => ({
  id: lender.id,
  name: lender.name,
  initials: lender.initials,
  minAmount: lender.minAmount,
  maxAmount: lender.maxAmount,
  minTermDays: lender.minTermDays,
  maxTermDays: lender.maxTermDays,
  minAge: lender.minAge,
  maxAge: lender.maxAge,
  firstLoanFree: lender.firstLoanFree,
  acceptsAsnef: lender.acceptsAsnef,
  noPayslip: lender.noPayslip,
  responseMinutes: lender.responseMinutes,
  recommended: lender.recommended,
  ...(amount !== undefined && termDays !== undefined ? totals(lender, amount, termDays) : {}),
});

export const lendersService = {
  async list(query: LenderListQuery): Promise<PageResponse<LenderResponse>> {
    if (query.featured) {
      const featured = (await lendersRepository.findFeatured()).map((lender) => toResponse(lender));
      return toPageResponse(featured, featured.length, { page: 0, size: 3 });
    }

    if (query.order === 'total' && (query.amount === undefined || query.termDays === undefined)) {
      throw new BusinessRuleError('TOTAL_REQUIRES_AMOUNT_AND_TERM', 'Para ordenar por total, ingresa el importe y el plazo.');
    }

    const { items, total } = await lendersRepository.findPage(query, (lender) =>
      query.amount !== undefined && query.termDays !== undefined
        ? totals(lender, query.amount, query.termDays).totalNew
        : 0,
    );
    return toPageResponse(items.map((lender) => toResponse(lender, query.amount, query.termDays)), total, query);
  },
};
