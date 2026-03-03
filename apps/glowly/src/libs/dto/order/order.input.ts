import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  ArrayMaxSize,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

// Define the nested DTO for individual order items
export class OrderItemDto {
  // Product identifier must be a non-empty string
  @IsString()
  @IsNotEmpty({ message: 'Product ID is required for each item' })
  productId: string;

  // Quantity must be a positive integer of at least 1
  @IsNumber()
  @IsPositive({ message: 'Quantity must be positive' })
  @Min(1, { message: 'Minimum quantity is 1' })
  quantity: number;

  // Unit price must be a positive number
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price must have at most 2 decimal places' },
  )
  @IsPositive({ message: 'Price must be positive' })
  unitPrice: number;
}

// Define the nested DTO for shipping address
export class AddressDto {
  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @IsString()
  @IsNotEmpty()
  country: string;
}

// Main order DTO with nested validation
export class CreateOrderDto {
  // Customer ID for the order
  @IsString()
  @IsNotEmpty({ message: 'Customer ID is required' })
  customerId: string;

  // Array of order items with validation on each element
  // Type decorator tells class-transformer how to instantiate nested objects
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1, { message: 'Order must contain at least one item' })
  @ArrayMaxSize(50, { message: 'Order cannot exceed 50 items' })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  // Nested shipping address object
  @ValidateNested()
  @Type(() => AddressDto)
  shippingAddress: AddressDto;

  // Optional billing address - if not provided, uses shipping address
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  billingAddress?: AddressDto;
}
