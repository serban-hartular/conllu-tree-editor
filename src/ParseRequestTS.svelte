<script lang="ts">
import ConlluTree from "./tree";


	export let conllu_tree : ConlluTree


	let message = '';
    let sentence = '';
    function processInput() {
        message = 'Se analizează'
        doPost()
    }

    function doPost () {
        fetch('./parse', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: sentence
            }),
        })
        .then(response => response.json())
        .then(data => {
            conllu_tree = ConlluTree.treeFromJSONObj(data[0])
            message = sentence
            conllu_tree.generateComponentText()

            // for(var node of treeManager.traverse()) {
            //     if(treeManager.nodeMatches(node, {UPOS:['NOUN', 'PROPN']}))
            //         console.log(node.FORM)
            // }
        } );		
	}
</script>

Enunț:<br/>
<form on:submit|preventDefault={processInput}>
    <input type="text" size="50" bind:value={sentence}><br/>
    <button type="submit">Analiză</button>

</form>
<p><span style="font-style: italic;">{message}</span></p>
