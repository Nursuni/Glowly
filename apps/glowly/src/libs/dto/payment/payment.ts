import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  ValidateIf,
  IsCreditCard,
  Matches,
  Length,
  IsEmail,
} from 'class-validator';

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  BANK_TRANSFER = 'bank_transfer',
  PAYPAL = 'paypal',
}

export class PaymentDto {
  // Payment method determines which other fields are required
  @IsEnum(PaymentMethod, {
    message: 'Payment method must be credit_card, bank_transfer, or paypal',
  })
  paymentMethod: PaymentMethod;

  // Credit card number is only validated when payment method is credit card
  // ValidateIf decorator conditionally applies validation based on a predicate
  @ValidateIf((obj) => obj.paymentMethod === PaymentMethod.CREDIT_CARD)
  @IsCreditCard({ message: 'Invalid credit card number' })
  cardNumber?: string;

  // CVV is only required for credit card payments
  @ValidateIf((obj) => obj.paymentMethod === PaymentMethod.CREDIT_CARD)
  @IsString()
  @Length(3, 4, { message: 'CVV must be 3 or 4 digits' })
  @Matches(/^\d+$/, { message: 'CVV must contain only numbers' })
  cvv?: string;

  // Expiry date only required for credit card payments
  @ValidateIf((obj) => obj.paymentMethod === PaymentMethod.CREDIT_CARD)
  @IsString()
  @Matches(/^(0[1-9]|1[0-2])\/\d{2}$/, {
    message: 'Expiry date must be in MM/YY format',
  })
  expiryDate?: string;

  // Bank account number only required for bank transfers
  @ValidateIf((obj) => obj.paymentMethod === PaymentMethod.BANK_TRANSFER)
  @IsString()
  @IsNotEmpty({ message: 'Bank account number is required for bank transfers' })
  bankAccountNumber?: string;

  // Routing number only required for bank transfers
  @ValidateIf((obj) => obj.paymentMethod === PaymentMethod.BANK_TRANSFER)
  @IsString()
  @Length(9, 9, { message: 'Routing number must be exactly 9 digits' })
  @Matches(/^\d+$/, { message: 'Routing number must contain only numbers' })
  routingNumber?: string;

  // PayPal email only required for PayPal payments
  @ValidateIf((obj) => obj.paymentMethod === PaymentMethod.PAYPAL)
  @IsEmail({}, { message: 'Valid PayPal email is required' })
  paypalEmail?: string;
}
