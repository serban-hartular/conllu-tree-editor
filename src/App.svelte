<script lang="ts">
import { children } from 'svelte/internal';

// import ParseRequest from './old/ParseRequest.svelte';
// import Rand from './old/Rand.svelte';
// import TreeManager from './old/treeManager.js'
import ConlluTree from './tree';

	// let treeManager;
	let conllu_tree : ConlluTree = ConlluTree.treeFromJSONObj({ID:1, DEPREL:'root', FORM:'Sunt', TREE_FORM:'Sunt', UPOS:'VERB', children:[]});;
	conllu_tree.generateComponentText()

	// $: {
	// 	treeManager = new TreeManager({ID:1, DEPREL:'root', FORM:'Sunt', TREE_FORM:'Sunt', UPOS:'VERB', children:[]})
	// }
	// $: {
	// 	conllu_tree  = new ConlluTree({ID:1, DEPREL:'root', FORM:'Sunt', TREE_FORM:'Sunt', UPOS:'VERB', children:[]});
	// 	conllu_tree.generateComponentText()
	// }
	// import TreeView from './TreeView.svelte'

	// let selected_id = '';
	let ts_selected_id:string = ''
	let selected_data = null
	// $:{
	// 	if(selected_id != '') {
	// 		treeManager = treeManager;
	// 	}
	// }
	$:{
		if(ts_selected_id != '') {
			conllu_tree = conllu_tree
			let selected_node = conllu_tree.find({'ID':ts_selected_id})
			selected_data = (selected_node ? selected_node.data : null)
		}
	}
	import TreeViewTs from './TreeViewTS.svelte';
	import ParseRequestTs from './ParseRequestTS.svelte';
	import DictEditorTs from './DictEditorTs.svelte';
	// $:{
	// 	treeManager;
	// 	conllu_tree = new ConlluTree(treeManager.root)
	// 	conllu_tree.generateComponentText()
	// }
	$: {
		conllu_tree;
		conllu_tree.generateComponentText()
	}

</script>

<!-- <ParseRequest bind:treeManager={treeManager} />
<TreeView bind:treeManager={treeManager} bind:node={treeManager.root} bind:selected_id={selected_id} /> -->
<table>
	<tr>
		<td>
			<ParseRequestTs bind:conllu_tree={conllu_tree} />
			Arbore de dependență <br/>
			<TreeViewTs bind:root={conllu_tree} bind:node={conllu_tree} bind:selected_id={ts_selected_id} />
		</td>
		<td>
			Editor Conllu
			<DictEditorTs bind:obj={selected_data} />
		</td>
	</tr>
</table>


<style>
	table td {
        padding-left: 3px;
        padding-right: 3px;
    }
	td {
		vertical-align: text-top;
	}
</style>