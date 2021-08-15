import { text } from "svelte/internal"

export class ConlluData {
    ID: string = ''
    FORM: string = ''
    LEMMA: string = ''
    UPOS: string = ''
    XPOS: string = ''
    FEATS: string = '' //Object = new Object()
    HEAD: string = ''
    DEPREL: string = ''
    DEPS: string = ''
    MISC: string = '' //Object = new Object()
    static ELEMENTS = ['ID', 'FORM', 'LEMMA', 'UPOS', 'XPOS', 'FEATS', 'HEAD', 'DEPREL', 'DEPS', 'MISC']
    constructor(obj : Object) {
        for(let p in obj) {
            if(this[p] != undefined) {
//                if(typeof(this[p]) == 'string')
                    this[p] = ConlluData.conlluEntry2Property(String(obj[p]))
                // else
                //     this[p] = ConlluData.conlluEntry2Obj(obj[p])
            }
        }
    }
    static conlluEntry2Property(text : string): string {
        if(text == '_') return ''
        return text
    }
    static property2ConlluEntry(prop : string): string {
        if(prop == '') return '_'
        return prop
    }
    matches(dict : Object) {
        let this_dict = new Object()
        Object.assign(this_dict, this)
        Object.assign(this_dict, ConlluData.getFeatureDict(this.FEATS)) //add FEATS k,v pairs
        Object.assign(this_dict, ConlluData.getFeatureDict(this.MISC))  //add MISC k,v pairs
        for(let p in dict) {
            if(this_dict[p] == undefined) return false
            if(this_dict[p].includes(dict[p])) continue
            return false
        } 
        return true
    }
    static swapData(data1 : ConlluData, data2 : ConlluData, properties_in_place : Array<string> = []) {
        //kids don't move, just properties
        //to keep, eg, DEPREL in place despite the switch, properties_in_place = ['DEPREL']
        //first, store props in new objects
        let new_node1 = new Object()
        for(let p in data2) {
            if(!properties_in_place.includes(p))
                new_node1[p] = data2[p]
        }
        for(let p of properties_in_place)
            new_node1[p] = data1[p]
        let new_node2 = new Object()
        for(let p in data1) {
            if(!properties_in_place.includes(p))
                new_node2[p] = data1[p]
        }
        for(let p of properties_in_place)
            new_node2[p] = data2[p]
        //now do the swap
        for(let p in new_node1)
            data1[p] = new_node1[p]
        for(let p in new_node2)
            data2[p] = new_node2[p]
    }
    toConlluLine() : string {
        let text = ''
        for(let prop of ConlluData.ELEMENTS) {
            let val = this[prop] ? this[prop] : '' 
            //console.log(prop + ', ' + val)
            val.replace(/\s+/, ' ')
            if(val == '' || val == ' ') val = '_'
            text += (val + '\t')
        }
        return text.slice(0, -1); //remove last tab
    }
    static getFeatureDict(text : string) : Object {
        //this is for getting properties of FEATS and MISC, which follow the form
        //"Key1=Value1|Key2=Value2"
        //returns text doesn't follow this format
        let dict = new Object()
        let pair_list = text.split('|')
        for(let pair of pair_list) {
            let pair_array = pair.split('=')
            if(pair_array.length != 2)
                return null
            dict[pair_array[0]] = pair_array[1]
        }
        return dict
    }
}

export default class ConlluTree {
    data : ConlluData
    children : Array<ConlluTree> = []
    parent : ConlluTree = null
    component_text = ''
    

    constructor(data : ConlluData, parent : ConlluTree = null) {
        this.parent = parent
        this.data = data
        // if(obj['children']) for(let child of obj['children']) {
        //     //console.log(child)
        //     this.children.push(new ConlluTree(child, this))
        // }
    }
    addChild(child : ConlluTree) {
        child.parent = this
        this.children.push(child)
        this.children.sort((e1, e2) => parseFloat(e1.data.ID) - parseFloat(e2.data.ID))
    }
    * traverse() : Generator<ConlluTree> {
        yield this;
        for(let child of this.children) {
            yield *child.traverse()
        }
    }
    matches(dict : Object) : boolean {
        return this.data.matches(dict)
    }
    childMatches(dict : Object) : ConlluTree {
        for(let child of this.children)
            if(child.matches(dict))
                return child
        return null
    }
    find(dict : Object) {
        if(this.matches(dict))
            return this
        for(let child of this.children) {
            let r = child.find(dict)
            if(r != null) return r
        }
        return null
    }
    moveToParent(new_parent : ConlluTree) {
        let old_parent = this.parent
        // console.log('%s %s %s %s', this.data.FORM, old_parent != null ? old_parent.data.FORM : 'null',
            // new_parent.data.FORM, this.children.includes(new_parent)) 
        if(old_parent == null  || old_parent == new_parent || this == new_parent
            || this.children.includes(new_parent)) {
            return false
        }
        let index = old_parent.children.indexOf(this)
        old_parent.children.splice(index, 1)
        new_parent.addChild(this)
        new_parent.redoHeads()
        return true
    }
    generateComponentText() {
        for(let child of this.children)
            child.generateComponentText()
        let constituent = [...this.children]
        constituent.push(this)
        constituent.sort((e1, e2) => parseFloat(e1.data.ID) - parseFloat(e2.data.ID))
        let treeform = ''
        this.component_text = this.data.FORM
        for(let elem of constituent) {
            treeform += elem.component_text
            if(elem==this && !(elem.matches({'SpaceAfter': 'No'})))
                treeform += ' '
        }
        this.component_text = treeform
    }
    redoHeads() {
        for(let node of this.traverse()) {
            if(node.parent == null) {
                node.data.HEAD = '0'
            } else {
                node.data.HEAD = node.parent.data.ID
            }
        }
    }
    static switchPlaces(node1 : ConlluTree, node2 : ConlluTree, properties_in_place:Array<string>) {
        ConlluData.swapData(node1.data, node2.data, properties_in_place)
        node1.redoHeads()
        node2.redoHeads()
    }
    static treeFromJSONObj(obj : Object, children_label = 'children') : ConlluTree {
        let data = new ConlluData(obj)
        let tree = new ConlluTree(data)
        //console.log(obj[children_label])
        if(obj[children_label]) for(let child_data of obj[children_label]) {
            tree.addChild(ConlluTree.treeFromJSONObj(child_data))
        }
        return tree
    }
    static toConllu(tree : ConlluTree) : string {
        let text = ''
        let list = new Array<ConlluData>()
        for(let node of tree.traverse()) {
            list.push(node.data)
        }
        list.sort((e1, e2) => parseFloat(e1.ID) - parseFloat(e2.ID))
        for(let word of list) {
            text = text + word.toConlluLine() + '\n'
        }
        return text + '\n'
    }
}
