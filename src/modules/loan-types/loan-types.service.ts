import { NotFoundError } from '../../shared/errors/http-errors.js';
import { loanTypesRepository, type LoanType, type LoanTypeLender } from './loan-types.repository.js';
import type { LoanTypeLenderResponse, LoanTypeResponse, LoanTypeSummaryResponse, RelatedLoanTypeResponse } from './loan-types.schemas.js';

const toSummary = (type: LoanType): LoanTypeSummaryResponse => ({
  slug: type.slug,
  title: type.title,
  icon: type.icon,
  summary: type.summary,
});

const matchesCriterion = (lender: LoanTypeLender, criterion: string): boolean => {
  switch (criterion) {
    case 'todas': return true;
    case 'aceptaAsnef': return lender.acceptsAsnef;
    case 'sinNomina': return lender.noPayslip;
    case 'respuestaMax30': return lender.responseMinutes <= 30;
    case 'primerPrestamoGratis': return lender.firstLoanFree;
    default: {
      const amount = /^importe:(\d+)$/.exec(criterion);
      return amount !== null && lender.minAmount <= Number(amount[1]) && lender.maxAmount >= Number(amount[1]);
    }
  }
};

const toLenderResponse = (lender: LoanTypeLender): LoanTypeLenderResponse => ({
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
});

export const loanTypesService = {
  async list(): Promise<LoanTypeSummaryResponse[]> {
    return (await loanTypesRepository.findActive()).map(toSummary);
  },

  async get(slug: string): Promise<LoanTypeResponse> {
    const type = await loanTypesRepository.findActiveBySlug(slug);
    if (!type) throw new NotFoundError(`No existe el tipo de préstamo ${slug}.`);

    const [activeTypes, activeLenders] = await Promise.all([
      loanTypesRepository.findActive(),
      loanTypesRepository.findActiveLenders(),
    ]);
    const bySlug = new Map(activeTypes.map((related) => [related.slug, related]));
    const related: RelatedLoanTypeResponse[] = type.related.flatMap((relatedSlug) => {
      const item = bySlug.get(relatedSlug);
      return item ? [{ slug: item.slug, title: item.title }] : [];
    });
    const lenders = activeLenders
      .filter((lender) => matchesCriterion(lender, type.criterion))
      .sort((left, right) => Number(right.recommended) - Number(left.recommended) || left.name.localeCompare(right.name, 'es'))
      .map(toLenderResponse);

    return {
      ...toSummary(type),
      subtitle: type.subtitle,
      tags: type.tags,
      criterion: type.criterion,
      requirements: type.requirements,
      advantages: type.advantages,
      disadvantages: type.disadvantages,
      questions: type.questions,
      related,
      metaTitle: type.metaTitle,
      metaDescription: type.metaDescription,
      lenders,
    };
  },
};
