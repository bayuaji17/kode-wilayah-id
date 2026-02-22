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
  .get("/", ({ set }) => {
    set.headers["content-type"] = "text/html; charset=utf-8";
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kode Wilayah Indonesia API</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      background: #f5f5f5;
    }
    .container {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 { color: #1a73e8; margin-bottom: 0.5rem; }
    .subtitle { color: #666; margin-bottom: 1.5rem; }
    .endpoint {
      background: #f8f9fa;
      padding: 0.75rem 1rem;
      margin: 0.5rem 0;
      border-radius: 4px;
      border-left: 4px solid #1a73e8;
    }
    .method { color: #0d904f; font-weight: bold; }
    .path { color: #333; font-family: monospace; }
    .docs-link {
      display: inline-block;
      margin-top: 1.5rem;
      padding: 0.75rem 1.5rem;
      background: #1a73e8;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 500;
    }
    .docs-link:hover { background: #1557b0; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Kode Wilayah Indonesia API</h1>
    <p class="subtitle">
      REST API for Indonesian administrative region codes (provinces, regencies, districts, villages)
      based on Permendagri 72/2019
    </p>

    <h2>Available Endpoints</h2>
    <div class="endpoint">
      <span class="method">GET</span> <span class="path">/provinces</span>
      <span> - Get all 34 provinces</span>
    </div>
    <div class="endpoint">
      <span class="method">GET</span> <span class="path">/regencies/:province_id</span>
      <span> - Get regencies by province code</span>
    </div>
    <div class="endpoint">
      <span class="method">GET</span> <span class="path">/districts/:regency_id</span>
      <span> - Get districts by regency code</span>
    </div>
    <div class="endpoint">
      <span class="method">GET</span> <span class="path">/villages/:district_id</span>
      <span> - Get villages by district code</span>
    </div>

    <a href="/openapi" class="docs-link">View API Documentation →</a>
  </div>
</body>
</html>`;
  })
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
  .get("/favicon.ico", ({ set }) => {
    set.status = 204;
    return "";
  })
  .onError(({ code, error, request }) => {
    // Handle NOT_FOUND errors
    if (code === "NOT_FOUND") {
      const url = request.url;
      // Don't log common browser asset requests
      if (url.includes("favicon") || url.includes("robots.txt")) {
        return;
      }
      return {
        status: 404,
        success: false,
        error: "Not found",
      };
    }
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
