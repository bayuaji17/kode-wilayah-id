import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import { getRegionService } from "./modules/region/service";
import {
  ProvinceModel,
  RegencyModel,
  DistrictModel,
  VillageModel,
  SuccessResponse,
  ErrorResponse,
} from "./modules/region/model";

const app = new Elysia()
  .use(
    cors({
      origin: "*",
      methods: "GET",
    }),
  )
  .use(
    openapi({
      documentation: {
        info: {
          title: "Kode Wilayah Indonesia API",
          version: "1.0.0",
          description:
            "API for Indonesian administrative region codes (provinces, regencies, districts, villages) based on Permendagri 72/2019",
        },
        tags: [
          { name: "Provinces", description: "Province endpoints" },
          { name: "Regencies", description: "Regency endpoints" },
          { name: "Districts", description: "District endpoints" },
          { name: "Villages", description: "Village endpoints" },
        ],
      },
    }),
  )
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
  .get("/", () => "Server Active")
  .get(
    "/provinces",
    ({ set }) => {
      set.headers["cache-control"] = "public, max-age=604800, immutable";
      return getRegionService().getProvinces();
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
      return getRegionService().getRegencies(params.province_id);
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
      return getRegionService().getDistricts(params.regency_id);
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
      return getRegionService().getVillages(params.district_id);
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
  )
  .onError(({ code, error }) => {
    console.error("[Error]", code, error);
    if (code === "VALIDATION") {
      return {
        status: 400,
        success: false,
        error: "Path parameter cannot be empty",
      };
    }
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return {
      status: 500,
      success: false,
      error: message,
    };
  });

export default app;
