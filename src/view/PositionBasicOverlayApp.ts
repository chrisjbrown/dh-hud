import { SvelteApp } from '#runtime/svelte/application';
import { deepMerge } from '#runtime/util/object';

import Overlay from './Overlay.svelte';

export class PositionBasicOverlayApp extends SvelteApp {
   /**
    * Default Application options
    *
    * @returns {SvelteApp.Options} options - SvelteApp options.
    * @see https://typhonjs-fvtt-lib.github.io/api-docs/interfaces/_runtime_svelte_application.SvelteApp.Options.html
    */
   static get defaultOptions() {
      return deepMerge(super.defaultOptions, {
         id: 'position-basic-overlay',
         classes: ['dh-hud'],
         minimizable: false,
         positionable: false,
         resizable: false,
         popOut: false,

         svelte: {
            class: Overlay,
            styles: {
               position: 'static',
            },
            target: document.querySelector("#ui-left-column-1") || document.body
         }
      });
   }
}
