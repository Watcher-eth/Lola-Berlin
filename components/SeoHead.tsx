import Head from "next/head";

type SeoHeadProps = {
  title: string;
  description: string;
  path?: string;
};

const siteName = "Lola";
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lola.berlin";
const ogImagePath = "/Lola.jpg";

export function SeoHead({
  title,
  description,
  path = "/",
}: SeoHeadProps) {
  const canonicalUrl = new URL(path, baseUrl).toString();
  const fullTitle = title === siteName ? siteName : `${title} | ${siteName}`;
  const ogImageUrl = new URL(ogImagePath, baseUrl).toString();

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
      <meta
        key="og:image:secure_url"
        property="og:image:secure_url"
        content={ogImageUrl}
      />
      <meta key="og:image:type" property="og:image:type" content="image/jpeg" />
      <meta key="og:image:width" property="og:image:width" content="2400" />
      <meta key="og:image:height" property="og:image:height" content="1792" />
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
