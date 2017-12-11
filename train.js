var natural = require('../natural');
var fs = require('fs');

console.info('Initiating scripts');

function selectRuleTemplates(templateNames) {
  var templates = [];
  templateNames.forEach(function(name) {
    if (natural.RuleTemplates[name]) {
      template = new natural.RuleTemplate(name, natural.RuleTemplates[name]);
      templates.push(template);
    }
  });
  return templates;
}

var data = null;
var corpus = null;
var BROWN = 1;
var percentageTrain = 60;
var trainLexicon = null;
var templates = null;
var trainer = null;
var ruleSet = null;

var templateNames = ["NEXT-TAG",
                    "PREV-WORD-IS-CAP",
                    "PREV-1-OR-2-OR-3-TAG",
                    "PREV-1-OR-2-TAG",
                    "PREV-TAG",
                    "NEXT-WORD-IS-CAP",
                    "CURRENT-WORD-IS-CAP",
                    "CURRENT-WORD-IS-NUMBER",
                    "CURRENT-WORD-IS-URL",
                    "CURRENT-WORD-ENDS-WITH",
                    "NEXT1OR2TAG",
                    "NEXT1OR2OR3TAG",
                    "SURROUNDTAG",
                    "NEXT2TAG"];

console.info('Variables setted');


console.info('Loading Corpus');

var text = fs.readFileSync('./corpus.txt', 'utf8');
var corpus = new natural.Corpus(text, BROWN);

console.info('Spliting train test corpora');

var corpora = corpus.splitInTrainAndTest(percentageTrain);

console.info('Building Lexicon');
var trainLexicon = corpora[0].buildLexicon();
trainLexicon .setDefaultCategories("NN", "NP");
console.info('Lexicon:');
console.info(trainLexicon);

fs.writeFileSync('pt_br-lexicon.json', JSON.stringify(trainLexicon.lexicon, null, 2), 'utf-8', function (err) {
    if (err)
        return console.log(err);
    console.log('Lexicon saved!');
});

console.info('Selecting Rules Templates');
templates = selectRuleTemplates(templateNames);
// var lexicon = corpus.buildLexicon();

console.info('Initiating ruleset training');
trainer = new natural.BrillPOSTrainer(1);
ruleSet = trainer.train(corpora[0], templates, trainLexicon);

console.info('Printing ruleset');
console.log(ruleSet.prettyPrint());

fs.writeFileSync('pt_br-ruleset.txt', ruleSet.prettyPrint(), 'utf-8', function (err) {
    if (err)
        return console.log(err);
    console.log('RuleSet saved!');
});

console.info('Iniating tests');
var tagger = new natural.BrillPOSTagger(trainLexicon, ruleSet);
var tester = new natural.BrillPOSTester();
var scores = tester.test(corpora[1], tagger);

console.info('Tests done!');
console.log("Test score lexicon " + scores[0] + "%");
console.log("Test score after applying rules " + scores[1] + "%");
console.log(Math.abs(scores[0] - scores[1]));

// var Tester = require('natural.BrillPOSTrainer');
// var trainer = new Trainer(/* optional threshold */);
// var ruleSet = trainer.train(corpus, templates, lexicon);
// console.log(ruleSet.prettyPrint());
