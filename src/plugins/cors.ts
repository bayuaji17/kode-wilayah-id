import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

export const corsPlugin = new Elysia({ name: "cors-plugin" }).use(
  cors({
    origin: "*",
    methods: "GET",
  }),
);
