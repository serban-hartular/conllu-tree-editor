<script lang="ts">
import { children, dataset_dev } from 'svelte/internal';

import ConlluTree from './tree';


	let conllu_tree : ConlluTree = null;
	// let ellipsis_detector : EllipsisDetector = null //= new EllipsisDetector([ro_obj_licensers])

	let selected_id:string = ''
	let selected_data = null
	$:{
		if(selected_id != '') {
			conllu_tree = conllu_tree
			let selected_node = conllu_tree.find({'ID':selected_id})
			selected_data = (selected_node ? selected_node.data : null)
		}
	}
	import TreeView from './TreeView.svelte';
	import ParseRequest from './ParseRequest.svelte';
	import DictEditor from './DictEditor.svelte';
	import EllipsisAnnotator from './EllipsisAnnotator.svelte';
	import { EllipsisDetector, ro_obj_licensers } from './ellipsisDetector';
	let e_detector = new EllipsisDetector([ro_obj_licensers])
	let e_list : Array<ConlluTree> = []
	let new_parse_flag = false

	$: {
		conllu_tree;
		if(conllu_tree) {
			conllu_tree.generateComponentText()
		}
	}

	$: {
		new_parse_flag; //if new parse, clear ellipsis candidates
		e_list = []
	}

	function exportToClipboard() {
		var conllu_text = ConlluTree.toConllu(conllu_tree)
		// console.log(conllu_text)
		conllu_text = "# text = " + conllu_tree.component_text + '\n' + conllu_text
        navigator.clipboard.writeText(conllu_text)
    }

	function findEllipses() {
		e_list = e_detector.findEllipsis(conllu_tree)
		// for(let node of conllu_tree.traverse()) {
		// 	if(node.matches({'UPOS':'VERB'})) console.log("verb\t%s", node.data.FORM)
		// 	if(node.matches({'PronType':'Int,Rel'})) console.log("rel\t%s", node.data.FORM)
		// 	if(node.matches({'SpaceAfter':'No'})) console.log("no_space\t%s", node.data.FORM)			
		// }
	}
	function onEllipsisClick(event) {
		// console.log(event.target)
		// console.log(event.target.id)
		selected_id = event.target.id
	}
</script>

<table>
	<tr>
		<td>
			<ParseRequest bind:conllu_tree={conllu_tree} bind:new_parse_flag={new_parse_flag} />
			{#if conllu_tree}
				<h3>Dependency Tree</h3>
				<TreeView bind:root={conllu_tree} bind:node={conllu_tree} bind:selected_id={selected_id} />
				<br/>
				<div>
					<button on:click={exportToClipboard}>Export Conllu to Clipboard</button>				
				</div>
				<br/>
				<div>
					<button on:click={findEllipses}>Find Ellipses</button>
					<table class="ellipses">
					{#if e_list.length > 0}
						<tr><th colspan="2">Candidates</th></tr>
					{/if}
					{#each e_list as ellipsis}
						<tr on:click={onEllipsisClick}>
						<td class="ellipses" id={ellipsis.data.ID}>{ellipsis.data.ID}</td>
						<td class="ellipses" id={ellipsis.data.ID}>{ellipsis.data.FORM}</td>
						</tr>
					{/each}
					</table>
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
	:global(button, input, select) {
		padding: 1px;
	}
</style>
