"use client";

import { useState } from "react";

import { submitInquiryAction } from "@/app/inquiry-actions";

export function useInquiryForm(errorFallback: string) {
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    try {
      const result = await submitInquiryAction(formData);
      if (result.ok) {
        setSubmitted(true);
      } else {
        setError(result.message || errorFallback);
      }
    } catch {
      setError(errorFallback);
    } finally {
      setPending(false);
    }
  }

  function reset() {
    setSubmitted(false);
    setError(null);
  }

  return { submitted, pending, error, onSubmit, reset };
}
