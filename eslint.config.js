import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        process: "readonly",
        require: "readonly",
        module: "readonly",
        exports: "readonly",
        global: "readonly",
        _N_E: "readonly",
        trustedTypes: "readonly",
        ActiveXObject: "readonly",
        Bun: "readonly",
        Deno: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "off",
      "no-sparse-arrays": "off",
      "no-prototype-builtins": "off",
      "no-self-assign": "off",
      "no-cond-assign": "off",
      "no-empty": "off",
      "no-redeclare": "off",
      "no-fallthrough": "off",
      "no-control-regex": "off",
    },
  },
  pluginJs.configs.recommended,
];