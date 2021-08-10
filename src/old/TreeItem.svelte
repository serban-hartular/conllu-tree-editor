<script>
    //	import { slide } from 'svelte/transition'
        import SvelteTooltip from 'svelte-tooltip';    
        
        export let node;
        export let is_expanded;
        export let selected_id;

        function handleClick() {
            if(selected_id == node.ID)
                selected_id = ''
            else
                selected_id = node.ID
            node = node
        }
    function handleKeypress(event) {
        //console.log(event.charCode)
        if(event.charCode == 13) {
            console.log(event.target)
            event.target.blur()
        }
    }
    function deprelBlur(event) {
        node.DEPREL = event.target.innerHTML
        //console.log(event.target.innerHTML)
    }
    function uposlBlur(event) {
        node.UPOS = event.target.innerHTML
        //console.log(event.target.innerHTML)
    }
</script>
<div style="background-color:{selected_id==node.ID ? 'lightblue':'white'}" on:click={handleClick}>
    <div class="deprel" contenteditable="true" on:keypress={handleKeypress} on:blur={deprelBlur}>{node.DEPREL}</div>:
    
    {#if is_expanded || !node.children || node.children.length == 0}
        <div class="form">{node.FORM}</div>
        <SvelteTooltip tip={node.FEATS} right color="#AAAAAA">
            (<span class="info" contenteditable="true" on:keypress={handleKeypress} on:blur={uposlBlur}> {node.UPOS}</span>)
        </SvelteTooltip>
    {:else}
        <span class="form">{node.TREE_FORM}</span>
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
