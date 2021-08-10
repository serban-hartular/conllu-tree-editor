<script lang="ts">
import { children } from 'svelte/internal';

import ConlluTree from './tree';

	let conllu_tree : ConlluTree = ConlluTree.treeFromJSONObj({ID:1, DEPREL:'root', FORM:'Sunt', TREE_FORM:'Sunt', UPOS:'VERB', children:[]});;
	conllu_tree.generateComponentText()

	let ts_selected_id:string = ''
	let selected_data = null
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

	$: {
		conllu_tree;
		conllu_tree.generateComponentText()
	}

</script>

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
