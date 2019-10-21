import { actions } from './InvoiceReducer';

export function attemptGetInvoices() {
    return { type: actions.ATTEMPT_GET_INVOICES };
}

export function attemptGetInvoicesSucceed(data) {
    return { type: actions.ATTEMPT_GET_INVOICES_SUCCEED, payload: { data } };
}

export function attemptGetInvoicesFailed() {
    return { type: actions.ATTEMPT_GET_INVOICES_FAILED };
}
