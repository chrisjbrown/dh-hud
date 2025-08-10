<script lang="ts">
   import { EmptyApplicationShell } from '#runtime/svelte/component/application';
   import Panel from './Panel.svelte'
   import Attacks from './Attacks.svelte'
   import Features from './Features.svelte'
   import Domains from './Domains.svelte'
   import Portrait from './Portrait.svelte'
   import Stats from './Stats.svelte'

   type Actor = {
      name: string
      img: string
   }

   export let elementRoot = void 0;
   let actor: Actor = null;

   function getActor() {
      if (game.user.isGM) {
         if (canvas.tokens.controlled.length === 0) return actor || null
         return canvas.tokens.controlled[0].document.actor
      }

      try {
         return game.actors.get(game.user.character.id)
      } catch (error) {
         console.error(error)
         ui.notifications.warn('dh-hud: Actor not found, have you assigned a player character to this user in the user configuration?')
         return null
      }
   }

   function setActor() {
      actor = getActor()
      console.log('actor', actor)
   }

   Hooks.on('controlToken', setActor);
   Hooks.on('updateActor', setActor);
   Hooks.on('refreshToken', setActor);
   
</script>

<svelte:options accessors={true}/>

<EmptyApplicationShell bind:elementRoot>
   <!--
    * width & height will be what you set in app options.
    *
    * You are in control of adding the draggable action to whatever element that you want to be the drag handle.
    * In this case it is added to the entire `drag-target` content div therefore to allow focusable elements like the
    * included input element you should limit draggable targets by `hasTargetClassList`.
    *
    * You may choose to have a specific drag handle element that is smaller than the content area and can apply the
    * draggable action to that without the need for `hasTargetClassList`.
   -->
   <div class="overlay" role="application">
      {#if actor}
         <Portrait actor={actor} />
         {#if actor?.type === 'character'}
            <Stats actor={actor} />
         {/if}
         <div>
            <Panel>
               <div class="horizontal">
                  <Attacks actor={actor} />
                  <Features actor={actor} />
                  <Domains actor={actor} />
                  <!-- <Items actorUuid={actor.uuid} equipables={equipables} consumables={consumables} /> -->
                  <!-- <Common actorUuid={actor.uuid} /> -->
               </div>
            </Panel>
         </div>
      {/if}
   </div>
</EmptyApplicationShell>

<style lang="scss">
   .overlay {
      display: flex;
      align-items: flex-start;
      font-size: var(--font-size);
      gap: var(--dh-hud-panel-gap);
      height: calc(var(--hotbar-height) + var(--hud-height));
      z-index: var(--z-index-app);
      width: var(--players-width);
      padding: 0;

      .abilities {
         width: var(--special-width);
         height: calc(var(--hotbar-height) + var(--hud-height));
         border-radius: 5px;

         .section {
            display: flex;
            gap: 5px;
         }
      }

      .horizontal {
         display: flex;
      }

      .penalties {
         color: white;
         margin-top: 5px;
         display: flex;
      }

   }

   .panel {
      pointer-events: all;
      line-height: 1.4;
      display: grid;
      gap: var(--section-gap);
   }
</style>
