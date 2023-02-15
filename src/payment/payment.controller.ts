import { Controller, Post, Request } from '@nestjs/common';
import express from 'express';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}
  @Post('/webhook')
  webhookHandler(@Request() req: express.Request) {
    const body = req.body;
    const signature = req.headers['x-nowpayments-sig'] as string;
    this.paymentService.webhookHandler(body, signature);
  }
}
