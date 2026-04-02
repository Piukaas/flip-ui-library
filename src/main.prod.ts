import { createApplication } from "@angular/platform-browser";
import { createCustomElement } from "@angular/elements";
import { Type } from "@angular/core";
import { appConfig } from "./app/app.config";
import * as Components from "ui-components";

createApplication(appConfig)
  .then((app) => {
    Object.entries(Components).forEach(([name, component]) => {
      if (typeof component === "function") {
        const tagName = `flip-${name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()}`;
        if (!customElements.get(tagName)) {
          const element = createCustomElement(component as Type<any>, { injector: app.injector });
          customElements.define(tagName, element);
        }
      }
    });
  });
