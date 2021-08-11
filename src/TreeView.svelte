

<script context="module">
	/* Taken from
   * https://svelte.dev/repl/a3f724e24df54b9695402576ffd68fe3?version=3.23.2
   */
	// retain module scoped expansion state for each tree node
	const _expansionState = {
		/* treeNodeId: expanded <boolean> */
	}
</script>
<script lang="ts">
//	import { slide } from 'svelte/transition'


import ConlluTree from "./tree";
import TreeItem from "./TreeItem.svelte";

	export let root : ConlluTree
	export let node : ConlluTree
	export let selected_id : string;

	let label;
	let children;

	$: {
		label = node.component_text;
		children = node.children;
	}
	
	let expanded = _expansionState[label] || false
	const toggleExpansion = () => {
		expanded = _expansionState[label] = !expanded
	}
	$: arrowDown = expanded

	function dropFn(event) {
		let dragged = root.find({'ID':selected_id})
		if(dragged == node) return
		var b = dragged.moveToParent(node)
		// console.log(b)
		if(!b) {
			ConlluTree.switchPlaces(dragged, node, ['DEPREL'])
			// console.log('switch')
		}
		root.generateComponentText()
		root = root
	}
	
	function allowDrop(event) {
		event.preventDefault()
	}
	
	function handleDragStart(event) {
		selected_id = node.data.ID
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
				<svelte:self bind:root = {root} bind:node={child} bind:selected_id={selected_id}/>
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
