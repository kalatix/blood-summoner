let roomLibrary = [


/////////////////////////////////////////////
/* WORLD MAP BATTLE ROOMS */
/////////////////////////////////////////////


  {
    title: 'Territory 1 Random Battle',
    ID: 9010,
    desc: "Somewhere on the peninsula.",
    descPreview: ".",
    cont: [],
    mobs: [],
    exitN: false,
    exitS: false,
    exitE: false,
    exitW: false,
    current: false
  },
  {
    title: 'Territory 2 Random Battle',
    ID: 9020,
    desc: "Somewhere on the mainland.",
    descPreview: ".",
    cont: [],
    mobs: [],
    exitN: false,
    exitS: false,
    exitE: false,
    exitW: false,
    current: false
  },
  {
    title: 'Territory 3 Random Battle',
    ID: 9030,
    desc: "Somewhere on the mainland.",
    descPreview: ".",
    cont: [],
    mobs: [],
    exitN: false,
    exitS: false,
    exitE: false,
    exitW: false,
    current: false
  },
  {
    title: 'Territory 4 Random Battle',
    ID: 9040,
    desc: "Somewhere on the mainland.",
    descPreview: ".",
    cont: [],
    mobs: [],
    exitN: false,
    exitS: false,
    exitE: false,
    exitW: false,
    current: false
  },
  {
    title: 'Territory 5 Random Battle',
    ID: 9050,
    desc: "Somewhere on the mainland.",
    descPreview: ".",
    cont: [],
    mobs: [],
    exitN: false,
    exitS: false,
    exitE: false,
    exitW: false,
    current: false
  },
  {
    title: 'Territory 6 Random Battle',
    ID: 9060,
    desc: "Somewhere on the mainland.",
    descPreview: ".",
    cont: [],
    mobs: [],
    exitN: false,
    exitS: false,
    exitE: false,
    exitW: false,
    current: false
  },
  {
    title: 'Territory 7 Random Battle',
    ID: 9070,
    desc: "Somewhere on the mainland.",
    descPreview: ".",
    cont: [],
    mobs: [],
    exitN: false,
    exitS: false,
    exitE: false,
    exitW: false,
    current: false
  },
  {
    title: 'Lair Depths',
    ID: 1001,
    desc: "The cave is even darker here. The rocky walls close in around you.",
    descPreview: "dark caverns.",
    cont: [],
    mobs: [  //health is stored floating point
      {ID:1, HPRatio:1, currentHP:1, maxHP:0, living:true},
      {ID:2, HPRatio:1, currentHP:1, maxHP:0, living:true},
      {ID:2, HPRatio:1, currentHP:1, maxHP:0, living:true}
    ],
    exitN: false,
    exitS: 1002,
    exitE: false,
    exitW: false,
    current: false
  },
  {
    title: 'Lair',
    ID: 1002,
    desc: "A dark and damp cave looms all around you. You can hear the wind whistling far behind you, near the cave's entrance.",
    descPreview: "a dark cave.",
    cont: [400], //contents of the room, listing out each item's ID
    mobs: [  //mobs in the room with their ID, health, aggro status, and living status
      {ID:2, HPRatio:1, currentHP:1, maxHP:0, living:true}
    ],
    exitN: 1001,
    exitS: 1003,
    exitE: false,
    exitW: false,
    current: false
  },


  /////////////////////////////////////////////
  /* WHITE CRAGS */
  /////////////////////////////////////////////


  {
    title: 'Ledge',
    ID: 1003,
    desc: "You stand on a rocky ledge, high above the peninsula. Wind whips around you while hungry birds scavenge for food.",
    descPreview: "a rocky overlook.",
    cont: [],
    mobs: [],
    exitN: false,
    exitS: false,
    exitE: 1004,
    exitW: false,
    current: false,
    POI: 'crags',
    func: function() {
      log("<o>Type e to go east.</o>");
    }
  },
  {
    title: 'Ledge Path 1',
    ID: 1004,
    desc: "The rocky path is narrow.",
    descPreview: "a path down the mountain.",
    cont: [001], //birds
    mobs: [],
    exitN: false,
    exitS: false,
    exitE: 1005,
    exitW: 1003,
    current: false,
    POI: 'crags',
    func: function() {
      log("Type <o>look birds</o> to look at the birds.", false); //add priority to the log so Look will wait to display at the right time
    }
  },
  {
    title: 'Ledge Path 2',
    ID: 1005,
    desc: "There's hardly room to stand here. The crags seem to give way underneath your feet.",
    descPreview: "a path down the mountain.",
    cont: [],
    mobs: [],
    exitN: false,
    exitS: false,
    exitE: 1006,
    exitW: 1004,
    current: false,
    POI: 'crags',
    func: function() {
      log("Type <w>?</w> to see a full list of commands.");
      log("Learn more about a command by typing <w>?</w> before it, such as <w>? look</w>.");
    }
  },
  {
    title: 'Ledge Path 3',
    ID: 1006,
    desc: "Sharp rocks jut from the side of the mountain. Oceans breaks on the rocks below.",
    descPreview: "a path down the mountain.",
    cont: [250],
    mobs: [
      //{ID:3, HPRatio:1, currentHP:1, maxHP:0, living:true}
    ],
    exitN: 1007,
    exitS: false,
    exitE: false,
    exitW: 1005,
    current: false,
    POI: 'crags',
    func: function() {
      log("Type <o>t potion</o> to take it.");
    }
  },
  {
    title: 'Mountain Landing 1',
    ID: 1007,
    desc: "The path clears. Tall, rough grass shows between cracks. A boulder is smeared with quite a lot of blood.",
    descPreview: "a boulder smeared with blood.",
    cont: [002], //skull or something?
    mobs: [
      //{ID:3, HPRatio:1, currentHP:1, maxHP:0, living:true}
    ],
    exitN: 1008,
    exitS: 1006,
    exitE: false,
    exitW: false,
    current: false,
    POI: 'crags',
    func: function() {
      log("Type <o>i</o> or <o>inv</o> to look at your inventory.");
    }
  },
  {
    title: 'Mountain Landing 2',
    ID: 1008,
    desc: "There is blood on the ground and covering the tall grasses around your knees. It's far too dark to belong to a human. The blood trail leads north.",
    descPreview: "a rocky landing.",
    cont: [],
    mobs: [
      //{ID:3, HPRatio:1, currentHP:1, maxHP:0, living:true}
    ],
    exitN: 1009,
    exitS: 1007,
    exitE: false,
    exitW: false,
    current: false,
    POI: 'crags',
    func: function() {
      log("The red bars to the left show your current health. You are badly hurt. Type <o>use potion</o> to restore your health.");
    }
  },
  {
    title: 'Squeeze Through',
    ID: 1009,
    desc: "You manage to squeeze yourself through a crack between two boulders. You hear something croak in the grass near here. The blood trail leads west.",
    descPreview: "a tight opening between two boulders.",
    cont: [],
    mobs: [
      {ID:1, HPRatio:0, currentHP:0, maxHP:0, living:false}
    ],
    exitN: false,
    exitS: 1008,
    exitE: false,
    exitW: 1010,
    current: false,
    POI: 'crags',
    func: function() {
      log("Type <o>st</o> to see your stats.");
    }
  },
  {
    title: 'tall grass',
    ID: 1010,
    desc: "You crouch in the tall grasses. The salty ocean air is cool on your face.",
    descPreview: "more tall grasses.",
    cont: [],
    mobs: [
      {ID:1, HPRatio:.3, currentHP:1, maxHP:0, living:true}
    ],
    exitN: 1011,
    exitS: false,
    exitE: 1009,
    exitW: false,
    current: false,
    POI: 'crags',
    func: function() {
      log("There's an enemy here. Type <o>k spawn</o> to attack it.");
    }
  },
  {
    title: 'tall grass 2',
    ID: 1011,
    desc: "You crouch in the tall grasses. The dirt is wet with blood and sea water. You hear talking to the north.",
    descPreview: "more tall grasses.",
    cont: [], //health shard
    mobs: [
      {ID:1, HPRatio:.4, currentHP:1, maxHP:0, living:true}
    ],
    exitN: 1012,
    exitS: 1010,
    exitE: false,
    exitW: false,
    current: false,
    POI: 'crags'
  },
  {
    title: 'trimble clearing',
    ID: 1012,
    desc: "The path is open here.",
    descPreview: "a clearing.",
    cont: [],
    mobs: [],
    NPCs: [902],
    exitN: 1014,
    exitS: 1011,
    exitE: 1013,
    exitW: false,
    current: false,
    exitAllowed: true,
    POI: 'crags'
  },
  {
    title: 'east trimble',
    ID: 1013,
    desc: "A sharp cliff drops to the east. Violent waves crash far below.",
    descPreview: "a clearing on a cliffside.",
    cont: [004, 501], //bones & health shard
    mobs: [
      //{ID:3, HPRatio:1, currentHP:1, maxHP:0, living:true}
    ],
    exitN: 1015,
    exitS: false,
    exitE: false,
    exitW: 1012,
    current: false,
    POI: 'crags'
  },
  {
    title: 'north trimble',
    ID: 1014,
    desc: "An aged tree clings for life at the edge of the pathway.",
    descPreview: "a clearing.",
    cont: [401], //dagger
    mobs: [
      //{ID:3, HPRatio:1, currentHP:1, maxHP:0, living:true}
    ],
    exitN: false,
    exitS: 1012,
    exitE: 1015,
    exitW: false,
    current: false,
    exitAllowed: true,
    POI: 'crags',
    func: function() {
      log("You could <o>t</o>ake and <o>eq</o>uip the dagger.")
    }
  },
  {
    title: 'clearing',
    ID: 1015,
    desc: "The path is wide here.",
    descPreview: "a clearing.",
    cont: [],
    mobs: [
      {ID:2, HPRatio:.4, currentHP:1, maxHP:0, living:true},
      {ID:1, HPRatio:.4, currentHP:1, maxHP:0, living:true}
    ],
    exitN: 1016,
    exitS: 1013,
    exitE: false,
    exitW: 1014,
    current: false,
    exitAllowed: true,
    POI: 'crags'
  },
  {
    title: 'sharp turn',
    ID: 1016,
    desc: "The stony path takes a sharp turn here. You watch your step.",
    descPreview: "a sharp turn in the path.",
    cont: [],
    mobs: [
      //{ID:3, HPRatio:1, currentHP:1, maxHP:0, living:true}
    ],
    exitN: false,
    exitS: 1015,
    exitE: 1017,
    exitW: false,
    current: false,
    exitAllowed: true,
    POI: 'crags'
  },
  {
    title: 'campfire',
    ID: 1017,
    desc: "A smoldering fire is flickering out. The bloody grass suggests the firemaker isn't coming back.",
    descPreview: "a smoldering fire.",
    cont: [005], //meaty bones
    mobs: [
      {ID:1, HPRatio:.5, currentHP:1, maxHP:0, living:true},
      {ID:2, HPRatio:.5, currentHP:1, maxHP:0, living:true}
    ],
    exitN: 1018,
    exitS: false,
    exitE: false,
    exitW: 1016,
    current: false,
    exitAllowed: true,
    POI: 'crags'
  },
  {
    title: 'roots',
    ID: 1018,
    desc: "Stones give way to tree roots. You see a city silhouette far in the distance. A worn dirt road <w>leaves</w> this place.",
    descPreview: "roots breaking through the stone.",
    cont: [],
    mobs: [
      //{ID:3, HPRatio:1, currentHP:1, maxHP:0, living:true}
    ],
    exitN: false,
    exitS: 1017,
    exitE: false,
    exitW: false,
    current: false,
    exitAllowed: true,
    entrance: true,
    POI: 'crags',
    func: function() {
      log("Type <o>leave</o> to go to the world map.");
    }
  },


  /////////////////////////////////////////////
  /* BASTION 1 - BLOOD RUN */
  /////////////////////////////////////////////


  {
    title: 'Dark City Entrance',
    ID: 1030,
    desc: "Dark gothic architechture is offset by the hustle and bustle of city life. Merchants trade to the east. Soldiers make preparations to the west. Residential houses lie north. Great city gates <w>leave</w> Blood Run",
    descPreview: "the entrance to the Dark City.",
    cont: [],
    mobs: [],
    NPCs: [],
    exitN: 1050,
    exitS: false,
    exitE: 1031,
    exitW: 1040,
    current: false,
    exitAllowed: true,
    entrance: true,
    POI: 'bastion1'
  },
  {
    title: 'Market street',
    ID: 1031,
    desc: "Traders and merchants gather here for protection from the creatures outside the gates. Their horse-drawn carts are parked behind their makeshift storefront tents. The city gates lie due west of here.",
    descPreview: "merchants and their carts.",
    cont: [],
    mobs: [],
    NPCs: [],
    exitN: false,
    exitS: false,
    exitE: 1032,
    exitW: 1030,
    current: false,
    exitAllowed: false,
    entrance: false,
    POI: 'bastion1'
  },
  {
    title: 'Market street 2',
    ID: 1032,
    desc: "Stranger wares are on display here. Mystical crystals, foreign jewely, and all manner of monster parts are available for more well-to-do customers.",
    descPreview: "strange items for sale.",
    cont: [],
    mobs: [],
    NPCs: [903],
    exitN: false,
    exitS: false,
    exitE: 1033,
    exitW: 1031,
    current: false,
    exitAllowed: false,
    entrance: false,
    POI: 'bastion1'
  },
  {
    title: 'Market street 3',
    ID: 1033,
    desc: "Bins and boxes line the dirt street. You see a crack in the wall you might be able to <w>squeeze</w> through.",
    descPreview: "bins and boxes.",
    cont: [309], //copper
    mobs: [],
    NPCs: [],
    exitN: false,
    exitS: false,
    exitE: false,
    exitW: 1032,
    current: false,
    exitAllowed: false,
    entrance: false,
    squeezable: false,
    POI: 'bastion1',
    func: function() {
      if (!this.squeezable) {
        addUniqueAction({
          entry: 'squeeze',
          input: ['squeeze'],
          onlyInRoom: 1033,
          once: false,
          hidden: true,
          func: function() {
            log('You squeeze through a crack in the stone.', 'yellow');
            act('goto', '1034');
          }
        });
      }
      this.squeezable = true;
    }
  },
  {
    title: 'Market street dead end (hidden)',
    ID: 1034,
    desc: "Abandoned supplies are half-crushed under a collapsed wall.",
    descPreview: "something... not sure what.",
    cont: [250, 303, 304, 305], //lots of loot here!
    mobs: [],
    NPCs: [],
    exitN: false,
    exitS: 1033,
    exitE: false,
    exitW: false,
    current: false,
    exitAllowed: false,
    entrance: false,
    POI: 'bastion1'
  },
  {
    title: 'Ramparts Path 1',
    ID: 1040,
    desc: "Away from the crowds, tired soldiers gather. Their weapons and armor are blackened with blood.",
    descPreview: "tired soldiers.",
    cont: [],
    mobs: [],
    NPCs: [],
    exitN: false,
    exitS: false,
    exitE: 1030,
    exitW: 1041,
    current: false,
    exitAllowed: false,
    entrance: false,
    POI: 'bastion1'
  },
  {
    title: 'Ramparts Path 2',
    ID: 1041,
    desc: "At the foot of the ramparts, soldiers of all kinds are gathered. Decorated veterans and new recruits string bows, sharpen swords, and adjust armor.",
    descPreview: "soldiers making preperations.",
    cont: [],
    mobs: [],
    NPCs: [],
    exitN: false,
    exitS: 1042,
    exitE: 1040,
    exitW: false,
    current: false,
    exitAllowed: false,
    entrance: false,
    POI: 'bastion1'
  },
  {
    title: 'Ramparts dead end',
    ID: 1042,
    desc: "You climb the ladder up to the city's ramparts. On the stony pathway overlooking the city outskirts, dozens of archers and a handful of gunmen keep a tight watch.",
    descPreview: "ramparts overlooking the city outskirts.",
    cont: [],
    mobs: [],
    NPCs: [904],
    exitN: 1041,
    exitS: false,
    exitE: false,
    exitW: false,
    current: false,
    exitAllowed: false,
    entrance: false,
    POI: 'bastion1'
  },
  {
    title: 'To Marcus',
    ID: 1050,
    desc: "Tall brick tenements crowd the cobblestone street. Their brown and red bricks are weathered, but stand sturdy. Several groups of people talk amongst themselves.",
    descPreview: "tall brick tenements.",
    cont: [],
    mobs: [],
    NPCs: [],
    exitN: 1051,
    exitS: 1030,
    exitE: false,
    exitW: false,
    current: false,
    exitAllowed: false,
    entrance: false,
    POI: 'bastion1'
  },
  {
    title: 'To marcus 2',
    ID: 1051,
    desc: "Wedged between the buildings is what used to be a school. It doesn't look like there are many children left to attend.",
    descPreview: "a schoolhouse.",
    cont: [310], //gunpowder
    mobs: [],
    NPCs: [],
    exitN: 1052,
    exitS: 1050,
    exitE: false,
    exitW: false,
    current: false,
    exitAllowed: false,
    entrance: false,
    POI: 'bastion1'
  },
  {
    title: 'Marcus',
    ID: 1052,
    desc: "A ways north of the tenements, you arrive at a clocktower with several architectural additions. Its immense size dwarfs the surrounding buildings.",
    descPreview: "an imposing clocktower.",
    cont: [006], //marcus sign
    mobs: [],
    NPCs: [901], //marcus is technically here
    exitN: false,
    exitS: 1051,
    exitE: 1053,
    exitW: 1060,
    current: false,
    exitAllowed: false,
    entrance: false,
    knockable: true,
    POI: 'bastion1'
  },
  {
    title: 'Around Marcus House 1',
    ID: 1053,
    desc: "Snaking around the clocktower, more sturdy houses line the narrow streets. Several brands of artisans devote themselves to their work in half-open workshops.",
    descPreview: "artisan workhouses.",
    cont: [],
    mobs: [],
    NPCs: [],
    exitN: 1054,
    exitS: false,
    exitE: false,
    exitW: 1052,
    current: false,
    exitAllowed: false,
    entrance: false,
    POI: 'bastion1'
  },
  {
    title: 'Around Marcus House 2',
    ID: 1054,
    desc: "Large wood piles are stacked in front of a particularly prosperous woodworking shop. A 'gunpowder for sale' sign with modest prices leans against a broken stoop. A burly brickmaker eyes you as you pass by.",
    descPreview: "large piles of wood.",
    cont: [],
    mobs: [],
    NPCs: [],
    exitN: 1055,
    exitS: 1053,
    exitE: false,
    exitW: false,
    current: false,
    exitAllowed: false,
    entrance: false,
    POI: 'bastion1'
  },
  {
    title: 'Around Marcus House Dead End',
    ID: 1055,
    desc: "The cobblestone abruptly dead-ends into an large abandoned building. The windows are all blown out, and the broken beams are black with soot. You could <w>look inside</w> through the burnt openings.",
    descPreview: "an abandoned building.",
    cont: [],
    mobs: [],
    NPCs: [],
    exitN: false,
    exitS: 1054,
    exitE: false,
    exitW: false,
    current: false,
    exitAllowed: false,
    entrance: false,
    inspected: false,
    POI: 'bastion1',
    func: function() {
      addUniqueAction({
        entry: 'burnt building',
        input: ['look inside', 'l inside'],
        onlyInRoom: 1055,
        once: true,
        hidden: true,
        func: function() {
          if (!currentRoom.inspected) {
            log('You peer in to the dilapidated building and find some <w>feral blood</w>, a <w>twilight shard</w>, and some <w>glittering dust</w>.', 'yellow');
            currentRoom.cont = [301, 304, 305];
            currentRoom.inspected = true;
            roomReset();
          } else {
            log("You don't see anything else inside the abandoned building.");
          }
        }
      });
    }
  },
  {
    title: 'Slums 1',
    ID: 1060,
    desc: "A brown-haired girl and blonde boy are playing - a few of the only children left in Blood Run. Their clothes have been worn ragged and they look a bit too thin.",
    descPreview: "a few children playing.",
    cont: [],
    mobs: [],
    NPCs: [],
    exitN: false,
    exitS: false,
    exitE: 1052,
    exitW: 1061,
    current: false,
    exitAllowed: false,
    entrance: false,
    POI: 'bastion1'
  },
  {
    title: 'Slums 2',
    ID: 1061,
    desc: "Farther away from the city center, you see a few drably-decorated houses stand in disrepair. Squatters have taken up residence in homes of the dead.",
    descPreview: "drably-decorated houses.",
    cont: [],
    mobs: [],
    NPCs: [],
    exitN: 1062,
    exitS: false,
    exitE: 1060,
    exitW: false,
    current: false,
    exitAllowed: false,
    entrance: false,
    POI: 'bastion1'
  },
  {
    title: 'Slums 3',
    ID: 1062,
    desc: "A foreign family scrounges through refuse. A man with one eye stares as you walk by.",
    descPreview: "some people down on their luck.",
    cont: [301],
    mobs: [],
    NPCs: [],
    exitN: false,
    exitS: 1061,
    exitE: false,
    exitW: 1063,
    current: false,
    exitAllowed: false,
    entrance: false,
    POI: 'bastion1'
  },
  {
    title: 'Slums Dead End',
    ID: 1063,
    desc: "The dimly-lit dirt street squeezes into a dead end. Trash is littered about.",
    descPreview: "a dead end.",
    cont: [],
    mobs: [],
    NPCs: [905],
    exitN: false,
    exitS: false,
    exitE: 1062,
    exitW: false,
    current: false,
    exitAllowed: false,
    entrance: false,
    POI: 'bastion1'
  },

  /////////////////////////////////////////////
  /* BASTION 1 - MARCUS' ESTATE */
  /////////////////////////////////////////////

  {
    title: "Marcus' Estate - Entrance",
    ID: 1080,
    desc: "Just inside Marcus' clocktower safehouse. The air is thicker than fog, but as clear as day. Safeyard to the north, your quarters to the east, lab to the west, and exit to the south.",
    descPreview: "the entrance to Marcus' estate.",
    cont: [],
    mobs: [],
    NPCs: [],
    exitN: 1100,
    exitS: 1052,
    exitE: 1081,
    exitW: 1090,
    current: false,
    exitAllowed: false,
    entrance: true,
    POI: 'bastion1'
  },
  {
    title: "Marcus' Estate - Hallway",
    ID: 1081,
    desc: "The cathedral ceiling draws displays a dazzling array of otherworldly lights, all dancing to and fro. Hanging lanterns pulse with purple flame.",
    descPreview: "a hallway full of lights.",
    cont: [],
    mobs: [],
    NPCs: [],
    exitN: 1083,
    exitS: false,
    exitE: 1082,
    exitW: 1080,
    current: false,
    exitAllowed: false,
    entrance: false,
    POI: 'bastion1'
  },
  {
    title: "Marcus' Estate - Your room",
    ID: 1082,
    desc: "A dusty and forgotten guest room.",
    descPreview: ".",
    cont: [102], //bed, diary?
    mobs: [],
    NPCs: [],
    exitN: false,
    exitS: false,
    exitE: false,
    exitW: 1081,
    current: false,
    exitAllowed: false,
    entrance: false,
    POI: 'bastion1'
  },
  {
    title: "Marcus' Estate - Library",
    ID: 1083,
    desc: "In Marcus' personal library, hundreds of books line the shelves in this crowded room. A plush leather chair is positioned neatly in the corner. Who could have time to read all this?.",
    descPreview: "the library.",
    cont: [],
    mobs: [],
    NPCs: [],
    exitN: false,
    exitS: 1081,
    exitE: false,
    exitW: false,
    current: false,
    exitAllowed: false,
    entrance: false,
    POI: 'bastion1'
  },
  {
    title: "Marcus' Estate - Plasmoid Pool",
    ID: 1090,
    desc: "A basin filled with a gritty liquid lies in the center of the room, hooked up to all sorts of machines.",
    descPreview: "the plasmoid pool.",
    cont: [101],
    mobs: [],
    NPCs: [],
    exitN: 1092,
    exitS: false,
    exitE: 1080,
    exitW: 1091,
    current: false,
    exitAllowed: false,
    entrance: false,
    POI: 'bastion1'
  },
  {
    title: "Marcus' Estate - Study",
    ID: 1091,
    desc: "Many strange devices are scattered around the room. Large books, papers, and notes of many kinds line the walls.",
    descPreview: "Marcus' study. A large wooden desk boasts many strange devices.",
    cont: [],
    mobs: [],
    NPCs: [],
    exitN: false,
    exitS: false,
    exitE: 1090,
    exitW: false,
    locked: true,
    lockedDesc: "The door to Marcus' study is locked.",
    current: false,
    exitAllowed: false,
    entrance: false,
    POI: 'bastion1'
  },
  {
    title: "Marcus' Estate - Lab",
    ID: 1092,
    desc: "This clean white room sports an array of heavy duty machinery and mystical devices.",
    descPreview: "Marcus' laboratory, full of experiments.",
    cont: [007, 008, 515], //some flavor devices, plus primitive trap
    mobs: [],
    NPCs: [],
    exitN: false,
    exitS: 1090,
    exitE: false,
    exitW: false,
    current: false,
    exitAllowed: false,
    entrance: false,
    POI: 'bastion1'
  },
  {
    title: "Marcus' Estate - Safeyard",
    ID: 1100,
    desc: "You arrive in a lush safeyard. Among the unfamiliar flowers and trees, there stands a massive black stone in the center. It glistens with a thick wet sheen, but is dry to the touch.",
    descPreview: "the safeyard.",
    cont: [],
    mobs: [
      {ID:0, HPRatio:1, currentHP:1, maxHP:0, living:true},
    ],
    NPCs: [],
    exitN: false,
    exitS: 1080,
    exitE: false,
    exitW: false,
    current: false,
    exitAllowed: false,
    entrance: false,
    POI: 'bastion1'
  },

  /////////////////////////////////////////////
  /* GRAFF'S BATTALION */
  /////////////////////////////////////////////

  {
    title: "Battlefield Opening",
    ID: 1110,
    desc: "The open air is pungent with decay. The battlefield to the east is stained with the blood of humans and creatures alike. A dirt path <w>leaves</w> the battlefield.",
    descPreview: "the edge of the battlefield.",
    cont: [],
    mobs: [],
    NPCs: [906], // alex graff
    exitN: false,
    exitS: false,
    exitE: 1114,
    exitW: false,
    current: false,
    exitAllowed: true,
    entrance: true,
    POI: 'graff',
    func: function() {
      if (!graff.savedAlex) {
        mapCoord = [-39,-29];
        worldUpdateXY(mapCoord[0], mapCoord[1], true);
        //console.log("You haven't saved Alex yet, so you can't pass");
      } else {

      }
    }
  },
  {
    title: "Battlefield",
    ID: 1111,
    desc: "The edge of the soft dirt drops sharply off into the bay. It's a long way down.",
    descPreview: "an edge dropping sharply into the bay.",
    cont: [009], //corpse
    mobs: [
      {ID:2, HPRatio:.5, currentHP:1, maxHP:0, living:true},
      {ID:2, HPRatio:1, currentHP:1, maxHP:0, living:true}
    ],
    NPCs: [],
    exitN: false,
    exitS: 1114,
    exitE: 1112,
    exitW: false,
    current: false,
    exitAllowed: true,
    entrance: false,
    POI: 'graff'
  },
  {
    title: "Battlefield",
    ID: 1112,
    desc: "The battlefield stretches on.",
    descPreview: "more battlefield.",
    cont: [],
    mobs: [
      {ID:1, HPRatio:1, currentHP:1, maxHP:0, living:true},
      {ID:6, HPRatio:1, currentHP:1, maxHP:0, living:true},
      {ID:1, HPRatio:1, currentHP:1, maxHP:0, living:true},
    ],
    NPCs: [],
    exitN: false,
    exitS: 1115,
    exitE: 1113,
    exitW: 1111,
    current: false,
    exitAllowed: false,
    entrance: false,
    POI: 'graff'
  },
  {
    title: "Battlefield",
    ID: 1113,
    desc: "A man-sized crater is carved from the soft earth.",
    descPreview: "a man-sized crater.",
    cont: [305, 305], //glittering dust - add some corpses?
    mobs: [],
    NPCs: [],
    exitN: false,
    exitS: 1116,
    exitE: false,
    exitW: 1112,
    current: false,
    exitAllowed: false,
    entrance: false,
    POI: 'graff'
  },
  {
    title: "Battlefield",
    ID: 1114,
    desc: "Swords and claws are half-buried in the soft turf. The green grass is lush, but dark.",
    descPreview: "Swords and claws half-buried in the dirt.",
    cont: [],
    mobs: [
      {ID:6, HPRatio:1, currentHP:1, maxHP:0, living:true},
      {ID:6, HPRatio:1, currentHP:1, maxHP:0, living:true}
    ],
    NPCs: [],
    exitN: 1111,
    exitS: 1117,
    exitE: 1115,
    exitW: 1110,
    current: false,
    exitAllowed: false,
    entrance: false,
    POI: 'graff'
  },
  {
    title: "Battlefield",
    ID: 1115,
    desc: "Years of fighting have left this spot barren and sunken. How many lives were lost here? How many saved?",
    descPreview: "barren ground.",
    cont: [],
    mobs: [
      {ID:2, HPRatio:1, currentHP:1, maxHP:0, living:true},
      {ID:1, HPRatio:1, currentHP:1, maxHP:0, living:true},
    ],
    NPCs: [],
    exitN: 1112,
    exitS: 1118,
    exitE: 1116,
    exitW: 1114,
    current: false,
    exitAllowed: false,
    entrance: false,
    POI: 'graff'
  },
  {
    title: "Battlefield",
    ID: 1116,
    desc: "Shards of broken armor and shields have been driven into the ground, singed with acid.",
    descPreview: "shards of broken armor.",
    cont: [],
    mobs: [
      {ID:6, HPRatio:1, currentHP:1, maxHP:0, living:true},
      {ID:2, HPRatio:.8, currentHP:1, maxHP:0, living:true},
    ],
    NPCs: [],
    exitN: 1113,
    exitS: 1119,
    exitE: 1120,
    exitW: 1115,
    current: false,
    exitAllowed: false,
    entrance: false,
    POI: 'graff'
  },
  {
    title: "Battlefield",
    ID: 1117,
    desc: "The battlefield stretches on.",
    descPreview: "more battlefield.",
    cont: [],
    mobs: [
      {ID:6, HPRatio:1, currentHP:1, maxHP:0, living:true},
      {ID:1, HPRatio:.5, currentHP:1, maxHP:0, living:true},
      {ID:1, HPRatio:1, currentHP:1, maxHP:0, living:true},
    ],
    NPCs: [],
    exitN: 1114,
    exitS: false,
    exitE: 1118,
    exitW: false,
    current: false,
    exitAllowed: false,
    entrance: false,
    POI: 'graff'
  },
  {
    title: "Battlefield",
    ID: 1118,
    desc: "Pieces of monster carapace litter the ground.",
    descPreview: "more battlefield.",
    cont: [010, 305],
    mobs: [
      {ID:6, HPRatio:.5, currentHP:1, maxHP:0, living:true},
      {ID:2, HPRatio:.5, currentHP:1, maxHP:0, living:true},
    ],
    NPCs: [],
    exitN: 1115,
    exitS: false,
    exitE: 1119,
    exitW: 1117,
    current: false,
    exitAllowed: false,
    entrance: false,
    POI: 'graff'
  },
  {
    title: "Battlefield",
    ID: 1119,
    desc: "The battlefield stretches on.",
    descPreview: "more battlefield.",
    cont: [],
    mobs: [
      {ID:1, HPRatio:1, currentHP:1, maxHP:0, living:true},
      {ID:6, HPRatio:1, currentHP:1, maxHP:0, living:true},
    ],
    NPCs: [],
    exitN: 1116,
    exitS: false,
    exitE: false,
    exitW: 1118,
    current: false,
    exitAllowed: false,
    entrance: false,
    POI: 'graff'
  },
  {
    title: "Edge of the Mainland",
    ID: 1120,
    desc: "Large spiked barricades are stacked stories high. The ground is soaked with acid and blood.",
    descPreview: "the edge of the battlefield.",
    cont: [],
    mobs: [
      {ID: 201, HPRatio:1, currentHP:1, maxHP:0, living: true,} //midnight spitter mini-boss
    ],
    NPCs: [],
    exitN: false,
    exitS: false,
    exitE: 1121,
    exitW: 1116,
    current: false,
    exitAllowed: false,
    entrance: false,
    POI: 'graff'
  },
  {
    title: "TITLE",
    ID: 1121,
    desc: "A dirt road <w>leaves</w> to the east.",
    descPreview: ".",
    cont: [],
    mobs: [],
    NPCs: [],
    exitN: false,
    exitS: false,
    exitE: false,
    exitW: 1120,
    current: false,
    exitAllowed: true,
    entrance: false,
    locked: true,
    lockedDesc: "Alex needs to clear the way after you've defeated the Spitter.",
    POI: 'graff'
  },

  /////////////////////////////////////////////
  /* HARPE TOWER - OUTSIDE */
  /////////////////////////////////////////////

  {
    title: "Harp Tower entrance",
    ID: 1200,
    desc: "In the middle of the wasteworld rises a massive spire. A beacon of hope, if it weren't faded and crumbling.",
    descPreview: "the outskirts of Harpe Tower.",
    cont: [],
    mobs: [],
    NPCs: [],
    exitN: 1202,
    exitS: false,
    exitE: false,
    exitW: false,
    current: false,
    exitAllowed: true,
    entrance: true,
    POI: 'tower'
  },
  {
    title: "Brambles",
    ID: 1201,
    desc: "Stepping through brambles, you wrap around the tower's massive stone base. Sickly gray thorns strangle the flowers, and wind their way up the tower's outside wall.",
    descPreview: "brambles and thorns.",
    cont: [502],
    mobs: [],
    NPCs: [],
    exitN: false,
    exitS: false,
    exitE: 1202,
    exitW: false,
    current: false,
    exitAllowed: true,
    POI: 'tower'
  },
  {
    title: "At the base of Harpe Tower",
    ID: 1202,
    desc: "You stand at the base of Harpe Tower. The pale stonework stretches high into the sky. The arched doorway once boasted dense steel gates, but now they hang bent from their hinges.",
    descPreview: "the base of Harpe Tower.",
    cont: [],
    mobs: [],
    NPCs: [],
    exitN: 1203,
    exitS: 1200,
    exitE: false,
    exitW: 1201,
    current: false,
    exitAllowed: true,
    POI: 'tower'
  },

  /////////////////////////////////////////////
  /* HARPE TOWER - 1st FLOOR */
  /////////////////////////////////////////////

  {
    title: "Harpe Tower - 1st Floor",
    ID: 1203,
    desc: "Just inside the tower's entryway, the ballroom's intricate masonry is cracked and disheveled. A lavish staircase winds its way up to the east.",
    descPreview: "the first floor landing.",
    cont: [],
    mobs: [
      {ID:3, HPRatio:1, currentHP:1, maxHP:0, living:true},
    ],
    NPCs: [],
    exitN: false,
    exitS: 1202,
    exitE: 1204,
    exitW: false,
    current: false,
    POI: 'tower'
  },
  {
    title: "Harpe Tower - 1st Floor",
    ID: 1204,
    desc: "Light streams in from the many crumbling windows and unfinished walls. The carpeted steps are wide and forgiving - meant more for processionals than combat.",
    descPreview: "luxurious carpeted steps.",
    cont: [501],
    mobs: [],
    NPCs: [],
    exitN: 1205,
    exitS: false,
    exitE: false,
    exitW: 1203,
    current: false,
    POI: 'tower'
  },
  {
    title: "Harpe Tower - 1st Floor",
    ID: 1205,
    desc: "The stone wall is open here - burst through with a powerful explosive. Or powerful magic.",
    descPreview: "an opening in the stone wall.",
    cont: [],
    mobs: [
      {ID:3, HPRatio:1, currentHP:1, maxHP:0, living:true},
      {ID:3, HPRatio:1, currentHP:1, maxHP:0, living:true}
    ],
    NPCs: [],
    exitN: 1206,
    exitS: 1204,
    exitE: false,
    exitW: false,
    current: false,
    POI: 'tower'
  },
  {
    title: "Harpe Tower - 1st Floor",
    ID: 1206,
    desc: "The grand staircase levels out here. There used to be rooms branching off the main drag, but their doorways have collapsed and been filled with rubble.",
    descPreview: "collapsed doorways branching from the main drag.",
    cont: [],
    mobs: [
      {ID:5, HPRatio:1, currentHP:1, maxHP:0, living:true},
    ],
    NPCs: [],
    exitN: false,
    exitS: 1205,
    exitE: false,
    exitW: 1207,
    current: false,
    POI: 'tower'
  },
  {
    title: "Harpe Tower - 1st Floor",
    ID: 1207,
    desc: "The faded red carpet stretches up and down the steps.",
    descPreview: "a bust of General Harpe.",
    cont: [012],
    mobs: [],
    NPCs: [],
    exitN: false,
    exitS: false,
    exitE: 1206,
    exitW: 1208,
    current: false,
    POI: 'tower'
  },
  {
    title: "Harpe Tower - 1st Floor",
    ID: 1208,
    desc: "A chandelier broke free from its chains many years ago. What used to be state-of-the-art electric lighting encased in manufactured crystal now lie in several hundred pieces.",
    descPreview: "a broken chandelier.",
    cont: [309],
    mobs: [],
    NPCs: [],
    exitN: false,
    exitS: 1209,
    exitE: 1207,
    exitW: false,
    current: false,
    POI: 'tower'
  },
  {
    title: "Harpe Tower - 1st Floor",
    ID: 1209,
    desc: "Just below the second floor landing, the spiral stairs leave a small gap where the stone has fallen away.",
    descPreview: "a gap in the stairs.",
    cont: [],
    mobs: [
      {ID:3, HPRatio:1, currentHP:1, maxHP:0, living:true},
      {ID:3, HPRatio:1, currentHP:1, maxHP:0, living:true},
      {ID:5, HPRatio:1, currentHP:1, maxHP:0, living:true}
    ],
    NPCs: [],
    exitN: 1208,
    exitS: 1210,
    exitE: false,
    exitW: false,
    current: false,
    POI: 'tower'
  },

  /////////////////////////////////////////////
  /* HARPE TOWER - 2nd FLOOR */
  /////////////////////////////////////////////

  {
    title: "Harpe Tower - 2nd Floor",
    ID: 1210,
    desc: "The second floor balcony stretches above the ballroom.",
    descPreview: "the second floor balcony.",
    cont: [013, 301],
    mobs: [],
    NPCs: [],
    exitN: 1209,
    exitS: false,
    exitE: 1211,
    exitW: false,
    current: false,
    POI: 'tower'
  },
  {
    title: "Harpe Tower - 2nd Floor",
    ID: 1211,
    desc: "Toppled bookcases line the wall, spilling books and parchments of all kinds onto the carpet. One red bookcase has settled in front of a doorway, and may be able to be <w>pushed</w>.",
    descPreview: ".",
    cont: [],
    mobs: [
      {ID:3, HPRatio:1, currentHP:1, maxHP:0, living:true},
    ],
    NPCs: [],
    exitN: false,
    exitS: false,
    exitE: 1213,
    exitW: 1210,
    current: false,
    pushedBookcase: false,
    POI: 'tower',
    func: function() {
      if (!this.pushedBookcase) {
        addUniqueAction({
          entry: 'push bookcase',
          input: ['push bookcase', 'move bookcase', 'push', 'move', 'bookcase'],
          onlyInRoom: 1211,
          once: true,
          hidden: true,
          func: function() {
            log('You push the bookcase to reveal a room to the south.', 'yellow');
          }
        });
      }
      this.pushedBookcase = true;
      this.exitS = 1212;
      this.desc = "Toppled bookcases line the wall, spilling books and parchments of all kinds onto the carpet. A red bookcase has been pushed out of the way."
    }
  },
  {
    title: "Harpe Tower - 2nd Floor (hidden trophy room)",
    ID: 1212,
    desc: "Dozens of monster heads sit in glass cases. Horned and scaled, cracked and clean. Trophies from a time before we were overrun - when morale was high.",
    descPreview: "General Harpe's trophy room.",
    cont: [501, 502, 303, 305], //loot here!
    mobs: [],
    NPCs: [],
    exitN: 1211,
    exitS: false,
    exitE: false,
    exitW: false,
    current: false,
    POI: 'tower'
  },
  {
    title: "Harpe Tower - 2nd Floor",
    ID: 1213,
    desc: "The carpet here is distorted and discolored.",
    descPreview: "a broken aquarium.",
    cont: [014], //aquarium
    mobs: [
      {ID:5, HPRatio:1, currentHP:1, maxHP:0, living:true},
      {ID:3, HPRatio:1, currentHP:1, maxHP:0, living:true},
      {ID:3, HPRatio:1, currentHP:1, maxHP:0, living:true}
    ],
    NPCs: [],
    exitN: 1214,
    exitS: false,
    exitE: false,
    exitW: 1211,
    current: false,
    POI: 'tower'
  },
  {
    title: "Harpe Tower - 2nd Floor",
    ID: 1214,
    desc: "A broken marble pillar has crashed down here. The rubble is piled high, making it difficult to navigate.",
    descPreview: "a broken pillar.",
    cont: [301],
    mobs: [],
    NPCs: [],
    exitN: 1215,
    exitS: 1213,
    exitE: false,
    exitW: false,
    current: false,
    POI: 'tower'
  },
  {
    title: "Harpe Tower - 2nd Floor",
    ID: 1215,
    desc: "A gaping hole in the tower structure has left room for Ravens to roost. Their tangled mess of a nest is filled with all sorts of scraps carried here from far away places.",
    descPreview: "a Raven roost.",
    cont: [009], //soldier
    mobs: [
      {ID:4, HPRatio:1, currentHP:1, maxHP:0, living:true},
      {ID:4, HPRatio:1, currentHP:1, maxHP:0, living:true},
    ],
    NPCs: [],
    exitN: false,
    exitS: 1214,
    exitE: false,
    exitW: 1216,
    current: false,
    POI: 'tower'
  },
  {
    title: "Harpe Tower - 2nd Floor",
    ID: 1216,
    desc: "A streak of blood has stained the carpet.",
    descPreview: "a streak of blood.",
    cont: [015, 502], //sword
    mobs: [],
    NPCs: [],
    exitN: false,
    exitS: false,
    exitE: 1215,
    exitW: 1217,
    current: false,
    POI: 'tower'
  },
  {
    title: "Harpe Tower - 2nd Floor",
    ID: 1217,
    desc: "Some monster remains have been left here.",
    descPreview: "monster remains.",
    cont: [016, 017], //gland, feathers
    mobs: [
      {ID:3, HPRatio:1, currentHP:1, maxHP:0, living:true},
      {ID:3, HPRatio:1, currentHP:1, maxHP:0, living:true},
    ],
    NPCs: [],
    exitN: false,
    exitS: 1218,
    exitE: 1216,
    exitW: false,
    current: false,
    POI: 'tower'
  },

  /////////////////////////////////////////////
  /* HARPE TOWER - 3rd FLOOR */
  /////////////////////////////////////////////

  {
    title: "Harpe Tower - 3rd Floor",
    ID: 1218,
    desc: "On the 3rd floor landing, you suddenly feel the dizzying height as you overlook the railing to the marble floor below.",
    descPreview: "the 3rd floor landing.",
    cont: [],
    mobs: [
      {ID:3, HPRatio:1, currentHP:1, maxHP:0, living:true},
      {ID:5, HPRatio:1, currentHP:1, maxHP:0, living:true},
    ],
    NPCs: [],
    exitN: 1217,
    exitS: 1219,
    exitE: false,
    exitW: false,
    current: false,
    POI: 'tower'
  },
  {
    title: "Harpe Tower - 3rd Floor",
    ID: 1219,
    desc: "The tower stairs continue climbing.",
    descPreview: "more stairs.",
    cont: [018, 019],
    mobs: [],
    NPCs: [],
    exitN: 1218,
    exitS: false,
    exitE: 1220,
    exitW: false,
    current: false,
    POI: 'tower'
  },
  {
    title: "Harpe Tower - 3rd Floor",
    ID: 1220,
    desc: "Windows that once held fine glass are now boarded up. It does nothing to protect this place from the elements.",
    descPreview: "boarded up windows.",
    cont: [004],
    mobs: [
      {ID:3, HPRatio:1, currentHP:1, maxHP:0, living:true},
      {ID:3, HPRatio:1, currentHP:1, maxHP:0, living:true},
      {ID:3, HPRatio:1, currentHP:1, maxHP:0, living:true},
    ],
    NPCs: [],
    exitN: false,
    exitS: false,
    exitE: 1221,
    exitW: 1219,
    current: false,
    POI: 'tower'
  },
  {
    title: "Harpe Tower - 3rd Floor",
    ID: 1221,
    desc: "The floor here has caved and collapsed outward. You carefully make your way across the fragile remaining flooring to continue.",
    descPreview: "collapsed floor.",
    cont: [501],
    mobs: [],
    NPCs: [],
    exitN: 1222,
    exitS: false,
    exitE: false,
    exitW: 1220,
    current: false,
    POI: 'tower'
  },
  {
    title: "Harpe Tower - 3rd Floor",
    ID: 1222,
    desc: "Near the top of the tower, sword and claw marks have cut chinks from the walls and railing.",
    descPreview: "sword and claw marks.",
    cont: [],
    mobs: [
      {ID:3, HPRatio:1, currentHP:1, maxHP:0, living:true},
    ],
    NPCs: [],
    exitN: 1223,
    exitS: 1221,
    exitE: false,
    exitW: false,
    current: false,
    POI: 'tower'
  },
  {
    title: "Harpe Tower - 3rd Floor",
    ID: 1223,
    desc: "A burn mark on the carpet suggests an explosion went off some time ago.",
    descPreview: "a large burn mark.",
    cont: [020], //boss carapace
    mobs: [
      {ID:3, HPRatio:1, currentHP:1, maxHP:0, living:true},
      {ID:5, HPRatio:1, currentHP:1, maxHP:0, living:true},
    ],
    NPCs: [],
    exitN: false,
    exitS: 1222,
    exitE: false,
    exitW: 1224,
    current: false,
    POI: 'tower'
  },
  {
    title: "Harpe Tower - 3rd Floor",
    ID: 1224,
    desc: "The stairs reach their peak.",
    descPreview: "a massive iron gate.",
    cont: [150],
    mobs: [],
    NPCs: [],
    exitN: false, //1225
    exitS: false,
    exitE: 1223,
    exitW: false,
    current: false,
    POI: 'tower',
    /*func: function() {
      addClosedDoor(this, 'exitN', 1225, 'open gate', "At first the door resists your push, but at last its rusted hinges give way. The way north has been opened.");
    }*/
  },
  {
    title: "Harpe Tower - Boss",
    ID: 1225,
    desc: "The vast marble outcropping juts from the tower. From this high up, you can see halfway across the continent.",
    descPreview: "a vast marble outcropping extending from the tower.",
    cont: [],
    mobs: [
      {ID:202, HPRatio:1, currentHP:1, maxHP:0, living:true}, //boss mob!
    ],
    NPCs: [],
    exitN: false,
    exitS: 1224,
    exitE: false,
    exitW: false,
    current: false,
    POI: 'tower'
  },

  /////////////////////////////////////////////
  /* BASTION 2 - PROSPEROS */
  /////////////////////////////////////////////

  {
    title: "Prosperos City Gates",
    ID: 1250,
    desc: "Inside [Prosperos]'s impressive gates, the bustling city sprawls out in front of you.",
    descPreview: "the city gates.",
    cont: [],
    mobs: [],
    NPCs: [],
    exitN: 1251,
    exitS: false,
    exitE: 1260,
    exitW: false,
    current: false,
    entrance: true,
    exit: true,
    POI: 'bastion2'
  },
  {
    title: "Prosperos - Arts District",
    ID: 1251,
    desc: "At the base of a large stone staircase, brightly colored buildings line the stone road. Music plays in the distance.",
    descPreview: "the arts district.",
    cont: [],
    mobs: [],
    NPCs: [],
    exitN: 1252,
    exitS: 1250,
    exitE: false,
    exitW: false,
    current: false,
    POI: 'bastion2'
  },
  {
    title: "Prosperos - ",
    ID: 1252,
    desc: "Bright streamers and banners sport colors and emblems of all kinds.",
    descPreview: "brightly colored banners.",
    cont: [], //a band playing music, a painted canvas
    mobs: [],
    NPCs: [], //musician maybe?
    exitN: false,
    exitS: 1251,
    exitE: 1253,
    exitW: false,
    current: false,
    POI: 'bastion2'
  },
  {
    title: "Prosperos - ",
    ID: 1253,
    desc: "A costume shop has put their best outfits on display.",
    descPreview: "a costume shop.",
    cont: [], //some costumes on mannequins
    mobs: [],
    NPCs: [], //beggar
    exitN: false,
    exitS: false,
    exitE: 1256,
    exitW: 1252,
    current: false,
    POI: 'bastion2'
  },
  {
    title: "Prosperos - ",
    ID: 1254,
    desc: "A theatre troupe rehearses for their next big show. Their lifted voices and dramatic gestures tell of a grand story.",
    descPreview: "a theatre troupe.",
    cont: [],
    mobs: [],
    NPCs: [],
    exitN: false,
    exitS: 1256,
    exitE: false, //1255
    exitW: false,
    current: false,
    POI: 'bastion2'
  },
  {
    title: "Prosperos - Dead Man's house",
    ID: 1255,
    desc: "Inside the abandoned house, household objects are scattered everywhere.",
    descPreview: "an abandoned house.",
    cont: [], //a bunch of random objects.
    mobs: [],
    NPCs: [],
    exitN: false,
    exitS: false,
    exitE: false,
    exitW: 1254,
    current: false,
    POI: 'bastion2',
    func: function() {
      //add unique action open drawer
    }
  },
  {
    title: "Prosperos - ",
    ID: 1256,
    desc: "Several men and women are high atop ladders, stretching to hang small shining crystals above the street. A few barrels of confetti and paper strips sit beside the road.",
    descPreview: "party preparations.",
    cont: [],
    mobs: [],
    NPCs: [],
    exitN: 1254,
    exitS: false,
    exitE: 1257,
    exitW: 1253,
    current: false,
    POI: 'bastion2'
  },
  {
    title: "Prosperos - ",
    ID: 1257,
    desc: "The smooth stone roadway continues to the east, but there are too many people to fit your way through. Narrow <w>steps</w> lead up to the Summoner's Lookout.",
    descPreview: ".",
    cont: [],
    mobs: [],
    NPCs: [],
    exitN: false,
    exitS: false,
    exitE: false,
    exitW: 1256,
    current: false,
    POI: 'bastion2',
    func: function() {
      addUniqueAction({
        entry: 'steps',
        input: ['climb', 'climb steps', 'use steps', 'steps', 'ascend', 'ascend steps', 'climb stairs', 'use stairs'],
        onlyInRoom: 1257,
        once: false,
        hidden: true,
        func: function() {
          log("You climb the steps toward the Summoner's Lookout.", 'yellow');
          act('goto', '1280');
        }
      });
    }
  },
  {
    title: "Prosperos - Market Square",
    ID: 1260,
    desc: ".",
    descPreview: ".",
    cont: [],
    mobs: [],
    NPCs: [],
    exitN: false,
    exitS: 1261,
    exitE: false,
    exitW: 1250,
    current: false,
    POI: 'bastion2'
  },
  {
    title: "Prosperos - Market Square",
    ID: 1261,
    desc: ".",
    descPreview: ".",
    cont: [],
    mobs: [],
    NPCs: [],
    exitN: false,
    exitS: 1262,
    exitE: 1263,
    exitW: false,
    current: false,
    POI: 'bastion2'
  },
  {
    title: "Prosperos - Market Square",
    ID: 1262,
    desc: "A human-sized metal grate covers the entrance to a dark passageway.",
    descPreview: ".",
    cont: [],
    mobs: [],
    NPCs: [],
    exitN: 1261,
    exitS: false,
    exitE: 1264,
    exitW: false, //1274 underground
    current: false,
    POI: 'bastion2'
  },
  {
    title: "Prosperos - Market Square",
    ID: 1263,
    desc: ".",
    descPreview: ".",
    cont: [],
    mobs: [],
    NPCs: [],
    exitN: false,
    exitS: 1264,
    exitE: 1261,
    exitW: false,
    current: false,
    POI: 'bastion2'
  },
  {
    title: "Prosperos - Market Square",
    ID: 1264,
    desc: ".",
    descPreview: ".",
    cont: [],
    mobs: [],
    NPCs: [],
    exitN: 1263,
    exitS: false,
    exitE: 1265,
    exitW: 1262,
    current: false,
    POI: 'bastion2'
  },
  {
    title: "Prosperos - Shopping Alley",
    ID: 1265,
    desc: ".",
    descPreview: ".",
    cont: [],
    mobs: [],
    NPCs: [],
    exitN: false,
    exitS: 1266,
    exitE: 1267,
    exitW: 1264,
    current: false,
    POI: 'bastion2'
  },
  {
    title: "Prosperos - Shopping Alley",
    ID: 1266,
    desc: ".",
    descPreview: ".",
    cont: [],
    mobs: [],
    NPCs: [],
    exitN: 1265,
    exitS: false,
    exitE: false,
    exitW: false,
    current: false,
    POI: 'bastion2'
  },
  {
    title: "Prosperos - Shopping Alley",
    ID: 1267,
    desc: ".",
    descPreview: ".",
    cont: [],
    mobs: [],
    NPCs: [],
    exitN: false,
    exitS: false,
    exitE: false,
    exitW: 1265,
    current: false,
    POI: 'bastion2',
    func: function() {
      addUniqueAction({
        entry: 'steps',
        input: ['climb', 'climb steps', 'use steps', 'steps', 'ascend', 'ascend steps', 'climb stairs', 'use stairs'],
        onlyInRoom: 1267,
        once: false,
        hidden: true,
        func: function() {
          log("You climb the steps toward the Summoner's Lookout.", 'yellow');
          act('goto', '1280');
        }
      });
    }
  },

  /////////////////////////////////////////////
  /* BASTION 2 - PROSPEROS UNDERGROUND */
  /////////////////////////////////////////////

  {
    title: "Prosperos - Underground",
    ID: 1270,
    desc: ".",
    descPreview: ".",
    cont: [],
    mobs: [
      {ID:203, HPRatio:1, currentHP:1, maxHP:0, living:true}
    ],
    NPCs: [],
    exitN: false,
    exitS: 1271,
    exitE: false,
    exitW: false,
    current: false,
    POI: 'bastion2'
  },
  {
    title: "Prosperos - ",
    ID: 1271,
    desc: ".",
    descPreview: ".",
    cont: [],
    mobs: [
      {ID:6, HPRatio:1, currentHP:1, maxHP:0, living:true},
    ],
    NPCs: [],
    exitN: 1270,
    exitS: 1272,
    exitE: false,
    exitW: false,
    current: false,
    POI: 'bastion2'
  },
  {
    title: "Prosperos - ",
    ID: 1272,
    desc: ".",
    descPreview: ".",
    cont: [],
    mobs: [],
    NPCs: [],
    exitN: 1271,
    exitS: false, //1273
    exitE: 1274,
    exitW: false,
    current: false,
    POI: 'bastion2'
  },
  {
    title: "Prosperos - Underground",
    ID: 1273,
    desc: ".",
    descPreview: ".",
    cont: [],
    mobs: [],
    NPCs: [],
    exitN: 1272,
    exitS: false,
    exitE: false,
    exitW: false,
    current: false,
    POI: 'bastion2'
  },
  {
    title: "Prosperos - Underground Entrance",
    ID: 1274,
    desc: ".",
    descPreview: ".",
    cont: [152],
    mobs: [],
    NPCs: [],
    exitN: false,
    exitS: false,
    exitE: false,
    exitW: 1272, //
    current: false,
    locked: true,
    lockedDesc: "The metal grate is locked.",
    POI: 'bastion2'
  },

  /////////////////////////////////////////////
  /* BASTION 2 - PROSPEROS SUMMONER'S LOOKOUT*/
  /////////////////////////////////////////////

  {
    title: "Prosperos - Summoner's Lookout",
    ID: 1280,
    desc: ".",
    descPreview: ".",
    cont: [],
    mobs: [],
    NPCs: [],
    exitN: false,
    exitS: false,
    exitE: false,
    exitW: false,
    current: false,
    POI: 'bastion2'
  },
  {
    title: "Prosperos - Summoner's Lookout",
    ID: 1281,
    desc: ".",
    descPreview: ".",
    cont: [],
    mobs: [],
    NPCs: [],
    exitN: false,
    exitS: false,
    exitE: false,
    exitW: false,
    current: false,
    POI: 'bastion2'
  },
  {
    title: "Prosperos - Summoner's Lookout",
    ID: 1282,
    desc: ".",
    descPreview: ".",
    cont: [],
    mobs: [],
    NPCs: [],
    exitN: false,
    exitS: false,
    exitE: false,
    exitW: false,
    current: false,
    POI: 'bastion2'
  },
  {
    title: "Prosperos - Summoner's Lookout",
    ID: 1283,
    desc: ".",
    descPreview: ".",
    cont: [],
    mobs: [],
    NPCs: [],
    exitN: false,
    exitS: false,
    exitE: false,
    exitW: false,
    current: false,
    POI: 'bastion2'
  },
  {
    title: "Prosperos - Summoner's Lookout",
    ID: 1284,
    desc: ".",
    descPreview: ".",
    cont: [],
    mobs: [],
    NPCs: [],
    exitN: false,
    exitS: false,
    exitE: false,
    exitW: false,
    current: false,
    POI: 'bastion2'
  },

];
