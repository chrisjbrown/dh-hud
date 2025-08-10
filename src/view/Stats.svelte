<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Panel from './Panel.svelte';
  export let actor = null

  $: traits = Object.keys(actor?.system?.traits).map((key) => ({
    key: key,
    label: key,
    icon: `fa-solid fa-${getIconByKey(key)}`,
    value: actor?.system?.traits[key]?.value || 0,
  }));

  const rollTrait = (event, trait) => {
    actor.sheet.options.actions.rollAttribute.call(actor.sheet, event, {
        dataset: {
            attribute: trait
        }
    })
  }

  const getIconByKey = (key) => {
    switch (key) {
      case 'strength':
        return 'fist-raised';
      case 'agility':
        return 'running';
      case 'finesse':
        return 'user-ninja';
      case 'instinct':
        return 'head-side-brain';
      case 'presence':
        return 'person-burst';
      case 'knowledge':
        return 'brain';
      default:
        return key;
    }
  }

</script>
<div>
    <Panel>
        <!-- svelte-ignore a11y-missing-attribute -->
        <div class="traits">
            { #each traits as trait}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <a
                    class="trait"
                    data-tooltip="{trait.label}"
                    role="button"
                    tabindex="0"
                    on:click={(e) => rollTrait(e, trait.key)}
                >
                    <i class="{trait.icon}" />
                    <span class="value">{trait.value}</span>
                </a>
            {/each}
        </div>
    </Panel>
</div>

 <style lang="scss">
    .traits {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 5px;
        width: var(--special-width);
        border-radius: 5px;
        height: calc(var(--hotbar-height) + var(--hud-height));

       .trait {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
          justify-content: center;
          align-items: center;

          .traits {
            min-width: 15px;
            text-align: center;
          }
          .value {
            min-width: 15px;
            text-align: center;
          }
       }
    }
 </style>
 