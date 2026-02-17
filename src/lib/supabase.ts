import { createClient } from "@supabase/supabase-js";
import env from "../../lib/modules/constants/env";

if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing Supabase configuration");
}

export const supabase = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

export const STORAGE_BUCKET = "asterixh-sms-images";
