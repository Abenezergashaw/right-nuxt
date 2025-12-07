// composables/useLocale.js
import am from "../../locales/am.json";
import om from "../../locales/om.json";
import tg from "../../locales/tg.json";
import { ref } from "vue";

export const currentLang = ref("en");

export function t(key) {
  if (currentLang.value === "am") {
    return am[key] || key;
  } else if (currentLang.value === "om") {
    return om[key] || key;
  } else if (currentLang.value === "tg") {
    return tg[key] || key;
  } else {
    return key;
  }
}
