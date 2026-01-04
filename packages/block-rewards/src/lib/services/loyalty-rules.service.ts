import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  BadgeCategory,
  CreateBadgeCategoryRequest,
  MoneyRule,
  CreateMoneyRuleRequest,
  UpdateMoneyRuleRequest,
  ProductRule,
  CreateProductRuleRequest,
  UpdateProductRuleRequest,
  EventRule,
  CreateEventRuleRequest,
  UpdateEventRuleRequest,
} from '../types/loyalty-rules';
import {
  badgeCategoryMapper,
  moneyRuleMapper,
  productRuleMapper,
  eventRuleMapper,
} from '../mappers/loyalty-rules.mapper';

/**
 * Badge Categories Service
 */
export interface BadgeCategoriesService {
  list(page?: number, perPage?: number): Promise<PageResult<BadgeCategory>>;
  get(uniqueId: string): Promise<BadgeCategory>;
  create(data: CreateBadgeCategoryRequest): Promise<BadgeCategory>;
  update(uniqueId: string, data: Partial<CreateBadgeCategoryRequest>): Promise<BadgeCategory>;
  delete(uniqueId: string): Promise<void>;
}

/**
 * Money Rules Service - Points earned from monetary spend
 */
export interface MoneyRulesService {
  list(loyaltyUniqueId: string): Promise<MoneyRule[]>;
  get(loyaltyUniqueId: string, ruleUniqueId: string): Promise<MoneyRule>;
  create(loyaltyUniqueId: string, data: CreateMoneyRuleRequest): Promise<MoneyRule>;
  update(loyaltyUniqueId: string, ruleUniqueId: string, data: UpdateMoneyRuleRequest): Promise<MoneyRule>;
  delete(loyaltyUniqueId: string, ruleUniqueId: string): Promise<void>;
}

/**
 * Product Rules Service - Points earned from product purchases
 */
export interface ProductRulesService {
  list(loyaltyUniqueId: string): Promise<ProductRule[]>;
  get(loyaltyUniqueId: string, ruleUniqueId: string): Promise<ProductRule>;
  create(loyaltyUniqueId: string, data: CreateProductRuleRequest): Promise<ProductRule>;
  update(loyaltyUniqueId: string, ruleUniqueId: string, data: UpdateProductRuleRequest): Promise<ProductRule>;
  delete(loyaltyUniqueId: string, ruleUniqueId: string): Promise<void>;
}

/**
 * Event Rules Service - Points earned from events/actions
 */
export interface EventRulesService {
  list(loyaltyUniqueId: string): Promise<EventRule[]>;
  get(loyaltyUniqueId: string, ruleUniqueId: string): Promise<EventRule>;
  create(loyaltyUniqueId: string, data: CreateEventRuleRequest): Promise<EventRule>;
  update(loyaltyUniqueId: string, ruleUniqueId: string, data: UpdateEventRuleRequest): Promise<EventRule>;
  delete(loyaltyUniqueId: string, ruleUniqueId: string): Promise<void>;
}

export function createBadgeCategoriesService(
  transport: Transport,
  _config: { appId: string }
): BadgeCategoriesService {
  return {
    async list(page?: number, perPage?: number): Promise<PageResult<BadgeCategory>> {
      const params: Record<string, string> = {};
      if (page) params['page'] = String(page);
      if (perPage) params['records'] = String(perPage);

      const response = await transport.get<unknown>('/categories', { params });
      return decodePageResult(response, badgeCategoryMapper);
    },

    async get(uniqueId: string): Promise<BadgeCategory> {
      const response = await transport.get<unknown>(`/categories/${uniqueId}`);
      return decodeOne(response, badgeCategoryMapper);
    },

    async create(data: CreateBadgeCategoryRequest): Promise<BadgeCategory> {
      const response = await transport.post<unknown>('/categories', {
        category: {
          name: data.name,
          description: data.description,
          display_order: data.displayOrder,
          image_url: data.imageUrl,
        },
      });
      return decodeOne(response, badgeCategoryMapper);
    },

    async update(uniqueId: string, data: Partial<CreateBadgeCategoryRequest>): Promise<BadgeCategory> {
      const response = await transport.put<unknown>(`/categories/${uniqueId}`, {
        category: {
          name: data.name,
          description: data.description,
          display_order: data.displayOrder,
          image_url: data.imageUrl,
        },
      });
      return decodeOne(response, badgeCategoryMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/categories/${uniqueId}`);
    },
  };
}

export function createMoneyRulesService(
  transport: Transport,
  _config: { appId: string }
): MoneyRulesService {
  return {
    async list(loyaltyUniqueId: string): Promise<MoneyRule[]> {
      const response = await transport.get<unknown>(`/loyalties/${loyaltyUniqueId}/rules/money`);
      return decodeMany(response, moneyRuleMapper);
    },

    async get(loyaltyUniqueId: string, ruleUniqueId: string): Promise<MoneyRule> {
      const response = await transport.get<unknown>(`/loyalties/${loyaltyUniqueId}/rules/money/${ruleUniqueId}`);
      return decodeOne(response, moneyRuleMapper);
    },

    async create(loyaltyUniqueId: string, data: CreateMoneyRuleRequest): Promise<MoneyRule> {
      const response = await transport.post<unknown>(`/loyalties/${loyaltyUniqueId}/rules/money`, {
        money_rule: {
          name: data.name,
          description: data.description,
          min_amount: data.minAmount,
          max_amount: data.maxAmount,
          points_per_unit: data.pointsPerUnit,
          unit_amount: data.unitAmount,
          currency: data.currency,
          start_date: data.startDate,
          end_date: data.endDate,
        },
      });
      return decodeOne(response, moneyRuleMapper);
    },

    async update(loyaltyUniqueId: string, ruleUniqueId: string, data: UpdateMoneyRuleRequest): Promise<MoneyRule> {
      const response = await transport.put<unknown>(`/loyalties/${loyaltyUniqueId}/rules/money/${ruleUniqueId}`, {
        money_rule: {
          name: data.name,
          description: data.description,
          min_amount: data.minAmount,
          max_amount: data.maxAmount,
          points_per_unit: data.pointsPerUnit,
          unit_amount: data.unitAmount,
          currency: data.currency,
          is_active: data.isActive,
          start_date: data.startDate,
          end_date: data.endDate,
          enabled: data.enabled,
          status: data.status,
        },
      });
      return decodeOne(response, moneyRuleMapper);
    },

    async delete(loyaltyUniqueId: string, ruleUniqueId: string): Promise<void> {
      await transport.delete(`/loyalties/${loyaltyUniqueId}/rules/money/${ruleUniqueId}`);
    },
  };
}

export function createProductRulesService(
  transport: Transport,
  _config: { appId: string }
): ProductRulesService {
  return {
    async list(loyaltyUniqueId: string): Promise<ProductRule[]> {
      const response = await transport.get<unknown>(`/loyalties/${loyaltyUniqueId}/rules/products`);
      return decodeMany(response, productRuleMapper);
    },

    async get(loyaltyUniqueId: string, ruleUniqueId: string): Promise<ProductRule> {
      const response = await transport.get<unknown>(`/loyalties/${loyaltyUniqueId}/rules/products/${ruleUniqueId}`);
      return decodeOne(response, productRuleMapper);
    },

    async create(loyaltyUniqueId: string, data: CreateProductRuleRequest): Promise<ProductRule> {
      const response = await transport.post<unknown>(`/loyalties/${loyaltyUniqueId}/rules/products`, {
        product_rule: {
          name: data.name,
          description: data.description,
          product_unique_id: data.productUniqueId,
          category_unique_id: data.categoryUniqueId,
          brand_unique_id: data.brandUniqueId,
          points_earned: data.pointsEarned,
          multiplier: data.multiplier,
          start_date: data.startDate,
          end_date: data.endDate,
        },
      });
      return decodeOne(response, productRuleMapper);
    },

    async update(loyaltyUniqueId: string, ruleUniqueId: string, data: UpdateProductRuleRequest): Promise<ProductRule> {
      const response = await transport.put<unknown>(`/loyalties/${loyaltyUniqueId}/rules/products/${ruleUniqueId}`, {
        product_rule: {
          name: data.name,
          description: data.description,
          product_unique_id: data.productUniqueId,
          category_unique_id: data.categoryUniqueId,
          brand_unique_id: data.brandUniqueId,
          points_earned: data.pointsEarned,
          multiplier: data.multiplier,
          is_active: data.isActive,
          start_date: data.startDate,
          end_date: data.endDate,
          enabled: data.enabled,
          status: data.status,
        },
      });
      return decodeOne(response, productRuleMapper);
    },

    async delete(loyaltyUniqueId: string, ruleUniqueId: string): Promise<void> {
      await transport.delete(`/loyalties/${loyaltyUniqueId}/rules/products/${ruleUniqueId}`);
    },
  };
}

export function createEventRulesService(
  transport: Transport,
  _config: { appId: string }
): EventRulesService {
  return {
    async list(loyaltyUniqueId: string): Promise<EventRule[]> {
      const response = await transport.get<unknown>(`/loyalties/${loyaltyUniqueId}/rules/events`);
      return decodeMany(response, eventRuleMapper);
    },

    async get(loyaltyUniqueId: string, ruleUniqueId: string): Promise<EventRule> {
      const response = await transport.get<unknown>(`/loyalties/${loyaltyUniqueId}/rules/events/${ruleUniqueId}`);
      return decodeOne(response, eventRuleMapper);
    },

    async create(loyaltyUniqueId: string, data: CreateEventRuleRequest): Promise<EventRule> {
      const response = await transport.post<unknown>(`/loyalties/${loyaltyUniqueId}/rules/events`, {
        event_rule: {
          name: data.name,
          description: data.description,
          event_type: data.eventType,
          points_earned: data.pointsEarned,
          max_occurrences: data.maxOccurrences,
          cooldown_period: data.cooldownPeriod,
          start_date: data.startDate,
          end_date: data.endDate,
        },
      });
      return decodeOne(response, eventRuleMapper);
    },

    async update(loyaltyUniqueId: string, ruleUniqueId: string, data: UpdateEventRuleRequest): Promise<EventRule> {
      const response = await transport.put<unknown>(`/loyalties/${loyaltyUniqueId}/rules/events/${ruleUniqueId}`, {
        event_rule: {
          name: data.name,
          description: data.description,
          event_type: data.eventType,
          points_earned: data.pointsEarned,
          max_occurrences: data.maxOccurrences,
          cooldown_period: data.cooldownPeriod,
          is_active: data.isActive,
          start_date: data.startDate,
          end_date: data.endDate,
          enabled: data.enabled,
          status: data.status,
        },
      });
      return decodeOne(response, eventRuleMapper);
    },

    async delete(loyaltyUniqueId: string, ruleUniqueId: string): Promise<void> {
      await transport.delete(`/loyalties/${loyaltyUniqueId}/rules/events/${ruleUniqueId}`);
    },
  };
}
