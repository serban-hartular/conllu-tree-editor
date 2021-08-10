<script lang='ts'>
    import type {ConlluData} from "./tree";

    export let conllu_data : ConlluData
    let entries = [];
    let ellipsis_count = '0'

    function onButtonClick() {
        var text = conllu_data.MISC
        if(text != '') text += '|'
        text += ('Ellipsis=' + ellipsis_count)
        conllu_data.MISC = text
    }

    function onCopyClick() {
        navigator.clipboard.writeText(ellipsis_count)
    }

</script>

<button on:click={onButtonClick}>Ellipsis</button>
<input bind:value={ellipsis_count}>
<button on:click={onCopyClick}>Copy</button>