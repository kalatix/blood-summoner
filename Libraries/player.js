/* objects can have the following types:
//  equip: 400-level, inventory-able, equippable
//  craft: 300-level, inventory-able, craftable
//  picksume: 200-level, inventory-able, usable
//  pickup: 100-level, inventory-able
//  perm: permanent inventory items, not droppable
//  statsume: static in the room, but still usable
//  static: they just sit there.
*/

let maxBars = 15; //how many health bars = 100%

let player = {
  //Base stats
  level: 1,
  baseHP: 100, //100
  basePlasmoid: 35,
  baseDmgMin: 6,
  baseDmgMax: 9,
  baseHit: 0.72, //0.70
  baseCritChance: 0.03, // % chance
  baseCritFactor: 3.5, // damage multiplier
  baseAtkSpd: 7, // # of ticks it takes between attacks
  baseAtkVerb: 'punch',
  XPincrement: 100,
  XP: 50,
  prevXP: 1, //XP it took to level to the current level. For saving XP %
  nextXP: 100, //total XP to next level
  plasmoidRecoveryChance: .65,
  //unlock viewing advanced stats in the stats screen
  stLevel: false,
  stHPMax: false,
  stPlasmoidMax: false,
  stHitPercent: false,
  stDPS: false,
  stCrit: false,
  stMobBleed: false,
  stGuardBreak: false,
  stMobBerserk: false,
  stMobConfuse: false,
  stAssault: false,
  stXPNext: false,
  //Status & Milestones
  moveEnabled: true,
  actEnabled: true,
  plasmoidEnabled: false,
  milestone: false,
  //Fluctuating stats
  HP: 1,
  plasmoid: 0,
  dmgMin: 0,
  dmgMax: 0,
  hit: 0,
  critChance: 0.03,
  critFactor: 3, // multiplier when scoring a critical hit
  atkSpd: 7, //current attack speed in ticks
  defenseMod: 1, // floating point % to modify incoming damage
  living: true,
  eqHand: false, //ID of the equipped item
  eqArmor: false,
  eqAccessory: false,
  eqWeaponClass: false,
  atkVerb: 'punch',
  baseAtkTitle: 'Unarmed',
  atkTitle: '',
  inRoom: 1003, //ID of the room you're in
  talking: false, //ID of npc you're talking to
  battlingInstanceID: false,
  //ailment stats and modifiers
  mobBleedInterval: 12, //ticks
  mobBleedDmgFactor: 1,
  mobBleedDuration: 6, //repetitions
  mobBleedMaxStacks: 3,
  guardBreakDuration: 1, // # of turns a guard break prevents a mob from guarding again
  mobBerserkDuration: 4, //turns
  mobConfuseDuration: 6, //turns
  mobConfuseHitMod: .5, //multiplier
  deflectArray: [], // array of items that can deflect attacks, since they each roll sepearately
  buffs: [], //array of current buffs.
  //item modifiers
  assaultDmgMod: 1, //floating point multiplier for assault items
  //random jazz
  playTimeSeconds: 0,
  playTimeMinutes: 0,
  playTimeHours: 0,
  playTime: '',
};

let playerQuests = [
  //make sure all quests have multiple entries! Else bad lookup things could happen.
  {
    title: 'Find Marcus',
    entry: ['find marcus', 'find', 'marcus'],
    objective: 'Look for Marcus Lambert near White Crag.',
    finish: '',
    compulsion: 'mandatory',
    area: "near White Crag",
    accepted: true,
    completed: false,
    failed: false,
    killEnemyID: false,
    collectItems: false,
    ID: 1,
    acceptFunc: false,
    completeFunc: false,
    turnInFunc: function() {
      addXP(200);
    },
    failFunc: false,
  },
  {
    title: 'Crafting',
    entry: ['crafting', 'craft', 'crafting1'],
    objective: 'Scavenge 2 feral claws by killing monsters and deliver to Bart.',
    finish: 'Deliver 2 feral claws to Bart in Blood Run to learn new a crafting recipe.',
    compulsion: 'optional',
    area: "Blood Run",
    accepted: false,
    completed: false,
    failed: false,
    killEnemyID: false,
    collectItems: [
      {ID: 302, qty: 2},
    ],
    ID: 2,
    acceptFunc: function() {
      discoverRecipe(501);
      log('You agree to gather materials for Bart.');
    },
    completeFunc: false,
    turnInFunc: function() {
      removeInv(thisRoomIndex, 302, 2);
      discoverRecipe(502);
      addXP(50);
    },
    failFunc: false,
  },
  {
    title: 'Crafting II',
    entry: ['crafting', 'craft', '2', 'crafting2', 'crafting II', 'crafting 2'],
    objective: 'Deliver 1 Glittering Dust and 2 Gunpowder to Bart.',
    finish: 'Deliver 1 Glittering Dust and 2 Gunpowder to Bart in Blood Run to learn a new crafting recipe.',
    compulsion: 'optional',
    area: "Blood Run",
    accepted: false,
    completed: false,
    failed: false,
    killEnemyID: false,
    collectItems: [
      {ID: 305, qty: 1},
      {ID: 310, qty: 2},
    ],
    ID: 7,
    acceptFunc: function() {
      log('You agree to gather more materials for Bart.');
    },
    completeFunc: false,
    turnInFunc: function() {
      removeInv(thisRoomIndex, 305, 1);
      removeInv(thisRoomIndex, 310, 2);
      discoverRecipe(515); //primitive trap
      addXP(50);
    },
    failFunc: false,
  },
  {
    title: "General's Daughter",
    entry: ['general', 'daughter', "general's"],
    objective: 'Help Alex win the battle at Graff’s Battalion.',
    finish: '',
    compulsion: 'mandatory',
    area: "Graff's Battalion",
    accepted: false,
    completed: false,
    failed: false,
    killEnemyID: false,
    collectItems: false,
    ID: 3,
    acceptFunc: function() {
      log("You agree to help Alex Graff defeat the creatures.");
    },
    completeFunc: false,
    turnInFunc: function() {
      addXP(50);
    },
    failFunc: false,
  },
  {
    title: "William's Fate",
    entry: ['fate', 'william', "william's fate"],
    objective: 'Ask around Blood Run for more information on William Lider.',
    finish: '',
    compulsion: 'mandatory',
    area: "Blood Run",
    accepted: false,
    completed: false,
    failed: false,
    killEnemyID: false,
    collectItems: false,
    ID: 4,
    acceptFunc: function() {
      log("You agree to help Rose find her husband William.");
    },
    completeFunc: false,
    turnInFunc: false,
    failFunc: false,
  },
  {
    title: 'Kill the Midnight Spitter',
    entry: ['midnight spitter', 'spitter', 'midnight', 'kill'],
    objective: "Alex Graff's forces are pinned down at Graff's Battalion. She asked you to kill the Midnight Spitter.",
    finish: "Return to Alex Graff to tell her the news.",
    compulsion: 'mandatory',
    area: "Graff's Battalion",
    accepted: false,
    completed: false,
    turnedIn: false,
    failed: false,
    killEnemyID: 201,
    collectItems: false,
    ID: 5,
    acceptFunc: false,
    completeFunc: function() {
      advanceTalkPosition('alex', 20);
    },
    turnInFunc: function() {
      log("You receive 2 Twilight Shards.", 'green');
      addInv(304, 2); //give 2 twilight shards
      addXP(125);
    },
    failFunc: false,
  },
  {
    title: 'Healing Up',
    entry: ['healing up', 'healing', 'up', 'heal'],
    objective: 'Bring <w>3 Health Shards</w> and <w>2 Feral Hides</w> to General Graff in Blood Run. After you have the proper materials, craft Health Shards using <g>craft</g>.',
    finish: "Return to General Graff in Blood Run to hand over the supplies.",
    compulsion: 'optional',
    area: "Graff's Battalion",
    accepted: false,
    completed: false,
    turnedIn: false,
    failed: false,
    killEnemyID: false,
    collectItems: [
      {ID: 501, qty: 3},
      {ID: 303, qty: 2}
    ],
    ID: 6,
    acceptFunc: false,
    completeFunc: function() {
      advanceTalkPosition('general', 20);
    },
    turnInFunc: function() {
      addXP(100);
      addInv(306);
    },
    failFunc: false,
  },
  {
    title: '',
    entry: [''],
    objective: '',
    finish: '',
    compulsion: 'mandatory',
    area: "",
    accepted: false,
    completed: false,
    failed: false,
    killEnemyID: false,
    collectItems: false,
    ID: 0,
    acceptFunc: false,
    completeFunc: false,
    turnInFunc: false,
    failFunc: false,
  }
]

let invLibrary = [
  {
    entry: ['craft', 'crafting', 'bag', 'materials'],
    title: 'bag of <cr>crafting</cr> materials',
    article: 'your ',
    qty: 1,
    ID: 99,
    contents: [
      {ID: 301, qty: 4}, //ID, qty of crafting material
      {ID: 304, qty: 4},
      {ID: 305, qty: 8}
    ],
    desc: "A bag where you'd hold all your materials for crafting, if you had any.",
    type: 'perm'
  },
  {
    entry: ['letter', 'burnt', 'burnt letter'],
    title: 'burnt letter',
    article: 'a ',
    qty: 1,
    ID: 100,
    desc: "A singed letter from your father saying to meet Marcus at the bastion.",
    roomDesc: "Your father's letter flutters on the floor.",
    type: 'pickup'
  }
]

let knownRecipes = [];
let uniqueActions = [
  //{entry, title, once, onlyInRoom}
  //unique action take NPC objects as an argument
]

//TRANSLATOR

//possible equipment places for logging stat listing
let equipList = [
  'eqHand',
  'eqArmor',
  'eqAccessory'
]

//for logging common sense words for equipment codes
let translator = {
  eqHand: 'weapon',
  eqArmor: 'armor',
  eqAccessory: 'accessory',
  n: 'north',
  s: 'south',
  e: 'east',
  w: 'west',
  exitN: 'north',
  exitS: 'south',
  exitE: 'east',
  exitW: 'west'
};

let directionList = [
  'n',
  's',
  'e',
  'w'
];

let materialList = [
  'science',
  'mystical',
  'monster'
];

let tickTranslator = {
  4: 'unbelievably quickly',
  5: 'extremely quickly',
  6: 'very quickly',
  7: 'quickly',
  8: 'moderately quickly',
  9: 'at a moderate pace',
  10: 'at a moderate pace',
  11: 'moderately slowly',
  12: 'slowly',
  13: 'very slowly',
  14: 'extremely slowly',
  15: 'unbelievably slowly',
};

/////////////////////////////////////////////
/* BUFFS */
/////////////////////////////////////////////

/*  status effect classes:
//  buff: good for you
//  debuff: bad for you
//  recovery: helps hp/plasmoid, removes debuffs or status effects
//  weaken: hurts base stats, hinders recovery, or prevents certain actions
//  offense: increases dmg, hit, crit, atkspd
//  defense: increases evade, def, deflect
//  status: applies another status effect such as delay, bleed, berserk, confuse, or acid/pierce
//  loot: effects loot, xp, and plasmoid gains on kill
*/

/*  status effect triggerTypes:
//  battleRound: triggered as battle time passes, every number of ticks
//  nonBattleRound: triggered as time passes outside battle
//  playerAttack: triggered when the player HITS
//  mobAttack: triggered when a mob HITS
//  playerSkill: triggered when a player uses a skill
//  mobSkill: triggered when a mob uses a skill
//  playerDeflect: triggered on a successful deflection
//  mobAggro: triggered when a mob gets aggravated into attacking
//  mobGuard: triggered when a mob puts up its guard
//  mobDeflect: triggered when the player strikes a guarding enemy
*/

let buffList = [
  {
    entry: ['electric blade', 'electric', 'electric1'],
    title: ['Electric Blade'],
    ID: 801,
    class: ['buff', 'offense', 'status'],
    potency: 1,
    uses: 20,
    interval: 0,
    desc: "Your attacks have a 30% chance to stun enemies with electricity",
    triggerType: ['playerAttack'], // what kind of thing activates it
    triggerFunc: function() {
      var mob = checkArrayID(mobLibrary, currentTarget.ID);

      if (mob && currentTarget.living) {
        var ailment = {
          type: 'delay',
          hit: .3, // 100% to hit
          duration: 15, // delay for 15 ticks
          customLog: "Your electrified blade stuns " + mob.title + "!"
        }
        console.log("trying to afflict mob via " + this.title + " buff.");
        afflictMob(ailment, mob, currentTarget);
      }
    }
  },
  {
    entry: ['bloodthirsty blade', 'bloodthirsty', 'bloodthirsty1'],
    title: ['Bloodthirsty Blade'],
    ID: 802,
    class: ['buff', 'offense', 'status'],
    potency: 1,
    uses: 20,
    interval: 0,
    desc: "Your attacks have a 30% chance to make an enemy bleed",
    triggerType: ['playerAttack'], // what kind of thing activates it
    triggerFunc: function() {
      var mob = checkArrayID(mobLibrary, currentTarget.ID);

      if (mob && currentTarget.living) {
        var ailment = {
          type: 'bleed',
          hit: .3,
          customLog: "Your bloodthirsty blade tears into " + mob.title + "!"
        }
        console.log("trying to afflict mob via " + this.title + " buff.");
        afflictMob(ailment, mob, currentTarget);
      }
    }
  },
  {
    entry: ['enraging blade', 'enraging', 'enrage', 'enrage1'],
    title: ['Enraging Blade'],
    ID: 803,
    class: ['buff', 'offense', 'status'],
    potency: 1,
    uses: 20,
    interval: 0,
    desc: "Your attacks have a 30% chance to berserk an enemy",
    triggerType: ['playerAttack'], // what kind of thing activates it
    triggerFunc: function() {
      var mob = checkArrayID(mobLibrary, currentTarget.ID);

      if (mob && currentTarget.living) {
        var ailment = {
          type: 'berserk',
          hit: .30,
          customLog: "Your enraging blade provokes " + mob.title + " into a berserking rage!"
        }
        console.log("trying to afflict mob via " + this.title + " buff.");
        afflictMob(ailment, mob, currentTarget);
      }
    }
  },
  {
    entry: ['maddening blade', 'maddening', 'maddening1', 'madden', 'mad'],
    title: ['Maddening Blade'],
    ID: 804,
    class: ['buff', 'offense', 'status'],
    potency: 1,
    uses: 20,
    interval: 0,
    desc: "Your attacks have a 30% chance to confuse an enemy",
    triggerType: ['playerAttack'], // what kind of thing activates it
    triggerFunc: function() {
      var mob = checkArrayID(mobLibrary, currentTarget.ID);
      if (mob && currentTarget.living) {
        var ailment = {
          type: 'confuse',
          hit: .30,
          customLog: "Your maddening blade sends " + mob.title + " into a fog of confusion!"
        }
        console.log("trying to afflict mob via " + this.title + " buff.");
        afflictMob(ailment, mob, currentTarget);
      }
    }
  },
  {
    entry: [''],
    title: [''],
    ID: 800,
    class: [''],
    potency: 1,
    duration: 0,
    uses: 0,
    interval: 0, //how many ticks it takes to trigger
    desc: ".",
    triggerType: [''], // what kind of thing activates it
    triggerFunc: function() {
      //doAThing();
    },
  },
];

/////////////////////////////////////////////
/* ALCHEMY */
/////////////////////////////////////////////

let currentPuzzle;

let alcTable = {}; //this is where all the dispensers, containers, tools, and goal go.

let alcPuzzleList = [
  {
    ID: 1,
    title: 'Tutorial',
    goal: [
      {chem: 'estrum', state: 'gas'} // can add qty or holding as well
    ],
    dispensers: [
      {chem: 'estrum', state: 'solid'}
    ],
    tools: [
      {entry: 'burner'}
    ],
    containers: [
      {entry: 'beaker', attr: 'capped'}
    ]
  },
  {
    ID: 2,
    title: 'Transferring',
    goal: [
      {chem: 'estrum', state: 'gas'}
    ],
    dispensers: [
      {chem: 'estrum', state: 'solid'}
    ],
    tools: [
      {entry: 'burner'}
    ],
    containers: [
      {entry: 'beaker', attr: ''},
      {entry: 'flask', attr: 'capped'}
    ]
  },
  {
    ID: 3,
    title: 'Heat and Chill',
    goal: [
      {chem: 'estrum', state: 'solid'},
      {chem: 'estrum', state: 'gas'}
    ],
    dispensers: [
      {chem: 'estrum', state: 'liquid'}
    ],
    containers: [
      {entry: 'beaker', attr: ''},
      {entry: 'flask', attr: 'capped'}
    ],
    tools: [
      {entry: 'burner'},
      {entry: 'chiller'}
    ]
  },
  {
    ID: 4,
    title: 'Fragile Containers, Multiple Goals',
    goal: [
      {chem: 'estrum', state: 'gas'},
      {chem: 'estrum', state: 'liquid'}
    ],
    dispensers: [
      {chem: 'estrum', state: 'gas'}
    ],
    containers: [
      {entry: 'beaker', attr: 'fragile capped'},
      {entry: 'flask', attr: 'capped'}
    ],
    tools: [
      {entry: 'chiller'},
    ]
  },
  {
    ID: 5,
    title: 'More Fragile Containers',
    goal: [
      {chem: 'estrum', state: 'gas'},
      {chem: 'estrum', state: 'liquid'},
      {chem: 'estrum', state: 'solid'}
    ],
    dispensers: [
      {chem: 'estrum', state: 'liquid'}
    ],
    containers: [
      {entry: 'beaker', attr: 'capped'},
      {entry: 'flask', attr: 'fragile capped'},
      {entry: 'platter', attr: ''}
    ],
    tools: [
      {entry: 'burner'},
      {entry: 'chiller'}
    ]
  },
  {
    ID: 6,
    title: 'Introducing Besal, Holding Heat',
    goal: [
      {chem: 'besal', state: 'solid', holding: 'heat'},
      {chem: 'besal', state: 'solid', holding: 'heat'}
    ],
    dispensers: [
      {chem: 'besal', state: 'solid'}
    ],
    containers: [
      {entry: 'beaker', attr: 'fragile'},
      {entry: 'platter', attr: ''}
    ],
    tools: [
      {entry: 'burner'}
    ]
  },
  {
    ID: 0,
    title: '',
    goal: [
      {chem: '', state: ''},
      {chem: '', state: ''}
    ],
    dispensers: [
      {chem: '', state: ''}
    ],
    containers: [
      {entry: '', attr: ''},
      {entry: '', attr: ''}
    ],
    tools: [
      {entry: ''},
      {entry: ''}
    ]
  },
  {
    ID: 0,
    title: '',
    goal: [
      {chem: '', state: ''},
      {chem: '', state: ''}
    ],
    dispensers: [
      {chem: '', state: ''}
    ],
    containers: [
      {entry: '', attr: ''},
      {entry: '', attr: ''}
    ],
    tools: [
      {entry: ''},
      {entry: ''}
    ]
  },
];

function ContainerChem(chem, state) {
  this.chem = chem;
  this.state = state;
}

function alcCheckGoal() {
  var satisfied = false;
  var numComplete = 0;
  //need a way to mark the chemicals as it checks through, so it doesn't count the same one twice.
  $.each(alcTable.containers, function() {
    alcMarkUncomplete(this);
  });
  //check through each to see if they satisfy.
  for (i = 0; i < alcTable.goal.length; i++) {
    var currentGoal = alcTable.goal[i];
    var holding = false;
    if (currentGoal.holding) {
      holding = currentGoal.holding;
    }
    console.log("checking for goal " + i + ": " + currentGoal.state + " " + currentGoal.chem + " holding " + holding);
    $.each(alcTable.containers, function() {
      var match = alcCheckAllContents('chem', currentGoal.chem, currentGoal.state, 'mark', holding);
      if (match) {
        console.log("matched goal " + i + " for " + match.chem + " in " + this.entry);
        numComplete++;
      }
      /*console.log("currentGoal:")
      logProps(currentGoal);
      console.log("Match:")
      logProps(match);*/
    });
  }
  if (numComplete == alcTable.goal.length) {
    satisfied = true;
    alcClearTable('complete');
  } else if (numComplete > 0) {
    log("You've satisfied " + numComplete + " of the " + alcTable.goal.length + " goals.", 'orange');
  } else {
    log("You haven't met any goals yet.");
  }
}

function alcMarkUncomplete(container) {
  $.each(container.contents, function() {
    this.marked = false;
  });
}

function alcCheckAllContents(checking, chem, state, mark, holding) {
  var result = false;
  //search each of the tools on the table
  $.each(alcTable.containers, function() {
    //if it has contents, search it
    if (this.contents && this.contents.length > 0) {
      result = alcCheckContents(checking, this, chem, state, mark, holding); //return the container or chem, depending on "checking"
      if (result) {
        return false; //stop checking
      }
    } else {
      //console.log(this.tool + " has no contents");
    }
  });
  return result; //return the container you found it in
}

function alcCheckContents(checking, container, chem, state, mark, holding) {
  //console.log(container.contents[0].chem);
  var result = false;
  //search through the container's contents
  $.each(container.contents, function() {
    if ( this.chem == chem && (!mark || (mark && !this.marked)) ) {
      //if a state is specified and it matches, great! otherwise if no state is specified, match it anyway
      if ( !state || state && this.state == state ) {
        if ( !holding || (holding && this.holding == holding) ) { // make sure it matches if there's a hold
          if (checking == 'chem') {
            result = this; //if checking for chem, return the chemical
          } else {
            result = container; //return the container
          }
          this.marked = true;
          return false; //stop looking
        }
      }
      //otherwise just keep looping each and checking for contents. Could have solid and liquid versions of the same chem.
    }
  });
  return result;
}

function alcCheckTool(entry) {
  return checkArray(alcTable.tools, entry);
}

function alcCheckContainer(entry) {
  var result;
  //sometimes you need to search for the whole splitInput array
  if (Array.isArray(entry)) {
    //cycle through the arguments until you find a container
    for (i = 1; i < entry.length; i++) {
      result = checkArray(alcGlasswareList, entry[i], 'input');
      if (!result) {
        result = checkArray(alcGlasswareList, entry[i] + " " + entry[i+1], 'input');
      }
      if (result) {
        return result
        break;
      }
    }
  } else {
    return checkArray(alcTable.containers, entry);
  }
}

function alcTranslate(chem, state) {
  var fullChem;
  var fullState;
  switch(chem) {
    case 'e':
    case 'est':
    case 'estrum':
      fullChem = 'estrum';
      break;

    case 'b':
    case 'bes':
    case 'besal':
      fullChem = 'besal';
      break;
  }
  switch(state) {
    case 's':
    case 'sol':
    case 'solid':
      fullState = 'solid';
      break;

    case 'l':
    case 'liq':
    case 'liquid':
      fullState = 'liquid';
      break;

    case 'g':
    case 'gas':
      fullState = 'gas';
      break;

    case 'p':
    case 'pla':
    case 'plas':
    case 'plasma':
      fullState = 'plasma';
      break;

    default:
      false;
      break;
  }
  return {chem: fullChem, state: fullState};
}

function alcCheckDispenser(dirObj, indirObj) {
  var dispenser;
  var translatedChem = alcTranslate(dirObj, indirObj);
  var thisDispenser = $.grep(alcTable.dispensers, function(disp) {
    if (translatedChem.state) {
      return disp.chem == translatedChem.chem && disp.state == translatedChem.state;
    } else {
      return disp.chem == translatedChem.chem;
    }
  });
  if (Array.isArray(thisDispenser)) {
    thisDispenser = thisDispenser[0];
  }
  //only return the dispenser if it's on the table
  if (thisDispenser) {
    dispenser = checkArray(alcDispenserList, thisDispenser.chem + " " + thisDispenser.state);
    if (dispenser) {
      //console.log("found thisDispenser: " + thisDispenser);
      //logProps(dispenser);
      return dispenser;
    }
  } else {
    return false;
  }
}

function alcSetTable(puzzleID) {
  var puzzle = checkArrayID(alcPuzzleList, puzzleID);
  // right now alcTable dispensers are stored as IDs. I should change that to objects with chem and state
  if (puzzle) {
    currentPuzzle = puzzle.ID;
    alcTable.goal = puzzle.goal;
    alcTable.dispensers = puzzle.dispensers;
    alcTable.containers = puzzle.containers;
    alcTable.tools = puzzle.tools;
    $.each(alcTable.containers, function() {
      this.contents = [];
    });
    act('lalc');
  } else {
    log("Can't find puzzle " + puzzleID);
  }
}

function alcClearTable(reason) {
  switch(reason) {
    case 'complete':
      log("You completed puzzle #" + currentPuzzle + "!", 'green');
      log("Would you like to try another? Use <w>set</w> to set the table with a new puzzle, such as <w>set 2</w>.");
      break;

    case 'fail':
      break;

    case 'quit':
      break;
  }
  alcTable = {};
}

function alcTableMatch(dirObj, indirObj, fullCommand, tool) {
  var results = [] // the array of results that gets pushed back

  var thisTool = alcCheckTool(tool);
  var chem = checkArray(alcChemicalList, dirObj, 'input');
  var theseChems;
  var container = checkArray(alcGlasswareList, dirObj, 'input');
  var thisContainer;
  var niceContainer;

  if (chem) { // heat estrum
    thisContainer = alcCheckAllContents('container', chem.entry);
    theseChems = thisContainer.contents;
    container = checkArray(alcGlasswareList, thisContainer.entry);
  } else if (container) { //heat beaker
    thisContainer = alcCheckContainer(container.entry);
    if (thisContainer && Array.isArray(thisContainer.contents) && thisContainer.contents.length) {
      theseChems = thisContainer.contents;
    }
  }
  if (thisContainer) {
    niceContainer = alcNiceName(thisContainer, true)
  }

  results.push(chem,theseChems,container,thisContainer,niceContainer,thisTool);
  return results;
}

function alcNiceName(tool, hideParens) {
  var niceName = "";
  if (tool.attr) {
    niceName += tool.attr + " ";
  }
  niceName += tool.entry
  if (tool.uses >-1 && !hideParens) {
    niceName += " (uses: " + tool.uses + ")";
  }
  //check if the contents array is empty. For some reason jQuery is really picky about this.
  if (Array.isArray(tool.contents) && tool.contents.length && !hideParens) {
    var totalContents = 0;
    niceName += " (";
    $.each(tool.contents, function() {
      if (totalContents >= 1) {
        niceName += ", ";
      }
      niceName += alcNiceChem(this);
      totalContents++
    });
    niceName += ")";
  }
  return niceName;
}

function alcNiceChem(chem) {
  var niceName = "";
  //logProps(chem);
  if (chem) {
    niceName = chem.chem.substr(0,1).toUpperCase() + chem.chem.substr(1) + "<sub>" + chem.state.substr(0,1) + "</sub>";
    if (chem.holding) {
      niceName += " holding <w>" + chem.holding + "</w>";
    }
  }
  return niceName;
}

function alcCheckReactions(thisContainer, container, appliedEffect, holdingChem) {
  $.each(thisContainer.contents, function() {
    var stateChange = checkArray(alcChemicalList, this.chem).checkStateChange(this, appliedEffect, thisContainer, container, holdingChem);
    if (stateChange)  {
      var spillage = alcCheckSpillage(this, thisContainer, container);
    }
    if (stateChange && !spillage && holdingChem) {
      checkArray(alcChemicalList, holdingChem.chem).releaseEffect(this, thisContainer, container);
      log("Chain reaction!", 'alc alc-chain');
    } else if (!holdingChem) {
      checkArray(alcChemicalList, this.chem).holdEffect(this, appliedEffect, thisContainer, container);
    }
  });
}

function alcChangeState(thisChem, newState, holdingChem) {
  var niceChem = alcNiceChem(thisChem);
  var niceHoldingChem = alcNiceChem(holdingChem);
  var oldstate = thisChem.state;
  thisChem.state = newState;
  if (oldstate == 'solid') {
    if (holdingChem) {
      log(niceHoldingChem + " releases its " + holdingChem.holding + " to help melt " + thisChem.chem + " into a liquid.", 'alc alc-state-change');
    } else {
      log(niceChem + " melts to a liquid.", 'alc alc-state-change');
    }
  } else if (oldstate == 'liquid') {
    if (newState == 'solid') {
      if (holdingChem) {
        log(niceHoldingChem + " releases its " + holdingChem.holding + " to help freeze " + thisChem.chem + " into a solid.", 'alc alc-state-change');
      } else {
        log(niceChem + " freezes into a solid.", 'alc alc-state-change');
      }
    } else if (newState == 'gas') {
      if (holdingChem) {
        log(niceHoldingChem + " releases its " + holdingChem.holding + " to help boil " + thisChem.chem + " into a gas.", 'alc alc-state-change');
      } else {
        log(niceChem + " boils into a gas.", 'alc alc-state-change');
      }
    }
  } else if (oldstate == 'gas') {
    if (newState == 'liquid') {
      if (holdingChem) {
        log(niceHoldingChem + " releases its " + holdingChem.holding + " to help condense " + thisChem.chem + " into a liquid.", 'alc alc-state-change');
      } else {
        log(niceChem + " condenses into a solid.", 'alc alc-state-change');
      }
    } else if (newState == 'plasma') {
      if (holdingChem) {
        log(niceHoldingChem + " releases its " + holdingChem.holding + " to help ionize " + thisChem.chem + " into a plasma.", 'alc alc-state-change');
      } else {
        log(niceChem + " ionizes into a plasma.", 'alc alc-state-change');
      }
    }
  } else if (oldstate == 'plasma') {
    if (holdingChem) {
      log(niceHoldingChem + " releases its " + holdingChem.holding + " to help de-ionize " + thisChem.chem + " into a gas.", 'alc alc-state-change');
    } else {
      log(niceChem + " de-ionizes into a gas.", 'alc alc-state-change');
    }
  }
}

function alcCheckSpillage(chem, thisContainer, container) {
  if (container.entry == 'platter' && chem.state == 'liquid') {
    removeThis(chem, thisContainer.contents, chem.chem + " spilled out of " + thisContainer.entry);
    log("The " + chem.chem + " overflows the open platter!");
  } else if ( (container.entry == 'platter' || !thisContainer.attr.includes('capped') ) && (chem.state == 'gas' || chem.state == 'plasma') ) {
    removeThis(chem, thisContainer.contents, chem.chem + " spilled out of " + thisContainer.entry);
    log("The " + chem.chem + " escapes the open " + container.entry + "!");
  } else if ( thisContainer.attr && !thisContainer.attr.includes('capped') && (chem.state == 'gas' || chem.state == 'plasma') ) {
    removeThis(chem, thisContainer.contents, chem.chem + " spilled out of " + thisContainer.entry);
    log("The " + chem.chem + " escape out the open " + container.entry + "!");
  } else if (container.entry == 'flask' && chem.state == 'solid') {
    removeThis(chem, thisContainer.contents, chem.chem + " spilled out of " + thisContainer.entry);
    log("The " + chem.chem + "'s coarse crystals skitter onto the table, too big for the flask's mouth!");
  }
}

function alcDumpContainer(thisContainer, container) {
  thisContainer.contents = [];
  log("Emptied all the " + thisContainer.entry + "'s contents.");
}

let alcChemicalList = [
  {
    entry: 'estrum',
    title: 'Estrum',
    input: ['estrum', 'est', 'es', 'e'],
    article: 'some ',
    returnChemDesc: function(thisChem) {
      switch(thisChem.state) {
        case 'solid':
          return 'It has large spiky crystals with coarse grooves. Poisonous to the touch.'
          break;

        case 'liquid':
          return 'This viscous liquid swirls with a milky appearance. It bubbles from time to time.'
          break;

        case 'gas':
          return 'A smoky gas fills the container. You can see small points of light flash inside from time to time.'
          break;

        case 'plasma':
          return 'This electrified gas glows a bright purple. Arcs of electricity bound from it.'
          break;
      }
    },
    checkStateChange: function(thisChem, effect, thisContainer, container, holdingChem) {
      switch (thisChem.state) {
        case 'solid':
          if (effect == 'heat') {
            alcChangeState(thisChem, 'liquid', holdingChem);
            return true;
          } else {
            return false;
          }
          break;

        case 'liquid':
          if (effect == 'heat') {
            alcChangeState(thisChem, 'gas', holdingChem);
            return true;
          } else if (effect == 'chill') {
            alcChangeState(thisChem, 'solid', holdingChem);
            return true;
          } else {
            return false;
          }
          break;

        case 'gas':
          if (effect == 'charge') {
            alcChangeState(thisChem, 'plasma', holdingChem);
            return true;
          } else if (effect == 'chill') {
            alcChangeState(thisChem, 'liquid', holdingChem);
            return true;
          } else {
            return false;
          }
          break;

        case 'plasma':
          if (effect == 'discharge') {
            alcChangeState(thisChem, 'gas', holdingChem);
            return true;
          } else {
            return false;
          }
          break;

        default:
          return false;
      }
    },
    holdEffect: function(thisChem, effect, thisContainer, container) {
      //console.log("tried to hold " + effect + " in estrum.");
    },
    releaseEffect: function(thisChem, thisContainer, container) {
      /*console.log("releasing hold on " + thisChem.holding);
      thisChem.holding = false;
      return true;*/
    }
  },
  {
    entry: 'besal',
    title: 'Besal',
    input: ['besal', 'bes', 'be', 'b'],
    article: 'some ',
    returnChemDesc: function(thisChem) {
      switch(thisChem.state) {
        case 'solid':
          return 'It has coarse black spines. Poisonous to the touch.'
          break;

        case 'liquid':
          return 'This liquid does stuff.'
          break;

        case 'gas':
          return 'A gas.'
          break;

        case 'plasma':
          return 'This electrified gas does something.'
          break;
      }
    },
    checkStateChange: function(thisChem, effect, thisContainer, container, holdingChem) {
      switch (thisChem.state) {
        case 'solid':
          if (effect == 'charge') {
            alcChangeState(thisChem, 'liquid', holdingChem);
            return true;
          } else {
            return false;
          }
          break;

        case 'liquid':
          if (effect == 'charge') {
            alcChangeState(thisChem, 'gas', holdingChem);
            return true;
          } else if (effect == 'discharge') {
            alcChangeState(thisChem, 'solid', holdingChem);
            return true;
          } else {
            return false;
          }
          break;

        case 'gas':
          if (effect == 'heat charge') { //how to include more than one effect?
            alcChangeState(thisChem, 'plasma', holdingChem);
            return true;
          } else if (effect == 'discharge') {
            alcChangeState(thisChem, 'liquid', holdingChem);
            return true;
          } else {
            return false;
          }
          break;

        /* //how to include more than one effect?
        case 'plasma':
          if (effect == 'discharge') {
            alcChangeState(thisChem, 'gas', holdingChem);
            return true;
          } else {
            return false;
          }
          break;
        */

        default:
          return false;
      }
    },
    holdEffect: function(thisChem, effect, thisContainer, container) {
      if (effect == 'heat' || effect == 'chill') {
        if (!thisChem.holding) {
          thisChem.holding = effect;
          log("Besal<sub>s</sub> holds the " + effect + ".", 'alc alc-hold');
          alcCheckReactions(thisContainer, container, thisChem.holding, thisChem);
        } else if (thisChem.holding == effect) {
          log("Besal<sub>s</sub> is already holding " + effect + ".", 'alc');
        } else if (thisChem.holding && thisChem.holding != effect) {
          log("Besal<sub>s</sub> was holding " + thisChem.holding + ", but now holds " + effect + ".", 'alc');
          thisChem.holding = effect;
          alcCheckReactions(thisContainer, container, thisChem.holding, thisChem);
        }
      } else {
        console.log("Besal (s) did not hold effect: " + effect);
      }
    },
    releaseEffect: function(thisChem, thisContainer, container) {
      console.log("releasing hold on " + thisChem.holding);
      thisChem.holding = false;
      return true;
    }
  }
];

let alcGlasswareList = [
  {
    entry: 'platter',
    input: ['platter', 'plat', 'pl'],
    title: 'Platter',
    desc: 'A curved glass wellplate several inches in diameter. Holds one solid chemical at a time.',
    dispenseVerb: ' onto ',
    maxChems: 1,
    ID: 201,
    allowedStates: ['solid'],
    returnError: function(thisChem) {
      switch(thisChem.state) {
        case 'liquid':
          return "The liquid would overflow the small platter.";
          break;

        case 'gas':
          return "The gas has nothing to reign it in.";
          break;

        case 'plasma':
          return "Unpridled plasma needs to be in a capped container.";
          break;

        default:
          return "The chemical is in an unknown state...";
      }
    }
  },
  {
    entry: 'beaker',
    input: ['beaker', 'beak', 'be', 'bk'],
    title: 'Beaker',
    desc: 'An open-mouthed glass container that holds solids and liquids. Can hold two chemicals at a time.',
    dispenseVerb: ' into ',
    maxChems: 2,
    ID: 202,
    allowedStates: ['solid', 'liquid'],
    returnError: function(thisChem) {
      switch(thisChem.state) {

        case 'gas':
          return "The gas would escape out the open mouth.";
          break;

        case 'plasma':
          return "Unpridled plasma needs to be in a capped container.";
          break;

        default:
          return "The chemical is in an unknown state...";
      }
    }
  },
  {
    entry: 'flask',
    input: ['flask', 'flas', 'flas', 'fl'],
    title: 'Flask',
    desc: 'A triangular glass container with a very narrow opening at the top. Can hold two liquid chemicals at a time.',
    dispenseVerb: ' into ',
    maxChems: 2,
    ID: 203,
    allowedStates: ['liquid'],
    returnError: function(thisChem) {
      switch(thisChem.state) {

      case 'solid':
        return "The crystal shards are too large to fit through the narrow mouth.";
        break;

        case 'gas':
          return "The gas would escape out the open mouth.";
          break;

        case 'plasma':
          return "Unpridled plasma needs to be in a capped container.";
          break;

        default:
          return "The chemical is in an unknown state...";
      }
    }
  },
  {
    entry: 'capped',
    title: 'Capped Containers',
    desc: 'Capped Beakers and Flasks can contain gasses and plasma.',
  },
  {
    entry: 'insulated',
    title: 'Insulated Glassware',
    desc: 'Insulated Platters, Beakers, and Flasks resist heat and chill applied from the outside.',
  },
  {
    entry: 'rubber',
    title: 'Rubber Glassware',
    desc: 'Rubber Platters, Beakers, and Flasks resist electrical charge and discharge applied from the outside.',
  },
  {
    entry: 'fragile',
    title: 'Fragile Glassware',
    desc: 'Fragile Platters, Beakers, and Flasks will break if you try to heat, chill, charge, or discharge them from the outside.',
  },
];

let alcDispenserList = [
  {
    entry: 'estrum solid',
    input: ['estrum', 'estrums', 'estrum solid', 'estrum sol', 'estrum s', 'est', 'est sol', 'est s', 'e'],
    title: 'Estrum<sub>s</sub> Dispenser',
    action: 'You dispense Estrum<sub>s</sub>',
    chem: 'estrum',
    state: 'solid',
    ID: 101
  },
  {
    entry: 'estrum liquid',
    input: ['estrum', 'estruml', 'estrum liquid', 'estrum liq', 'estrum l', 'est', 'est liq', 'est l', 'e'],
    title: 'Estrum<sub>l</sub> Dispenser',
    action: 'You dispense Estrum<sub>l</sub>',
    chem: 'estrum',
    state: 'liquid',
    ID: 102
  },
  {
    entry: 'estrum gas',
    input: ['estrum', 'estrumg', 'estrum gas', 'estrum g', 'est', 'est gas', 'est g', 'e'],
    title: 'Estrum<sub>g</sub> Dispenser',
    action: 'You dispense Estrum<sub>g</sub>',
    chem: 'estrum',
    state: 'gas',
    ID: 103
  },
  {
    entry: 'estrum plasma',
    input: ['estrum', 'estrump', 'estrum plasma', 'estrum plas', 'estrum p', 'est', 'est plas', 'est p', 'e'],
    title: 'Estrum<sub>p</sub> Dispenser',
    action: 'You dispense Estrum<sub>p</sub>',
    chem: 'estrum',
    state: 'plasma',
    ID: 104
  },
  {
    entry: 'besal solid',
    input: ['besal', 'besals', 'besal solid', 'besal sol', 'besal s', 'bes', 'bes sol', 'bes s', 'b'],
    title: 'Besal<sub>s</sub> Dispenser',
    action: 'You dispense Besal<sub>s</sub>',
    chem: 'besal',
    state: 'solid',
    ID: 201
  },
  {
    entry: 'besal liquid',
    input: ['besal', 'besall', 'besal liquid', 'besal liq', 'besal l', 'bes', 'bes liq', 'bes l', 'b'],
    title: 'Besal<sub>l</sub> Dispenser',
    action: 'You dispense Besal<sub>l</sub>',
    chem: 'besal',
    state: 'liquid',
    ID: 202
  },
  {
    entry: 'besal gas',
    input: ['besal', 'besalg', 'besal gas', 'besal g', 'bes', 'bes gas', 'bes g', 'b'],
    title: 'Besal<sub>g</sub> Dispenser',
    action: 'You dispense Besal<sub>g</sub>',
    chem: 'besal',
    state: 'gas',
    ID: 203
  },
  {
    entry: 'besal plasma',
    input: ['besal', 'besalp', 'besal plasma', 'besal plas', 'besal p', 'bes', 'bes plas', 'bes p', 'b'],
    title: 'Besal<sub>p</sub> Dispenser',
    action: 'You dispense Besal<sub>p</sub>',
    chem: 'besal',
    state: 'plasma',
    ID: 204
  },
];

let alcToolList = [
  {
    entry: 'burner',
    title: 'Burner',
    uses: 'infinite',
    effect: 'heat',
    desc: "A simple bunson burner that heats with an open flame."
  },
  {
    entry: 'chiller',
    title: 'Chiller',
    uses: 'infinite',
    effect: 'chill',
    desc: "A cryo-bath that quickly chills glassware."
  },
  {
    entry: 'charger',
    title: 'Ion Charger',
    uses: 'infinite',
    effect: 'charge',
    desc: "Conductive terminals that delivers a burst of electricity."
  },
  {
    entry: 'discharger',
    title: 'Ion Discharger',
    uses: 'infinite',
    effect: 'discharge',
    desc: "Electrode contacts that remove electrical charge."
  },
  {
    entry: 'limited tools',
    title: 'Limited Tools',
    desc: "Some tools have a limited number of uses before they stop working."
  },
];

let alchemyJournal = [
  {
    entry: 'generalStates0',
    desc: "<span class='bottom'><w>Estrum</w><sub>s</sub> represents solid Estrum crystal. Estrum<sub>l</sub> is liquid, Estrum<sub>g</sub> is gas, and Estrum<sub>p</sub> is plasma.</span>"
  },
  {
    entry: 'generalStates1',
    desc: "Solid <w class='rarr'>melt</w> Liquid <w class='rarr'>boil</w> Gas <w class='rarr'>ionize</w> Plasma"
  },
  {
    entry: 'generalStates2',
    desc: "<span class='bottom'>Solid <w class='larr'>freeze</w> Liquid <w class='larr'>condense</w> Gas <w class='larr'>de-ionize</w> Plasma</span>",
  },
  {
    entry: 'chemAStateSL', // [chemical] state changes from [solid] to [liquid]
    locked: false,
    desc: "Estrum<sub>s</sub> melts with heat."
  },
  {
    entry: 'chemAStateLS',
    locked: false,
    desc: "Estrum<sub>l</sub> freezes when chilled."
  },
  {
    entry: 'chemAStateLG',
    locked: false,
    desc: "Estrum<sub>l</sub> boils with heat."
  },
  {
    entry: 'chemAStateGL',
    locked: false,
    desc: "Estrum<sub>g</sub> condenses when chilled."
  },
  {
    entry: 'chemAStateGP',
    locked: true,
    desc: "Estrum<sub>g</sub> ionizes with electrical charge."
  },
  {
    entry: 'chemAPropP', // [chemical] has a special property when in a [plasma] state
    locked: true,
    desc: "Estrum<sub>p</sub> constantly produces and electrical charge."
  },
  {
    entry: 'chemAStatePG',
    locked: true,
    desc: "Estrum<sub>p</sub> de-ionizes with electrical discharge."
  },
  {
    entry: 'chemBPropS',
    locked: false,
    desc: "<span class='top'>Besal<sub>s</sub> can hold one usage of heat or chill.</span>"
  },
  {
    entry: 'chemBStateSL',
    locked: false,
    desc: "Besal<sub>s</sub> melts with electrical charge."
  },
  {
    entry: 'chemBMixL1', // [chemical] can mix as a [state]
    locked: true,
    desc: "Besal<sub>l</sub> mixes with Estrum<sub>s</sub> to generate heat. Consumes the solution."
  },
  {
    entry: 'chemBMixL2', // [chemical] can mix as a [state]
    locked: true,
    desc: "Besal<sub>l</sub> mixes with Estrum<sub>g</sub> to generate chill. Consumes the solution."
  },
  {
    entry: 'chemBStateLS',
    locked: false,
    desc: "Besal<sub>l</sub> freezes with electrical discharge."
  },
  {
    entry: 'chemBStateLG',
    locked: false,
    desc: "Besal<sub>l</sub> boils with electrical charge."
  },
  {
    entry: 'chemBStateGL',
    locked: false,
    desc: "Besal<sub>g</sub> condenses with electrical discharge."
  },
  {
    entry: 'chemBStateGP',
    locked: true,
    desc: "Besal<sub>g</sub> ionizes with heat and electrical charge."
  },
  {
    entry: 'chemBPropP', // [chemical] has a special property when in a [plasma] state
    locked: true,
    desc: "Besal<sub>p</sub> constantly produces and electrical discharge."
  },
  {
    entry: 'chemBStateGP',
    locked: true,
    desc: "Besal<sub>p</sub> de-ionizes with chill and electrical discharge."
  },
  {
    entry: '',
    locked: true,
    desc: ""
  },
];
