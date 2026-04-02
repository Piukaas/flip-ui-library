import {bootstrapApplication} from '@angular/platform-browser';
import {createCustomElement} from '@angular/elements';
import {Type} from '@angular/core';
import {appConfig} from './app/app.config';
import {App} from './app/app';
import * as Components from 'ui-components';

bootstrapApplication(App, appConfig)
  .then((appRef) => {
    Object.entries(Components).forEach(([name, component]) => {
      if (typeof component === 'function') {
        const tagName = `flip-${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;

        if (!customElements.get(tagName)) {
          const element = createCustomElement(component as Type<any>, {
            injector: appRef.injector
          });
          customElements.define(tagName, element);
          console.log(`🚀 Registered <${tagName}>`);
        }
      }
    });
  })
  .catch((err) => console.error(err));
