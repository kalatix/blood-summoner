/* objects can have the following types:
  recipes (in recipes.js): 500-level, craftable
  equip: 400-level, inventory-able, equippable
  craft: 300-level, inventory-able, craft ingredients
  picksume: 200-level, inventory-able, usable
  pickup: 200-level, inventory-able
  statsume: 100-level, static in the room, but still usable
  static: 000-level they just sit there.
*/

let objLibrary = [

////////////////////////////////////////////////////////////////////////////
/* Static objects */
////////////////////////////////////////////////////////////////////////////

  {
    entry: ['birds'], //tutorial birds
    ID: 001,
    roomDesc: 'The black <w>birds</w> fly close, cawing at each other and at you.',
    desc: "These mutated creatures barely resemble the crows they came from. Their small eyes are trained on you.<br>Type <o>l</o> (short for look) to look at your surroundings if you need a refresher.",
    type: ['static'],
    noPickup: "They fly just out of reach."
  },
  {
    entry: ['skull'],
    ID: 002,
    roomDesc: 'A malformed <w>skull</w> lies here.',
    desc: "Dense spines protrude from the bone. This skull must have come from one of those dark creatures.",
    type: ['static'],
    noPickup: "You don't want to carry that around."
  },
  {
    entry: ['birds'], //real birds
    ID: 003,
    roomDesc: 'Black <w>birds</w> fly close, cawing for food.',
    desc: "These mutated creatures barely resemble the crows they came from. Their small eyes are trained on you.",
    type: ['static'],
    noPickup: "They fly just out of reach."
  },
  {
    entry: ['bones', 'human'],
    ID: 004,
    roomDesc: 'A few human <w>bones</w> are strewn about.',
    desc: "These bones have been picked clean.",
    type: ['static'],
    noPickup: "You don't want to carry those around."
  },
  {
    entry: ['bones', 'human'],
    ID: 005,
    roomDesc: 'Some human <w>bones</w> lie here, muscle still clinging to them.',
    desc: "A fresh kill.",
    type: ['static'],
    noPickup: "You don't want to carry those around."
  },
  {
    entry: ['sign'],
    ID: 006,
    roomDesc: 'A battered <w>sign</w> swings in the breeze.',
    desc: "The sign reads: Home of the Marcus Lambert, first Blood Summoner and author of the Dark Codex. <w>Knock</w> before you enter.",
    type: ['static'],
    noPickup: "You don't want to carry those around."
  },
  {
    entry: ['syphon', 'blood syphon', 'blood'],
    ID: 007,
    roomDesc: "An early prototype of the <w>Blood Syphon</w> sits on the counter.",
    desc: "It's not fully assembled and you can see the main tubes and chambers that filter and syphon the Plasmoid compounds. The applicator pad is missing, so it's not ready for use.",
    type: ['static'],
    noPickup: "Marcus wouldn't like you taking that."
  },
  {
    entry: ['gland'],
    ID: 008,
    roomDesc: "Some sort of monster <w>gland</w> is oozing onto a platter.",
    desc: "This oversized sack of fluids used to belong to a Spitter. The caustic purple mucus has burned the finish off the platter it's sitting on.",
    type: ['static'],
    noPickup: "The caustic mucus would burn your hands!"
  },
  {
    entry: ['corpse', 'swordsman', 'swordman'],
    ID: 009,
    roomDesc: 'The corpse of a <w>swordsman</w> is torn open.',
    desc: "Animals and monsters have already had their way with the entrails.",
    type: ['static'],
    noPickup: "It would be best to leave them to rest."
  },
  {
    entry: ['remains', 'creature', 'soldier'],
    ID: 010,
    roomDesc: 'The <w>remains</w> of an unrecognizable creature lie entangled with the corpse of a human soldier. No telling how long either have been here.',
    desc: "They died together, locked in the heat of battle.",
    type: ['static'],
    noPickup: "It would be best to leave them to rest."
  },
  {
    entry: ['bust', 'general', 'harpe'],
    ID: 012,
    roomDesc: 'A marble <w>bust</w> of General Harpe sits proudly on a pedestal. His plump curls are swept behind the ears, jaw set in determination.',
    desc: "The nose is chipped, but the rest of the features are remarkably in tact, even through years of wear.",
    type: ['static'],
    noPickup: "That's too heavy."
  },
  {
    entry: ['stained', 'glass', 'window'],
    ID: 013,
    roomDesc: 'A large stained-glass <w>window</w> depicts an ancient story. Figures adorned in shining robes approach each other with strange gifts.',
    desc: "The craftsmanship is impeccable. Despite the ruined state of the tower, this art remains immaculate.",
    type: ['static'],
    noPickup: "It's installed into the wall."
  },
  {
    entry: ['aquarium', 'fish'],
    ID: 014,
    roomDesc: 'An <w>aquarium</w> once filled with exotic sea life has spilled its prized contents long ago.',
    desc: "The sea creatures have long since been eaten, but the small engraved plaques once promised a first-hand look at the world's most unique sea life for those wealthy enough to be invited here.",
    type: ['static'],
    noPickup: "It's too big to carry."
  },
  {
    entry: ['sword', 'soldier'],
    ID: 015,
    roomDesc: "A soldier's broken <w>sword</w> lies here.",
    desc: "A fight was lost here.",
    type: ['static'],
    noPickup: "That's of no use to you."
  },
  {
    entry: ['gland', 'monster'],
    ID: 016,
    roomDesc: "Some sort of monster <w>gland</w> is leaking fluid.",
    desc: "This oversized sack of oozing fluids used to belong to a Spitter, Miter, or other vile creature.",
    type: ['static'],
    noPickup: "The caustic mucus would burn your hands!"
  },
  {
    entry: ['feathers', 'feather'],
    ID: 017,
    roomDesc: 'Raven <w>feathers</w> are scattered about.',
    desc: "Their thick black powder coating is rubbing off.",
    type: ['static'],
    noPickup: "You don't have a use for those."
  },
  {
    entry: ['mice', 'mouse'],
    ID: 018,
    roomDesc: 'Jittery <w>mice</w> scamper to and fro.',
    desc: "Their mouths are black with blood. They have been surviving on the remains of dark creatures.",
    type: ['static'],
    noPickup: "They escape your clumsy grip."
  },
  {
    entry: ['platter', 'metal'],
    ID: 019,
    roomDesc: 'A faded metal <w>platter</w> has been discarded here.',
    desc: "Once it was meticulously polished for use at a luxurious dinner. Now it's now tarnished and bent.",
    type: ['static'],
    noPickup: "It probably isn't worth anything."
  },
  {
    entry: ['carapace', 'monster'],
    ID: 020,
    roomDesc: 'A cracked piece of monster <w>carapace</w> has been discarded.',
    desc: "Veiny ridges that run along the shell's surface. A nearby monster is missing its defense.",
    type: ['static'],
    noPickup: "Too unwieldy to use for your own protection."
  },
  {
    entry: [''],
    ID: 000,
    roomDesc: '.',
    desc: ".",
    type: ['static'],
    noPickup: "Not sure what you would use that for."
  },
  {
    entry: [''],
    ID: 000,
    roomDesc: '.',
    desc: ".",
    type: ['static'],
    noPickup: "You don't want that."
  },

  ////////////////////////////////////////////////////////////////////////////
  /* Usable Static Objects */
  ////////////////////////////////////////////////////////////////////////////

  {
    entry: ['pool', 'plasmoid'],
    title: 'Plasmoid Pool',
    ID: 101,
    enabled: true,
    roomDesc: 'The <w>Plasmoid Pool</w> is charged and ready for use.',
    desc: "This viscous liquid is charged with plasmoid-derived compounds and injected with a bacteria that help stimulate cell reconstruction.",
    type: ['statsume'],
    noPickup: "That's way too big to carry.",
    func: function(thisRoomIndex, indirObj) {
      //console.log('this: ' + this);
      //logProps(this);
      if (this.enabled) {
        updateStat('HP', 'set', 'full');
        updateStat('plasmoid', 'set', 'full');
        log("You spend some time in the Plasmoid Pool to refresh your <g>health</g> and <pu>plasmoid</pu>.");
      } else {
        log("The Plasmoid Pool isn't available right now.");
      }
    }
  },
  {
    entry: ['bed'],
    title: 'bed',
    ID: 102,
    enabled: true,
    roomDesc: 'A firm <w>bed</w> looks welcoming.',
    desc: "Rough blankets are crumpled on the old mattress. Looks well-used, but not in a long time.",
    type: ['statsume'],
    noPickup: "That's way too big to carry.",
    noBattle: true, //each object decides whether it can be used in battle or not
    func: function(thisRoomIndex, indirObj) {
      if (this.enabled) {
        updateStat('HP', 'set', 'full');
        setOpacity(0);
        setTimeout( function() {
          resetLog();
          showHint();
          resetOpacity();
          log("After a solid rest, you wake up <g>feeling great</g>!");
        }, 1500)
      } else {
        log("Can't rest right now.");
      }
    }
  },
  {
    entry: ['gate'],
    title: 'iron gate',
    openVerb: 'open',
    closeVerb: 'close',
    ID: 150,
    type: ['statsume'],
    class: ['door'],
    openable: true,
    closable: false,
    exitN: 1225,
    noBattle: true,
    roomDescClosed: "A massive wrought iron <w>gate</w> looms here. You could <w>open</w> it to gain access outside.",
    roomDescOpen: "A massive wrought iron <w>gate</w> has been pushed open. Doesn't look like it would <w>close</w> again.",
    openDesc: "At first the door resists your push, but at last its rusted hinges give way. The way north has been opened.",
    closeDesc: ".",
    descCloseErr: "Its rusted hinges won't budge.",
    state: 'closed',
    desc: "After years of neglect, its bars are rusted and misshapen.",
    noPickup: "That's way too big to carry."
  },
  {
    entry: ['door'],
    title: 'wooden door',
    openVerb: 'open',
    closeVerb: 'close',
    ID: 151,
    type: ['statsume'],
    class: ['door'],
    openable: true,
    closable: false,
    exitN: 1000,
    noBattle: true,
    roomDescClosed: "A wooden door is closed.",
    roomDescOpen: "A wooden door is open.",
    openDesc: "You push the door open.",
    closeDesc: "You pull the door closed.",
    descOpenErr: "It's blocked.",
    descCloseErr: "Its rusted hinges won't budge.",
    state: 'closed',
    desc: "It's nicely carved.",
    noPickup: "That's too big to carry."
  },
  {
    entry: ['grate', 'metal'],
    title: 'metal grate',
    openVerb: 'open',
    closeVerb: 'close',
    ID: 152,
    type: ['statsume'],
    class: ['door'],
    openable: false, //true when you have key
    closable: false,
    exitN: 1225,
    noBattle: true,
    roomDescClosed: "A massive wrought iron <w>gate</w> looms here. You could <w>open</w> it to gain access outside.",
    roomDescOpen: "A massive wrought iron <w>gate</w> has been pushed open. Doesn't look like it would <w>close</w> again.",
    openDesc: "At first the door resists your push, but at last its rusted hinges give way. The way north has been opened.",
    closeDesc: ".",
    descCloseErr: "Its rusted hinges won't budge.",
    state: 'closed',
    desc: "After years of neglect, its bars are rusted and misshapen.",
    noPickup: "That's way too big to carry."
  },

  ////////////////////////////////////////////////////////////////////////////
  /* Pickups & consumables */
  ////////////////////////////////////////////////////////////////////////////
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
  },
  {
    entry: ['crystal', 'pure', 'purified', 'purified crystal'],
    title: 'Purified Crystal',
    article: 'a ',
    ID: 200,
    noBattle: true,
    desc: "purified crystal.",
    roomDesc: "purified crystal.",
    inspectDesc: ".",
    type: ['pickup'],
    class: ['quest'],
    qty: 2,
    func: function(thisRoomIndex, indirObj) {
      log("The device needs to be completed before it will work.");
    }
  },
  {
    entry: ['device'],
    title: 'unfinished communications device',
    article: 'an ',
    ID: 201,
    noBattle: true,
    desc: "unfinished communications device.",
    roomDesc: "unfinished communications device.",
    inspectDesc: ".",
    type: ['pickup'],
    class: ['quest'],
    qty: 2,
    func: function(thisRoomIndex, indirObj) {
      log("The device needs to be completed before it will work.");
    }
  },
  {
    entry: ['potion'],
    title: 'murky potion',
    article: 'a ',
    ID: 250,
    desc: "A half-filled flask that sports a thick red liquid. They say it <span class='green'>heals wounds</span>.",
    useDesc: "You quaff the murky liquid. It goes down smooth. <span class='green'>You feel a lot better</span>.",
    roomDesc: "A glass <w>potion</w> containing murky liquid lies here.",
    inspectDesc: "A flask of thick red liquid. <span class='green'>Heals to full health</span>.",
    type: ['picksume'],
    class: ['recovery'],
    qty: 2,
    func: function(thisRoomIndex, indirObj) {
      updateStat('HP', 'set', 'full');
      log(this.useDesc);
      removeInv(thisRoomIndex, this);
    }
  },

  ////////////////////////////////////////////////////////////////////////////
  /* Crafting items */
  ////////////////////////////////////////////////////////////////////////////

  {
    entry: ['blood', 'feral', 'feral blood'],
    title: 'feral blood',
    article: 'some ',
    ID: 301,
    roomDesc: "A vial of <w>blood</w> from a feral creature lies here.",
    desc: "Common material used for recovery items.",
    type: ['craft'],
    class: ['monster'],
    tier: 1,
    defaultQty: 1
  },
  {
    entry: ['claws', 'feral', 'feral claws'],
    title: 'feral claws',
    article: 'some ',
    ID: 302,
    roomDesc: "You see a few <w>claws</w> from a feral creature dropped here.",
    desc: "Common material used for attack assault items.",
    type: ['craft'],
    class: ['monster'],
    tier: 1,
    defaultQty: 1
  },
  {
    entry: ['hide', 'feral', 'feral hide'],
    title: 'feral hide',
    article: 'a ',
    ID: 303,
    roomDesc: "You see the <w>hide</w> of a feral creature here.",
    desc: "Common material used for defense assault items.",
    type: ['craft'],
    class: ['monster'],
    tier: 1,
    defaultQty: 1
  },
  {
    entry: ['twilight', 'shard'],
    title: 'twilight shard',
    article: 'a ',
    ID: 304,
    roomDesc: "A small but brilliant crystal <w>shard</w> catches your eye.",
    desc: "Common housing material.",
    type: ['craft'],
    class: ['mystical'],
    tier: 1,
    defaultQty: 1
  },
  {
    entry: ['glittering', 'dust'],
    title: 'glittering dust',
    article: 'some ',
    ID: 305,
    roomDesc: "A small pile of glittering <w>dust</w> catches your eye.",
    desc: "Common material used for recovery items. Can enhance effects of assault items.",
    type: ['craft'],
    class: ['mystical'],
    tier: 1,
    defaultQty: 2
  },
  {
    entry: ['blazing', 'stone'],
    title: 'Blazing Stone',
    article: 'a ',
    ID: 306,
    roomDesc: "",
    desc: "Common material that imbues items with fire.",
    type: ['craft'],
    class: ['mystical'],
    tier: 1,
    defaultQty: 1
  },
  {
    entry: ['frost', 'stone'],
    title: 'Frost Stone',
    article: 'a ',
    ID: 307,
    roomDesc: "",
    desc: "Common material that imbues items with ice.",
    type: ['craft'],
    class: ['mystical'],
    tier: 1,
    defaultQty: 1
  },
  {
    entry: ['lightning', 'stone'],
    title: 'Lightning Stone',
    article: 'a ',
    ID: 308,
    roomDesc: "",
    desc: "Common material that imbues items with lightning.",
    type: ['craft'],
    class: ['mystical'],
    tier: 1,
    defaultQty: 1
  },
  {
    entry: ['copper', 'wire'],
    title: 'copper wire',
    article: 'coiled ',
    ID: 309,
    roomDesc: "A bundle of coiled <w>copper</w> wire catches your eye.",
    desc: "Common electric conductive material.",
    type: ['craft'],
    class: ['science'],
    tier: 1,
    defaultQty: 1
  },
  {
    entry: ['gunpowder', 'gun', 'powder', 'gun powder'],
    title: 'gunpowder',
    article: 'some ',
    ID: 310,
    roomDesc: "A small pouch of <w>gunpowder</w> catches your eye.",
    desc: "Common material used for explosive devices.",
    type: ['craft'],
    class: ['science'],
    tier: 1,
    defaultQty: 1
  },
  {
    entry: ['lodestone', 'stone', 'lode'],
    title: 'lodestone',
    article: 'a ',
    ID: 326,
    roomDesc: "A magnetic <w>lodestone</w> wiggles about.",
    desc: "Naturally magnetic stone used for making electric circuits.",
    type: ['craft'],
    class: ['science'],
    tier: 2,
    defaultQty: 1
  },
  {
    entry: ['dagger', 'rusty', 'dagg', 'dag'],
    title: 'rusty dagger',
    shortTitle: 'rusty dagger',
    article: 'a ',
    ID: 401,
    desc: "An old dagger abandoned by somone less fortunate.",
    roomDesc: "A rusted <w>dagger</w> lies on the ground.",
    inspectDesc: 'An unreliable blade with modest damage. Better than your fists.',
    summonDesc: "You ready the dagger.",
    equipDesc: "You practice with the rusted blade. Unequip with <o>uneq</o>.",
    unsummonDesc: 'You put the dagger away.',
    type: ['equip'],
    class: ['light blade'],
    qty: 1,
    dmgMod: 2,
    atkSpd: 7,
    hitMod: 0.1,
    equipped: false,
    eqSlot: 'eqHand',
    atkVerb: 'stab'
  },
];

  ////////////////////////////////////////////////////////////////////////////
  /* Equippable Items */
  ////////////////////////////////////////////////////////////////////////////

let summonLibrary = [
  {
    entry: ['arditi', 'perfect', 'pair', 'dagger', 'dual', 'dual blades'],
    title: 'Arditi, Perfect Pair',
    shortTitle: 'Arditi',
    ID: 402,
    locked: true,
    desc: 'A quick duo of dark swords that dispatches light enemies with ease.',
    inspectDesc: 'A very fast pair of blades that deals damage very reliably.',
    summonDesc: "You pull two slim blades from the other side.",
    equipDesc: 'Arditi nearly jump into your hands, ready to attack.',
    unsummonDesc: 'Arditi evaporate from your hands, returning to the other side.',
    type: ['equip'],
    class: ['dual blades'],
    dmgMod: 1,
    atkSpd: 4,
    hitMod: 0.15,
    equipped: false,
    effectDesc: 'No special effects.',
    eqSlot: 'eqHand',
    atkVerb: 'stab'
  },
  {
    entry: ['aon'],
    title: 'Aon',
    shortTite: 'Aon',
    ID: 403,
    locked: true,
    desc: "Swift blades that protect the wielder.",
    inspectDesc: ".",
    summonDesc: ".",
    equipDesc: ".",
    unsummonDesc: 'unsummon.',
    type: ['equip'],
    class: ['dual blades'],
    dmgMod: 2,
    atkSpd: 5,
    hitMod: 0.12,
    equipped: false,
    effectDesc: 'Occasionally parries enemy attacks.',
    eqSlot: 'eqHand',
    atkVerb: 'slash'
  },
  {
    entry: ['exilon'],
    title: 'Exilon',
    shortTite: 'Exilon',
    ID: 404,
    locked: true,
    desc: "A deadly pair of bloodthirsty claws. Easily finds enemy weak points.",
    inspectDesc: ".",
    summonDesc: ".",
    equipDesc: ".",
    unsummonDesc: 'unsummon.',
    type: ['equip'],
    class: ['dual blades'],
    dmgMod: 4,
    atkSpd: 7,
    hitMod: 0.1,
    critChance: .12,
    critFactor: .5,
    equipped: false,
    effectDesc: 'Critical hits are more frequent and more powerful.',
    eqSlot: 'eqHand',
    atkVerb: 'claw'
  },
  {
    entry: ['chialis'],
    title: 'Chialis',
    shortTite: 'Chialis',
    ID: 405,
    locked: true,
    desc: "An advanced blade duet that increases skill effectiveness.",
    inspectDesc: ".",
    summonDesc: ".",
    equipDesc: ".",
    unsummonDesc: 'unsummon.',
    type: ['equip'],
    class: ['dual blades'],
    dmgMod: 3,
    atkSpd: 6,
    hitMod: 0.1,
    equipped: false,
    effectDesc: 'Skills deal more damage and cost less Plasmoid.',
    eqSlot: 'eqHand',
    atkVerb: 'puncture'
  },
  {
    entry: ['tritus'],
    title: 'Tritus',
    shortTite: 'Tritus',
    ID: 406,
    locked: true,
    desc: "A vetted and effective duo with good damage. Powerful enough to stun enemies.",
    inspectDesc: ".",
    summonDesc: ".",
    equipDesc: ".",
    unsummonDesc: 'unsummon.',
    type: ['equip'],
    class: ['dual blades'],
    dmgMod: 5,
    atkSpd: 9,
    hitMod: 0.05,
    equipped: false,
    effectDesc: 'Each hit has a chance to stun enemies.',
    eqSlot: 'eqHand',
    atkVerb: 'crush'
  },
  {
    entry: ['chrystus', 'silver', 'sword', 'light', 'light blade'],
    title: 'Chrystus, Silver Sword',
    shortTitle: 'Chrystus',
    ID: 407,
    locked: true,
    desc: 'An ancient silver blade with a curiously sharp edge.',
    roomDesc: "Chrystus, Silver Sword, is on the ground.",
    inspectDesc: 'A reliable blade with good damage, speed, and accuracy.',
    summonDesc: "The blade materializes out of thin air.",
    equipDesc: 'You feel the ancient blade thrum with energy.',
    unsummonDesc: 'Chrystus dissipates in a fine silver mist.',
    type: ['equip'],
    class: ['light blade'],
    dmgMod: 5,
    atkSpd: 9,
    hitMod: 0,
    equipped: false,
    effectDesc: 'No special effects.',
    eqSlot: 'eqHand',
    atkVerb: 'slice'
  },
  {
    entry: ['gora'],
    title: 'Gora',
    shortTitle: 'Gora',
    ID: 408,
    locked: true,
    desc: "A short red blade brimming with power. Causes enemies to bleed.",
    inspectDesc: ".",
    summonDesc: ".",
    equipDesc: ".",
    unsummonDesc: 'unsummon.',
    type: ['equip'],
    class: ['light blade'],
    dmgMod: 6,
    atkSpd: 10,
    hitMod: 0,
    equipped: false,
    effectDesc: 'Each hit has a chance to make enemy bleed, which damages them over time.',
    eqSlot: 'eqHand',
    atkVerb: 'rip'
  },
  {
    entry: ['deleora'],
    title: 'Deleora',
    shortTitle: 'Deleora',
    ID: 409,
    locked: true,
    desc: "A nimble blade with excellent reach. Easily finds enemy weak points.",
    inspectDesc: ".",
    summonDesc: ".",
    equipDesc: ".",
    unsummonDesc: 'unsummon.',
    type: ['equip'],
    class: ['light blade'],
    dmgMod: 3,
    atkSpd: 8,
    hitMod: 0.05,
    critChance: .12,
    critFactor: .5,
    equipped: false,
    effectDesc: 'Critical hits are more frequent and more powerful.',
    eqSlot: 'eqHand',
    atkVerb: 'puncture'
  },
  {
    entry: ['wes'],
    title: 'Wes',
    shortTitle: 'Wes',
    ID: 410,
    locked: true,
    desc: "An raw and infested blade that cuts through enemy defenses.",
    inspectDesc: ".",
    summonDesc: ".",
    equipDesc: ".",
    unsummonDesc: 'unsummon.',
    type: ['equip'],
    class: ['light blade'],
    dmgMod: 5,
    atkSpd: 10,
    hitMod: -0.05,
    equipped: false,
    effectDesc: 'Regularly hits enemies with acid damage.',
    eqSlot: 'eqHand',
    atkVerb: 'dissect'
  },
  {
    entry: ['pera'],
    title: 'Pera',
    shortTitle: 'Pera',
    ID: 411,
    locked: true,
    desc: "An ornate and decorated blade that draws power from its user.",
    inspectDesc: ".",
    summonDesc: ".",
    equipDesc: ".",
    unsummonDesc: 'unsummon.',
    type: ['equip'],
    class: ['light blade'],
    dmgMod: 8,
    atkSpd: 13,
    hitMod: 0,
    equipped: false,
    effectDesc: 'Draws Plasmoid for each attack to deal massive damage.',
    eqSlot: 'eqHand',
    atkVerb: 'demolish'
  },
  {
    entry: ['angwar'],
    title: 'Angwar',
    shortTitle: 'Angwar',
    ID: 412,
    locked: true,
    desc: "An enormous two-handed sword that deals great damage.",
    inspectDesc: ".",
    summonDesc: ".",
    equipDesc: ".",
    unsummonDesc: 'unsummon.',
    type: ['equip'],
    class: ['heavy blade'],
    dmgMod: 7,
    atkSpd: 12,
    hitMod: -0.03,
    equipped: false,
    effectDesc: 'No special effects.',
    eqSlot: 'eqHand',
    atkVerb: 'cleave'
  },
  {
    entry: ['grotto'],
    title: 'Grotto',
    shortTitle: 'Grotto',
    ID: 413,
    locked: true,
    desc: "An unorthodox axe that plows through enemy defenses.",
    inspectDesc: ".",
    summonDesc: ".",
    equipDesc: ".",
    unsummonDesc: 'unsummon.',
    type: ['equip'],
    class: ['heavy blade'],
    dmgMod: 9,
    atkSpd: 14,
    hitMod: -0.05,
    equipped: false,
    effectDesc: 'No special effects.',
    eqSlot: 'eqHand',
    atkVerb: 'sunder'
  },
  {
    entry: ['memora'],
    title: 'Memora',
    shortTitle: 'Memora',
    ID: 414,
    locked: true,
    desc: "A refined blade that easily finds enemy weak points.",
    inspectDesc: ".",
    summonDesc: ".",
    equipDesc: ".",
    unsummonDesc: 'unsummon.',
    type: ['equip'],
    class: ['heavy blade'],
    dmgMod: 8,
    atkSpd: 14,
    hitMod: -0.05,
    critChance: .12,
    critFactor: .5,
    equipped: false,
    effectDesc: 'Critical hits are more frequent and more powerful.',
    eqSlot: 'eqHand',
    atkVerb: 'skewer'
  },
  {
    entry: ['virno', 'axe', 'great'],
    title: 'Virno, Great Axe',
    shortTitle: 'Virno',
    ID: 415,
    locked: true,
    desc: 'A brutal axe that tears enemies apart.',
    roomDesc: "Virno, Great Axe, lies here.",
    inspectDesc: 'A massive blade that is as slow as it is powerful. Can be hard to aim.',
    summonDesc: "You pull Virno from the earth, ready for bloodletting.",
    equipDesc: 'You ready the massive axe for destruction.',
    unsummonDesc: 'unsummon.',
    type: ['equip'],
    class: ['heavy blade'],
    dmgMod: 10,
    atkSpd: 15,
    hitMod: -0.05,
    equipped: false,
    effectDesc: 'No special effects.',
    eqSlot: 'eqHand',
    atkVerb: 'destroy'
  },
  {
    entry: ['fae'],
    title: 'Fae',
    shortTitle: 'Fae',
    ID: 416,
    locked: true,
    desc: "An ancient ritual blade that greatly increases skill power at the cost of damage.",
    inspectDesc: ".",
    summonDesc: ".",
    equipDesc: ".",
    unsummonDesc: 'unsummon.',
    type: ['equip'],
    class: ['heavy blade'],
    dmgMod: 4,
    atkSpd: 12,
    hitMod: 0.1,
    equipped: false,
    effectDesc: 'Skills deal more damage and cost less Plasmoid.',
    eqSlot: 'eqHand',
    atkVerb: 'blast'
  },
  {
    entry: ['busteo'],
    title: 'Busteo',
    shortTitle: 'Busteo',
    ID: 450,
    locked: true,
    desc: "A reliable set of scale mail that protects the wearer from various ailments.",
    roomDesc: "room.",
    inspectDesc: 'inspect.',
    summonDesc: 'summon.',
    equipDesc: 'equip.',
    unsummonDesc: 'unsummon.',
    type: ['equip'],
    class: ['armor'],
    armorMod: 5,
    hitMod: 0,
    spdMod: 0,
    equipped: false,
    effectDesc: 'Boosts resistance to stun, bleed, and berserk.',
    eqSlot: 'eqTorso'
  },
  {
    entry: ['brava'],
    title: 'Brava',
    shortTitle: 'Brava',
    ID: 451,
    locked: true,
    desc: "An aggressive set of chain mail that increases the effectiveness of counter attacks and retaliations.",
    roomDesc: "room.",
    inspectDesc: 'inspect.',
    summonDesc: 'summon.',
    equipDesc: 'equip.',
    unsummonDesc: 'unsummon.',
    type: ['equip'],
    class: ['armor'],
    armorMod: 2,
    hitMod: -0.03,
    spdMod: -1,
    equipped: false,
    effectDesc: 'Parries and counterattacks are stronger and more frequent.',
    eqSlot: 'eqTorso'
  },
  {
    entry: ['aundrei'],
    title: 'Aundrei',
    shortTitle: 'Aundrei',
    ID: 452,
    locked: true,
    desc: "A lithe and flexible set of armor that helps engage targets faster and more accurately.",
    roomDesc: "room.",
    inspectDesc: 'inspect.',
    summonDesc: 'summon.',
    equipDesc: 'equip.',
    unsummonDesc: 'unsummon.',
    type: ['equip'],
    class: ['armor'],
    armorMod: 1,
    hitMod: 0.12,
    spdMod: -2,
    equipped: false,
    effectDesc: 'No special effects.',
    eqSlot: 'eqTorso'
  },
  {
    entry: ['snuff'],
    title: 'Snuff',
    shortTitle: 'Snuff',
    ID: 453,
    locked: true,
    desc: "An impish-looking set of skin-like armor that gives it's user various benefits.",
    roomDesc: "room.",
    inspectDesc: 'inspect.',
    summonDesc: 'summon.',
    equipDesc: 'equip.',
    unsummonDesc: 'unsummon.',
    type: ['equip'],
    class: ['armor'],
    armorMod: 3,
    hitMod: 0.08,
    spdMod: -1,
    equipped: false,
    effectDesc: 'Helps find more crafting materials, improves item effectiveness, and occasionally blocks attacks.',
    eqSlot: 'eqTorso'
  },
  {
    entry: ['fir'],
    title: 'Fir',
    shortTitle: 'Fir',
    ID: 454,
    locked: true,
    desc: "An intricate set of ritual armor worn by royalty. Helps the wearer recover faster.",
    roomDesc: "room.",
    inspectDesc: 'inspect.',
    summonDesc: 'summon.',
    equipDesc: 'equip.',
    unsummonDesc: 'unsummon.',
    type: ['equip'],
    class: ['armor'],
    armorMod: 4,
    hitMod: 0.05,
    spdMod: -1,
    equipped: false,
    effectDesc: 'Skills recover faster and consume less blood when out of Plasmoid.',
    eqSlot: 'eqTorso'
  },
  {
    entry: ['breedwyn'],
    title: 'Breedwyn',
    shortTitle: 'Breedwyn',
    ID: 455,
    locked: true,
    desc: "Imposing heavy plate armor with reliable defense.",
    roomDesc: "room.",
    inspectDesc: 'inspect.',
    summonDesc: 'summon.',
    equipDesc: 'equip.',
    unsummonDesc: 'unsummon.',
    type: ['equip'],
    class: ['armor'],
    armorMod: 7,
    hitMod: -0.05,
    spdMod: 0,
    equipped: false,
    effectDesc: 'No special effects.',
    eqSlot: 'eqTorso'
  },
  {
    entry: ['heleo'],
    title: 'Heleo',
    shortTitle: 'Heleo',
    ID: 456,
    locked: true,
    desc: "A head-to-toe set of scale armor carved from the hide of a legendary creature.",
    roomDesc: "room.",
    inspectDesc: 'inspect.',
    summonDesc: 'summon.',
    equipDesc: 'equip.',
    unsummonDesc: 'unsummon.',
    type: ['equip'],
    class: ['armor'],
    armorMod: 8,
    hitMod: -0.1,
    spdMod: 2,
    equipped: false,
    effectDesc: 'No special effects.',
    eqSlot: 'eqTorso'
  },
  {
    entry: ['cantella'],
    title: 'Cantella',
    shortTitle: 'Cantella',
    ID: 457,
    locked: true,
    desc: "A clunky set of armor that increases the chance of finding materials and recovering health and plasmoid.",
    roomDesc: "room.",
    inspectDesc: 'inspect.',
    summonDesc: 'summon.',
    equipDesc: 'equip.',
    unsummonDesc: 'unsummon.',
    type: ['equip'],
    class: ['armor'],
    armorMod: 6,
    hitMod: 0,
    spdMod: 2,
    equipped: false,
    effectDesc: 'Helps find more crafting materials more often, and defeated enemies occasionally restore health or plasmoid.',
    eqSlot: 'eqTorso'
  },
  {
    entry: ['torrin'],
    title: 'Torrin',
    shortTitle: 'Torrin',
    ID: 458,
    locked: true,
    desc: "A battle-tested set of living armor that helps the wearer engage multiple enemies.",
    roomDesc: "room.",
    inspectDesc: 'inspect.',
    summonDesc: 'summon.',
    equipDesc: 'equip.',
    unsummonDesc: 'unsummon.',
    type: ['equip'],
    class: ['armor'],
    armorMod: 5,
    hitMod: -0.1,
    spdMod: 1,
    equipped: false,
    effectDesc: 'When engaged in battle with multiple enemies, Torrin will attack the other foes.',
    eqSlot: 'eqTorso'
  },
  {
    entry: ['dolorem'],
    title: 'Dolorem',
    shortTitle: 'Dolorem',
    ID: 459,
    locked: true,
    desc: "Impossibly dense set of full plate armor. Greatly increases defense, but has a mind of its own.",
    roomDesc: "room.",
    inspectDesc: 'inspect.',
    summonDesc: 'summon.',
    equipDesc: 'equip.',
    unsummonDesc: 'unsummon.',
    type: ['equip'],
    class: ['armor'],
    armorMod: 9,
    hitMod: 0,
    spdMod: 2,
    equipped: false,
    effectDesc: "Can't flee from battle.",
    eqSlot: 'eqTorso'
  },
  /*{
    entry: [''],
    title: '',
    shortTitle: '',
    ID: 450,
    locked: true,
    desc: "desc",
    roomDesc: "room.",
    inspectDesc: 'inspect.',
    summonDesc: 'summon.',
    equipDesc: 'equip.',
    unsummonDesc: 'unsummon.',
    type: ['equip'],
    class: ['armor'],
    armorMod: 0,
    hitMod: 0,
    spdMod: 0,
    equipped: false,
    effectDesc: 'No special effects.',
    eqSlot: 'eqTorso'
  },*/
];

let recipeLibrary = [

////////////////////////////////////////////////////////////////////////////
/* Basic Item Recipes */
////////////////////////////////////////////////////////////////////////////

  {
    ID: 501,
    entry: ['shard', 'health', 'health shard'],
    title: 'Health Shard',
    article: 'a ',
    ingreds: [
      //{qty: 2, ingred: 305},
      {qty: 1, ingred: 301},
      {qty: 1, ingred: 304}
    ],
    mods: [
      {ingred: 'Blood', effect: 'Increase health recovered'},
      {ingred: 'Plasmoid Essence', effect: 'Also recover some as Plasmoid'}
    ],
    desc: "Instantly recover some health.",
    useDesc: "You bite down on the soft crystal. <span class='green'>You feel better</span>.",
    roomDesc: "A Health <w>Shard</w> catches your eye.",
    inspectDesc: "A mysterious crystal infused with magic. <span class='green'>Heals about 50% health</span>.",
    type: ['picksume'],
    class: ['recovery'],
    func: function(thisRoomIndex, indirObj) {
      updateStat('HP', 'add', .5);
      log(this.useDesc);
      removeInv(thisRoomIndex, this);
    }
  },
  {
    ID: 502,
    entry: ['plasmoid', 'pouch'],
    title: 'Plasmoid Pouch',
    article: 'a ',
    ingreds: [
      {qty: 2, ingred: 301},
      {qty: 1, ingred: 304},
      {qty: 2, ingred: 305}
    ],
    mods: [
      {ingred: 'Blood', effect: 'Increase plasmoid recovered'},
    ],
    desc: "Instantly recover Plasmoid.",
    useDesc: "You drink the viscous liquid. <pu>You feel more powerful</pu>.",
    roomDesc: "A Plasmoid <w>Pouch</w> catches your eye.",
    inspectDesc: "A crude pouch filled with filtered plasmoid. <pu>Restores about 60% Plasmoid</pu>.",
    type: ['picksume'],
    class: ['recovery'],
    func: function() {
      updateStat('plasmoid', 'add', .75);
      log(this.useDesc);
      removeInv(thisRoomIndex, this);
    }
  },
  {
    ID: 503,
    entry: ['purifying tonic', 'purifying', 'tonic'],
    title: 'Purifying Tonic',
    article: 'a ',
    ingreds: [
      {qty: 1, ingred: 304},
      {qty: 1, ingred: 305}
    ],
    type: ['picksume'],
    class: ['recovery'],
    desc: "Recovers all status effects. If using tier 2 or 3 items, receive more tonics",
    useDesc: "The clear liquid tastes fresh. <g>You feel better.</g>",
    roomDesc: ".",
    inspectDesc: ".",
    func: function() {
      log(this.useDesc);
      removeInv(thisRoomIndex, this);
      cleanBuffs('player', 'debuff');
    }
  },
  {
    ID: 504,
    entry: ['rejuvinating shard', 'shard', 'rejuvinating', 'rejuv'],
    title: 'Rejuvinating Shard',
    article: 'a ',
    ingreds: [
      {qty: 2, ingred: 'Glittering Dust'},
      {qty: 1, ingred: 'Twilight Shard'},
      {qty: 2, ingred: 309}
    ],
    mods: [
      {ingred: '2 Dust', effect: 'Increase duration'},
      {ingred: 'Plasmoid Essence', effect: 'increase regen rate'}
    ],
    class: ['recovery'],
    desc: "Slowly recover health and plasmoid."
  },
  {
    ID: 505,
    entry: ['vigor tonic', 'vigor', 'tonic'],
    title: 'Vigor Tonic',
    type: ['picksume'],
    class: ['buff', 'tonic'],
    desc: "Increase maximum Health Points for short time.",
    useDesc: ".",
    roomDesc: ".",
    inspectDesc: ".",
    func: function() {
      log(this.useDesc);
      removeInv(thisRoomIndex, this);
    }
  },
  {
    ID: 506,
    entry: ['nimble tonic', 'nimble', 'tonic'],
    title: 'Nimble Tonic',
    article: 'a ',
    ingreds: [
      {qty: 1, ingred: 303},
      {qty: 1, ingred: 304},
      {qty: 1, ingred: 305}
    ],
    mods: [
      {ingred: '2 Dust', effect: 'Increase duration'},
      {ingred: 'Lightning Shard/Stone/Crystal', effect: 'Increase movement speed'}
    ],
    type: ['picksume'],
    class: ['buff', 'tonic'],
    desc: "Increase attack speed and skill recovery for a short time.",
    useDesc: ".",
    roomDesc: ".",
    inspectDesc: ".",
    func: function() {
      log(this.useDesc);
      removeInv(thisRoomIndex, this);
    }
  },
  {
    ID: 507,
    entry: ['hunter tonic', 'hunter', 'tonic'],
    title: 'Hunter tonic',
    type: ['picksume'],
    class: ['buff', 'tonic'],
    desc: "Increase accuracy and critical hit chance for a short time.",
    useDesc: "You swallow the orange liquid and feel your focus center.",
    roomDesc: "A bright orange <w>hunter tonic</w> swishes in its vial.",
    inspectDesc: "Small bubbles float to the surface.",
    func: function() {
      log(this.useDesc);
      removeInv(thisRoomIndex, this);
    }
  },
  {
    ID: 508,
    entry: ['feral breastplate', 'feral', 'breastplate'],
    title: 'Feral Breastplate',
    article: 'a ',
    ingreds: [
      {qty: 2, ingred: 303},
      {qty: 1, ingred: 301},
      {qty: 1, ingred: 305},
      {qty: 1, ingred: 309}
    ],
    mods: [
      {ingred:'Elemental Stone/Shard/Crystal', effect: 'reduce element-specific damage.'}
    ],
    noBattle: true,
    noCombine: true,
    type: ['picksume'],
    class: ['buff'],
    desc: "A fairly study breastplate that can deflect multiple hits before breaking.",
    useDesc: "You assemble the coarse armor and pull it over your head.",
    roomDesc: "A hairy, coarse <w>breastplate</w> has been discarded here.",
    inspectDesc: ".",
    func: function() {
      log(this.useDesc);
      removeInv(thisRoomIndex, this);
    }
  },
  {
    ID: 509,
    entry: ['boiling oil', 'boil', 'boiling', 'oil'],
    title: 'Boiling Oil',
    type: ['picksume'],
    class: ['buff', 'oil'],
    desc: "Regular attacks have a chance to berserk the enemy, negating skills and guard.",
    useDesc: "The hot red liquid runs down your blade.",
    roomDesc: ".",
    inspectDesc: ".",
    func: function() {
      log(this.useDesc);
      removeInv(thisRoomIndex, this);
      var thisBuff = checkArray(buffList, 'enrage1');
      addBuff(this.title, thisBuff, 'player');
    }
  },
  {
    ID: 510,
    entry: ['dark oil', 'oil'],
    title: 'Dark Oil',
    type: ['picksume'],
    class: ['buff', 'oil'],
    desc: "Regular attacks have a chance to cause bleed, dealing damage over time.",
    useDesc: "You coat your weapon with the dark, murky oil.",
    roomDesc: ".",
    inspectDesc: ".",
    func: function() {
      log(this.useDesc);
      removeInv(thisRoomIndex, this);
      var thisBuff = checkArray(buffList, 'bloodthirsty1');
      addBuff(this.title, thisBuff, 'player');
    }
  },
  {
    ID: 511,
    entry: ['conductive oil', 'conductive', 'oil', 'conduct'],
    title: 'Conductive Oil',
    type: ['picksume'],
    class: ['buff', 'oil'],
    desc: "Regular attacks have a chance to stun enemies with electricity.",
    useDesc: "You coat your weapon in the electrifying oil.",
    roomDesc: ".",
    inspectDesc: ".",
    func: function() {
      log(this.useDesc);
      removeInv(thisRoomIndex, this);
      var thisBuff = checkArray(buffList, 'electric1');
      addBuff(this.title, thisBuff, 'player');
    }
  },
  {
    ID: 512,
    entry: ['corrosive oil', 'oil'],
    title: 'Corrosive Oil',
    type: ['picksume'],
    class: ['buff', 'oil'],
    desc: "Regular attacks have a chance to cut through armor, ignoring enemy defenses.",
    useDesc: ".",
    roomDesc: ".",
    inspectDesc: ".",
    func: function() {
      log(this.useDesc);
      removeInv(thisRoomIndex, this);
    }
  },
  {
    ID: 513,
    entry: ['maddening oil', 'oil', 'maddening', 'madden', 'mad'],
    title: 'Maddening Oil',
    type: ['picksume'],
    class: ['buff', 'oil'],
    desc: "Regular attacks have a chance to confuse the enemy, causing them to miss more often and perhaps damage themselves.",
    useDesc: "Your weapon drips with the wriggling liquid.",
    roomDesc: ".",
    inspectDesc: ".",
    func: function() {
      log(this.useDesc);
      removeInv(thisRoomIndex, this);
      var thisBuff = checkArray(buffList, 'maddening1');
      addBuff(this.title, thisBuff, 'player');
    }
  },
  {
    ID: 514,
    entry: ['trap', 'primitive', 'primitive trap'],
    title: 'Primitive Trap',
    article: 'a ',
    desc: "Set the trap to deal heavy damage to monsters. Can only be used before battle starts.",
    useDesc: "You carefully pull back the lever and prime the switch.",
    roomDesc: "Someone left a primitive <w>trap</w> disarmed here.",
    inspectDesc: "Arm the trap to deal heavy damage to monsters. Automatically detonated when battle starts.",
    roomDescArmed: "A primitive <w>trap</w> is <o>armed and ready to fire</o>.",
    detonateDesc: "The Primitive Trap's razor wire whips around you!",
    ingreds: [
      {qty: 2, ingred: 302},
      {qty: 1, ingred: 310},
      {qty: 1, ingred: 309}
    ],
    mods: [
      {ingred: 'Claws', effect: 'Add bonus damage'},
      {ingred: '2 Gunpowder', effect: 'Increase AoE'},
      {ingred: 'Blood', effect: 'Chance to cause bleeding'},
      {ingred: 'Elemental Stone/Shard/Crystal', effect: 'add elemental damage and chance to cause status effect'}
    ],
    noBattle: true,
    state: 'unarmed',
    detonateOn: 'battleStart',
    type: ['picksume'],
    class: ['assault', 'trap'],
    func: function() {
      if (!battling) {
        log(this.useDesc, 'orange');
        this.state = 'armed';
        removeInv(thisRoomIndex, this);
        addObj(thisRoomIndex, this);
      } else {
        log("You don't have time for that!", 'yellow');
      }
    },
    detonate: function() {
      removeObj(thisRoomIndex, this);
      log(this.detonateDesc, 'yellow');
      damageAllMobs(this.title, 8.5 * player.assaultDmgMod, 'Primitive Trap slices');
    }
  },

  /////////////////////////////////////////////////////////////////////////////////////
  /* Advanced Items */
  /////////////////////////////////////////////////////////////////////////////////////



  {
    ID: 512,
    entry: ['fire grenade', 'fire', 'grenade'],
    title: 'Fire Grenade',
    article: 'a ',
    ingreds: [
      {qty: 2, ingred: 302},
      {qty: 1, ingred: 310},
      {qty: 1, ingred: 306}
    ],
    mods: [
      {ingred: 'Claws', effect: 'Add bonus damage'},
      {ingred: '2 Gunpowder', effect: 'Increase AoE'},
      {ingred: 'Blood', effect: 'Chance to cause bleeding'}
    ],
    type: ['picksume'],
    class: ['assault', 'grenade'],
    desc: "damage and burn multiple enemies. Detonates on contact.",
    useDesc: "You pull the pin and toss the grenade!",
    roomDesc: "A <w>fire grenade</w> sits here.",
    inspectDesc: "Its round, lumpy body fits nicely in your hand. You can feel the heat emanating from it.",
    func: function(thisRoomIndex, indirObj) {
      log(this.useDesc, 'orange');
      removeInv(thisRoomIndex, this);
      damageAllMobs(this.title, 4.5 * player.assaultDmgMod, 'Fire Grenade burns');
    }
  },
  {
    ID: 513,
    entry: ['ice grenade', 'ice', 'grenade'],
    title: 'Ice Grenade',
    article: 'an ',
    ingreds: [
      {qty: 2, ingred: 302},
      {qty: 1, ingred: 310},
      {qty: 1, ingred: 307}
    ],
    mods: [
      {ingred: 'Claws', effect: 'Add bonus damage'},
      {ingred: '2 Gunpowder', effect: 'Increase AoE'},
      {ingred: 'Blood', effect: 'Chance to cause bleeding'}
    ],
    type: ['picksume'],
    class: ['assault', 'grenade'],
    desc: "damage and slow multiple enemies. Detonates on contact.",
    useDesc: ".",
    roomDesc: ".",
    inspectDesc: ".",
    func: function() {
      log(this.useDesc);
      removeInv(thisRoomIndex, this);
    }
  },
  {
    ID: 514,
    entry: ['lightning grenade', 'lightning', 'grenade'],
    title: 'Lightning Grenade',
    article: 'a ',
    ingreds: [
      {qty: 2, ingred: 302},
      {qty: 1, ingred: 310},
      {qty: 1, ingred: 308}
    ],
    mods: [
      {ingred: 'Claws', effect: 'Add bonus damage'},
      {ingred: '2 Gunpowder', effect: 'Increase AoE'},
      {ingred: 'Blood', effect: 'Chance to cause bleeding'}
    ],
    type: ['picksume'],
    class: ['assault', 'grenade'],
    desc: "damage and chain lightning to multiple enemies. Detonates on contact.",
    useDesc: ".",
    roomDesc: ".",
    inspectDesc: ".",
    func: function() {
      log(this.useDesc);
      removeInv(thisRoomIndex, this);
    }
  },




  {
    ID: 516,
    entry: ['health stone', 'stone', 'health'],
    title: 'Health Stone',
    article: 'a ',
    ingreds: [
      {qty: 2, ingred: 'Luminescent Dust'},
      {qty: 1, ingred: 'Monstrous Blood'},
      {qty: 1, ingred: 'Twilight Stone'}
    ],
    mods: [
      {ingred:'Blood', effect: 'Increase health recovered'},
      {ingred: 'Plasmoid Essence', effect: 'Also recover some as Plasmoid'}
    ],
    class: ['recovery'],
    desc: "instantly recover a moderate amount of health (60%)."
  },
  {
    ID: 517,
    entry: ['rejuvinating stone', 'stone', 'rejuvinating', 'rejuv'],
    title: 'Rejuvinating Stone',
    article: 'a ',
    ingreds: [
      {qty: 2, ingred: 'Luminescent Dust'},
      {qty: 1, ingred: 'Twilight Stone'},
      {qty: 2, ingred: 309}
    ],
    mods: [
      {ingred: '2 Dust', effect: 'Increase duration'},
      {ingred: 'Plasmoid Essence', effect: 'increase regen rate'}
    ],
    class: ['recovery'],
    desc: "moderately speed up health and Plasmoid recovery."
  },
  {
    ID: 518,
    entry: ['recovery stone', 'recovery', 'stone', 'recover'],
    title: 'Recovery Stone',
    article: 'a ',
    ingreds: [
      {qty: 1, ingred: 'Luminescent Dust'},
      {qty: 1, ingred: 'Monstrous Blood'},
      {qty: 1, ingred: 'Twilight Stone'}
    ],
    mods: [
      {ingred: 'Dust', effect: 'Increase duration'},
      {ingred: 'Blood', effect: 'Increase regen rate'},
      {ingred: 'Plasmoid Essence', effect: 'Also recover Plasmoid at a reduced rate'}
    ],
    class: ['recovery'],
    desc: "regenerate health at a good rate."
  },
  {
    ID: 519,
    entry: ['coagulant', 'coagulate', 'coag'],
    title: 'Coagulant',
    ingreds: [
      {qty: 1, ingred: 'Monstrous Blood'},
      {qty: 1, ingred: 'Plasmoid Essence'},
      {qty: 1, ingred: 'Lodestone'}
    ],
    mods: [
      {ingred: 'Plasmoid Essence', effect: 'Further reduce Plasmoid cost'},
      {ingred: '2 Dust', effect: 'Increase duration'}
    ],
    class: ['recovery'],
    desc: "Reduce Plasmoid cost for a short time."
  },
  {
    ID: 520,
    entry: ['enraging stone', 'enraging', 'stone', 'rage', 'enrage'],
    title: 'Enraging Stone',
    article: 'an ',
    ingreds: [
      {qty: 2, ingred: 'Monstrous Claws'},
      {qty: 1, ingred: 'Monstrous Blood'},
      {qty: 1, ingred: 'Twilight Stone'},
      {qty: 1, ingred: 309}
    ],
    mods: [
      {ingred: '2 Dust', effect: 'Increase duration'},
      {ingred: 'Claws', effect: 'Increase damage'}
    ],
    class: ['recovery'],
    desc: "significantly raise attack speed and damage for a short time"
  },
  {
    ID: 521,
    entry: ['warding amulet'],
    title: 'Warding Amulet',
    article: 'a ',
    ingreds: [
      {qty: 1, ingred: 'Monstrous Hide'},
      {qty: 2, ingred: 309},
      {qty: 1, ingred: 'Lodestone'}
    ],
    mods: [
      {ingred: 'Trans-Dimensional Residue', effect: 'Reflect status effects back to the attackers,'}
    ],
    class: ['recovery'],
    desc: "prevents status effects 3-5 times before breaking"
  },
  {
    ID: 522,
    entry: ['blood tonic'],
    title: 'Blood Tonic',
    ingreds: [
      {qty: 1, ingred: 'Monstrous Blood'},
      {qty: 2, ingred: 'Luminescent Dust'},
      {qty: 1, ingred: 'Twilight Stone'}
    ],
    mods: [
      {ingred: '2 Dust', effect: 'Increase duration'},
      {ingred: 'Blood', effect: 'Increase chance to bleed'}
    ],
    class: ['buff'],
    desc: "Next several attacks have a chance to inflict bleed."
  },
  {
    ID: 523,
    entry: ['fear tonic'],
    title: 'Fear Tonic',
    ingreds: [
      {qty: 1, ingred: 'Monstrous Claws'},
      {qty: 2, ingred: 'Luminescent Dust'},
      {qty: 1, ingred: 'Twilight Stone'}
    ],
    mods: [
      {ingred: '2 Dust', effect: 'Increase duration'},
      {ingred: 'Claws', effect: 'Increase chance to fear'}
    ],
    class: ['buff'],
    desc: "Next several attacks have a chance to inflict fear."
  },
  {
    ID: 524,
    entry: ['confuse tonic'],
    title: 'Confuse Tonic',
    ingreds: [
      {qty: 1, ingred: 'Monstrous Hide'},
      {qty: 2, ingred: 'Luminescent Dust'},
      {qty: 1, ingred: 'Twilight Stone'}
    ],
    mods: [
      {ingred: '2 Dust', effect: 'Increase duration'},
      {ingred: 'Hide', effect: 'Increase chance to confuse'}
    ],
    class: ['buff'],
    desc: "Next several attacks have a chance to inflict confusion."
  },
  {
    ID: 525,
    entry: ['acid tonic'],
    title: 'Acid Tonic',
    ingreds: [
      {qty: 1, ingred: 'Lodestone'},
      {qty: 2, ingred: 'Luminescent Dust'},
      {qty: 1, ingred: 'Twilight Stone'}
    ],
    mods: [
      {ingred: '2 Dust', effect: 'Increase duration'},
      {ingred: 'Lodestone', effect: 'Increase chance to cut through armor'}
    ],
    class: ['buff'],
    desc: "Next several attacks cut through armor."
  },
  {
    ID: 526,
    entry: ['monstrous breastplate'],
    title: 'Monstrous Breastplate',
    article: 'a ',
    ingreds: [
      {qty: 2, ingred: 'Monstrous Hide'},
      {qty: 1, ingred: 'Monstrous Blood'},
      {qty: 2, ingred: 309}
    ],
    mods: [
      {ingred: 'Hide', effect: 'Increase damage absorbed'},
      {ingred: 'Trans-Dimensional Residue', effect: 'Recover health more quickly while active'}
    ],
    class: ['buff'],
    desc: "protect against a moderate amount of damage before breaking"
  },
  {
    ID: 527,
    entry: ['spike shield'],
    title: 'Spike Shield',
    article: 'a ',
    ingreds: [
      {qty: 1, ingred: 'Monstrous Claws'},
      {qty: 1, ingred: 'Monstrous Hide'},
      {qty: 2, ingred: 310},
      {qty: 1, ingred: 'Lodestone'},
    ],
    mods: [
      {ingred: 'Claws', effect: 'increase damage'},
      {ingred: '2 Gunpowder', effect: 'Increase AoE'},
      {ingred: 'Plasmoid Essence', effect: 'Detonation instantly recovers some Plasmoid'},
      {ingred: 'Ungola Spawn Eye', effect: 'Adds another use before breaking'},
      {ingred: '3 Hide', effect: 'Adds another use before breaking'}
    ],
    class: ['buff'],
    desc: "Explodes when attacked, protecting and dealing great damage to the attacker"
  },
  {
    ID: 528,
    entry: ['incendiary oil +'],
    title: 'Incendiary Oil +',
    class: ['buff'],
    desc: "Enchant melee attacks with fire, dealing additional fire damage. Chance to set enemies on fire. (extended duration, double burn chance)"
  },
  {
    ID: 529,
    entry: ['chilling oil +'],
    title: 'Chilling Oil +',
    class: ['buff'],
    desc: "enchant melee attacks with ice, dealing additional ice damage and slowing enemies. (extended duration, stronger slowing)"
  },
  {
    ID: 530,
    entry: ['conductive oil +'],
    title: 'Conductive Oil +',
    class: ['buff'],
    desc: "enchant melee attacks with lightning, dealing additional lightning damage and chaining lightning. (extended duration, more bounces)"
  },
  {
    ID: 531,
    entry: ['corrosive oil +'],
    title: 'Corrosive Oil +',
    class: ['buff'],
    desc: "enchant melee attacks with acid, cutting through armor. (extended duration)"
  },
  {
    ID: 532,
    entry: ['vigorous oil +'],
    title: 'Vigorous Oil +',
    class: ['buff'],
    desc: "Greatly increase melee attack spread and reach. (2x arc, 2x reach)"
  },
  {
    ID: 533,
    entry: ['nimble serum +'],
    title: 'Nimble Serum +',
    class: ['buff'],
    desc: "Greatly increase ranged attack speed and aim speed. Dodging doesn't interrupt aiming. (Can't release to fire in the middle of dodge though)"
  },
  {
    ID: 534,
    entry: "Hunter's Serum",
    class: ['buff'],
    desc: "Small chance to instantly defeat enemies with aimed shots. More accurate aim increases chance. (Light enemies high chance, heavy enemies lower chance)"
  },
  {
    ID: 535,
    entry: ['berserker serum'],
    title: 'Berserker Serum',
    class: ['buff'],
    desc: "increase attack speed and ignore some interruptions (1.4x atk spd, ignore 1 atk/sec)"
  },
  {
    ID: 536,
    entry: ['transfusion serum'],
    title: 'Transfusion Serum',
    class: ['buff'],
    desc: "recover a bit of Plasmoid for every hit. (adjusted for attack speed, multiplied by enemies hit.)"
  },
  {
    ID: 537,
    entry: ['stalwart serum'],
    title: 'Stalwart Serum',
    class: ['buff'],
    desc: "blocking an attack stuns the attacker. This enchantment lasts for 12 uses, and has no time limit."
  },
  {
    ID: 538,
    entry: ['elemental ooze'],
    title: 'Elemental Ooze',
    class: ['buff'],
    desc: "Deal 100% more elemental damage (fire, ice, lightning, acid) for a short time"
  },
  {
    ID: 539,
    entry: ['fire grenade +'],
    title: 'Fire Grenade +',
    article: 'a ',
    ingreds: [
      {qty: 1, ingred: 'Monstrous Claws'},
      {qty: 2, ingred: 310},
      {qty: 2, ingred: 306}
    ],
    mods: [
      {ingred: 'Claws', effect: 'Add bonus damage'},
      {ingred: '2 Gunpowder', effect: 'Increase AoE'},
      {ingred: 'Blood', effect: 'Chance to cause bleeding'}
    ],
    type: ['picksume'],
    class: ['assault', 'grenade'],
    desc: "Heavily damage and burn enemies in a wide area. Detonates on contact.",
    useDesc: ".",
    roomDesc: ".",
    inspectDesc: ".",
    func: function() {
      log(this.useDesc);
      removeInv(thisRoomIndex, this);
    }
  },
  {
    ID: 540,
    entry: ['ice grenade +'],
    title: 'Ice Grenade +',
    article: 'an ',
    ingreds: [
      {qty: 1, ingred: 'Monstrous Claws'},
      {qty: 2, ingred: 310},
      {qty: 2, ingred: 307}
    ],
    mods: [
      {ingred: 'Claws', effect: 'Add bonus damage'},
      {ingred: '2 Gunpowder', effect: 'Increase AoE'},
      {ingred: 'Blood', effect: 'Chance to cause bleeding'}
    ],
    type: ['picksume'],
    class: ['assault', 'grenade'],
    desc: "Heavily damage and slow enemies in a wide area. Detonates on contact.",
    useDesc: ".",
    roomDesc: ".",
    inspectDesc: ".",
    func: function() {
      log(this.useDesc);
      removeInv(thisRoomIndex, this);
    }
  },
  {
    ID: 541,
    entry: ['lightning grenade +'],
    title: 'Lightning Grenade +',
    article: 'a ',
    ingreds: [
      {qty: 1, ingred: 'Monstrous Claws'},
      {qty: 2, ingred: 310},
      {qty: 2, ingred: 308}
    ],
    mods: [
      {ingred: 'Claws', effect: 'Add bonus damage'},
      {ingred: '2 Gunpowder', effect: 'Increase AoE'},
      {ingred: 'Blood', effect: 'Chance to cause bleeding'}
    ],
    type: ['picksume'],
    class: ['assault', 'grenade'],
    desc: "Heavily damage and chain lightning enemies in a wide area. Detonates on contact.",
    useDesc: ".",
    roomDesc: ".",
    inspectDesc: ".",
    func: function() {
      log(this.useDesc);
      removeInv(thisRoomIndex, this);
    }
  },
  {
    ID: 542,
    entry: ['advanced trap'],
    title: 'Advanced Trap',
    article: 'an ',
    ingreds: [
      {qty: 1, ingred: 'Monstrous Claws'},
      {qty: 1, ingred: 'Lodestone'},
      {qty: 2, ingred: 309}
    ],
    mods: [
      {ingred: 'Claws', effect: 'Add bonus damage'},
      {ingred: '2 Gunpowder', effect: 'Increase AoE'},
      {ingred: 'Blood', effect: 'Chance to cause bleeding'},
      {ingred: 'Elemental Stone/Shard/Crystal', effect: 'add elemental damage and chance to cause status effect'}
    ],
    noBattle: true,
    state: 'unarmed',
    detonateOn: 'battleStart',
    class: ['assault', 'trap'],
    desc: "Deal great damage in a moderate radius when triggered",
    useDesc: "You prime the trap.",
    roomDesc: "Someone left an advanced <w>trap</w> disarmed here.",
    inspectDesc: "Arm the trap to deal heavy damage to monsters. Can only be used before battle starts.",
    roomDescArmed: "An advanced <w>trap</w> is <o>armed and ready to fire</o>.",
  }
];
