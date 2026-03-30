"use server";

export type WaitlistResult = {
  success: boolean;
  message: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INSERT_WAITLIST = `
  mutation InsertWaitlist($email: String!, $source: String!) {
    insert_waitlist_one(object: { email: $email, source: $source }) {
      id
    }
  }
`;

function getGraphqlUrl() {
  const subdomain = process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN;
  const region = process.env.NEXT_PUBLIC_NHOST_REGION;
  if (!subdomain || !region) return null;
  return `https://${subdomain}.graphql.${region}.nhost.run/v1`;
}

export async function joinWaitlist(
  _prev: WaitlistResult,
  formData: FormData
): Promise<WaitlistResult> {
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const source = formData.get("source")?.toString() || "landing_page";

  if (!email || !EMAIL_REGEX.test(email) || email.length > 320) {
    return { success: false, message: "Please enter a valid email address." };
  }

  const graphqlUrl = getGraphqlUrl();
  const adminSecret = process.env.NHOST_HASURA_ADMIN_SECRET;

  if (!graphqlUrl || !adminSecret) {
    console.error("[waitlist] Missing config — url:", !!graphqlUrl, "secret:", !!adminSecret, "secret length:", adminSecret?.length);
    return { success: false, message: "Waitlist is not configured yet. Please try again later." };
  }

  try {
    const res = await fetch(graphqlUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": adminSecret,
      },
      body: JSON.stringify({
        query: INSERT_WAITLIST,
        variables: { email, source },
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[waitlist] HTTP error:", res.status, body);
      return { success: false, message: "Something went wrong. Please try again." };
    }

    const json = await res.json();

    if (json.errors?.length) {
      const msg = json.errors[0].message ?? "";
      console.error("[waitlist] GraphQL error:", msg);
      if (msg.includes("uniqueness violation") || msg.includes("duplicate")) {
        return { success: true, message: "You're already subscribed!" };
      }
      return { success: false, message: "Something went wrong. Please try again." };
    }

    return { success: true, message: "You're subscribed for updates!" };
  } catch (err) {
    console.error("[waitlist] Unexpected error:", err);
    return { success: false, message: "Something went wrong. Please try again." };
  }
}
