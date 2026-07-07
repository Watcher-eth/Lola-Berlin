import Head from "next/head";

type SeoHeadProps = {
  title: string;
  description: string;
  path?: string;
};

const siteName = "Lola";
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.lolaliving.de";
const ogImagePath = "/LolaOg.png";
const ogImageAlt = "LOLA Wohnhaus in Berlin-Wilmersdorf";
const ogImageWidth = "1450";
const ogImageHeight = "1085";

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
      <link key="image_src" rel="image_src" href={ogImageUrl} />

      <meta key="og:type" property="og:type" content="website" />
      <meta key="og:locale" property="og:locale" content="de_DE" />
      <meta key="og:site_name" property="og:site_name" content={siteName} />
      <meta key="og:title" property="og:title" content={fullTitle} />
      <meta
        key="og:description"
        property="og:description"
        content={description}
      />
      <meta key="og:url" property="og:url" content={canonicalUrl} />
      <meta key="og:image" property="og:image" content={ogImageUrl} />
      <meta key="og:image:url" property="og:image:url" content={ogImageUrl} />
      <meta
        key="og:image:secure_url"
        property="og:image:secure_url"
        content={ogImageUrl}
      />
      <meta key="og:image:type" property="og:image:type" content="image/png" />
      <meta
        key="og:image:width"
        property="og:image:width"
        content={ogImageWidth}
      />
      <meta
        key="og:image:height"
        property="og:image:height"
        content={ogImageHeight}
      />
      <meta
        key="og:image:alt"
        property="og:image:alt"
        content={ogImageAlt}
      />

      <meta
        key="twitter:card"
        name="twitter:card"
        content="summary_large_image"
      />
      <meta key="twitter:title" name="twitter:title" content={fullTitle} />
      <meta key="twitter:url" name="twitter:url" content={canonicalUrl} />
      <meta
        key="twitter:description"
        name="twitter:description"
        content={description}
      />
      <meta key="twitter:image" name="twitter:image" content={ogImageUrl} />
      <meta
        key="twitter:image:src"
        name="twitter:image:src"
        content={ogImageUrl}
      />
      <meta
        key="twitter:image:alt"
        name="twitter:image:alt"
        content={ogImageAlt}
      />
    </Head>
  );
}
