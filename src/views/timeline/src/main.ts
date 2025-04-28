import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./assets/main.css";
import router from "@/router/router"
import { useMarkwhenStore } from "./Markwhen/markwhenStore";
import { parse } from "@markwhen/parser";
import type { Sourced } from "./Markwhen/useLpc";
import type { EventGroup } from "@markwhen/parser";

const app = createApp(App);
const pinia = createPinia();

app.use(router)
app.use(pinia);

app.mount("#app");

// 加载示例数据
const markwhenStore = useMarkwhenStore();
fetch("../test.mw")
  .then(response => response.text())
  .then(text => {
    const mw = parse(text);
    markwhenStore.app = {
      isDark: false,
      colorMap: { default: {} }
    };
    markwhenStore.markwhen = {
      rawText: text,
      parsed: mw,
      transformed: mw.events as Sourced<EventGroup>
    };
  });

