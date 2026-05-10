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
      <meta key="description" name="description" content={description} />
      <meta
        key="viewport"
        name="viewport"
        content="width=device-width, initial-scale=1"
      />
      <meta key="robots" name="robots" content="index,follow" />
      <link key="canonical" rel="canonical" href={canonicalUrl} />

      <meta key="og:type" property="og:type" content="website" />
      <meta key="og:site_name" property="og:site_name" content={siteName} />
      <meta key="og:title" property="og:title" content={fullTitle} />
      <meta
        key="og:description"
        property="og:description"
        content={description}
      />
      <meta key="og:url" property="og:url" content={canonicalUrl} />
      <meta key="og:image" property="og:image" content={ogImageUrl} />
      <meta key="og:image:width" property="og:image:width" content="1200" />
      <meta key="og:image:height" property="og:image:height" content="630" />
      <meta
        key="og:image:alt"
        property="og:image:alt"
        content="Lola in Berlin-Wilmersdorf"
      />

      <meta
        key="twitter:card"
        name="twitter:card"
        content="summary_large_image"
      />
      <meta key="twitter:title" name="twitter:title" content={fullTitle} />
      <meta
        key="twitter:description"
        name="twitter:description"
        content={description}
      />
      <meta key="twitter:image" name="twitter:image" content={ogImageUrl} />
      <meta
        key="twitter:image:alt"
        name="twitter:image:alt"
        content="Lola in Berlin-Wilmersdorf"
      />
    </Head>
  );
}
