import { PositionBasicOverlayApp } from './view/PositionBasicOverlayApp';
import '../styles/base.scss'; // Import any styles as this includes them in the build.
import { constants } from '#constants';

// shim
window.MIN_WINDOW_WIDTH = 200;
window.MIN_WINDOW_HEIGHT = 50;

/**
 * Launches and positions the main `essential-svelte-esm` menu app to the left of the sidebar.
 */
Hooks.once('ready', () => {
   const enabled = game.settings.get(constants.moduleId, "dhHudEnabled");
   if (!enabled) return
   new PositionBasicOverlayApp().render(true, { focus: true });
});

Hooks.once("init", () => {
   game.settings.register(constants.moduleId, "dhHudEnabled", {
      name: "dh-hud",
      hint: "Enable hud",
      label: "",
      scope: "client",
      config: true,
      type: Boolean,
      default: true,
      requiresReload: true,
   });
})
// Hooks.once("ready", () => {
//    if (game.user.isGM) {
//       // manual rename
//       Hooks.on("renderTokenHUD", renderTokenHUD);
//    }
// });
