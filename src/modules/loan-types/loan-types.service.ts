import { NotFoundError } from '../../shared/errors/http-errors.js';
import { loanTypesRepository, type Lender, type LoanType } from './loan-types.repository.js';
import type { LoanTypeDetailResponse, LoanTypeLenderResponse, LoanTypeSummaryResponse, RelatedLoanTypeResponse } from './loan-types.schemas.js';

const toSummary = (type: LoanType): LoanTypeSummaryResponse => ({
  slug: type.id,
  title: type.title,
  icon: type.icon,
  summary: type.summary,
});

/** Solo se proyectan los campos públicos: affiliateUrl permanece en el servidor. */
const toLenderResponse = (lender: Lender): LoanTypeLenderResponse => ({
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
});

const matchesCriterion = (lender: Lender, criterion: string): boolean => {
  switch (criterion) {
    case 'todas': return true;
    case 'aceptaAsnef': return lender.acceptsAsnef;
    case 'sinNomina': return lender.noPayslip;
    case 'respuestaMax30': return lender.responseMinutes <= 30;
    case 'primerPrestamoGratis': return lender.firstLoanFree;
    default: {
      const amount = /^importe:(\d+)$/.exec(criterion);
      if (!amount) return false;
      const value = Number(amount[1]);
      return lender.minAmount <= value && value <= lender.maxAmount;
    }
  }
};

export const loanTypesService = {
  async list(): Promise<LoanTypeSummaryResponse[]> {
    return (await loanTypesRepository.findActive()).map(toSummary);
  },

  async get(slug: string): Promise<LoanTypeDetailResponse> {
    const type = await loanTypesRepository.findActiveBySlug(slug);
    if (!type) throw new NotFoundError(`No existe el tipo de préstamo ${slug}.`);

    const [activeTypes, activeLenders] = await Promise.all([
      loanTypesRepository.findActive(),
      loanTypesRepository.findActiveLenders(),
    ]);
    const typesBySlug = new Map(activeTypes.map((item) => [item.id, item]));
    const related: RelatedLoanTypeResponse[] = type.related.flatMap((relatedSlug) => {
      const item = typesBySlug.get(relatedSlug);
      return item ? [{ slug: item.id, title: item.title }] : [];
    });
    const compatible = activeLenders
      .filter((lender) => matchesCriterion(lender, type.criterion))
      .sort((a, b) => Number(b.recommended) - Number(a.recommended) || a.name.localeCompare(b.name, 'es'));

    return {
      ...toSummary(type),
      subtitle: type.subtitle,
      tags: type.tags,
      criterion: type.criterion,
      requirements: type.requirements,
      advantages: type.advantages,
      disadvantages: type.disadvantages,
      questions: type.questions,
      metaTitle: type.metaTitle,
      metaDescription: type.metaDescription,
      related,
      lenders: compatible.map(toLenderResponse),
    };
  },
};
