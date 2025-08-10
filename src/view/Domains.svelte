<script lang="ts">
    import ItemsPopover from './popovers/ItemsPopover.svelte';
    import Popover from './popovers/Popover.svelte';
    export let actor = null

    $: domains = actor?.items.map((item) => {
        if (item.type === 'domainCard') {
          return item
        }
        return null;
      }).filter(Boolean);
  </script>
  
<Popover component={ItemsPopover} props={{ items: domains }}>
  <div class="domains { domains?.length === 0 ? 'fade' : '' }">
    <!-- svelte-ignore a11y-missing-attribute -->
    <a data-tooltip="domains" role="button">
      <i class="fa-solid fa-book"></i>
    </a>
  </div>
</Popover>
  
  <style lang="scss">
    .domains {
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
  
  