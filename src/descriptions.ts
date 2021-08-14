export function findDeprel(deprel_name : string, descriptions : Array<Array<DeprelDescription>>) : DeprelDescription {
    // let descriptions = [ro_deprel_descriptions, ud_deprel_descriptions]
    for(let d of descriptions)
        for(let deprel of d)
            if(deprel.name && deprel.name == deprel_name)
                return deprel

    return null
}

export class DeprelDescription {
    name : string
    description : string
    site: string
}

export let ud_deprel_descriptions = [
    {name: 'nsubj',     description: 'Nominal subject', site:'https://universaldependencies.org/u/dep/nsubj.html'},
    {name: 'obj',       description: 'Nominal direct object', site:'https://universaldependencies.org/u/dep/obj.html'},
    {name: 'iobj',      description: 'Indirect object', site:'https://universaldependencies.org/u/dep/iobj.html'},
    {name: 'csubj',     description: 'Clausal subject', site:'https://universaldependencies.org/u/dep/csubj.html'},
    {name: 'ccomp',     description: 'Clausal complement', site:'https://universaldependencies.org/u/dep/ccomp.html'},
    {name: 'xcomp',     description: 'Clause under syntactic control', site:'https://universaldependencies.org/u/dep/xcomp.html'},
    {name: 'obl',       description: 'Non-core nominal adjunct', site:'https://universaldependencies.org/u/dep/obl.html'},
    {name: 'vocative',  description: '', site:'https://universaldependencies.org/u/dep/vocative.html'},
    {name: 'expl',      description: 'Expletive or pleonastic nominal', site:'https://universaldependencies.org/u/dep/expl.html'},
    {name: 'dislocated',description: '', site:'https://universaldependencies.org/u/dep/dislocated.html'},
    {name: 'advcl',     description: 'Adverbial clause', site:'https://universaldependencies.org/u/dep/advcl.html'},
    {name: 'advmod',    description: 'Adverbial modifier', site:'https://universaldependencies.org/u/dep/advmod.html'},
    {name: 'discourse', description: 'Discourse particles', site:'https://universaldependencies.org/u/dep/discourse.html'},
    {name: 'aux',       description: 'Verbal auxiliary', site:'https://universaldependencies.org/u/dep/aux_.html'},
    {name: 'cop',       description: 'Copula', site:'https://universaldependencies.org/u/dep/cop.html'},
    {name: 'mark',      description: 'Subordination marker', site:'https://universaldependencies.org/u/dep/mark.html'},
    {name: 'nmod',      description: 'Nominal modifier (eg attribute or genitive)', site:'https://universaldependencies.org/u/dep/nmod.html'},
    {name: 'appos',     description: 'Appositional modifier', site:'https://universaldependencies.org/u/dep/appos.html'},
    {name: 'nummod',    description: 'Numeric modifier', site:'https://universaldependencies.org/u/dep/nummod.html'},
    {name: 'acl',       description: 'Clausal modifier of noun (adnominal clause)', site:'https://universaldependencies.org/u/dep/acl.html'},
    {name: 'amod',      description: 'Adjectival modifier', site:'https://universaldependencies.org/u/dep/amod.html'},
    {name: 'det',       description: 'Determiner', site:'https://universaldependencies.org/u/dep/det.html'},
    {name: 'clf',       description: 'Classifier', site:'https://universaldependencies.org/u/dep/clf.html'},
    {name: 'case',      description: 'Case-marking element', site:'https://universaldependencies.org/u/dep/case.html'},
    {name: 'conj',      description: 'Conjunct element', site:'https://universaldependencies.org/u/dep/conj.html'},
    {name: 'cc',        description: 'Coordinating conjunction', site:'https://universaldependencies.org/u/dep/cc.html'},
    {name: 'fixed',     description: 'Fixed multiword expression', site:'https://universaldependencies.org/u/dep/fixed.html'},
    {name: 'flat',      description: 'Exocentric (headless) expression', site:'https://universaldependencies.org/u/dep/flat.html'},
    {name: 'compound',  description: 'Any kind of X0 compounding', site:'https://universaldependencies.org/u/dep/compound.html'},
    {name: 'list',      description: '', site:'https://universaldependencies.org/u/dep/list.html'},
    {name: 'parataxis', description: '', site:'https://universaldependencies.org/u/dep/parataxis.html'},
    {name: 'orphan',    description: '', site:'https://universaldependencies.org/u/dep/orphan.html'},
    {name: 'goeswith',  description: '', site:'https://universaldependencies.org/u/dep/goeswith.html'},
    {name: 'reparandum', description: '', site:'https://universaldependencies.org/u/dep/reparandum.html'},
    {name: 'punct',     description: 'Punctuation.', site:'https://universaldependencies.org/u/dep/punct.html'},
    {name: 'root',      description: '', site:'https://universaldependencies.org/u/dep/root.html'},
    {name: 'dep',       description: 'Unspecified dependency', site:'https://universaldependencies.org/u/dep/dep.html'},
]

export let ro_deprel_descriptions = [
    {name: 'nsubj:pass',    description: 'Nominal subjects of passive verbs', site: 'https://universaldependencies.org/ro/dep/nsubj-pass.html'},
    {name: 'csubj:pass',    description: 'Clausal subjects of passive verbs', site: 'https://universaldependencies.org/ro/dep/csubj-pass.html'},
    {name: 'nmod:agent',    description: 'Agents of passive verbs', site: 'https://universaldependencies.org/ro/'},
    {name: 'nmod:pmod',     description: 'Prepositional objects which cannot be omitted as determiners of some verbs.', site: 'https://universaldependencies.org/ro/'},
    {name: 'expl:impers',   description: 'Impersonal value of the reflexive', site: 'https://universaldependencies.org/u/dep/expl-impers.html'},
    {name: 'expl:pv',       description: 'Clitics of inherently reflexive verbs', site: 'https://universaldependencies.org/u/dep/expl-pv.html'},
    {name: 'expl:pass',     description: 'Clitics with passive value', site: 'https://universaldependencies.org/u/dep/expl-pass.html'},
    {name: 'expl:poss',     description: 'Clitics with possessive value', site: 'https://universaldependencies.org/ro/dep/expl-poss.html'},
    {name: 'aux:pass',      description: 'Passive auxiliaries', site: 'https://universaldependencies.org/ro/dep/aux-pass.html'},
    {name: 'nmod:tmod',     description: 'Prepositional nouns w/temporal value', site: 'https://universaldependencies.org/u/dep/nmod-tmod.html'},
    {name: 'advcl:tcl',     description: 'Adverbial clauses w/temporal value', site: 'https://universaldependencies.org/ro/dep/advcl-tcl.html'},
    {name: 'advmod:tmod',   description: 'Adverbs with temporal value', site: 'https://universaldependencies.org/ro/dep/advmod-tmod.html'},
]