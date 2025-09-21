import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import "@mdi/font/css/materialdesignicons.css";

export const customDarkTheme = {
  dark: true,
  colors: {
    background: "#000000",
    surface: "#111010",
    outline: "#2A2F35",
    primary: "#45c4a2",
    secondary: "#333333",
    success: "#22C55E",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
  },
};

export default createVuetify({
  components,
  directives,
  icons: {defaultSet: "mdi"},
  defaults: {
    VSheet: {rounded: "lg", elevation: 1},
    VCard: {rounded: "lg", elevation: 1},

    VBtn: {
      rounded: "lg",
      variant: "flat"
    },

    VTextField: {variant: "outlined", density: "compact", rounded: "lg"}
  },
  theme: {
    defaultTheme: "dark",
    themes: {dark: customDarkTheme},
  },
});
