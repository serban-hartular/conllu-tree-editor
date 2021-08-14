<script lang='ts'>
    import type {ConlluData} from "./tree";
	import Modal,{getModal} from './Modal.svelte'

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
<table><tr>
    <td><h3>Ellipsis Annotator</h3></td>
    <td><button class="help" on:click={()=>getModal('ellipsis_annotator').open()}>?</button></td>
</tr></table>
<button on:click={onEllipsisClick}>Ellipsis</button>
<input bind:value={ellipsis_count}> <br/>
<button on:click={onAntecedentClick}>Antecedent</button>
<input bind:value={antecedent_count}> <br/>

<Modal id="ellipsis_annotator">
    <p class="modal">The ellipsis annotator simply adds "Ellisis=X" or "Antecedent=X" to the MISC field.</p>
    <p class="modal">The value X can be changed in the adjacent text input.</p>
    <p class="modal">If it's a number, it will autoincrement. To undo, manually edit the MISC field.</p>
</Modal>

<style>
    h3 {
        padding-bottom: 0px;
    }
    .help {
        padding: 0px 10px 0px 10px;
        font-weight: bold;
        ;
    }

</style>