export interface GetPaymentAddressResponse {
  payment_id: string;
  payment_status: string;
  pay_address: string;
  price_amount: number;
  price_currency: string;
  pay_amount: number;
  pay_currency: string;
  order_id: string;
  order_description?: string;
  ipn_callback_url: string;
  created_at: string;
  updated_at: string;
  purchase_id: string;
  amount_received?: null;
  payin_extra_id?: null;
  smart_contract: '';
  network: string;
  network_precision: number;
  time_limit: null;
  burning_percent: null;
  expiration_estimate_date: string;
}

export enum PaymentStatus {
  Waiting = 'waiting',
  Confirming = 'confirming',
  Confirmed = 'confirmed',
  Sending = 'sending',
  PartiallyPaid = 'partially_paid',
  Finished = 'finished',
  Failed = 'failed',
  Refunded = 'refunded',
  Expired = 'expired',
}

export interface GetPaymentStatusResponse {
  payment_id: number;
  payment_status: PaymentStatus;
  pay_address: string;
  price_amount: number;
  price_currency: string;
  pay_amount: number;
  actually_paid: number;
  pay_currency: string;
  order_id: string;
  order_description: string;
  purchase_id: string;
  created_at: string;
  updated_at: string;
  outcome_amount: number;
  outcome_currency: string;
}

export interface GetAuthorizationTokenResponse {
  token: string;
}

export interface GetPaymentAddressPayload {
  amount: number;
  currency: string;
  order_id: string;
  callbackUrl?: string;
}
