

<script context="module">
	/* Taken from
   * https://svelte.dev/repl/a3f724e24df54b9695402576ffd68fe3?version=3.23.2
   */
	// retain module scoped expansion state for each tree node
	const _expansionState = {
		/* treeNodeId: expanded <boolean> */
	}
</script>
<script>
//	import { slide } from 'svelte/transition'

import TreeItem from "./TreeItem.svelte";

	export let treeManager
	export let node
	export let selected_id;

	let label;
	let children;

	$: {
		label = node.TREE_FORM;
		children = node.children;
	}
	
	let expanded = _expansionState[label] || false
	const toggleExpansion = () => {
		expanded = _expansionState[label] = !expanded
	}
	$: arrowDown = expanded

	function dropFn(event) {
		let dragged = treeManager.findNode(selected_id)
		if(dragged == node) return
		if(!treeManager.moveToParent(dragged, node)) {
			treeManager.switchPlaces(dragged, node, ['DEPREL'])
		}
		treeManager.redoTreeforms()
		treeManager = treeManager
	}
	
	function allowDrop(event) {
		event.preventDefault()
	}
	
	function handleDragStart(event) {
		selected_id = node.ID
	}
	
</script>

<ul><!-- transition:slide -->
	<li>
		<div draggable="true" on:dragstart={handleDragStart} on:drop={dropFn} on:dragover={allowDrop} id={label}>
			{#if children && children.length > 0}
				<span on:click={toggleExpansion} class="arrow" class:arrowDown>&#x25b6</span>
			{:else}
				<span class="no-arrow"/>
			{/if}
			<TreeItem bind:node={node} bind:is_expanded={expanded} bind:selected_id={selected_id} />
		</div>
		
		{#if children && children.length > 0 && expanded}
			{#each children as child}
				<svelte:self bind:treeManager = {treeManager} bind:node={child} bind:selected_id={selected_id}/>
			{/each}
		{/if}					
		
	</li>
</ul>

<style>
	ul {
		margin: 0;
		list-style: none;
		padding-left: 1.2rem; 
		user-select: none;
	}
	.no-arrow { padding-left: 1.0rem; }
	.arrow {
		cursor: pointer;
		display: inline-block;
		/* transition: transform 200ms; */
	}
	.arrowDown { transform: rotate(90deg); }
</style>
