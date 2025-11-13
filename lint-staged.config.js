export default {
  "**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx,vue,astro,svelte}": (filenames) => {
    const filteredFilenames = filenames.filter(
      (file) => !file.includes("openapi/clients"),
    );
    if (filteredFilenames.length === 0) return [];
    return [
      `biome check --write ${filteredFilenames.join(" ")}`,
      `oxlint ${filteredFilenames.join(" ")}`,
    ];
  },
};
