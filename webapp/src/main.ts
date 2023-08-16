import "./polyfills.ts";

import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { enableProdMode } from "@angular/core";
import { environment } from "./environments/environment";
import { AppModule } from "./app";
import { APP_CONFIG } from "./injection-tokens";


if (environment.production) {
  enableProdMode();
}

fetch("assets/config.json")
  .then((response) => response.json())
  .then((config: any) => {
    if (environment.production) {
      enableProdMode();
    }

    platformBrowserDynamic([{ provide: APP_CONFIG, useValue: config }])
      .bootstrapModule(AppModule)
      .catch((err) => console.error(err));
  })
  .catch((e) => {
    console.error("Couldn't load config", e);
  });
