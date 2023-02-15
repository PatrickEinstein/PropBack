import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as axios from 'axios';
import {
  GetAuthorizationTokenResponse,
  GetPaymentAddressPayload,
  GetPaymentAddressResponse,
  GetPaymentStatusResponse,
} from './types';

@Injectable()
export class NowPaymentService {
  private instance: axios.AxiosInstance;
  constructor(private config: ConfigService) {
    this.instance = axios.default.create({
      baseURL: 'https://api.nowpayments.io/v1',
      headers: {
        'x-api-key': config.getOrThrow('NOW_PAYMENT_API_KEY'),
      },
    });
  }

  async getAuthorizationToken() {
    const email = this.config.getOrThrow('NOW_PAYMENT_EMAIL');
    const password = this.config.getOrThrow('NOW_PAYMENT_PASSWORD');

    const { data } = await this.instance.post<GetAuthorizationTokenResponse>(
      '/auth',
      {
        email,
        password,
      },
    );

    return data.token;
  }

  async getPaymentAddress(payload: GetPaymentAddressPayload, token: string) {
    const { data } = await this.instance.post<GetPaymentAddressResponse>(
      '/payment',
      {
        price_amount: payload.amount,
        price_currency: 'usd',
        pay_currency: payload.currency,
        ipn_callback_url: this.config.getOrThrow('PAYMENT_CALLBACK_URL'),
        order_id: payload.order_id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return data;
  }

  async getPaymentStatus(paymentId: string, token: string) {
    const { data } = await this.instance.get<GetPaymentStatusResponse>(
      `/payment/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return data;
  }
}
