const Conference = require("../models/conference");

exports.generateSitemap = async (req, res) => {
  try {
    const conferences = await Conference.find({
      status: "Published",
    })
      .select("_id updatedAt")
      .sort({ startDate: 1 })
      .lean();

    const baseUrl = "https://www.globalscion.com";

    const staticUrls = [
      {
        path: "/",
        priority: "1.0",
      },
      {
        path: "/about",
        priority: "0.8",
      },
      {
        path: "/conferences",
        priority: "0.9",
      },
      {
        path: "/speakers",
        priority: "0.8",
      },
      {
        path: "/reviews",
        priority: "0.7",
      },
      {
        path: "/contact",
        priority: "0.7",
      },
      {
        path: "/terms",
        priority: "0.3",
      },
      {
        path: "/privacy",
        priority: "0.3",
      },
    ];

    const urls = [];

    // ======================================================
    // STATIC PAGES
    // ======================================================

    staticUrls.forEach(({ path, priority }) => {
      urls.push(`
  <url>
    <loc>${baseUrl}${path}</loc>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`);
    });

    // ======================================================
    // PUBLISHED CONFERENCES
    // ======================================================

    conferences.forEach((conference) => {
      const conferenceId = conference._id.toString();

      const lastModified = conference.updatedAt
        ? new Date(conference.updatedAt).toISOString()
        : null;

      urls.push(`
  <url>
    <loc>${baseUrl}/conferences/${conferenceId}</loc>
    ${
      lastModified
        ? `<lastmod>${lastModified}</lastmod>`
        : ""
    }
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`);
    });

    // ======================================================
    // FINAL XML
    // ======================================================

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("")}
</urlset>`;

    res
      .status(200)
      .type("application/xml")
      .send(sitemap);
  } catch (error) {
    console.error("Sitemap generation error:", error);

    return res.status(500).send(`
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`);
  }
};