<script lang="ts">
    import { createPopper } from '@popperjs/core/dist/esm';
   import { SvelteComponent } from 'svelte';

    export let props = null
    export let component = SvelteComponent
    let ref;
    let popperInstance = null
    let componentInstance = null
    let isActive = false
    let id = Date.now().toString(36) + Math.random().toString(36).substr(2)

    function show(e) {
        isActive = true
        componentInstance = new component({
            target: document.body,
            props: {...props, id}
        });

        const renderedComponent = document.querySelector(`#${id}`);

        popperInstance = createPopper(ref, renderedComponent, {
            placement: 'top'
        });

        document.addEventListener('click', detectClickOutside)
    }

    function detectClickOutside(event) {
        if (!isActive) return
        if (ref && !ref.contains(event.target)) {
            event.stopPropagation()
            hide()
        }
    }

    function hide () {
        popperInstance?.destroy()
        componentInstance?.$destroy()
        popperInstance = null
        componentInstance = null
        isActive = false
        document.removeEventListener('click', detectClickOutside);
    }

    function togglePop(event) {
        if (!isActive) {
            show()
        } else {
            hide()
        }
    }
  </script>
  
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div bind:this={ref} on:click={togglePop}>
    <slot />
</div>
  
  