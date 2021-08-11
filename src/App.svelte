<script lang="ts">
import { children } from 'svelte/internal';

import ConlluTree from './tree';

	let conllu_tree : ConlluTree = null; //ConlluTree.treeFromJSONObj({ID:1, DEPREL:'root', FORM:'Sunt', TREE_FORM:'Sunt', UPOS:'VERB', children:[]});;
	//conllu_tree.generateComponentText()

	let ts_selected_id:string = ''
	let selected_data = null
	$:{
		if(ts_selected_id != '') {
			conllu_tree = conllu_tree
			let selected_node = conllu_tree.find({'ID':ts_selected_id})
			selected_data = (selected_node ? selected_node.data : null)
		}
	}
	import TreeView from './TreeView.svelte';
	import ParseRequest from './ParseRequest.svelte';
	import DictEditor from './DictEditor.svelte';
	import EllipsisAnnotator from './EllipsisAnnotator.svelte';

	$: {
		conllu_tree;
		if(conllu_tree) conllu_tree.generateComponentText()
	}

	function exportToClipboard() {
		var conllu_text = ConlluTree.toConllu(conllu_tree)
		// console.log(conllu_text)
		conllu_text = "# text = " + conllu_tree.component_text + '\n' + conllu_text
        navigator.clipboard.writeText(conllu_text)
    }


</script>

<table>
	<tr>
		<td>
			<ParseRequest bind:conllu_tree={conllu_tree} />
			{#if conllu_tree}
				<h3>Dependency Tree</h3>
				<TreeView bind:root={conllu_tree} bind:node={conllu_tree} bind:selected_id={ts_selected_id} />
				<div>
					<br/>
					<button on:click={exportToClipboard}>Export Conllu to Clipboard</button>				
				</div>
			{/if}
		</td>
		<td>
			{#if selected_data}
			<h3>Conllu Item Editor</h3>
			<DictEditor bind:obj={selected_data} />
			<EllipsisAnnotator bind:conllu_data={selected_data} />				
			{/if}
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

	h3 {
		padding-bottom: 0px;
	}
</style>
