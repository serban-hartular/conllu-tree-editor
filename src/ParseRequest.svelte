<script>
	export let treeManager

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
            treeManager.root = data
            message = sentence
            for(var node of treeManager.traverse()) {
                if(treeManager.nodeMatches(node, {UPOS:['NOUN', 'PROPN']}))
                    console.log(node.FORM)
            }
        } );		
	}
</script>

Enunț:<br/>
<form on:submit|preventDefault={processInput}>
    <input type="text" size="50" bind:value={sentence}><br/>
    <button type="submit">Analiză</button>

</form>
<p><span style="font-style: italic;">{message}</span></p>
