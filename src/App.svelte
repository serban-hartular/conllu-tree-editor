<script lang="ts">
	import { children, dataset_dev } from 'svelte/internal';
	import TreeView from './TreeView.svelte';
	import ParseRequest from './ParseRequest.svelte';
	import DictEditor from './DictEditor.svelte';
	import EllipsisAnnotator from './EllipsisAnnotator.svelte';


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
	import { EllipsisDetector, EllipsisReport } from './ellipsisDetector';
	import {ro_intranz_licensers, ro_obj_licensers, ro_passreflex_licensers, 
			ro_copula_licensers, ro_indir_copula_licensers} from './roEllipsisPatterns'
	let e_obj_detector = new EllipsisDetector([ro_obj_licensers, ro_passreflex_licensers,
		ro_intranz_licensers, ro_copula_licensers, ro_indir_copula_licensers])
	let e_list : Array<EllipsisReport> = []
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
		e_list = e_obj_detector.findEllipsis(conllu_tree)
		// let node_list = e_obj_detector.findEllipsis(conllu_tree) 
		// console.log(node_list)
		// for(let node of node_list) {
		// 	e_list.push({node:node, message:'dirobj'})
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
						<tr><th colspan="3">Candidates</th></tr>
						<tr><th>ID</th><th>Lemma</th><th>Missing</th></tr>
					{/if}
					{#each e_list as ellipsis}
						<tr on:click={onEllipsisClick}>
						<td class="ellipses" id={ellipsis.node.data.ID}>{ellipsis.node.data.ID}</td>
						<td class="ellipses" id={ellipsis.node.data.ID}>{ellipsis.node.data.FORM}</td>
						<td class="ellipses" id={ellipsis.node.data.ID}>{ellipsis.type}</td>
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

	.ellipses {
		text-align: center;
		padding: 3px
	}
</style>
