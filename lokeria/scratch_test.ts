import { createClient } from "@supabase/supabase-js";

async function test() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ""
  );
  
  const { data: allJobs } = await supabase.from("jobs").select("*").limit(1);
  console.log("Jobs columns:", Object.keys(allJobs?.[0] || {}));
}
test().catch(console.error);

test().catch(console.error);
