import { Helmet } from "react-helmet-async";

const SITE_URL = "https://www.globalscion.com";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

const SEO = ({
  title,
  description,
  keywords = "",
  canonical = "/",
  image = DEFAULT_IMAGE,
  type = "website",

  // ==============================
  // STRUCTURED DATA / JSON-LD
  // ==============================
  structuredData = null,
}) => {
  const canonicalUrl = canonical.startsWith("http")
    ? canonical
    : `${SITE_URL}${canonical}`;

  // Convert single schema object into array
  const schemas = structuredData
    ? Array.isArray(structuredData)
      ? structuredData
      : [structuredData]
    : [];

  return (
    <Helmet>
      {/* ==============================
          BASIC SEO
      ============================== */}

      <title>{title}</title>

      <meta
        name="description"
        content={description}
      />

      {/* Google does not use meta keywords
          for ranking, but keeping this is harmless */}
      <meta
        name="keywords"
        content={keywords}
      />

      <meta
        name="robots"
        content="index, follow"
      />

      <link
        rel="canonical"
        href={canonicalUrl}
      />

      {/* ==============================
          OPEN GRAPH
      ============================== */}

      <meta
        property="og:title"
        content={title}
      />

      <meta
        property="og:description"
        content={description}
      />

      <meta
        property="og:type"
        content={type}
      />

      <meta
        property="og:url"
        content={canonicalUrl}
      />

      <meta
        property="og:image"
        content={image}
      />

      <meta
        property="og:site_name"
        content="GlobalScion"
      />

      {/* ==============================
          TWITTER
      ============================== */}

      <meta
        name="twitter:card"
        content="summary_large_image"
      />

      <meta
        name="twitter:title"
        content={title}
      />

      <meta
        name="twitter:description"
        content={description}
      />

      <meta
        name="twitter:image"
        content={image}
      />

      {/* ==============================
          STRUCTURED DATA / JSON-LD
      ============================== */}

      {schemas.map((schema, index) => (
        <script
          key={`structured-data-${index}`}
          type="application/ld+json"
        >
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;