/**
 * @type {import('prettier').Options}
 */
export default {
  semi: false,

  plugins: ["prettier-plugin-astro"],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
}
