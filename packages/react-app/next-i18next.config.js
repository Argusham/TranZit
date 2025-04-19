/** @type {import('next-i18next').UserConfig} */
module.exports = {
    i18n: {
      defaultLocale: "en",
      locales: ["en", "af", "de", "xh", "zu"],
    },
    localePath: "./public/locales",
    localeStructure: "{{lng}}", // important for flat structure
    defaultNS: "default",        // name of your translation file (e.g., "en.json" -> defaultNS = "default")
    fallbackNS: "default",       // fallback if namespace not found
    ns: ["default"],             // explicitly set available namespaces
  };
  