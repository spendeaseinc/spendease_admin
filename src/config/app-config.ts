import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "SpendEase Admin",
  version: packageJson.version,
  copyright: `© ${currentYear}, SpendEase Admin.`,
  meta: {
    title: "SpendEase Admin",
    description: "SpendEase Admin.",
  },
};
