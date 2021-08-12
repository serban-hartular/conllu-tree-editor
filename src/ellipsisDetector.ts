import type ConlluTree from "./tree";

class DeprelCheck {
    name : string
    checkFn : (n:ConlluTree) => boolean = function (n) { return true }
}

export class Licenser {
    lemmas : Array<string> = [];
    deprels : Array<DeprelCheck> = []
    constructor(deprels : Array<DeprelCheck>, lemmas : Array<string>) {
        this.deprels = deprels
        this.lemmas = lemmas
    }
    isLicenser(node : ConlluTree) : boolean {
        if(this.lemmas.includes(node.data.LEMMA)) { //is correct lemma
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

export class EllipsisDetector {
    licenser_list : Array<Licenser> = []
    constructor(licenser_list : Array<Licenser>) {
        this.licenser_list = licenser_list
    }
    findEllipsis(tree : ConlluTree) : Array<ConlluTree> {
        let ellipses = new Array<ConlluTree>()
        for(let node of tree.traverse()) {
            for(let l of this.licenser_list)
                if(l.isLicenser(node))
                    ellipses.push(node)
        }
        return ellipses
    }
}

export let ro_obj_licensers = new Licenser(
    [{name:'xcomp', checkFn:(n)=>true},
     {name:'ccomp', checkFn:(n)=>true},
     {name:'obj', checkFn:isRelativeObj}],
    ['vrea', 'putea', 'începe', 'termina', 'continua', 'încerca', 'reuși', 'refuza']
)

function isRelativeObj(node : ConlluTree) : boolean {
    if(node.matches({'PronType':'Rel'})) return false
    if(node.matches({'UPOS':'PRON'}) && node.childMatches({'DEPREL':'fixed', 'PronType':'Rel'}))
        return false
    return true
}
