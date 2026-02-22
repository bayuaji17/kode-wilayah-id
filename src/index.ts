import { Elysia, status } from "elysia";
import { openapi } from "@elysiajs/openapi";
import { corsPlugin } from "./plugins/cors";
import { loggerPlugin } from "./plugins/logger";
import { regionModule } from "./modules/region";

const app = new Elysia()
  .use(loggerPlugin)
  .use(corsPlugin)
  .get("/", () => "Server Active")
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
  .use(regionModule)
  .onError(({ code }) => {
    if (code === "VALIDATION") {
      return status(400, {
        success: false,
        error: "Path parameter cannot be empty",
      });
    }
    return status(500, {
      success: false,
      error: "Internal server error",
    });
  });
// Remove for production deploy
// .listen(3000);

export default app;
