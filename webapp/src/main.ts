import "./polyfills.ts";

import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { enableProdMode } from "@angular/core";
import { environment } from "./environments/environment";
import { AppModule } from "./app";
import { APP_CONFIG } from "./injection-tokens";

let urlForConfig= "http://localhost:8080/api/config";

if (environment.production) {
  enableProdMode();
  urlForConfig = "./api/config";
}

fetch(urlForConfig)
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
