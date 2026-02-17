import { createClient } from "@supabase/supabase-js";
import env from "../../lib/modules/constants/env";

if (!env.SUPABASE_URL || !env.SUPABASE_SECRET) {
  throw new Error("Missing Supabase configuration");
}

export const supabase = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SECRET
);

export const STORAGE_BUCKET = "asterixh-sms-images";
