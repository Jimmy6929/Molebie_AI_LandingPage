import { createNhostClient } from "@nhost/nhost-js";

const subdomain = process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN ?? "";
const region = process.env.NEXT_PUBLIC_NHOST_REGION ?? "";

function getClient() {
  if (!subdomain || !region) return null;
  try {
    return createNhostClient({ subdomain, region });
  } catch {
    return null;
  }
}

export const nhost = getClient();
