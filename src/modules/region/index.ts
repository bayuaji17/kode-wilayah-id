import { Elysia, t } from "elysia";
import { regionService } from "./service";
import {
  ProvinceModel,
  RegencyModel,
  DistrictModel,
  VillageModel,
  SuccessResponse,
  ErrorResponse,
} from "./model";

export const regionModule = new Elysia({ name: "region" })
  .model({
    Province: ProvinceModel,
    Regency: RegencyModel,
    District: DistrictModel,
    Village: VillageModel,
    ProvinceResponse: SuccessResponse(ProvinceModel),
    RegencyResponse: SuccessResponse(RegencyModel),
    DistrictResponse: SuccessResponse(DistrictModel),
    VillageResponse: SuccessResponse(VillageModel),
    ErrorResponse: ErrorResponse,
  })
  .get(
    "/provinces",
    ({ set }) => {
      set.headers["cache-control"] = "public, max-age=604800, immutable";
      return regionService.getProvinces();
    },
    {
      detail: {
        summary: "Get all provinces",
        description: "Returns all 34 provinces in Indonesia",
        tags: ["Provinces"],
      },
      response: "ProvinceResponse",
    },
  )
  .get(
    "/regencies/:province_id",
    ({ params, set }) => {
      set.headers["cache-control"] = "public, max-age=604800, immutable";
      return regionService.getRegencies(params.province_id);
    },
    {
      params: t.Object({
        province_id: t.String({
          description: "Province code (e.g., 11 for Aceh)",
        }),
      }),
      detail: {
        summary: "Get regencies by province",
        description: "Returns all regencies/cities in a province",
        tags: ["Regencies"],
      },
      response: {
        200: "RegencyResponse",
        404: "ErrorResponse",
      },
    },
  )
  .get(
    "/districts/:regency_id",
    ({ params, set }) => {
      set.headers["cache-control"] = "public, max-age=604800, immutable";
      return regionService.getDistricts(params.regency_id);
    },
    {
      params: t.Object({
        regency_id: t.String({
          description: "Regency code (e.g., 11.01 for Aceh Selatan)",
        }),
      }),
      detail: {
        summary: "Get districts by regency",
        description: "Returns all districts in a regency/city",
        tags: ["Districts"],
      },
      response: {
        200: "DistrictResponse",
        404: "ErrorResponse",
      },
    },
  )
  .get(
    "/villages/:district_id",
    ({ params, set }) => {
      set.headers["cache-control"] = "public, max-age=604800, immutable";
      return regionService.getVillages(params.district_id);
    },
    {
      params: t.Object({
        district_id: t.String({
          description: "District code (e.g., 11.01.01 for Bakongan)",
        }),
      }),
      detail: {
        summary: "Get villages by district",
        description: "Returns all villages in a district",
        tags: ["Villages"],
      },
      response: {
        200: "VillageResponse",
        404: "ErrorResponse",
      },
    },
  );
