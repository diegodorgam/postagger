var natural = require("../natural");
var path = require("path");

//var base_folder = path.join(path.dirname(require.resolve("../natural")), "brill_pos_tagger");
var rulesFilename = "./pt_br-ruleset.txt";
var lexiconFilename = "./pt_br-lexicon.json";
var defaultCategory = 'NN';

var lexicon = new natural.Lexicon(lexiconFilename, defaultCategory);
var rules = new natural.RuleSet(rulesFilename);
var tagger = new natural.BrillPOSTagger(lexicon, rules);
var sentence = "Antes de iniciarmos o estudo de origem da vida".split(' ');
//var sentence = ["I", "see", "the", "man", "with", "the", "telescope"];
console.log(JSON.stringify(tagger.tag(sentence)));
console.log(JSON.stringify(tagger.tag("empreitadas são indescritível".split(' '))));
