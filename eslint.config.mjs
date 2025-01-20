import globals from "globals";
import pluginJs from "@eslint/js";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {languageOptions: { globals: {
    ...globals.browser,  // Include browser globals
    ...globals.jest,     // Add Jest-specific globals
  },

   }},
  pluginJs.configs.recommended,
];