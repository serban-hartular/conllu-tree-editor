import type ConlluTree from "./tree";

export class DeprelCheck {
    name : string
    checkFn : (n:ConlluTree) => boolean = function (n) { return true }
    constructor(name:string, checkFn : (n:ConlluTree) => boolean = function (n) { return true }) {
        this.name = name
        this.checkFn = checkFn
    }
}

export class Licenser {
    name : string
    lemmas : Array<string> = [];
    deprels : Array<DeprelCheck> = []
    lemma_check : (n:ConlluTree) => boolean
    constructor(name : string, deprels : Array<DeprelCheck>, lemmas : Array<string>, lemma_check = function (n) { return true }) {
        this.name = name
        this.deprels = deprels
        this.lemmas = lemmas
        this.lemma_check = lemma_check
    }
    isLicenser(node : ConlluTree) : boolean {
        if(this.lemmas.includes(node.data.LEMMA) && this.lemma_check(node)) { //is correct lemma
            for(let child of node.children) {
                for(let deprel of this.deprels) {
                    if(child.data.DEPREL == deprel.name && deprel.checkFn(child))
                        //has target deprel and checks out
                        return false
                }
            }
            return true
        }
        return false
    }
}

export class EllipsisReport {
    node : ConlluTree
    type : string
    constructor(node : ConlluTree, type : string = '') {
        this.node = node
        this.type = type
    }
}

export class EllipsisDetector {
    licenser_list : Array<Licenser> = []
    constructor(licenser_list : Array<Licenser>) {
        this.licenser_list = licenser_list
    }
    findEllipsis(tree : ConlluTree) : Array<EllipsisReport> {
        let ellipses = new Array<EllipsisReport>()
        for(let node of tree.traverse()) {
            for(let l of this.licenser_list)
                if(l.isLicenser(node))
                    ellipses.push(new EllipsisReport(node, l.name))
        }
        return ellipses
    }
}

