import Head from "next/head";

type SeoHeadProps = {
  title: string;
  description: string;
  path?: string;
  imagePath?: string;
};

const siteName = "Lola";
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lola.berlin";

export function SeoHead({
  title,
  description,
  path = "/",
  imagePath = "/Lola.jpg",
}: SeoHeadProps) {
  const canonicalUrl = new URL(path, baseUrl).toString();
  const fullTitle = title === siteName ? siteName : `${title} | ${siteName}`;
  const ogImageUrl = new URL(imagePath, baseUrl).toString();

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="index,follow" />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Lola in Berlin-Wilmersdorf" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />
      <meta name="twitter:image:alt" content="Lola in Berlin-Wilmersdorf" />
    </Head>
  );
}
