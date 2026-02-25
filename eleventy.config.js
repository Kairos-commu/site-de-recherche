module.exports = function (eleventyConfig) {
  // ─────────────────────────────────────────
  // PASSTHROUGH COPY
  // ─────────────────────────────────────────

  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/demo");
  eleventyConfig.addPassthroughCopy("src/docs");
  eleventyConfig.addPassthroughCopy("src/favicon.svg");
  eleventyConfig.addPassthroughCopy("src/og-image.jpg");
  eleventyConfig.addPassthroughCopy("src/CNAME");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy("src/presentation_kairos.html");
  eleventyConfig.addPassthroughCopy("src/images");

  // Exclude passthrough files from template processing
  eleventyConfig.ignores.add("src/docs/**");
  eleventyConfig.ignores.add("src/demo/**");
  eleventyConfig.ignores.add("src/presentation_kairos.html");

  // ─────────────────────────────────────────
  // COLLECTIONS
  // ─────────────────────────────────────────

  eleventyConfig.addCollection("articles", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/articles/*.md")
      .sort((a, b) => {
        const dateA = new Date(a.data.datePublished);
        const dateB = new Date(b.data.datePublished);
        if (dateA.getTime() !== dateB.getTime()) {
          return dateA - dateB;
        }
        return (a.data.order || 0) - (b.data.order || 0);
      });
  });

  // ─────────────────────────────────────────
  // FILTERS
  // ─────────────────────────────────────────

  // "24 février 2026"
  eleventyConfig.addFilter("dateFr", function (dateStr) {
    const months = [
      "janvier", "février", "mars", "avril", "mai", "juin",
      "juillet", "août", "septembre", "octobre", "novembre", "décembre"
    ];
    const d = new Date(dateStr + "T12:00:00");
    return d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear();
  });

  // "Février 2026"
  eleventyConfig.addFilter("dateMonthFr", function (dateStr) {
    const months = [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];
    const d = new Date(dateStr + "T12:00:00");
    return months[d.getMonth()] + " " + d.getFullYear();
  });

  // RFC-822 for RSS: "Mon, 24 Feb 2026 10:00:00 +0100"
  eleventyConfig.addFilter("dateRfc822", function (dateStr, timeStr) {
    const time = timeStr || "10:00:00";
    const d = new Date(dateStr + "T" + time + "+01:00");
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const pad = (n) => String(n).padStart(2, "0");
    return days[d.getUTCDay()] + ", " +
      pad(d.getUTCDate()) + " " + months[d.getUTCMonth()] + " " + d.getUTCFullYear() + " " +
      pad(d.getUTCHours()) + ":" + pad(d.getUTCMinutes()) + ":" + pad(d.getUTCSeconds()) + " +0000";
  });

  // Pad number: 1 -> "01"
  eleventyConfig.addFilter("pad", function (num) {
    return String(num).padStart(2, "0");
  });

  // ─────────────────────────────────────────
  // CONFIGURATION
  // ─────────────────────────────────────────

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "md"],
    markdownTemplateEngine: "njk"
  };
};
