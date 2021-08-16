import type ConlluTree from "./tree";
import { Licenser, DeprelCheck } from "./ellipsisDetector";

export let ro_obj_licensers = new Licenser(
    'dirobj',
    [{ name: 'xcomp', checkFn: (n) => true },
    { name: 'ccomp', checkFn: (n) => true },
    { name: 'obj', checkFn: isRelativePersPron }],
    ['vrea', 'putea', 'dori', 'începe', 'termina', 'continua', 'încerca', 'reuși', 'refuza'],
    (n) => isVerb(n) && !isPassReflexive(n) && !hasIobj(n)
);

export let ro_passreflex_licensers = new Licenser(
    'passreflex subj',
    [{ name: 'csubj', checkFn: (n) => true },
    { name: 'nsubj', checkFn: (n) => true }],
    ['vrea', 'putea', 'dori'],
    (n) => isVerb(n) && isPassReflexive(n)
);

export let ro_intranz_licensers = new Licenser(
    'intranzitive subject',
    [new DeprelCheck('csubj'), new DeprelCheck('nsubj', isRelativePersPron)],
    ['trebui', 'merita'],
    isVerb
);

export let ro_copula_licensers = new Licenser(
    'subj of copulative pred',
    [new DeprelCheck('csubj'), new DeprelCheck('nsubj', isRelativePersPron)],
    ['posibil', 'probabil', 'imposibil', 'improbabil', 'ușor', 'greu'],
    (n) => isPredicativeName(n) && !hasIobj(n)
);

export let ro_iobj_copula_licensers = new Licenser(
    'subj of copulative pred w/iobj',
    [new DeprelCheck('csubj'), new DeprelCheck('nsubj', isRelativePersPron)],
    ['posibil', 'imposibil', 'ușor', 'greu', 'scârbă', 'groază', 'indiferent'],
    (n) => isPredicativeName(n) && hasIobj(n)
);

export let ro_impers_experiment_iobj = new Licenser(
    'subj of impers verb w/iobj',
    [new DeprelCheck('csubj'), new DeprelCheck('nsubj', isRelativePersPron)],
    ['plăcea', 'dori', 'conveni', 'prii'],
    (n) => isVerb(n) && hasIobj(n)
);

export let ro_impers_experiment_dobj = new Licenser(
    'subj of impers verb w/dobj',
    [new DeprelCheck('csubj'), new DeprelCheck('nsubj', isRelativePersPron)],
    ['încânta', 'dezgusta', 'scârbi', 'bucura', 'uimi', 'privi'],
    (n) => isVerb(n) && hasDobj(n)
);

function isRelativePersPron(node: ConlluTree): boolean {
    if (node.matches({ 'PronType': 'Rel' }))
        return false;
    if (node.matches({ 'UPOS': 'PRON' }) && node.childMatches({ 'DEPREL': 'fixed', 'PronType': 'Rel' }))
        return false;
    return true;
}
function isVerb(node: ConlluTree): boolean {
    return node.matches({ 'UPOS': 'VERB' });
}
function isPassReflexive(node: ConlluTree): boolean {
    return node.childMatches({ 'DEPREL': 'expl:pv' }) != null;
}
function getCopula(node : ConlluTree) : ConlluTree {
    return node.childMatches({ 'DEPREL': 'cop' })
}
function isPredicativeName(node: ConlluTree): boolean {
    return  getCopula(node) != null;
}
function hasIobj(node : ConlluTree) : boolean {
    if(node.childMatches({'DEPREL':'iobj'}) != null) return true
    if(isPredicativeName(node))
        return hasIobj(getCopula(node))
}

function getDobj(node : ConlluTree) : ConlluTree {
    return node.childMatches({'DEPREL':'obj'})
}
function hasDobj(node : ConlluTree) : boolean {
    return getDobj(node) != null
}
