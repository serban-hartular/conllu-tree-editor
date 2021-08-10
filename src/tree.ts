
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
    constructor(obj : Object) {
        for(var p in obj) {
            if(this[p] != undefined) {
                if(typeof(this[p]) == 'string')
                    this[p] = ConlluData.conlluEntry2Property(String(obj[p]))
                else
                    this[p] = ConlluData.conlluEntry2Obj(obj[p])
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
    static conlluEntry2Obj(text: string): Object {
        var dict = new Object()
        if(text == '_') return dict

        var list = text.split('|')
        for(var item of list) {
            var kv = item.split('=')
            if(kv.length != 2) {
                console.log('Error in value pair ' + item)
            }
            var k = kv[0], v = kv[1]
            dict[k] = v
        }
        return dict
    }
    static obj2ConlluEntry(obj : Object): string {
        var itemArray = new Array<string>()
        for(var p in obj) {
            itemArray.push(p + '=' + obj[p])
        }
        var text = itemArray.join('|')
        return ConlluData.property2ConlluEntry(text) //if empty, return '_'
    }
    matches(dict : Object) {
        for(var p in dict)
            if(this[p] != undefined) {
                var possibilities = new Array<string>()
                if(typeof(dict[p]) == 'string') { //condition is string
                    possibilities.push(dict[p])
                }
                else {
                    possibilities = new Array<string>(dict[p])
                }
                //iterate through conditions
                var includes = false
                for(var val of dict[p]) {
                    if(this[p].includes(val)) {
                        includes = true
                        break
                    }
                }
                if(!includes) return false
            } 
        return true
    }
    static swapData(data1 : ConlluData, data2 : ConlluData, properties_in_place : Array<string> = []) {
        //kids don't move, just properties
        //to keep, eg, DEPREL in place despite the switch, properties_in_place = ['DEPREL']
        //first, store props in new objects
        let new_node1 = new Object()
        for(var p in data2) {
            if(!properties_in_place.includes(p))
                new_node1[p] = data2[p]
        }
        for(var p of properties_in_place)
            new_node1[p] = data1[p]
        let new_node2 = new Object()
        for(var p in data1) {
            if(!properties_in_place.includes(p))
                new_node2[p] = data1[p]
        }
        for(var p of properties_in_place)
            new_node2[p] = data2[p]
        //now do the swap
        for(var p in new_node1)
            data1[p] = new_node1[p]
        for(var p in new_node2)
            data2[p] = new_node2[p]
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
        // if(obj['children']) for(var child of obj['children']) {
        //     //console.log(child)
        //     this.children.push(new ConlluTree(child, this))
        // }
    }
    addChild(child : ConlluTree) {
        child.parent = this
        this.children.push(child)
        this.children.sort((e1, e2) => parseFloat(e1.data.ID) - parseFloat(e2.data.ID))
    }
    * traverse() {
        yield this;
        for(var child of this.children) {
            yield *child.traverse()
        }
    }
    matches(dict : Object) : boolean {
        return this.data.matches(dict)
    }
    find(dict : Object) {
        if(this.matches(dict))
            return this
        for(var child of this.children) {
            var r = child.find(dict)
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
        return true
    }
    generateComponentText() {
        for(var child of this.children)
            child.generateComponentText()
        var constituent = [...this.children]
        constituent.push(this)
        constituent.sort((e1, e2) => parseFloat(e1.data.ID) - parseFloat(e2.data.ID))
        var treeform = ''
        this.component_text = this.data.FORM
        for(var elem of constituent) {
            treeform += elem.component_text
            if(elem==this && !(elem.data.MISC['SpaceAfter'] == 'No'))
                treeform += ' '
        }
        this.component_text = treeform
    }
    static switchPlaces(node1 : ConlluTree, node2 : ConlluTree, properties_in_place:Array<string>) {
        ConlluData.swapData(node1.data, node2.data, properties_in_place)
    }
    static treeFromJSONObj(obj : Object, children_label = 'children') : ConlluTree {
        var data = new ConlluData(obj)
        var tree = new ConlluTree(data)
        //console.log(obj[children_label])
        if(obj[children_label]) for(var child_data of obj[children_label]) {
            tree.addChild(ConlluTree.treeFromJSONObj(child_data))
        }
        return tree
    }
}
