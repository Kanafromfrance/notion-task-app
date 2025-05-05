import { next } from "@vercel/eslint-config";

export default [
  next(),
  {
    rules: {
      "react/no-unescaped-entities": "off",
    },
  },
];
