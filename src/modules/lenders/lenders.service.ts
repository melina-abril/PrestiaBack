import { NotFoundError } from '../../shared/errors/http-errors.js';
import { toPageResponse, type PageResponse } from '../../shared/http/page.js';
import { lendersRepository, totalFor, type Lender } from './lenders.repository.js';
import type { LenderListQuery, LenderResponse } from './lenders.schemas.js';

const toResponse = (lender: Lender, query: LenderListQuery): LenderResponse => {
  const hasSimulation = query.featured !== true && query.amount !== undefined && query.termDays !== undefined;
  return {
    id: lender.id,
    name: lender.name,
    acronym: lender.acronym,
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
    totalNew: hasSimulation && query.amount !== undefined && query.termDays !== undefined
      ? totalFor(query.amount, query.termDays, lender.firstLoanFree) : null,
    totalRecurring: hasSimulation && query.amount !== undefined && query.termDays !== undefined
      ? totalFor(query.amount, query.termDays, false) : null,
  };
};

export const lendersService = {
  async list(query: LenderListQuery): Promise<PageResponse<LenderResponse>> {
    const { items, total } = await lendersRepository.findPage(query);
    const pagination = query.featured === true ? { page: 0, size: 3 } : query;
    return toPageResponse(items.map((lender) => toResponse(lender, query)), total, pagination);
  },

  /** Consulta interna para las ofertas: la URL no se expone en GET /api/lenders. */
  async getAffiliateUrl(id: string): Promise<string> {
    const lender = await lendersRepository.findById(id);
    if (!lender || !lender.active) throw new NotFoundError(`No existe la entidad ${id}.`);
    return lender.affiliateUrl;
  },
};
