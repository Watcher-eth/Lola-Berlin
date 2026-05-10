import { FormEvent, useState } from "react";

type ApartmentInquiryFormProps = {
  apartmentCode?: string;
  apartmentTitle?: string;
  floorLabel?: string;
  submitLabel?: string;
  onSuccess?: () => void;
};

export function ApartmentInquiryForm({
  apartmentCode,
  apartmentTitle,
  floorLabel,
  submitLabel = "Anfrage senden",
  onSuccess,
}: ApartmentInquiryFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/apartment-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          apartmentCode,
          apartmentTitle,
          floorLabel,
        }),
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message || "Anfrage konnte nicht gesendet werden.");
      }

      setStatus({
        type: "success",
        message: "Danke. Die Anfrage wurde versendet.",
      });
      setName("");
      setEmail("");
      onSuccess?.();
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Anfrage konnte nicht gesendet werden.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {apartmentCode ? (
        <div className="mb-6 border border-[var(--accent)]/12 bg-white/72 px-4 py-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]/58">
            Bezug
          </p>
          <p className="mt-2 text-base leading-7 text-black/74">
            {apartmentCode}
            {apartmentTitle ? ` · ${apartmentTitle}` : ""}
            {floorLabel ? ` · ${floorLabel}` : ""}
          </p>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="sr-only">Name</span>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            placeholder="Name*"
            className="w-full border border-[var(--accent)]/44 bg-transparent px-4 py-4 text-base text-[var(--ink)] outline-none transition-colors duration-300 placeholder:text-black/54 focus:border-[var(--accent)]"
          />
        </label>
        <label className="block">
          <span className="sr-only">E-Mail</span>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            placeholder="E-Mail*"
            className="w-full border border-[var(--accent)]/44 bg-transparent px-4 py-4 text-base text-[var(--ink)] outline-none transition-colors duration-300 placeholder:text-black/54 focus:border-[var(--accent)]"
          />
        </label>
      </div>

      <div className="mt-6 grid gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[var(--accent)] px-7 py-4 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-black disabled:cursor-wait disabled:opacity-70"
        >
          {isSubmitting ? "Wird gesendet..." : submitLabel}
        </button>

        {status.type !== "idle" ? (
          <p
            className={`text-sm leading-7 ${
              status.type === "success"
                ? "text-[var(--accent)]"
                : "text-[#9d3d2a]"
            }`}
          >
            {status.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
