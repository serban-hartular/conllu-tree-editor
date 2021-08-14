<script lang="ts">
	import { children, dataset_dev } from 'svelte/internal';
	import TreeView from './TreeView.svelte';
	import ParseRequest from './ParseRequest.svelte';
	import DictEditor from './DictEditor.svelte';
	import EllipsisAnnotator from './EllipsisAnnotator.svelte';
	import Modal,{getModal} from './Modal.svelte'


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
			ro_copula_licensers, ro_iobj_copula_licensers, ro_impers_experiment_dobj,
			ro_impers_experiment_iobj} from './roEllipsisPatterns'

	let e_obj_detector = new EllipsisDetector([ro_obj_licensers, ro_passreflex_licensers,
		ro_intranz_licensers, ro_copula_licensers, ro_iobj_copula_licensers,
		ro_impers_experiment_iobj, ro_impers_experiment_dobj])
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
		<td style="padding-left: 20px;">
			<ParseRequest bind:conllu_tree={conllu_tree} bind:new_parse_flag={new_parse_flag} />
			{#if conllu_tree}
				<table><tr>
				<td><h3>Dependency Tree</h3></td>
				<td><button class="help" on:click={()=>getModal('modal_deptree').open()}>?</button>
				</td>
				</tr></table>
				<TreeView bind:root={conllu_tree} bind:node={conllu_tree} bind:selected_id={selected_id} />
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
			<table><tr>
			<td><h3>Conllu Item Editor</h3></td>
			<td><button class="help" on:click={()=>getModal('conllu_item').open()}>?</button></td>
			</tr></table>
			<DictEditor bind:obj={selected_data} />
			<EllipsisAnnotator bind:conllu_data={selected_data} />				
			<br/>
			<div>
				<button on:click={exportToClipboard}>Export Conllu to Clipboard</button>				
			</div>
			{/if}
		</td>
	</tr>
</table>

<Modal id="modal_deptree">
	<p class="modal">The format of an expanded node is <b>dependency_relation:</b> word_form <i>(PART_OF_SPEECH)</i></p>
	<p class="modal">Hover cursor over dependency relation (deprel) to see a short description.</p>
	<p class="modal">Drag and drop tree elements to change tree structure.</p>
	<p class="modal">If you drag an element over another element, it will become the latter's child.</p>
	<p class="modal">If you drag an element over its own parent or child, they will exchange places.</p>
	<p class="modal">Click to select an element, and edit it in the Conllu Item table.</p>
</Modal>

<Modal id="conllu_item">
	<p class="modal">Click to edit the values in the second column.</p>
	<p class="modal">Click on DEPREL for the dependency relation's reference page</p>
	<p class="modal">Warning! App does not check you inputs for correctness.</p>
</Modal>


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
		padding: 0px 10px 0px 10px;
	}
	.help {
        padding: 0px 10px 0px 10px;
        font-weight: bold;
        ;
    }
	p.modal {
		text-indent: 10px;
		padding-bottom: 0px;
		margin: 0px;
	}
</style>
