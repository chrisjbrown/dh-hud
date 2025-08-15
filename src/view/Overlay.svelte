<script lang="ts">
   import { EmptyApplicationShell } from '#runtime/svelte/component/application';
   import Portrait from './Portrait.svelte'
   import Panel from './Panel.svelte'
   import Items from './Items.svelte'
   import Stats from './Stats.svelte'

   type Actor = {
      name: string
      img: string
   }

   export let elementRoot = void 0;
   let actor: Actor = null;
   let attacks: Array = []
   let features: Array = []
   let domains: Array = []
   let consumables: Array = []

   const getActor = () => {
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

   const resetItems = () => {
      attacks = []
      features = []
      domains = []
      consumables = []
   }

   const setActor = () => {
      resetItems()
      actor = getActor()
      if (!actor) return;
      const subclass = actor.items.find(i => i.type === 'subclass');
      const subclassState = subclass?.system?.featureState;

      for (const item of actor?.items || []) {
         switch (item.type) {
            case 'weapon':
               attacks.push(item)
               break
            case 'feature':
               // Only include subclass features if the subclass is active and the feature type matches the subclass state
               if (subclass && item.system.originItemType === CONFIG.DH.ITEM.featureTypes.subclass.id) {
                  const featureType = subclass
                     ? (subclass.system.features.find(x => x.item?.uuid === item.uuid)?.type ?? null)
                     : null;

                  if (
                     featureType === CONFIG.DH.ITEM.featureSubTypes.foundation ||
                     (featureType === CONFIG.DH.ITEM.featureSubTypes.specialization && subclassState >= 2) ||
                     (featureType === CONFIG.DH.ITEM.featureSubTypes.mastery && subclassState >= 3)
                  ) {
                     features.push(item)
                  }
               } else {
                  features.push(item)
               }
               break
            case 'domainCard':
               domains.push(item)
               break
            case 'consumable':
               consumables.push(item)
               break
         }
      }

      // If the actor is an adversary, check for a system attack
      if (actor?.type === 'adversary' && actor?.system?.attack) {
         attacks.push(actor.system.attack);
      }
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
         <Panel>
            <Items items={attacks} icon="fa-sword" tooltip="Attacks" />
            <Items items={features} icon="fa-award" tooltip="Features" />
            <Items items={domains} icon="fa-book" tooltip="Domains" />
            <Items items={consumables} icon="fa-wine-bottle" tooltip="Consumables" />
         </Panel>
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
