<script lang="ts">
    //	import { slide } from 'svelte/transition'
        import SvelteTooltip from 'svelte-tooltip';    
        import type ConlluTree from './tree';
        
        export let node : ConlluTree;
        export let is_expanded : boolean;
        export let selected_id : string;

    $: {
        node;
        node.data = node.data
    }

    function handleClick() {
        if(selected_id == node.data.ID)
            selected_id = ''
        else
            selected_id = node.data.ID
        node = node
    }
    function handleKeypress(event) {
        //console.log(event.charCode)
        if(event.charCode == 13) {
            event.target.blur()
        }
    }
    function deprelBlur(event) {
        node.data.DEPREL = event.target.innerHTML
        //console.log(event.target.innerHTML)
        selected_id = node.data.ID //let it still be selected, so as to update edit table
    }
    function uposlBlur(event) {
        node.data.UPOS = event.target.innerHTML
        //console.log(event.target.innerHTML)
        selected_id = node.data.ID //let it still be selected, so as to update edit table

    }

</script>
<div style="background-color:{selected_id==node.data.ID ? 'lightblue':'white'}"
    on:click={handleClick} >
    <div class="deprel" contenteditable="true" on:keypress={handleKeypress} on:blur={deprelBlur}>{node.data.DEPREL}</div>:
    
    {#if is_expanded || !node.children || node.children.length == 0}
        <div class="form">{node.data.FORM}</div>
        <SvelteTooltip tip={JSON.stringify(node.data.FEATS)} right color="#AAAAAA">
            (<span class="info" contenteditable="true" on:keypress={handleKeypress} on:blur={uposlBlur}> {node.data.UPOS}</span>)
        </SvelteTooltip>
    {:else}
        <span class="form">{node.component_text}</span>
    {/if}
</div>

<style>
    .deprel {
        font-family: Georgia, 'Times New Roman', Times, serif;
        font-weight: bold;
    }
    .info {
        font-family: Georgia, 'Times New Roman', Times, serif;
        font-style: italic;
    }
    .form {
        font-family: Arial, Helvetica, sans-serif;
    }
    div {
        display: inline;
    }
</style>
