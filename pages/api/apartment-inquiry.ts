import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

type ResponseData = {
  message: string;
};

type InquiryEmail = {
  to: string[];
  bcc: string[];
  from: string;
  replyTo: string;
  subject: string;
  text: string;
};

function parseEmailList(value: string | undefined, fallback: string[] = []) {
  return (
    value
      ?.split(",")
      .map((email) => email.trim())
      .filter(Boolean) ?? fallback
  );
}

function getSmtpTransport() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_PORT) {
    throw new Error("SMTP is not configured. Set SMTP_HOST and SMTP_PORT.");
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
  });
}

async function sendInquiryEmail(email: InquiryEmail) {
  const smtpTransport = getSmtpTransport();

  await smtpTransport.sendMail({
    to: email.to,
    bcc: email.bcc.length > 0 ? email.bcc : undefined,
    from: email.from,
    replyTo: email.replyTo,
    subject: email.subject,
    text: email.text,
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed." });
  }

  const {
    name,
    email,
    rooms,
    message,
    apartmentCode,
    apartmentTitle,
    floorLabel,
    privacyAccepted,
  } = req.body as {
    name?: string;
    email?: string;
    rooms?: string;
    message?: string;
    apartmentCode?: string;
    apartmentTitle?: string;
    floorLabel?: string;
    privacyAccepted?: boolean;
  };

  if (!name?.trim() || !email?.trim()) {
    return res
      .status(400)
      .json({ message: "Name und E-Mail sind erforderlich." });
  }

  if (privacyAccepted !== true) {
    return res
      .status(400)
      .json({ message: "Die Datenschutzhinweise müssen bestätigt werden." });
  }

  const to = parseEmailList(process.env.INQUIRY_TO_EMAILS, [
    process.env.INQUIRY_TO_EMAIL || "LOLA@jeremyzimmer-immobilien.de",
  ]);
  const bcc = parseEmailList(
    process.env.INQUIRY_BCC_EMAILS || process.env.INQUIRY_BCC_EMAIL,
  );
  const from =
    process.env.INQUIRY_FROM_EMAIL ||
    process.env.SMTP_USER ||
    "no-reply@lola.berlin";

  const subject = apartmentCode
    ? `Lola Anfrage: ${apartmentCode} / ${floorLabel ?? "ohne Etage"}`
    : "Lola Anfrage";

  const text = [
    "Neue Anfrage von der Lola Apartments-Seite",
    "",
    `Name: ${name.trim()}`,
    `E-Mail: ${email.trim()}`,
    `Größe/Zimmer: ${rooms?.trim() || "-"}`,
    `Nachricht: ${message?.trim() || "-"}`,
    `Wohnung: ${apartmentCode?.trim() || "Allgemeine Anfrage"}`,
    `Titel: ${apartmentTitle?.trim() || "-"}`,
    `Etage: ${floorLabel?.trim() || "-"}`,
    "Datenschutz bestätigt: ja",
  ].join("\n");

  try {
    await sendInquiryEmail({
      to,
      bcc,
      from,
      replyTo: email.trim(),
      subject,
      text,
    });

    return res.status(200).json({ message: "Anfrage wurde versendet." });
  } catch (error) {
    console.error("Apartment inquiry failed", error);
    return res.status(500).json({
      message:
        "Die Anfrage konnte gerade nicht versendet werden. Bitte später erneut versuchen.",
    });
  }
}
