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
  // Cards
  CARD = 'CARD',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',

  // Digital Wallets
  KAKAOPAY = 'KAKAOPAY',
  NAVERPAY = 'NAVERPAY',
  PAYCO = 'PAYCO',
  TOSS = 'TOSS',
  SAMSUNG_PAY = 'SAMSUNG_PAY',
  APPLE_PAY = 'APPLE_PAY',
  GOOGLE_PAY = 'GOOGLE_PAY',

  // Bank Transfer
  BANK_TRANSFER = 'BANK_TRANSFER',
  VIRTUAL_ACCOUNT = 'VIRTUAL_ACCOUNT',

  // Other
  CASH = 'CASH',
  COD = 'COD', // Cash on Delivery
  POINTS = 'POINTS', // Loyalty points
  GIFT_CARD = 'GIFT_CARD',
}

registerEnumType(PaymentMethod, {
  name: 'PaymentMethod',
});

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  AUTHORIZED = 'AUTHORIZED',
  CAPTURED = 'CAPTURED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
  EXPIRED = 'EXPIRED',
}

registerEnumType(PaymentStatus, {
  name: 'PaymentStatus',
  description: 'Status of the payment transaction',
});

export enum ShippingMethod {
  STANDARD = 'STANDARD',
  EXPRESS = 'EXPRESS',
  OVERNIGHT = 'OVERNIGHT',
  PICKUP = 'PICKUP',
  SAME_DAY = 'SAME_DAY',
  INTERNATIONAL = 'INTERNATIONAL',
}

registerEnumType(ShippingMethod, {
  name: 'ShippingMethod',
  description: 'Shipping method for the order',
});

export enum RefundReason {
  CHANGED_MIND = 'CHANGED_MIND',
  DEFECTIVE_PRODUCT = 'DEFECTIVE_PRODUCT',
  WRONG_ITEM = 'WRONG_ITEM',
  NOT_AS_DESCRIBED = 'NOT_AS_DESCRIBED',
  DAMAGED_IN_SHIPPING = 'DAMAGED_IN_SHIPPING',
  LATE_DELIVERY = 'LATE_DELIVERY',
  DUPLICATE_ORDER = 'DUPLICATE_ORDER',
  ALLERGIC_REACTION = 'ALLERGIC_REACTION',
  BETTER_PRICE_FOUND = 'BETTER_PRICE_FOUND',
  OTHER = 'OTHER',
}

registerEnumType(RefundReason, {
  name: 'RefundReason',
  description: 'Reason for refund request',
});

export enum OrderItemStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED',
  REFUNDED = 'REFUNDED',
}

registerEnumType(OrderItemStatus, {
  name: 'OrderItemStatus',
  description: 'Status of individual items in an order (for split shipments)',
});

export enum CancellationReason {
  CUSTOMER_REQUEST = 'CUSTOMER_REQUEST',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  FRAUD_SUSPECTED = 'FRAUD_SUSPECTED',
  ADDRESS_ISSUE = 'ADDRESS_ISSUE',
  DUPLICATE_ORDER = 'DUPLICATE_ORDER',
  SELLER_UNAVAILABLE = 'SELLER_UNAVAILABLE',
  OTHER = 'OTHER',
}

registerEnumType(CancellationReason, {
  name: 'CancellationReason',
  description: 'Reason for order cancellation',
});
