import { FormEvent, useState } from "react";
import Link from "next/link";

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
  const [rooms, setRooms] = useState("");
  const [message, setMessage] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!privacyAccepted) {
      setStatus({
        type: "error",
        message: "Bitte bestätigen Sie die Datenschutzhinweise.",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/apartment-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          rooms,
          message,
          apartmentCode,
          apartmentTitle,
          floorLabel,
          privacyAccepted,
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
      setRooms("");
      setMessage("");
      setPrivacyAccepted(false);
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

      <div className="mt-4">
        <label className="block">
          <span className="sr-only">Größe in Zimmern</span>
          <input
            type="text"
            name="rooms"
            value={rooms}
            onChange={(event) => setRooms(event.target.value)}
            placeholder="Größe in Zimmern"
            className="w-full border border-[var(--accent)]/44 bg-transparent px-4 py-4 text-base text-[var(--ink)] outline-none transition-colors duration-300 placeholder:text-black/54 focus:border-[var(--accent)]"
          />
        </label>
      </div>

      <div className="mt-4">
        <label className="block">
          <span className="sr-only">Nachricht</span>
          <textarea
            name="message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Freies Textfeld"
            rows={5}
            className="w-full resize-y border border-[var(--accent)]/44 bg-transparent px-4 py-4 text-base text-[var(--ink)] outline-none transition-colors duration-300 placeholder:text-black/54 focus:border-[var(--accent)]"
          />
        </label>
      </div>

      <div className="mt-6 grid gap-4">
        <label className="flex gap-3 text-sm leading-6 text-black/62">
          <input
            type="checkbox"
            name="privacyAccepted"
            checked={privacyAccepted}
            onChange={(event) => setPrivacyAccepted(event.target.checked)}
            required
            className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent)]"
          />
          <span>
            Ich habe die{" "}
            <Link
              href="/datenschutz"
              className="text-[var(--accent)] underline decoration-[var(--accent)]/34 underline-offset-4 transition-colors hover:text-black"
            >
              Datenschutzerklärung
            </Link>{" "}
            gelesen und bin einverstanden, dass meine Angaben zur Bearbeitung
            der Anfrage verarbeitet werden.
          </span>
        </label>

        <p className="text-xs leading-6 text-black/46">
          Die Wohnungen sind unmöbliert. Angaben zu Flächen, Grundrissen und
          weiteren Details sind bis zum Vertragsabschluss unverbindlich.
        </p>

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
