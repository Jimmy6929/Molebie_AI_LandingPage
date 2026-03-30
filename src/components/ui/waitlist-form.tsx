"use client";

import { useActionState, useEffect, useRef } from "react";
import { joinWaitlist, type WaitlistResult } from "@/app/actions/waitlist";

const initialState: WaitlistResult = { success: false, message: "" };

export function WaitlistForm({
  source = "landing_page",
  inverted = false,
}: {
  source?: string;
  inverted?: boolean;
}) {
  const [state, formAction, pending] = useActionState(joinWaitlist, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success && formRef.current) {
      formRef.current.reset();
    }
  }, [state.success]);

  const borderColor = inverted ? "border-base-black" : "border-accent-yellow";
  const btnBg = inverted
    ? "bg-base-black text-accent-yellow"
    : "bg-accent-yellow text-base-black";
  const inputText = inverted ? "text-base-black placeholder:text-base-black/40" : "text-bg-white placeholder:text-bg-white/40";
  const inputBg = inverted ? "bg-accent-yellow" : "bg-base-black";

  return (
    <div>
      <form ref={formRef} action={formAction} className={`flex flex-col sm:flex-row border-2 ${borderColor}`}>
        <input type="hidden" name="source" value={source} />
        <input
          type="email"
          name="email"
          required
          placeholder="Enter your email"
          className={`flex-1 px-4 py-3 ${inputBg} ${inputText} font-mono text-sm focus:outline-none`}
          disabled={pending}
        />
        <button
          type="submit"
          disabled={pending}
          className={`${btnBg} px-6 py-3 font-black uppercase tracking-widest text-sm transition-opacity disabled:opacity-60`}
        >
          {pending ? "Subscribing..." : "Get Updates"}
        </button>
      </form>

      {state.message && (
        <p
          className={`mt-2 text-sm font-mono ${
            state.success
              ? inverted
                ? "text-base-black"
                : "text-accent-yellow"
              : "text-red-400"
          }`}
        >
          {state.success ? "\u2713 " : ""}{state.message}
        </p>
      )}
    </div>
  );
}
