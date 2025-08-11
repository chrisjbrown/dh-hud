<script lang='ts'>
  import { createEventDispatcher } from 'svelte';
  export let actor = null

	$: ({ resources } = actor?.system);

   const getAttribute = (key: string) => {
      switch (key) {
         case 'hitPoints':
            return 'system.resources.hitPoints.value';
         case 'hope':
            return 'system.resources.hope.value';
         case 'stress':
            return 'system.resources.stress.value';
         case 'armor':
            return 'system.resources.armor.value';
         default:
            return '';
      }
   }

   let timer: NodeJS.Timeout
    const updateAttribute = (event: any, key) => {
      debounceUpdateActor(Number(event.target.value), key)
    }

    const debounceUpdateActor = (newValue: number, attribute: string) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
         const attrKey = getAttribute(attribute)
         try {
               actor.update({ [attrKey]: newValue })
         } catch (error) {
               console.error('dh-hud', `Error updating actor attribute: ${attribute}`, error)
         }
      }, 750);
    }

  const onAttributeChange = (e: Event, key: string) => {
    updateAttribute(e, key)
  }
</script>

<div class="portrait">
    <div class="top">
       {#if actor?.name}
          {actor?.name}
       {/if}
    </div>
    {#if actor?.img}
       <div class="avatar" style="background-image: url({actor?.img});"/>
    {/if}
        <div class="bottom">
            {#if resources?.armor}
            <!-- armor -->
            <div class="stat" data-tooltip="Armor" data-tooltip-direction="UP">
                <div class="icon">
                    <i class="fa-solid fa-shield"></i>
                </div>
                <div class="field">
                    <input type="number" value={resources?.armor.value} on:input={(e) => onAttributeChange(e, 'armor')} />
                    <div class="max">
                        <div>/</div>
                        <div>{resources?.armor?.max}</div>
                    </div>
                </div>
            </div>
            {/if}

            {#if resources?.hitPoints}
            <!-- health -->
            <div class="stat" data-tooltip="Health" data-tooltip-direction="UP">
                <div class="icon">
                    <i class="fa-solid fa-heart"></i>
                </div>
                <div class="field">
                    <input type="number" value={resources?.hitPoints.value} on:input={(e) => onAttributeChange(e, 'hitPoints')} />
                    <div class="max">
                        <div>/</div>
                        <div>{resources?.hitPoints?.max}</div>
                    </div>
                </div>
            </div>
            {/if}

            {#if resources?.stress}
            <!-- stress -->
            <div class="stat" data-tooltip="Stress" data-tooltip-direction="RIGHT" on:input={(e) => onAttributeChange(e, 'stress')}>
                <div class="icon">
                    <i class="fa-solid fa-bolt"></i>
                </div>
                <div class="field">
                    <input type="number" value={resources?.stress?.value} />
                    <div class="max">
                        <div>/</div>
                        <div>{resources?.stress?.max}</div>
                    </div>
                </div>
            </div>
            {/if}

            {#if resources?.hope}
            <!-- hope -->
            <div class="stat" data-tooltip="Hope" data-tooltip-direction="RIGHT">
                <div class="icon">
                    <i class="fa-solid fa-star"></i>
                </div>
                <div class="field">
                    <input type="number" value={resources?.hope?.value} on:input={(e) => onAttributeChange(e, 'hope')} />
                    <div class="max">
                        <div>/</div>
                        <div>{resources?.hope?.max}</div>
                    </div>
                </div>
            </div>
            {/if}
        </div>
 </div>

<style lang="scss">
    .portrait {
        background: var(--outer-background);
        border-radius: 5px;
        position: relative;
        height: 100%;
        padding: 0;
        aspect-ratio: 1 / 1;
        pointer-events: all;

        .top {
            position: absolute;
            height: 17px;
            color: white;
            top: 0;
            inset-inline: 0;
            text-align: center;
            background: linear-gradient(90deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.6) 20%, rgba(0, 0, 0, 0.8) 50%, rgba(0, 0, 0, 0.6) 80%, rgba(0, 0, 0, 0.3) 100%);
        }

        .avatar {
            inset: 0;
            background-position: center top;
            background-repeat: no-repeat;
            background-size: cover;
            width: 100%;
            height: 100%;
        }

        .bottom {
            color: white;
            position: absolute;
            bottom: 0;
            inset-inline: 0;
            display: grid;
            gap: var(--section-gap);
            background: rgba(33, 33, 33, .7019607843);
            padding: .2em .1em .1em;
            grid-template-columns: repeat(2, 1fr);
            align-items: center;

            .stat {
                display: flex;
                margin: 0 auto;

                .icon {
                    width: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .field {
                    display:flex;
                    align-items: center;
                    input {
                        height: 20px;
                        background: rgba(33, 33, 33, .7019607843);
                        color: white;
                        width: var(--input-width);
                        text-align: center;
                        border: none;
                        &:focus {
                            box-shadow: 0 0 5px var(--color-shadow-primary);
                        }
                    }

                    .max {
                        display: flex;
                        width: 30px;
                        gap: 5px;
                    }
                }
            }
        }
    }
</style>
