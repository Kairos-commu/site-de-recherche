module.exports = function (eleventyConfig) {
  // ─────────────────────────────────────────
  // PASSTHROUGH COPY
  // ─────────────────────────────────────────

  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/fonts");
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

  // ─────────────────────────────────────────
  // OBSERVATOIRE (03/10) — tout ce que l'accueil, Lire et l'article
  // calculent depuis la collection : jamais un compte ni une position tapés.
  // ─────────────────────────────────────────

  function minutesDe(readingTime) {
    var n = parseInt(String(readingTime || "").replace(/[^0-9]/g, ""), 10);
    return isNaN(n) ? 0 : n;
  }

  // "10 min" -> 10
  eleventyConfig.addFilter("minutes", minutesDe);

  // somme des temps de lecture d'une liste d'articles -> "3 h 30"
  eleventyConfig.addFilter("dureeTotale", function (articles) {
    var tot = 0;
    articles.forEach(function (a) { tot += minutesDe(a.data.card.readingTime); });
    return Math.floor(tot / 60) + " h " + String(tot % 60).padStart(2, "0");
  });

  // "2026-09-04" -> "04.09.2026"
  eleventyConfig.addFilter("dateNum", function (dateStr) {
    var p = String(dateStr).split("-");
    return p[2] + "." + p[1] + "." + p[0];
  });

  // "2026-09-04" -> "4 sept. 2026"
  eleventyConfig.addFilter("dateCourtFr", function (dateStr) {
    var mo = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
    var d = new Date(dateStr + "T12:00:00");
    return d.getDate() + " " + mo[d.getMonth()] + " " + d.getFullYear();
  });

  // l'étiquette d'une carte : le tag d'un texte « featured », le label sinon
  eleventyConfig.addFilter("cardLabel", function (card) {
    return (card.featured ? card.tag : card.label) || "";
  });

  // articles d'une orbite donnée (0 thèse, 1 outils et terrain, 2 analyses)
  eleventyConfig.addFilter("surOrbite", function (articles, o) {
    return articles.filter(function (a) { return a.data.orbit === o; });
  });

  // Les articles qui portent le pont vers Holotheia (page /holotheia.html)
  eleventyConfig.addFilter("avecPontHolotheia", function (articles) {
    return articles.filter(function (a) { return a.data.pontHolotheia === true; });
  });

  // 2191 -> "2 191", 1.43 -> "1,43" (espace insécable, virgule décimale)
  // (écrit à la main : U+202F, que rend toLocaleString, s'affichait sans largeur — « 2191 » collé
  // en capture (03/10) ; on groupe avec une espace insécable U+00A0)
  eleventyConfig.addFilter("nombre", function (n, dec) {
    var v = Number(n);
    if (isNaN(v)) return String(n);
    var s = dec === undefined ? String(v) : v.toFixed(dec);
    var p = s.split(".");
    return p[0].replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0") + (p[1] ? "," + p[1] : "");
  });

  // éléments d'un tableau dont le champ `cle` vaut `val`
  eleventyConfig.addFilter("ou", function (arr, cle, val) {
    return (arr || []).filter(function (x) { return x[cle] === val; });
  });

  // part arrondie en pourcentage : (305, 2639) -> 12
  eleventyConfig.addFilter("part", function (a, b) {
    return b ? Math.round(a / b * 100) : 0;
  });

  // ("2026-09-06", "2026-09-26") -> "du 6 au 26 septembre 2026"
  eleventyConfig.addFilter("periodeFr", function (a, b) {
    var mo = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
    var d1 = new Date(String(a).slice(0, 10) + "T12:00:00"), d2 = new Date(String(b).slice(0, 10) + "T12:00:00");
    var j = function (d) { return d.getDate() === 1 ? "1er" : String(d.getDate()); };
    if (d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth()) {
      return "du " + j(d1) + " au " + j(d2) + " " + mo[d2.getMonth()] + " " + d2.getFullYear();
    }
    return "du " + j(d1) + " " + mo[d1.getMonth()] + " " + d1.getFullYear() + " au " + j(d2) + " " + mo[d2.getMonth()] + " " + d2.getFullYear();
  });

  // les outils de spec/tools.json d'un palier donné (auto, confirm, irreversible)
  eleventyConfig.addFilter("palier", function (tools, tier) {
    return (tools || []).filter(function (t) { return t.tier === tier; });
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
