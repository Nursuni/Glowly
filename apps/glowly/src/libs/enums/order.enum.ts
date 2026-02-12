import { registerEnumType } from '@nestjs/graphql';

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
});

export enum PaymentMethod {
  CARD = 'CARD',
  CASH = 'CASH',
  KAKAOPAY = 'KAKAOPAY',
  NAVERPAY = 'NAVERPAY',
}

registerEnumType(PaymentMethod, {
  name: 'PaymentMethod',
});
