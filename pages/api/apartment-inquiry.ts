import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

type ResponseData = {
  message: string;
};

function getTransport() {
  if (process.env.SMTP_HOST && process.env.SMTP_PORT) {
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

  return nodemailer.createTransport({
    sendmail: true,
    newline: "unix",
    path: "/usr/sbin/sendmail",
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

  const { name, email, apartmentCode, apartmentTitle, floorLabel } = req.body as {
    name?: string;
    email?: string;
    apartmentCode?: string;
    apartmentTitle?: string;
    floorLabel?: string;
  };

  if (!name?.trim() || !email?.trim()) {
    return res
      .status(400)
      .json({ message: "Name und E-Mail sind erforderlich." });
  }

  const transport = getTransport();
  const to = "afg@afg-ia.de";
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
    `Wohnung: ${apartmentCode?.trim() || "Allgemeine Anfrage"}`,
    `Titel: ${apartmentTitle?.trim() || "-"}`,
    `Etage: ${floorLabel?.trim() || "-"}`,
  ].join("\n");

  try {
    await transport.sendMail({
      to,
      from,
      replyTo: email.trim(),
      subject,
      text,
    });

    return res.status(200).json({ message: "Inquiry sent." });
  } catch (error) {
    console.error("Apartment inquiry failed", error);
    return res.status(500).json({
      message:
        "Die Anfrage konnte gerade nicht versendet werden. Bitte später erneut versuchen.",
    });
  }
}
