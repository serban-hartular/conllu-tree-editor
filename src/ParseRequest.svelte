<script lang="ts">
import ConlluTree from "./tree";


	export let conllu_tree : ConlluTree
    export let new_parse_flag : boolean

	let message = '';
    let sentence = '';
    let lang_value = 'ro'

    function processInput() {
        //console.log(lang_value)
        message = 'Parse requested...'
        doPost()
    }

    function doPost () {
        fetch('./parse', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: sentence,
                lang: lang_value
            }),
        })
        .then(response => response.json())
        .then(data => {
            var tree = data.tree
            var error_msg = data.error_msg
            if(error_msg && error_msg != '') {
                message = error_msg
            } else {
                conllu_tree = ConlluTree.treeFromJSONObj(tree[0])
                message = sentence
                conllu_tree.generateComponentText()
                new_parse_flag = !new_parse_flag
            }
            // for(var node of treeManager.traverse()) {
            //     if(treeManager.nodeMatches(node, {UPOS:['NOUN', 'PROPN']}))
            //         console.log(node.FORM)
            // }
        } );		
	}
</script>

<h3>Enter sentence:</h3>
<form on:submit|preventDefault={processInput}>
    <input type="text" size="50" bind:value={sentence}><br/>
    Language:
    <select bind:value={lang_value}>
        <option value='ro'>Romanian</option>
        <option value='en'>English</option>
    </select>
    <button type="submit">Parse</button>

</form>
<p><span style="font-style: italic;">{message}</span></p>
