(function () {
  var adjectives = [
    'amber', 'azure', 'bold', 'brave', 'bright', 'calm', 'clear', 'cool',
    'crisp', 'deep', 'eager', 'fast', 'fine', 'firm', 'free', 'fresh',
    'glad', 'gold', 'grand', 'great', 'keen', 'kind', 'light', 'lush',
    'mild', 'neat', 'new', 'nice', 'open', 'proud', 'pure', 'quick',
    'quiet', 'rapid', 'rich', 'sage', 'sharp', 'shiny', 'sleek', 'smart',
    'soft', 'sure', 'swift', 'tall', 'true', 'vivid', 'warm', 'wide',
    'wise', 'young'
  ];
  var nouns = [
    'arch', 'blade', 'bloom', 'bolt', 'brook', 'brush', 'chain', 'cloud',
    'coast', 'comet', 'crest', 'crown', 'dawn', 'deck', 'drift', 'dune',
    'ember', 'field', 'flame', 'flash', 'fleet', 'flint', 'flow', 'forge',
    'frost', 'gale', 'gate', 'glow', 'grove', 'haze', 'horn', 'isle',
    'jade', 'lake', 'lark', 'leaf', 'light', 'lodge', 'mist', 'peak',
    'pine', 'reef', 'ridge', 'river', 'rock', 'rose', 'sand', 'shore',
    'sky', 'slide', 'spark', 'star', 'storm', 'stream', 'sun', 'tide',
    'trail', 'vale', 'vine', 'wave'
  ];

  window.makeName = function () {
    var adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    var noun = nouns[Math.floor(Math.random() * nouns.length)];
    var num = Math.floor(Math.random() * 900) + 100;
    return adj + '-' + noun + '-' + num;
  };
})();
