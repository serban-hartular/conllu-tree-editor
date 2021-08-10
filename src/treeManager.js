
export default class TreeManager {
    constructor(tree) {
        this.root = tree
    }
    findNode = function(id, node=this.root) { //null) {
        //if(node == null) node = this.root
        if(node.ID == id) return node
        if(node.children) for(var child of node.children) { //for(var i = 0; i < node.children.length; i++) {
            let f = this.findNode(id, child) //node.children[i])
            if(f != null) return f
        }			
        return null
    }
    findParent(search_for, tree_to_search=this.root) {
        if(tree_to_search.children.includes(search_for))
            return tree_to_search
        if(tree_to_search.children) for(var child of tree_to_search.children) {
            let f = this.findParent(search_for, child)
            if(f != null) return f
        }			
        return null
    }
    moveToParent(child, new_parent) {
        let old_parent = this.findParent(child)
        if(old_parent == null || child == this.root || old_parent == new_parent || child == old_parent
            || child.children.includes(new_parent)) {
            return false
        }
        let index = old_parent.children.indexOf(child)
        old_parent.children.splice(index, 1)
        new_parent.children.push(child)
        new_parent.children.sort((e1, e2) => parseFloat(e1.ID) - parseFloat(e2.ID))
        return true
    }
    switchPlaces(node1, node2, properties_in_place = []) {
        //kids don't move, just properties
        //to keep, eg, DEPREL in place despite the switch, properties_in_place = ['DEPREL']
        //first, store props in new objects
        let new_node1 = new Object()
        for(var p in node2) {
            if(p != 'children' && !properties_in_place.includes(p))
                new_node1[p] = node2[p]
        }
        for(var p of properties_in_place)
            new_node1[p] = node1[p]
        let new_node2 = new Object()
        for(var p in node1) {
            if(p != 'children' && !properties_in_place.includes(p))
                new_node2[p] = node1[p]
        }
        for(var p of properties_in_place)
            new_node2[p] = node2[p]
        //now do the swap
        for(var p in new_node1)
            node1[p] = new_node1[p]
        for(var p in new_node2)
            node2[p] = new_node2[p]
    }
    redoTreeforms(node = this.root) {
        for(var child of node.children)
            this.redoTreeforms(child)
        var constituent = [...node.children]
        constituent.push(node)
        constituent.sort((e1, e2) => parseFloat(e1.ID) - parseFloat(e2.ID))
        var treeform = ''
        node.TREE_FORM = node.FORM
        for(var elem of constituent) {
            treeform += elem.TREE_FORM
            if(elem==node && !elem.MISC.includes('SpaceAfter=No'))
                treeform += ' '
        }
        node.TREE_FORM = treeform
    }
    * traverse(node = this.root) {
        yield node;
        for(var child of node.children) {
            yield *this.traverse(child)
        }
    }
    nodeMatches(node, dict) {
        for(var p in dict)
            if(node[p]) {
                if(typeof(dict[p]) == 'string') { //condition is string
                    if(! node[p].includes(dict[p]))
                        return false
                } else { //iterate through conditions
                    var includes = false
                    for(var val of dict[p]) {
                        if(node[p].includes(val)) {
                            includes = true
                            break
                        }
                    }
                    if(!includes) return false
                }
            } 
        return true
    }
}
