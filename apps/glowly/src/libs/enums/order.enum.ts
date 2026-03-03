export enum OrderStatus {
  PENDING = 'PENDING', // just placed, awaiting payment
  CONFIRMED = 'CONFIRMED', // payment received
  PREPARING = 'PREPARING', // being packed
  SHIPPED = 'SHIPPED', // handed to carrier
  DELIVERED = 'DELIVERED', // received by customer
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  CARD = 'CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  KAKAO_PAY = 'KAKAO_PAY',
  NAVER_PAY = 'NAVER_PAY',
  CASH = 'CASH',
}

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum DeliveryMethod {
  STANDARD = 'STANDARD',
  EXPRESS = 'EXPRESS',
  SAME_DAY = 'SAME_DAY',
  PICKUP = 'PICKUP',
}
