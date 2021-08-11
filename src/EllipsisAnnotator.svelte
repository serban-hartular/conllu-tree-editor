<script lang='ts'>
    import type {ConlluData} from "./tree";

    export let conllu_data : ConlluData
    let entries = [];
    let ellipsis_count = '1'
    let antecedent_count = '1'

    function onEllipsisClick() {
        onAnnotateClick(true)
    }
    function onAntecedentClick() {
        onAnnotateClick(false)
    }
    function onAnnotateClick(isEllipsis : boolean) {
        var text = conllu_data.MISC
        if(text != '') text += '|'
        text += ((isEllipsis ? 'Ellipsis' : 'Antecedent') + '=' + (isEllipsis ? ellipsis_count : antecedent_count))
        conllu_data.MISC = text
        var i = parseInt(isEllipsis ? ellipsis_count : antecedent_count) //increment
        if(i != NaN) {
            if(isEllipsis) ellipsis_count = String(i+1)
            else antecedent_count = String(i+1)
        }
    }

</script>

<h3>Ellipsis Annotator</h3>
<button on:click={onEllipsisClick}>Ellipsis</button>
<input bind:value={ellipsis_count}> <br/>
<button on:click={onAntecedentClick}>Antecedent</button>
<input bind:value={antecedent_count}> <br/>

<style>
    h3 {
        padding-bottom: 0px;
    }
</style>