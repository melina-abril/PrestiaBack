import { createHash } from 'node:crypto';
import { Timestamp } from 'firebase-admin/firestore';
import { BusinessRuleError, NotFoundError } from '../../shared/errors/http-errors.js';
import { loanApplicationsRepository, type Lender, type StoredOffer } from './loan-applications.repository.js';
import type { LoanApplicationCreatedResponse, LoanApplicationOffersResponse, LoanApplicationRequest, LoanOfferResponse } from './loan-applications.schemas.js';

const repaymentFor = (amount: number, termDays: number, lender: Lender): number => {
  const chargeableDays = lender.firstLoanFree ? Math.max(0, termDays - 30) : termDays;
  return amount + Math.round(amount * lender.dailyRate * chargeableDays);
};

export const loanApplicationsService = {
  async create(request: LoanApplicationRequest, idempotencyKey: string, sourceIp: string): Promise<{ response: LoanApplicationCreatedResponse; created: boolean }> {
    // Un id determinista permite que Firestore resuelva los reintentos concurrentes sin otra colección.
    const id = `LA-${createHash('sha256').update(idempotencyKey).digest('hex')}`;
    const acceptedAt = Timestamp.now();
    const result = await loanApplicationsRepository.insertOnce(id, {
      ...request,
      birthDate: Timestamp.fromDate(new Date(`${request.birthDate}T00:00:00.000Z`)),
      privacyTermsAcceptedAt: acceptedAt,
      creditCheckAcceptedAt: acceptedAt,
      marketingAcceptedAt: request.marketingAccepted ? acceptedAt : null,
      idempotencyKey,
      sourceIp,
      status: 'RECIBIDA',
      offers: [],
    });
    if (result.limited) {
      // BusinessRuleError pertenece al manejo centralizado; el status HTTP se ajusta a 429.
      throw Object.assign(
        new BusinessRuleError('RATE_LIMITED', 'Hiciste demasiadas solicitudes. Intenta de nuevo más tarde.'),
        { status: 429, statusCode: 429 },
      );
    }
    return { response: { id: result.id }, created: result.created };
  },

  async getOffers(id: string): Promise<LoanApplicationOffersResponse> {
    const application = await loanApplicationsRepository.findById(id);
    if (!application) throw new NotFoundError(`No existe la solicitud ${id}.`);

    const lenders = await loanApplicationsRepository.findActiveLenders();
    const offers: LoanOfferResponse[] = lenders
      .filter((lender) => application.amount >= lender.minAmount && application.amount <= lender.maxAmount
        && application.termDays >= lender.minTermDays && application.termDays <= lender.maxTermDays
        && application.monthlyIncome >= lender.minMonthlyIncome)
      .map((lender) => ({
        lenderId: lender.id,
        lender: lender.name,
        initials: lender.initials,
        amount: application.amount,
        termDays: application.termDays,
        totalRepayment: repaymentFor(application.amount, application.termDays, lender),
        firstLoanFree: lender.firstLoanFree,
        responseTime: lender.responseTime,
        websiteUrl: lender.websiteUrl,
      }))
      .sort((a, b) => a.totalRepayment - b.totalRepayment || a.lender.localeCompare(b.lender, 'es'));

    const status = offers.length > 0 ? 'OFERTADA' : 'SIN_OFERTAS';
    const storedOffers: StoredOffer[] = offers.map(({ lenderId, totalRepayment }) => ({ lenderId, totalRepayment }));
    if (!(await loanApplicationsRepository.saveOffers(id, storedOffers, status))) {
      throw new NotFoundError(`No existe la solicitud ${id}.`);
    }
    return { applicationId: id, status, offers };
  },
};
