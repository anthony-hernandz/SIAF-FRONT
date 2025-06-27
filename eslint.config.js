import globals from "globals";
import pluginJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,vue}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...pluginVue.configs["flat/essential"],

  {
    rules: {
      "no-unused-vars": "off",

      "vue/multi-word-component-names": "off",

      "no-undef": "off",

      "vue/return-in-computed-property": "off",

      "vue/no-unused-vars": "off",

      "vue/no-unused-components": "off",
    },
  },
];

