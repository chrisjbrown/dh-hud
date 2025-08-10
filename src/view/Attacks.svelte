<script lang="ts">
    import ItemsPopover from './popovers/ItemsPopover.svelte';
    import Popover from './popovers/Popover.svelte';
    export let actor = null

    const getActorAttacks = () => {
     return actor?.items.map((item) => {
        if (item.type === 'weapon') {
          return item
        }
        return null;
      }).filter(Boolean);
    }

    const getAdversaryAttacks = () => {
      return actor?.system?.attack ? [actor?.system?.attack] : [];
    }

    $: attacks = actor?.type === 'character' ? getActorAttacks() : getAdversaryAttacks()
  </script>
  
<Popover component={ItemsPopover} props={{ items: attacks }}>
  <div class="attacks { attacks?.length === 0 ? 'fade' : '' }">
    <!-- svelte-ignore a11y-missing-attribute -->
    <a data-tooltip="Attacks" role="button">
      <i class="fa-solid fa-sword"></i>
    </a>
  </div>
</Popover>
  
  <style lang="scss">
    .attacks {
      pointer-events: all;
      color: white;
      padding: 5px;
      min-width: 24px;
      &.fade {
        cursor: not-allowed;
        opacity: 0.5;
      }
    }
  </style>
  
  