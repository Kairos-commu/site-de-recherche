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
  eleventyConfig.addPassthroughCopy("src/demo_en");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy({ "src/_data/kairos.json": "kairos.json" });

  // Exclude passthrough files from template processing
  eleventyConfig.ignores.add("src/docs/**");
  eleventyConfig.ignores.add("src/demo/**");
  eleventyConfig.ignores.add("src/demo_en/**");

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

  // Engineering notes (English section, src/notes/*.md), oldest first
  eleventyConfig.addCollection("notes", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/notes/*.md")
      .sort((a, b) => new Date(a.data.published) - new Date(b.data.published));
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

  // "6 September 2026"
  eleventyConfig.addFilter("dateEn", function (dateStr) {
    const months = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    const d = new Date(dateStr + "T12:00:00");
    return d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear();
  });

  // 19 → "dix-neuf" — un compte écrit en lettres dans une phrase ne doit pas
  // être figé à la main à côté d'une collection qui se compte toute seule
  // (l'accueil disait « Vingt articles » pour 19 publiés, 11/09)
  eleventyConfig.addFilter("nombreFr", function (n) {
    const u = ["zéro","un","deux","trois","quatre","cinq","six","sept","huit","neuf","dix",
      "onze","douze","treize","quatorze","quinze","seize","dix-sept","dix-huit","dix-neuf"];
    const d = ["", "", "vingt","trente","quarante","cinquante","soixante"];
    n = Number(n);
    if (!Number.isInteger(n) || n < 0) return String(n);
    if (n < 20) return u[n];
    if (n < 70) {
      const t = Math.floor(n / 10), r = n % 10;
      if (r === 0) return d[t];
      if (r === 1) return d[t] + " et un";
      return d[t] + "-" + u[r];
    }
    return String(n);
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

  // Articles non-featured uniquement
  eleventyConfig.addFilter("nonFeatured", function (articles) {
    return articles.filter(function (a) { return !a.data.card.featured; });
  });

  // Limiter un tableau a N elements
  eleventyConfig.addFilter("limit", function (arr, n) {
    return arr.slice(0, n);
  });

  // Labels uniques pour le filtre archive
  eleventyConfig.addFilter("uniqueLabels", function (articles) {
    var labels = [];
    articles.forEach(function (a) {
      var label = a.data.card.featured ? a.data.card.tag : a.data.card.label;
      if (label && labels.indexOf(label) === -1) {
        labels.push(label);
      }
    });
    return labels;
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
