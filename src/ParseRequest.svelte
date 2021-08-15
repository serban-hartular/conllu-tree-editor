<script lang="ts">
    import ConlluTree from "./tree";
    import SvelteTooltip from 'svelte-tooltip';   
    import Modal,{getModal} from './Modal.svelte'
 


	export let conllu_tree : ConlluTree
    export let new_parse_flag : boolean
    export let lang_value :string

	let message = '';
    let sentence = '';

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
                try {
                    conllu_tree = ConlluTree.treeFromJSONObj(tree[0])
                    message = sentence
                    conllu_tree.generateComponentText()
                    new_parse_flag = !new_parse_flag
                } catch(e) {
                    message = e.name + ': ' + e.message
                }
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
    <button class="help" on:click={()=>getModal('modal1').open()}>?</button>
</form>

<p><span style="font-style: italic;">{message}</span></p>

<Modal id="modal1">
	<p class="modal">Sentence parse is carried out by the NLP-Cube dependency parser, trained on Universal Dependency corpora.</p>
    <p class="modal">Project site <a href="https://github.com/adobe/NLP-Cube" target="_blank" rel="noopener noreferrer">here</a>.</p>
    <p class="modal">As a statistical parser, it may yield erroneous parses. The resulting tree is editable (see below).</p>
    Citation:<blockquote class="modal"><a href="http://www.aclweb.org/anthology/K18-2017" target="_blank" rel="noopener noreferrer">NLP-Cube: End-to-End Raw Text Processing With Neural Networks</a>, 
        Boroș, Tiberiu and Dumitrescu, Stefan Daniel and Burtica, Ruxandra, Proceedings of the CoNLL 2018 Shared Task: Multilingual Parsing from Raw Text to Universal Dependencies, Association for Computational Linguistics. p. 171--179. October 2018</blockquote>
</Modal>


<style>
    .help {
        padding: 0px 10px 0px 10px;
        font-weight: bold;
        ;
    }
</style>