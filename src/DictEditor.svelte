<script lang='ts'>

    export let obj : Object
    let entries = [];
    
    $: {
        obj;
        if(obj) {
            entries = Object.entries(obj)
        } else {
            entries = []
        }
    }

    function handleKeypress(event) {
        if(event.charCode == 13) { //if enter
            event.target.blur() // blur focus
        }
    }
    function keyvalBlur(event) {
        console.log(event.target.id + ' ' + event.target.innerHTML)
        obj[event.target.id] = event.target.innerHTML
    }

    import {findDeprel, ro_deprel_descriptions, ud_deprel_descriptions} from './descriptions'
    function deprelURL(deprel : string) : string {
        let description = findDeprel(deprel, [ro_deprel_descriptions, ud_deprel_descriptions])
        if(!description) return null
        let url = description.site
        if(!url || url == '') return null
        return url
    }
</script>

<table>
    {#each entries as [key, val] }
        <tr>
            <td class="key">
                {#if key == 'DEPREL' && deprelURL(val)}
                    <a href={deprelURL(val)} target="_blank" rel="noopener noreferrer">{key}</a>
                {:else}
                   {key}
                {/if}
            </td>
            <td class="value" id="{key}"
            contenteditable={key == 'ID' || key == 'HEAD' ? "false" : "true"}
            on:keypress={handleKeypress} on:blur={keyvalBlur}>      
                {val}          
            </td>
        </tr>
    {/each}
</table>

<style>
    table {
        border-collapse: collapse;
        border: 1px solid;
        font-family: Georgia, 'Times New Roman', Times, serif;
    }
    td {
        border-collapse: collapse;
        border: 1px solid;
        font-family: Georgia, 'Times New Roman', Times, serif;
        padding-left: 3px;
        padding-right: 3px;
    }
    /* td.key {
    } */
    td.value {
        width: 100px
    }
</style>
