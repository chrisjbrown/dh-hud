<script lang="ts">
    import ItemsPopover from './popovers/ItemsPopover.svelte';
    import Popover from './popovers/Popover.svelte';
    export let actor = null

    $: features = actor?.items.map((item) => {
        if (item.type === 'feature') {
          return item
        }
        return null;
      }).filter(Boolean);
  </script>
  
<Popover component={ItemsPopover} props={{ items: features }}>
  <div class="features { features?.length === 0 ? 'fade' : '' }">
    <!-- svelte-ignore a11y-missing-attribute -->
    <a data-tooltip="Features" role="button">
      <i class="fa-solid fa-bolt"></i>
    </a>
  </div>
</Popover>
  
  <style lang="scss">
    .features {
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
  
  