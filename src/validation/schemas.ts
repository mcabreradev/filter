import { z } from 'zod';

export const primitiveSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);

export const predicateFunctionSchema = z.function().args(z.any()).returns(z.boolean());

export const comparisonOperatorSchema = z
  .object({
    $gt: z.union([z.number(), z.date()]).optional(),
    $gte: z.union([z.number(), z.date()]).optional(),
    $lt: z.union([z.number(), z.date()]).optional(),
    $lte: z.union([z.number(), z.date()]).optional(),
    $eq: z.any().optional(),
    $ne: z.any().optional(),
  })
  .strict();

export const arrayOperatorSchema = z
  .object({
    $in: z.array(z.any()).optional(),
    $nin: z.array(z.any()).optional(),
    $contains: z.any().optional(),
    $size: z.number().optional(),
  })
  .strict();

export const stringOperatorSchema = z
  .object({
    $startsWith: z.string().optional(),
    $endsWith: z.string().optional(),
    $contains: z.string().optional(),
  })
  .strict();

export const operatorExpressionSchema = z.union([
  comparisonOperatorSchema,
  arrayOperatorSchema,
  stringOperatorSchema,
  comparisonOperatorSchema.merge(arrayOperatorSchema).merge(stringOperatorSchema),
]);

export const objectExpressionSchema = z.record(z.any());

export const expressionSchema = z.union([
  primitiveSchema,
  predicateFunctionSchema,
  objectExpressionSchema,
  operatorExpressionSchema,
]);

export const filterOptionsSchema = z
  .object({
    caseSensitive: z.boolean().optional(),
    maxDepth: z.number().min(1).max(10).optional(),
    customComparator: z.function().optional(),
    enableCache: z.boolean().optional(),
  })
  .optional();
