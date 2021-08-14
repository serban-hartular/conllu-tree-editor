<script lang="ts">
    //	import { slide } from 'svelte/transition'
        import SvelteTooltip from 'svelte-tooltip';    
        import type ConlluTree from './tree';
        import {ud_deprel_descriptions, ro_deprel_descriptions, findDeprel} from './descriptions'
        import { dataset_dev } from 'svelte/internal';
        
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
        { #if findDeprel(node.data.DEPREL, [ro_deprel_descriptions, ud_deprel_descriptions]) &&
            findDeprel(node.data.DEPREL, [ro_deprel_descriptions, ud_deprel_descriptions])['description'] &&
            findDeprel(node.data.DEPREL, [ro_deprel_descriptions, ud_deprel_descriptions])['description'] != ''}
            <!-- Have description, add tooltip. -->
            <SvelteTooltip tip={findDeprel(node.data.DEPREL, [ro_deprel_descriptions, ud_deprel_descriptions])['description']} right color="#AAAAAA">
                <div class="deprel">{node.data.DEPREL}</div>:
            </SvelteTooltip>
        {:else} <!-- no tooltip -->
            <div class="deprel">{node.data.DEPREL}</div>:
        {/if}

    {#if is_expanded || !node.children || node.children.length == 0} 
        <div class="form">{node.data.FORM}</div>
            (<span class="info"> {node.data.UPOS}</span>)
        <!-- {/if} -->
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
