import { t } from 'elysia'

export const ProvinceModel = t.Object({
  code: t.String(),
  name: t.String()
})

export const RegencyModel = t.Object({
  code: t.String(),
  name: t.String(),
  province_code: t.String()
})

export const DistrictModel = t.Object({
  code: t.String(),
  name: t.String(),
  regency_code: t.String()
})

export const VillageModel = t.Object({
  code: t.String(),
  name: t.String(),
  district_code: t.String()
})

export const SuccessResponse = <T extends ReturnType<typeof t.Object>>(data: T) =>
  t.Object({
    success: t.Literal(true),
    data: t.Array(data),
    count: t.Number()
  })

export const ErrorResponse = t.Object({
  success: t.Literal(false),
  error: t.String()
})

export const ValidationError = t.Object({
  success: t.Literal(false),
  error: t.String()
})

export type Province = typeof ProvinceModel.static
export type Regency = typeof RegencyModel.static
export type District = typeof DistrictModel.static
export type Village = typeof VillageModel.static
