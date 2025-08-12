<script lang="ts">
    import ItemsPopover from './popovers/ItemsPopover.svelte';
    import Popover from './popovers/Popover.svelte';
    export let items: Array = []
    export let icon: string = ''
    export let tooltip: string = ''
  </script>
  
<Popover component={ItemsPopover} props={{ items, placement: 'right' }}>
  <div class="items { items?.length === 0 ? 'fade' : '' }">
    <!-- svelte-ignore a11y-missing-attribute -->
    <a data-tooltip="{tooltip}" data-tooltip-direction="LEFT" role="button">
      <i class="fa-solid {icon}"></i>
    </a>
  </div>
</Popover>
  
  <style lang="scss">
    .items {
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
  
  