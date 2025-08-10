<script lang="ts">
  export let skills = null
  export let actorUuid = null
  export let id = null

  function dispatchSkillRoll(skill) {
    Hooks.call("aafohud.skillRoll", actorUuid, skill);
  }
</script>

<div id={id} class="popover">
  {#each skills as skill}
    <div class="item">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <!-- svelte-ignore a11y-missing-attribute -->
      <a on:click={() => dispatchSkillRoll(skill.id)}>{skill.label}</a>
    </div>
  {/each}
</div>
  
<style lang="scss">
  .popover {
    display: flex;
    gap: 3px;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border-radius: 1em;
    color: white;
    pointer-events: all;
    border-radius: 5px;
    z-index: var(--z-index-app);
    background: url("../../../ui/denim075.png") repeat #4d4d4d;

    .item {
      margin: 5px;
      &:hover {
        text-decoration: underline;
      }
    }
  }
</style>
  