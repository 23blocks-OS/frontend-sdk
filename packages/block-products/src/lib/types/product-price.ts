import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface ProductPrice extends IdentityCore {
  productUniqueId?: string;
  variationUniqueId?: string;
  channelUniqueId?: string;
  priceListUniqueId?: string;
  price: number;
  compareAtPrice?: number;
  cost?: number;
  currency?: string;
  minQuantity?: number;
  maxQuantity?: number;
  startDate?: Date;
  endDate?: Date;
  status: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListProductPricesParams {
  page?: number;
  perPage?: number;
  status?: string;
  productUniqueId?: string;
  variationUniqueId?: string;
  channelUniqueId?: string;
  priceListUniqueId?: string;
  currency?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateProductPriceRequest {
  price: number;
  isGlobal?: boolean;
  countryId?: string;
  countryName?: string;
  currencyUniqueId?: string;
  currencyCode?: string;
  currencyName?: string;
  isMultichannel?: boolean;
  channelUniqueId?: string;
  channelCode?: string;
  channelName?: string;
  cost?: number;
  priceWithFees?: number;
  priceWithTaxes?: number;
  discount?: number;
  discountValue?: number;
  tax?: number;
  taxValue?: number;
  fees?: number;
  feesValue?: number;
  vendorDiscount?: number;
  vendorDiscountValue?: number;
  vendorPrice?: number;
  status?: EntityStatus;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
  vendorUniqueId?: string;
  vendorName?: string;
  validFrom?: string;
  validTo?: string;
}

export interface UpdateProductPriceRequest {
  price?: number;
  isGlobal?: boolean;
  countryId?: string;
  countryName?: string;
  currencyUniqueId?: string;
  currencyCode?: string;
  currencyName?: string;
  isMultichannel?: boolean;
  channelUniqueId?: string;
  channelCode?: string;
  channelName?: string;
  cost?: number;
  priceWithFees?: number;
  priceWithTaxes?: number;
  discount?: number;
  discountValue?: number;
  tax?: number;
  taxValue?: number;
  fees?: number;
  feesValue?: number;
  vendorDiscount?: number;
  vendorDiscountValue?: number;
  vendorPrice?: number;
  status?: EntityStatus;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
  vendorUniqueId?: string;
  vendorName?: string;
  validFrom?: string;
  validTo?: string;
}
