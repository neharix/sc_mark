import { createApp } from "vue";
import { createPinia } from "pinia";
import I18NextVue from "i18next-vue";
import i18next from "i18next";
import VueECharts from "vue-echarts";
import * as echarts from "echarts";

import "./assets/fonts/nunito/font.css";
import "./assets/css/tailwind.css";
import "./assets/css/base.css";
import locales from "./locales/init";
import App from "./App.vue";
import router from "./router";

const language = localStorage.getItem("language") || "tk";
i18next
  .init({
    lng: language,
    interpolation: {
      escapeValue: false,
    },
    fallbackLng: false,
    resources: {
      tk: { translation: locales.tk },
      en: { translation: locales.en },
      ru: { translation: locales.ru },
    },
  })
  .then(() => {
    localStorage.setItem("language", language);
  });
// axiosInstance.defaults.headers["Accept-Language"] = language;

const app = createApp(App);

app.use(createPinia());
app.use(I18NextVue, { i18next });
app.use(router);

app.component("v-chart", VueECharts);

app.mount("#app");
