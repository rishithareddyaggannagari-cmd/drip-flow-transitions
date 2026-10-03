import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { recommendCoffee } from "./recommend.server";

export const getRecommendation = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ taste: z.string().trim().min(3).max(600) }).parse(data))
  .handler(async ({ data }) => recommendCoffee(data.taste));
