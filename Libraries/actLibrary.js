/* actions have the following classes:
// battleStart: initiates battle, only available when NOT already battling
// battle: available during battle OR to start battle
// noBattle: not available during battle
// skill: this is a player skill, takes plasmoid, etc.
// craft: for crafting
// dev: dev tools for testing
// inv: deals with inventory and equipping
// look: well... it's looking.
// nav: moving around normally
// player: deals with player, stats, and advancement
// settings: game settings and help
*/


/////////////////////////////////////////////
/* WORLD MAP NAVIGATION */
/////////////////////////////////////////////

$(document).keydown(function(e) {
  //DEV USE - set back to event.repeat when live
  //var repeat = event.repeat
  var repeat = false;

  if (!repeat) {
    switch(e.key) {
      case 'ArrowLeft':
        if (worldMap) {
          //console.log("moving map left");
          worldMoveX(1);
          e.preventDefault();
        }
      break;

      case 'ArrowUp':
        //console.log("moving map up");
        if (worldMap) {
          worldMoveY(1);
        } else {
          logStepBack();
        }
        e.preventDefault();
      break;

      case 'ArrowRight':
        if (worldMap) {
          //console.log("moving map right");
          worldMoveX(-1);
          e.preventDefault();
        }
      break;

      case 'ArrowDown':
        //console.log("moving map down");
        if (worldMap) {
          worldMoveY(-1);
        } else {
          logStepForward();
        }
        e.preventDefault();
      break;

      case 'Enter':
        if (worldMap) {
          enterPOI();
          e.preventDefault();
        }
      break;

      //DEV USE ONLY - logs current map coords
      case '`':
        if (worldMap) {
          var currentMap = String(mapCoord);
          console.log(currentMap);
          e.preventDefault();
        }
      break;

      //DEV USE ONLY
      case '=':
        console.log("switching maps");
        switchMap();
        e.preventDefault();
      break;

      //DEV USE ONLY
      case '\\':
      if (battleScreen) {
        switchMap('room');
      } else {
        switchMap('battle');
      }
      console.log("switching battle-wrapper");
      e.preventDefault();
      break;

      //DEV USE ONLY
      case '-':
        if (worldMap) {
          console.log("toggling map noclip");
          mapNoClip = !mapNoClip;
          e.preventDefault();
        }
      break;

      //DEV USE ONLY
      case ']':
        if (worldMap) {
          console.log("toggling all POIs");
          $('.map-POIs').toggleClass('show-POIs');
          e.preventDefault();
        }
      break;

      //DEV USE ONLY
      case '[':
        if (worldMap) {
          console.log("toggling mapEncounters");
          mapEncounters = !mapEncounters;
          e.preventDefault();
        }
      break;

      default: return; // exit this handler for other keys
    }
  }
});

//mimick navigation with buttons

$(".arrow").click(function() {
  if ($(this).hasClass('up')) {
    worldMoveY(1);
  } else if ($(this).hasClass('right')) {
    worldMoveX(-1);
  } else if ($(this).hasClass('down')) {
    worldMoveY(-1);
  } else if ($(this).hasClass('left')) {
    worldMoveX(1);
  }
});

$(".enter-button").click(function() {
  enterPOI();
});


/////////////////////////////////////////////
/* CONSOLE COMMANDS */
/////////////////////////////////////////////

let actLibrary = [
  {
    entry: 'north',
    input: ['n', 'north'],
    class: ['nav', 'noBattle'],
    desc: "Goes north! Can only be used if there's an exit to the north.",
    func: function(thisRoomIndex, dirObj, indirObj, directAct) {
      newRoom('exitN', directAct);
    }
  },
  {
    entry: 'south',
    input: ['s', 'south'],
    class: ['nav', 'noBattle'],
    desc: "Goes south! Can only be used if there's an exit to the south.",
    func: function(thisRoomIndex, dirObj, indirObj, directAct) {
      newRoom('exitS', directAct);
    }
  },
  {
    entry: 'east',
    input: ['e', 'east'],
    class: ['nav', 'noBattle'],
    desc: "Goes east! Can only be used if there's an exit to the east.",
    func: function(thisRoomIndex, dirObj, indirObj, directAct) {
      newRoom('exitE', directAct);
    }
  },
  {
    entry: 'west',
    input: ['w', 'west'],
    class: ['nav', 'noBattle'],
    desc: "Goes west! Can only be used if there's an exit to the west.",
    func: function(thisRoomIndex, dirObj, indirObj, directAct) {
      newRoom('exitW', directAct);
    }
  },
  {
    entry: 'look',
    input: ['l', 'look'],
    class: ['look'],
    desc: 'Looks at an object, person, creature, or item in your inventory. Can also be used to look in a direction, such as <w>l e</w> to look east.',
    err: 'Nothing to look at.',
    func: function(thisRoomIndex, dirObj) {
      //roomReset();
      activateNPCs();
      //if you're not looking at anything in particular, look at the room
      var obj = checkArray(roomObjLibrary, dirObj);
      var allObjs = checkArray(objLibrary, dirObj);
      var inv = checkArray(invLibrary, dirObj);
      var mob = checkArray(mobLibrary, dirObj);
      var craftingBag = invLibrary[0].contents;
      var material;
      thisMob = {};
      //display the room
      if (!dirObj) {
        roomLoot = "";
        //search through the object library to list room contents
        if (roomObjLibrary.length > 0) {
          $.each(roomObjLibrary, function() {
            if ( inArray('door', this.class) ) {
              if (this.state == 'closed') {
                roomLoot += " " + this.roomDescClosed;
              } else if (this.state == 'open') {
                roomLoot += " " + this.roomDescOpen;
              }
              addDoorAction(this);
            } else if ( inArray('trap', this.class) ) {
              if (this.state == 'armed') {
                roomLoot += " " + this.roomDescArmed;
              } else {
                roomLoot += " " + this.roomDesc;
              }
            } else {
              roomLoot += " " + this.roomDesc;
            }
          });
        }
        //show quest log 1 & 2 descriptions before the room.
        if (qLog1) {
          $.each(qLog1, function() {
            log(this.log, this.class);
          })
        }
        if (qLog2) {
          $.each(qLog2, function() {
            log(this.log, this.class);
          })
        }
        //show the room description plus object descriptions. Doors are in there too.
        log(roomLibrary[thisRoomIndex].desc + roomLoot);
        //show quest log 3
        if (qLog3) {
          $.each(qLog3, function() {
            log(this.log, this.class);
          })
        }
        //search enemy library to list enemies
        if (theseMobs.length > 0) {
          $.each(theseMobs, function() {
            thisMob = this;
            mob = checkArrayID(mobLibrary, thisMob.ID);
            if (thisMob.living) {
              log(mob.roomDesc, 'mobs');
            } else if (!thisMob.living) {
              log(mob.roomDescDeath, "mobs info");
            }
          });
        }
        //show quest log 4
        if (qLog4) {
          $.each(qLog4, function() {
            log(this.log, this.class);
          })
        }
        //list the exits to the this room
        roomExits = "<span class='exit'>";
        var totalExits = 0;
        $.each(directionList, function() {
          var tempDirection = 'exit' + this.toUpperCase();
          if (currentRoom[tempDirection]) {
            totalExits += 1;
            if (totalExits > 1) {
              roomExits += "</span>, <span class='exit'>";
            }
            roomExits += translator[this];
          } else {
            //console.log("didn't find " + tempDirection)
          }
        });
        log("Exits to the " + roomExits + "</span>.", 'exits info');
        //show quest log 5
        if (qLog5) {
          $.each(qLog5, function() {
            log(this.log, this.class);
          })
        }
        showUniqueActions();
      //if it's a direction, look at that room
    } else if (dirObj == 'alc' || dirObj == 'alchemy' ) {
      act('lalc');
    } else if ( dirObj && inArray(dirObj, directionList) ) {
        var exit = 'exit' + dirObj.toUpperCase();
        var nextRoomID = currentRoom[exit];
        var nextRoom = checkArrayID(roomLibrary, nextRoomID);
        if (nextRoom) {
          log("To the " + translator[dirObj] + ", you see " + nextRoom.descPreview);
          $.each(nextRoom.mobs, function() {
            if (this.living) {
              var tempMob = checkArrayID(mobLibrary, this.ID);
              log(tempMob.title, 'indent no-top');
            }
          });
        } else {
          log("You don't see anything in that direction.");
        }
        //if there's something in the room, look at that
      } else if (dirObj && obj) {
        log(obj.desc);
        //if there's an object in your inventory, look at that
      } else if (dirObj && inv) {
        //are you looking inside your crafting bag?
        if (inv.contents) {
          log("In " + inv.article + inv.title + " you find:");
          $.each(inv.contents, function () {
            if (this.qty > 0) {
              var item = checkArrayID(objLibrary, this.ID);
              log("<cr>" + this.qty + "</cr> " + item.title , 'ul');
            }
          })
        //check if it has a specific inventory description
        } else if (inv.inspectDesc) {
          log(inv.inspectDesc);
        //otherwise, log the regular description.
        } else {
          log(inv.desc);
        //check the crafting materials last
        }
      } else if (dirObj && theseMobs.length > 0 && mob) {
        thisMob = checkArrayID(theseMobs, mob.ID);
        console.log("mob: " + mob.title);
        if (thisMob) {
          //trim it down to one if there are several
          /*
          if (thisMob.length > 1) {
            thisMob = thisMob[0];
          }
          */
          logProps(thisMob);
          //logProps(mob);
          if (thisMob.living) {
            log(mob.inspectDesc);
          } else if (!thisMob.living) {
            log(mob.inspectDescDeath);
          }
        } else {
          log("You don't see that creature here.");
        }
      } else if (allObjs && craftingBag.length > 0) {
        if (allObjs) {
          material = checkArrayID(invLibrary[0].contents, allObjs.ID);
        }
        if (material) {
          log(allObjs.desc);
        } else if (allObjs) {
          log("You don't see any of those");
        }
       //check the mobs
      } else {
        log("You don't see that.");
      }
    }
  },


  /////////////////////////////////////////////
  /* GENERAL ACTIONS */
  /////////////////////////////////////////////

  {
    entry: 'add spoils',
    input: 'spoils',
    class: ['dev'],
    func: function(thisRoomIndex, dirObj) {
      var mob = checkArray(mobLibrary, dirObj);
      getSpoils(mob);
    }
  },
  {
    entry: 'add xp',
    input: 'xp',
    class: ['dev'],
    func: function(thisRoomIndex, dirObj) {
      if (dirObj) {
        addXP(parseInt(dirObj.trim()));
      } else {
        log("how much?");
      }
    }
  },
  {
    entry: 'attack',
    input: ['k', 'atk'],
    class: ['battleStart'],
    desc: "Attacks a creature to initiate battle. Battle continues until one is defeated. Can aggravate other nearby enemies to attack you.<br>Also see: <w>flee</w>, <w>skills</w>",
    err: 'Nothing to attack around here.',
    func: function(thisRoomIndex, dirObj, indirObj) {
      if (Number(dirObj)) {
        var tempMob = checkArray(theseMobs, dirObj, 'instanceID').ID;
        dirObj = checkArrayID(mobLibrary, tempMob).entry[0];
      }
      var npc = checkArray(npcLibrary, dirObj);
      var mob = checkArray(mobLibrary, dirObj);
      //console.log("trying to kill something");
      //logProps(mob);
      //console.log("theseMobs: " + theseMobs);
      //console.log("thisMob: " + thisMob);
      if (theseMobs.length > 0 && dirObj && mob) {
        //check the mobs in the room and see if any match the ID of the one you're looking for
        //kill the live, aggro ones first
        thisMob = checkArrayID(theseMobs, mob.ID, true, true);
        if (thisMob) {
          //console log its properties
          logProps(thisMob);
          if (thisMob.living) {
            //kill!
            if (!battling) {
              startBattle(thisRoomIndex, mob, thisMob);
            //if you're already in battle, redirect it
            } else if (battling && player.battlingInstanceID != thisMob.instanceID) {
              targetMob(thisMob, mob);
              log("Attacking the " + mob.title, 'orange');
            } else if (battling && player.battlingInstanceID == thisMob.instanceID) {
              log("You're already attacking the " + mob.title, 'info');
            }
          }
          //if no living ones are in the room, check elsewhere
        } else {
          thisMob = checkArrayID(theseMobs, mob.ID)
          if (thisMob && !thisMob.living) {
            log("It's already dead.")
          } else if (!thisMob) {
            log("That enemy's not here.")
          }
        }
      } else if (battling) {
        log("What do you want to attack?", 'yellow')
      } else if (npc && npc.inRoom == player.inRoom) {
        log("You're no monster, are you?");
      } else {
        log("What do you want to attack?")
      }
    }
  },
  {
    entry: 'kill',
    input: ['kill'],
    class: ['dev'],
    desc: "Kills a monster. (Dev use only)",
    func: function(thisRoomIndex, dirObj, indirObj) {
      if (Number(dirObj)) {
        var tempMob = checkArray(theseMobs, dirObj, 'instanceID').ID;
        dirObj = checkArrayID(mobLibrary, tempMob).entry[0];
      }
      var npc = checkArray(npcLibrary, dirObj);
      var mob = checkArray(mobLibrary, dirObj);
      if (theseMobs.length > 0 && dirObj && mob) {
        //check the mobs in the room and see if any match the ID of the one you're looking for
        //kill the live, aggro ones first
        thisMob = checkArrayID(theseMobs, mob.ID, true, true);
        if (thisMob) {
          if (thisMob.living) {
            killMob(thisMob, mob);
          } else {
            console.log("Can't kill that mob, it's already dead.");
          }
          //if no living ones are in the room, check elsewhere
        } else {
          console.log("Can't find thisMob to kill!");
        }
      } else if (npc) {
        console.log("Can't kill NPCs!");
      }
    }
  },
  {
    entry: 'buff',
    input: 'buff',
    class: ['dev'],
    desc: "Add a buff to a target.",
    func: function(thisRoomIndex, dirObj, indirObj) {
      var buff = checkArray(buffList, dirObj);
      var thisMob;
      if (!buff) {
        buff = checkArray(buffList, indirObj);
        var mob = checkArray(mobLibrary, dirObj);
        thisMob = checkArrayID(theseMobs, mob.ID, true, true);
      }
      if (buff && thisMob) {
        addBuff('dev command', buff, thisMob);
      } else if (buff && !indirObj) {
        addBuff('dev command', buff, 'player');
      } else if (buff && indirObj) {
        log("Can't find that mob");
      } else {
        log("Can't find that buff");
      }
    }
  },
  {
    entry: 'clear screen',
    input: 'cl',
    class: ['settings'],
    desc: "Clears the screen to keep things nice and tidy!",
    func: function() {
      resetLog();
      showHint();
    }
  },
  {
    entry: 'craft',
    input: ['c', 'craft', 'crafting', 'bag'],
    class: ['craft', 'noBattle'],
    desc: "Crafts items using materials from your crafting bag, such as <w>craft health shard</w>. Each recipe needs a specific number of ingredients. Type <w>recipes</w> to see all the recipes you know, and the ingredients each one needs.",
    func: function(thisRoomIndex, dirObj, indirObj) {
      var craftingBag = invLibrary[0].contents;
      if (!dirObj) {
        act("l","bag");
        log("Type <w>recipes</w> to see what you can craft");
      } else if (dirObj) {
        if (dirObj == "recipes") {
          if (knownRecipes.length > 0) {
            log("You know the following <cr>crafting recipes</cr>:")
            $.each(knownRecipes, function() {
              var thisRecipe = checkArrayID(recipeLibrary, this);
              log(thisRecipe.title + " <span class='info'> - " + thisRecipe.desc + "</span>", "ul")
              var ingredList = "";
              var totalIngreds = 0;
              if (thisRecipe.ingreds) {
                $.each(thisRecipe.ingreds, function() {
                  var thisIngred = checkArrayID(objLibrary, this.ingred);
                  totalIngreds++;
                  if (totalIngreds > 1) {
                    ingredList += ", "
                  }
                  if (thisIngred) {
                    ingredList += this.qty + " " + thisIngred.title;
                  } else {
                    ingredList += "some unknown material";
                  }
                });
              }
              log("<span class='dark'>" + ingredList + "</span>", 'ingreds');
            });
          } else {
            log("You don't know any crafting recipes yet.", 'info');
          }
        //check the recipes to match what you're trying to craft that
        } else {
          var query;
          if (!indirObj) {
            query = dirObj;
          } else {
            query = (dirObj + " " + indirObj);
          }
          var recipe = checkArray(recipeLibrary, query);
          console.log("check for recipe: " + query)
          if (recipe) {
            //if you know the recipe, go ahead
            if ( inArray(recipe.ID, knownRecipes) ) {
              //each entry in ingreds is an object with qty and ID
              var ingreds = recipe.ingreds;
              var ableToCraft = true;
              var removeIngreds = [];
              //logProps(ingreds);
              $.each(ingreds, function() {
                var inBag = checkArrayID(craftingBag, this.ingred)
                if (inBag && inBag.qty >= this.qty) {
                  console.log("You have enough " + checkArrayID(objLibrary, this.ingred).title);
                  removeIngreds.push(this);
                } else if (inBag && inBag.qty < this.qty) {
                  log("You don't have enough <span class='default'>" + checkArrayID(objLibrary, this.ingred).title + "</span>!", 'orange');
                  ableToCraft = false;
                } else if (!inBag) {
                  log("You don't have any <span class='default'>" + checkArrayID(objLibrary, this.ingred).title + "</span>!", 'orange');
                  ableToCraft = false;
                } else {
                  console.log("Something's wrong with " + this.ingred);
                  ableToCraft = false;
                }
              });
              if (ableToCraft) {
                log("You successfully craft a <cr>" + recipe.title + "</cr>!");
                //craft just one thing for now
                // removeIngreds is an array with objects containing qty and ID
                craft(recipe, 1, removeIngreds, craftingBag);
              }
            } else {
              log("You don't know how to make that.");
            }
          } else {
            log("What are you trying to craft? Type <w>recipes</w> to see your known recipes.")
          }
        }
      }
    }
  },
  {
    entry: 'commands',
    input: ['?', 'help'],
    class: ['settings'],
    desc: "This is the help description for the help command. You can... get help with it?",
    func: function(thisRoomIndex, dirObj, indirObj) {
      if (!dirObj) {
        commands = "";
        $.each(actLibrary, function() {
          //have to push the inputs to their own proper array in order to join with a space >.>
          var inputs = $.makeArray(this.input);
          if ( !inArray('dev', this.class) && !inArray('alchemy', this.class) && !inArray('skill', this.class) && !this.locked && !this.hidden ) {
            commands += "<span class='command'>" + this.entry + " <span class='info'>(" + inputs.join(", ") + ")</span></span>";
          }
        });
        log('<span class="command-title">Available commands:</span>');
        log(commands, 'command-list');
        log('Type <w>?</w> before a command to see more info, such as <w>? journal</w>');
      } else if (dirObj) {
        var action;
        $.each(actLibrary, function(index, val) {
          currentEntry = $(this);
          //if it's a single option, match the whole command
          if ( !$.isArray(this.input) && this.input == dirObj ) {
            //set the action to the current one
            action = this;
          } else if ( $.isArray(this.input) ) {
            var aliases = this.input;
            $.each(aliases, function(thisIndex, thisVal) {
              //console.log("checking alias: " + this + " for match to " + command);
              if (this == dirObj) {
                action = currentEntry[0];
                //console.log("found a match for " + currentEntry[0].entry);
              }
            });
          }
        });
        if (action) {
          log(action.desc);
        } else {
          log("Sorry, can't find that action.");
        }
      }
    }
  },
  {
    entry: 'detonate',
    input: ['detonate', 'denotate', 'deton', 'det'],
    class: ['noBattle'],
    desc: "Detonates any nearby traps.",
    func: function (thisRoomIndex, dirObj, indirObj) {
      if (checkArmedItems()) {
        detonateArmedItems();
      } else {
        log("Didn't find any traps nearby.");
      }
    }
  },
  {
    entry: 'drop',
    input: ['drop'],
    class: ['inv', 'noBattle'],
    desc: "Drops an item from your inventory to the ground. Items will stay wherever you drop them.",
    err: "Can't drop that. Or can't find it. I dunno.",
    func: function (thisRoomIndex, dirObj, hidden) {
      let inv = checkArray(invLibrary, dirObj);
      if (dirObj && inv && !inArray("perm", inv.type) ) {
        var room = checkArrayID(roomLibrary, player.inRoom);
        removeInv(thisRoomIndex, inv);
        addObj(thisRoomIndex, inv);
        if (inv.equipped) {
          inv.equipped = false;
          equipReset();
          log("You unequip " + inv.article  + inv.title + " and drop it on the ground.")
        } else if (!hidden) {
          log("You drop " + inv.article  + inv.title + " on the ground.")
        } else {
          console.log("Silently dropped " + inv.title);
        }
      } else if (dirObj) {
        log("Can't drop that right now.")
      } else {
        log("Drop what?")
      }
    }
  },
  {
    entry: 'destroy',
    input: 'destroy',
    class: ['inv', 'noBattle'],
    desc: "Destroys an item in your inventory.",
    err: "Can't destroy that right now.",
    func: function (thisRoomIndex, dirObj) {
      let inv = checkArray(invLibrary, dirObj);
      if (dirObj && inv && !inArray("perm", inv.type) ) {
        removeInv(thisRoomIndex, inv);
        if (inv.equipped) {
          act('uneq', inv.ID) = false;
          equipReset();
        }
          log("You destroy " + inv.title + ".")
      } else if (dirObj) {
        log("Can't destroy that right now.")
      } else {
        log("destroy what?")
      }
    }
  },
  {
    entry: 'equip',
    input: ['eq', 'equip'],
    class: ['inv', 'noBattle'],
    desc: "Equips an item to your person. Can equip one item per slot: weapon, armor, and unique.<br>Also see: <w>unequip</w>",
    err: "Can't equip that.",
    func: function (thisRoomIndex, dirObj) {
      var inv = checkArray(invLibrary, dirObj);
      if ( Number(dirObj) ) {
        inv = checkArrayID(invLibrary, dirObj);
      }
      if (dirObj && inv && inArray("equip", inv.type)) {
        var equipSlot = String(inv.eqSlot);
        if (!inv.equipped && equipSlot && player[equipSlot]) {
          console.log("something's equipped already, trying to replace " + player[equipSlot]);
          act('uneq', player[equipSlot]);
        }
        // if the slot's empty, equip it!
        if ( !inv.equipped && equipSlot && !player[equipSlot]) {
          inv.equipped = true;
          player[equipSlot] = inv.ID;
          if (inv.eqSlot == 'eqHand') {
            player.eqWeaponClass = inv.class;
            player.atkTitle = inv.shortTitle;
          }
          if (inv.equipDesc) {
            log(inv.equipDesc);
          } else {
            log("You equip " + inv.article + inv.title + " to your " + translator[equipSlot] + ".");
          }
          equipReset();
          logDmg();
          player.atkVerb = inv.atkVerb;
          // if something's there, remove the previous and equip over it.
        } else if (inv.equipped) {
          log("That's already equipped!");
        } else if (!equipSlot) {
          log("Can't find where to equip that item.");
        } else {
          //console.log("equipSlot: " + equipSlot);
          //console.log("player[equipSlot]: " + player[equipSlot]);
          //logProps(inv);
          log("Something went wrong.");
        }
      } else if (dirObj) {
        log("Can't equip that.")
      } else if (!dirObj) {
        log("Your currently equipped items are:")
        var hand = checkArrayID(summonLibrary,player.eqHand);
        var armor = checkArrayID(summonLibrary,player.eqArmor);
        var unique = checkArrayID(summonLibrary,player.eqAccessory);
        if (hand) {
          log("<o>" + hand.title + "</o>: " + hand.dmgMod + " attack, " + hand.atkSpd + " speed, " + parseFloat(hand.hitMod)*100 + "% to hit.");
          if (hand.effectDesc) {
            log(hand.effectDesc, 'indent no-top');
          }
        }
        if (armor) {

        }
        log("Type <w>eq [item]</w> to equip an item, such as <w>eq Chrystus</w>");
      }
    }
  },
  {
    entry: 'goto',
    input: ['goto', 'g'],
    class: ['dev'],
    func: function(thisRoomIndex, dirObj, hidden) {
      var gotoNPC = checkArray(npcLibrary, dirObj);
      var gotoRoom = checkArrayID(roomLibrary, dirObj);
      var prevRoom = checkArrayID(roomLibrary, player.inRoom);
      var nextRoomID;
      //sanitize the hidden attribute
      if (hidden === 'true' || hidden === 'hidden') {
        hidden = true;
      }
      if (gotoRoom || gotoNPC) {
        if (gotoNPC) {
          nextRoomID = gotoNPC.inRoom;
          gotoRoom = checkArrayID(roomLibrary, nextRoomID);
        } else if (gotoRoom) {
          nextRoomID = gotoRoom.ID;
        }
        enterRoom(nextRoomID, prevRoom, gotoRoom, 'dark dimension', false, hidden);
      } else {
        console.log("Can't find room: " + dirObj);
      }
    }
  },
  {
    entry: 'inventory',
    input: ['i', 'inv'],
    class: ['inv'],
    desc: "Lists all the items in your inventory. You can hold any number of items.<br>Also see: <w>use</w>, <w>craft</w>, <w>equip</w>",
    err: "Can't inspect your inventory right now",
    func: function () {
      if (!battling) {
        log('Searching your pack, you find:')
        $.each(invLibrary, function () {
          var invQty = this.qty;
          var invTitle;
          if (this.equipped) {
            invTitle = this.title + " (<o>equipped</o>)";
          } else if (invQty > 1) {
            invTitle = "(<o>" + this.qty + "</o>) " + this.title;
          } else {
            invTitle = this.title;
          }
          log(invTitle, 'ul');
        })
      } else {
        log("Not in the middle of battle!", "yellow")
      }
    }
  },
  {
    entry: 'journal',
    input: ['journal', 'j'],
    class: ['settings', 'player', 'noBattle'],
    desc: "Opens your journal, where you can save or load your current progress.",
    func: function(thisRoomIndex, dirObj, indirObj) {
      var recentSave = localStorage.getItem('BloodSummonerSaveGame');
      //add journal (show saves),0 journal write (save), and journal read (load)
      if (!battling && (dirObj == 'write' || dirObj == 'save')) {
        log("You record your travels in your journal.", "yellow");
        saveGame();
      } else if (!battling && (dirObj == 'read' || dirObj == 'load') ) {
        if (recentSave) {
          logSaveGame();
          log("There's a saved entry. Would you like to load it?");
          addUniqueAction({
            entry: 'load',
            onlyInRoom: player.inRoom,
            once: true,
            hidden: false,
            func: function() {
              loadGame();
            }
          });
          showUniqueActions();
        } else {
          log("There aren't any entries. Write a new entry with <w>j write</w>.");
        }
      //show the journal entries
      } else if (!battling && !dirObj) {
        if (recentSave) {
          logSaveGame();
        } else {
          log("There aren't any entries. Write a new entry with <w>j write</w>.");
        }
      } else if (battling)  {
        log("Can't use your journal during battle!");
      } else {
        log("Having trouble accessing your journal");
      }
    }
  },
  {
    entry: 'leave',
    input: ['leave', 'exit'],
    class: ['nav', 'noBattle'],
    desc: "Exits to the world map. Can only be used in an open spot near the edges of the area.",
    func: function() {
      if (currentRoom.exitAllowed) {
        log("Leaving the area...", "yellow");
        switchMap('map');
        bgmStop();
        bgmPlay(bgmWorld);
        //show the tutorial for a bit
        if (mapTutorial) {
          $('.map-tutorial').addClass('active');
          setTimeout( function(){
            $('.map-tutorial').removeClass('active');
            mapTutorial = false;
           }, 10000
          );
        }
      } else {
        log("Need to get to a more open area.");
      }
    }
  },
  {
    entry: 'level up',
    input: 'level',
    class: ['dev'],
    func: function(thisRoomIndex, dirObj) {
      if (dirObj) {
        setLevel( parseInt(dirObj.trim()), (player.HP / player.baseHP), (player.plasmoid / player.basePlasmoid) );
      } else {
        log("to what level?");
      }
    }
  },
  {
    entry: 'load game',
    input: ['load'],
    class: ['title'],
    locked: false,
    func: function(thisRoomIndex, dirObj) {
      var recentSave = localStorage.getItem('BloodSummonerSaveGame');
      if (recentSave) {
        loadGame();
      } else {
        console.log("no saved game to load!");
      }
    }
  },
  {
    entry: 'new game',
    input: ['new'],
    class: ['title'],
    locked: false,
    func: function(thisRoomIndex, dirObj) {
      init();
    }
  },
  {
    entry: 'milestone',
    input: ['milestone', 'ms'],
    class: ['dev'],
    func: function(thisRoomIndex, dirObj) {
      if (Number(dirObj)) {
        milestone(dirObj);
      } else {
        log("Which milestone?");
      }
    }
  },
  {
    entry: 'quests',
    input: ['q', 'quest', 'quests'],
    class: ['player'],
    desc: "Shows your current quests. Can be used to see quest details, such as <w>q marcus</w>",
    func: function(thisRoomIndex, dirObj, indirObj, directAct, fullCommand) {
      var thisQuest = checkQuest(dirObj, 'accepted'); //only search for accepted quests.
      if (!thisQuest) {
        thisQuest = checkQuest(fullCommand, 'accepted');
      }
      //list your quests
      if (!dirObj) {
        var totalQuests = 0;
        log("Your current quests:");
        $.each(playerQuests, function() {
          if (this.accepted && !this.turnedIn) {
            var questTitle = this.title
            if (this.completed) {
              questTitle = "<g>" + this.title + "</g>";
            }
            log(questTitle + "<span class='info'> - " + this.area, 'ul');
            totalQuests++
          }
        });
        if (totalQuests == 0) {
          log("You have no quests at the moment.", 'indent no-top info')
        }
      //looking at a quest
      } else if (dirObj && thisQuest && !indirObj) {
        if (!thisQuest.completed) {
          log(thisQuest.objective);
        } else {
          log(thisQuest.finish);
        }
      //forcing a quest to accept, complete, etc.
      } else if (dirObj && indirObj) {
        thisQuest = checkQuest(dirObj);
        if (thisQuest) {
          switch(indirObj) {
            case 'accept':
              acceptQuest(thisQuest.entry[0]);
            break;
            case 'complete':
              completeQuest(thisQuest.entry[0]);
            break;
            case 'uncomplete':
              uncompleteQuest(thisQuest.entry[0]);
            break;
            case 'turnin':
              turnInQuest(thisQuest.entry[0]);
            break;
            case 'fail':
              failQuest(thisQuest.entry[0]);
            break;
            default:
              log("Can't find that quest.");
            break;
          }
        } else {
          log("Can't find that quest to modify");
        }
      } else if (dirObj == 'showall' && !indirObj) {
        log("All quests:");
        $.each(playerQuests, function() {
          var questTitle = this.title
          if (this.completed) {
            questTitle = "<g>" + this.title + "</g>";
          }
          log(questTitle + "<span class='info'> - " + this.area, 'ul');
        });
      } else if (dirObj) {
        log("Can't find that quest.");
      }
    }
  },
  {
    entry: 'read',
    input: ['read', 'r'],
    class: ['look'],
    func: function(thisRoomIndex, dirObj, indirObj) {
      if (dirObj) {
        act("l", dirObj, indirObj);
      } else {
        log("Read what?");
      }
    }
  },
  {
    entry: 'recipes',
    input: ['recipes', 'recipe', 'rec'],
    class: ['craft'],
    hidden: true,
    func: function(thisRoomIndex, dirObj) {
      if (!dirObj) {
        act('craft', 'recipes');
      } else {
        discoverRecipe(dirObj);
      }
    }
  },
  {
    entry: 'room reset',
    input: 'rs',
    class: ['dev'],
    func: function() {
      roomReset();
    }
  },
  {
    entry: 'flee',
    input: ['flee', 'fl'],
    desc: "Attemps to run away from battle. Aggresive monsters may start attacking you if you stick around. You can also flee in a direction, such as <w>flee s</w>",
    class: ['battleOnly'],
    func: function(thisRoomIndex, dirObj) {
      if (!battling) {
        log("You're not in battle.");
        //run from battle in the same room
      } else if (battling && !dirObj) {
        log("You successfully escape!", "green");
        endBattle();
      //run from battle in a certain direction
      } else if (battling && inArray(dirObj, directionList) ) {
        act(dirObj, false, false, 'escape'); //"directAct" and "escape" bypass checks
        endBattle();
      } else {
        log("You can't flee from this battle!", "yellow");
      }
    }
  },
  {
    entry: 'sleep',
    input: ['sleep', 'nap', 'rest', 'snooze', 'relax'],
    hidden: true,
    class: ['player', 'noBattle'],
    func: function() {
      act('use','bed');
    }
  },
  {
    entry: 'stats',
    input: ['st', 'stats', 'stat'],
    desc: "Shows your stats, equipped items, and status effects. The stronger you become, the more you will learn about yourself.",
    class: ['player'],
    func: function(thisRoomIndex, dirObj, indirObj) {

      //DEV HELPER - SET STATS
      if (dirObj && indirObj && player[dirObj]) {
        player[dirObj] = indirObj;
        log("Setting " + dirObj + " to " + indirObj)
        playerReset();
      } else if (dirObj && !player[dirObj]) {
        log("Can't find that stat.")
      }

      if (!dirObj) {
        logLevel();
        logHealth();
        logPlasmoid();
        logDmg();
        logHit();
        logEquip();
        logBuffs('player');
        logXP();
        logProps(player);
      }
      equipReset();
    }
  },
  {
    entry: 'take',
    input: ['t', 'take', 'get'],
    class: ['inv', 'noBattle'],
    desc: "Takes a nearby item and puts it in your inventory. Use <w>take all</w> to take everything nearby. Obviously, not all items cans be picked up.<br>Also see: <w>drop</w>, <w>use</w>, <w>inv</w>",
    err: "Can't take that. Or can't find it. I dunno.",
    func: function (thisRoomIndex, dirObj, indirObj) {
      var dev = false;
      var obj = checkArray(roomObjLibrary, dirObj);
      //if you're typing in an item ID, then this is dev use. DEV TOOLS
      if ( Number(dirObj) ) {
        obj = checkArrayID(objLibrary, Number(dirObj));
        if (!obj) {
          obj = checkArrayID(recipeLibrary, Number(dirObj));
        }
        dev = true;
      }
      var objNoPickup;
      var mob = checkArray(mobLibrary, dirObj);
      //take everything!
      if (dirObj == "all") {
        var allObjects = "<span class='pickup'>";
        var totalObjects = 0;
        $.each(roomObjLibrary, function() {
          if ( inArray("pickup", this.type) || inArray("equip", this.type) || inArray("picksume", this.type)|| inArray("craft", this.type) ) {
            totalObjects++;
            if (totalObjects > 1) {
              allObjects += "</span>, <span class='pickup'>";
            }
            allObjects += this.title;
            addInv(this, 1, this.class);
            removeObj(thisRoomIndex, this);
          } else {
            console.log("couldn't pick up: " + this.entry);
          }
        });
        if (totalObjects > 0) {
          log("You take " + allObjects + "</span>.");
        } else {
          log("There's nothing to take!");
        }
      } else if (dev && obj && ( inArray("pickup", obj.type) || inArray("equip", obj.type) || inArray("picksume", obj.type)|| inArray("craft", obj.type) ) ) {
        //default to adding one, unless specified
        var qty = 1;
        if (indirObj) {
          qty = indirObj;
        }
        log('You pull ' + qty + " <w>" + obj.title + "</w> out of thin air.");
        addInv(obj, qty, obj.class);
      } else if (dirObj && obj && ( inArray("pickup", obj.type) || inArray("equip", obj.type) || inArray("picksume", obj.type)|| inArray("craft", obj.type) ) ) {
        //console.log("attempting to take: " + obj)
        log("You take " + obj.article + obj.title)
        removeObj(thisRoomIndex, obj);
        addInv(obj, 1, obj.class);
      } else if (mob) {
        log("Are you feeling ok?");
      } else if (dirObj && obj) {
        objNoPickup = obj.noPickup;
        if (objNoPickup) {
          log(objNoPickup);
        } else {
          log("Can't take that right now.")
        }
      } else {
        log("Take what?")
      }
    }
  },
  {
    entry: 'talk',
    input: 'talk',
    desc: "Strikes up a conversation with whoever you choose. Try to talk to everyone you meet!",
    class: ['npc', 'noBattle'],
    func: function(thisRoomIndex, dirObj, indirObj) {
      var npc = checkArray(npcLibrary, dirObj);
      var mob = checkArray(mobLibrary, dirObj);
      var obj = checkArray(objLibrary, dirObj);
      //console.log("checking for npc: " + npc.title);
      if (npc && npc.inRoom == player.inRoom) {
        if (npc.talkable && !indirObj) {
          talkStep = 'talk' + npc.talk;
          player.talking = npc.ID;
          //make sure it exists, because sometimes it gets in a weird loop if it switches.
          if (npc[talkStep]) {
            npc[talkStep](npc);
          } else {
            talkStep = 'talk' + npc.nextTalk;
            npc[talkStep](npc);
          }
          //show unique actions if there are any. In case you left the conversation by direction and you're not on the right convo point to show.
          showUniqueActions();
          console.log("running talkStep: " + talkStep + " for " + npc.title);
        } else if (indirObj) {
          advanceTalkPosition(npc, indirObj);
          talkStep = 'talk' + npc.talk;
          player.talking = npc.ID;
          npc[talkStep](npc);
          console.log("force talkStep: " + talkStep + " for " + npc.title);
        } else {
          log("They don't want to talk right now.");
        }
      } else if (npc) {
        log("They're not here right now.");
      } else if (mob) {
        log("There's no reasoning with those monsters.");
      } else if (obj) {
        log("Are you feeling ok?");
      } else if (dirObj) {
        log("Can't find that person.");
      } else {
        log("Talk to whom?");
      }
    }
  },
  {
    entry: 'use',
    input: 'use',
    desc: "Uses an item in your inventory such as <w>use potion</w>, or an item nearby, such as <w>use lever</w>.",
    class: ['inv'],
    func: function(thisRoomIndex, dirObj, indirObj) {
      var inv = checkArray(invLibrary, dirObj);
      var obj = checkArray(roomObjLibrary, dirObj);
      if (dirObj && inv && inArray("picksume", inv.type) ) {
        if (inv.noBattle && battling) {
          log("Can't use that item in battle!", 'orange');
        } else {
          inv.func(thisRoomIndex, indirObj);
        }
      } else if (dirObj && inv) {
        log("Can't use that item right now.");
      } else if (dirObj && obj && inArray("statsume", obj.type)) {
        if (obj.noBattle && battling) {
          log("Can't use that while in battle!", 'orange');
        } else {
          obj.func(thisRoomIndex, indirObj);
        }
      } else if (dirObj && obj) {
        log("You can't find a use for that.");
      } else if (dirObj && !inv && !obj) {
        log("Can't find that.");
      }
    }
  },
  {
    entry: 'unequip',
    input: ['uneq', 'unequip', 'remove'],
    class: ['inv'],
    desc: "Unequips an equipped item. Equipping an item over another item in the same slot will automatically unequip the former item. Only unequip something if you'd rather have nothing equipped there.<br>Also see: <w>equip</w>",
    err: "Can't unequip that.",
    func: function (thisRoomIndex, dirObj) {
      var summon = checkArray(summonLibrary, dirObj);
      var inv = checkArray(invLibrary, dirObj);
      var obj = checkArray(objLibrary, dirObj);
      if (Number(dirObj)) {
        inv = checkArrayID(invLibrary, dirObj);
        summon = checkArrayID(summonLibrary, dirObj);
        obj = checkArrayID(objLibrary, dirObj);
      }
      if (dirObj && inv && inv.equipped) {
        var equipSlot = String(inv.eqSlot);
        inv.equipped = false;
        player[equipSlot] = false;
        player.atkVerb = player.baseAtkVerb;
        equipReset();
        if (!obj && summon) {
          removeInv(thisRoomIndex, inv);
          log(summon.unsummonDesc, 'info');
          player.atkTitle = player.baseAtkTitle;
        } else if (obj && inv) {
          log("You put " + inv.article + inv.title + " back in your inventory.", 'info');
        }
      } else if (dirObj && inv && !inv.equipped) {
        log("That isn't equipped right now.")
      } else if (dirObj && !inv) {
        log("Can't find that in your inventory.")
      } else {
        log("Unequip what?")
      }
    }
  },
  {
    entry: 'open',
    input: ['open', 'op', 'o'],
    class: ['nav', 'noBattle'],
    desc: 'Attempts to unlock and open a nearby area or item, such as <w>open south</w> or <w>open chest</w>. Only works if you have the right key or device.',
    func: function(thisRoomIndex, dirObj, indirObj) {
      log("Can't unlock that right now.");
    }
  },
  {
    entry: 'unlock',
    input: 'unlock',
    class: ['dev'],
    desc: 'Unlocks an skill or summon by entry name. <w>Unlock all</w> unlocks all skills and summons.',
    func: function(thisRoomIndex, dirObj, indirObj) {
      var sum = checkArray(summonLibrary, dirObj);
      var action = checkArray(actLibrary, dirObj);
      var recipe = checkArray(recipeLibrary, dirObj);
      var recipeID = checkArrayID(recipeLibrary, dirObj);

      if (dirObj == 'all') {
        $.each(summonLibrary, function() {
          unlockSummon(this.ID);
          //console.log("trying to unlock summon this.ID: " + this.ID)
        })
        $.each(actLibrary, function() {
          if (this.locked && $.isArray(this.input)) {
            //console.log("trying to unlock action this.input[0]: " + this.input[0])
            unlockAction(this.input[0]);
          } else if (this.locked) {
            //console.log("trying to unlock action this.input: " + this.input)
            unlockAction(this.input);
          }
        })
        $.each(recipeLibrary, function() {
          discoverRecipe(this.ID, 'hidden');
          //console.log("trying to unlock summon this.ID: " + this.ID)
        })
        log("Unlocked all actions, skills, recipes, and summons.");
      } else if (dirObj && dirObj != 'all' && (sum || action || recipe || recipeID) ) {
        if (sum) {
          unlockSummon(dirObj);
          log("Unlocked summon: " + sum.title);
        } else if (action) {
          unlockAction(dirObj);
          log("Unlocked action: " + action.entry);
        } else if (recipe || recipeID) {
          discoverRecipe(dirObj);
        }
      } else {
        log("Unlock what?");
      }
    }
  },

  /////////////////////////////////////////////
  /* ALCHEMY */
  /////////////////////////////////////////////

  {
    entry: 'lalc',
    input: ['lalc'],
    class: ['dev'],
    hidden: true,
    func: function(thisRoomIndex, dirObj, indirObj) {
      if (Object.keys(alcTable).length > 0) {
        log("On the alchemy table, you find:", 'white')
        log("Dispensers: ");
        $.each(alcTable.dispensers, function() {
          log(alcNiceChem(this), 'ul');
        });
        log("Glassware: ");
        $.each(alcTable.containers, function() {
          log(alcNiceName(this), 'ul');
        });
        log("Tools: ");
        $.each(alcTable.tools, function() {
          log(alcNiceName(this), 'ul');
        });
        log("Goal: ");
        $.each(alcTable.goal, function() {
          log(alcNiceChem(this), 'ul');
        });
      } else {
        log("There's no alchemy table here.");
      }
    }
  },

  {
    entry: 'alchemy',
    input: ['alchemy', 'al', 'alc', 'alch'],
    class: ['settings'],
    desc: "Type <w>alc</w> to review your journal on what you've discovered about alchemy.<br />Type <w>alc glass</w> to learn about the types of glassware.<br />Type <w>alc tools</w> to see the tools used in alchemy.<br />Type <w>alc commands</w> to review basic alchemy commands.",
    locked: false, //change to true when live. Unlocked later in the game
    func: function(thisRoomIndex, dirObj, indirObj) {
      if (dirObj == 'commands' || dirObj == 'command' || dirObj == 'comm' || dirObj == 'cmds' || dirObj == 'cmd' ) {
        log("Alchemy Basics:");
        $.each(actLibrary, function() {
          if ( inArray('alchemy', this.class) ) {
            log(this.entry + " <span class='info'> - " + this.desc + "</span>", "ul")
          }
        });

      } else if (dirObj == 'glass' || dirObj == 'glassware') {
        log("Alchemy Glassware:");
        $.each(alcGlasswareList, function() {
          log(this.title + " <span class='info'> - " + this.desc + "</span>", "ul")
        });

      } else if (dirObj == 'tools' || dirObj == 'tool') {
        log("Alchemy Tools:");
        $.each(alcToolList, function() {
          log(this.title + " <span class='info'> - " + this.desc + "</span>", "ul")
        });

      } else if (!dirObj) {
        var entries = [];

        $.each (alchemyJournal, function() {
          if (!this.locked) {
            entries.push(this.desc);
          }
        });

        if (entries.length > 0) {
          $.each(entries, function() {
            log(this, 'ul');
          });
        } else {
          log("You haven't discovered anything about alchemy yet.");
        }
      } else {
        log("What would you like to know about alchemy?");
      }
    }
  },
  {
    entry: 'dispense',
    input: ['dispense', 'dispens', 'disp', 'dis', 'fill'],
    class: ['alchemy'],
    desc: "Dispense a chemical to a piece of glassware, such as <w>disp estrum beaker</w>. You can specify between two states with <w>disp estrum gas beaker</w>.",
    func: function(thisRoomIndex, dirObj, indirObj, directAct, fullCommand) {
      var splitInput = fullCommand.split(" ");
      if (Object.keys(alcTable).length > 0 && !indirObj && alcTable.containers.length == 1) {
        //if they don't specify and there's only one, dispense there.
        indirObj = alcTable.containers[0].entry;
        splitInput[2] = indirObj;
      }
      var dispenser = alcCheckDispenser(dirObj, indirObj);
      var container = alcCheckContainer(splitInput);
      var thisContainer;
      if (container) {
        thisContainer = alcCheckContainer(container.entry); // disp estrum beaker
      }

      if (Object.keys(alcTable).length > 0) {
        if ( thisContainer && thisContainer.attr.includes('broken') ) {
          log("That " + alcNiceName(thisContainer, true) + " can't hold anything.");
        } else if (dispenser && container && thisContainer && thisContainer.contents.length < container.maxChems) {
          var newChem = new ContainerChem(dispenser.chem, dispenser.state);
          thisContainer.contents.push(newChem);
          log(dispenser.action + container.dispenseVerb + " a " + thisContainer.attr + " " + container.entry);
          alcCheckSpillage(newChem, thisContainer, container);
          //logProps(thisContainer.contents[0]);
        } else if (dispenser && container && thisContainer && thisContainer.contents.length >= container.maxChems) {
          log("That " + container.entry + " is full.");
        } else if (dispenser && !indirObj) {
          log("Dispense into what?");
        } else if (dispenser && !container) {
          log("Dispense into what container?");
        } else if (dispenser && !thisContainer) {
          log("Can't find that container.");
        } else if (dirObj) {
          log("Can't find that dispenser");
        } else {
          log("Dispense what?");
        }
      } else {
       log("There's no alchemy table here.");
      }
    }
  },
  {
    entry: 'transfer',
    input: ['transfer', 'trans', 'tran', 'tr', 'move', 'mix'],
    class: ['alchemy'],
    desc: "Transfer a chemical from one container to another, such as <w>trans estrum platter</w> or <w>mix estrum Besal</w>. Can also be used to transfer the entire contents from one container to another, such as <w>trans flask beaker</w>",
    func: function(thisRoomIndex, dirObj, indirObj, directAct, fullCommand) {
      var splitInput = fullCommand.split(" ");
      var chemDir = checkArray(alcChemicalList, dirObj, 'input');
      var chemIndir = checkArray(alcChemicalList, indirObj);
      var containerDir = checkArray(alcGlasswareList, dirObj, 'input'); // trans beaker platter
      var containerIndir = checkArray(alcGlasswareList, indirObj, 'input'); // trans beaker platter
      var sourceCont;
      var sourceChem;
      var targetCont;
      var thisTargetCont;
      var transferAll;

      // if the dirObj is a chemical
      if (chemDir) {
        sourceCont = alcCheckAllContents('container', chemDir.entry); // trans estrum beaker
        sourceChem = alcCheckContents('chem', sourceCont, chemDir.entry); // trans estrum beaker
      // else if it's a container
      } else if (containerDir) {
        sourceCont = alcCheckContainer(containerDir.entry) // trans beaker flask
        transferAll = true;
      }

      if (chemIndir) {
        thisTargetCont = alcCheckAllContents('container', chemIndir.entry); // trans beaker estrum
      } else if (containerIndir) {
        thisTargetCont = alcCheckContainer(containerIndir.entry); // trans estrum beaker
      }

      if (thisTargetCont) {
        targetCont = checkArray(alcGlasswareList, thisTargetCont.entry);
      }

      if (Object.keys(alcTable).length > 0) {
        if (sourceCont == thisTargetCont) {
          log("It's already there.");
        } else if (sourceCont && sourceChem && thisTargetCont && !transferAll && thisTargetCont.contents.length < targetCont.maxChems) {
          var niceTargetCont = alcNiceName(thisTargetCont, true);
          //var newChem = new ContainerChem(dispenser.chem, dispenser.state);
          thisTargetCont.contents.push(sourceChem);
          removeThis(sourceChem, sourceCont.contents, "removing " + sourceChem.chem + " from " + sourceCont.entry);
          log("You transfer " + sourceChem.chem + " to " + niceTargetCont);
          var spillage = alcCheckSpillage(sourceChem, thisTargetCont, targetCont);
          if (!spillage) {
            alcCheckReactions(thisTargetCont, targetCont, false);
          }
          //logProps(thisContainer.contents[0]);
        } else if (sourceCont && thisTargetCont && transferAll && (Array.isArray(sourceCont.contents) && sourceCont.contents.length) && thisTargetCont.contents.length + sourceCont.contents.length <= targetCont.maxChems) {
          var niceSourceCont = alcNiceName(sourceCont, true);
          var niceTargetCont = alcNiceName(thisTargetCont, true);
          var sourceAttr = " ";
          var targetAttr = " ";
          if (sourceCont.attr) {
            sourceAttr += sourceCont.attr + " ";
          }
          if (thisTargetCont.attr) {
            targetAttr += thisTargetCont.attr + " ";
          }
          log("You transfer the contents of the " + niceSourceCont + " to the " + niceTargetCont);
          //var newChem = new ContainerChem(dispenser.chem, dispenser.state);
          for (i = 0; i < sourceCont.contents.length; i++) {
            thisTargetCont.contents.push(sourceCont.contents[i]);
            var spillage = alcCheckSpillage(sourceCont.contents[i], thisTargetCont, targetCont);
            if (!spillage) {
              alcCheckReactions(thisTargetCont, targetCont, false);
            }
          }
          sourceCont.contents = [];
          console.log("emptying " + niceSourceCont);
          alcCheckReactions(thisTargetCont, targetCont, false);
          //logProps(thisContainer.contents[0]);
        } else if (sourceCont && thisTargetCont && transferAll && thisTargetCont.contents.length + sourceCont.contents.length > targetCont.maxChems) {
          console.log("sourceCont.contents.length: " + sourceCont.contents.length);
          console.log("thisTargetCont.contents.length: " + thisTargetCont.contents.length);
          log("The " + thisTargetCont.entry + " would overflow.");
        } else if (sourceCont && transferAll && sourceCont.contents.length < 1) {
          log("That container is empty.");
        } else if (sourceCont && !sourceChem) {
          log("Can't find that chemical to transfer.");
        } else if (sourceCont && sourceChem && thisTargetCont && thisTargetCont.contents.length > targetCont.maxChems ) {
          log("That " + targetCont.entry + " is full.");
        } else if (sourceCont && transferAll && thisTargetCont) {
          log("Transferring contents of " + sourceCont.entry + " to " + thisTargetCont.entry);
          //add multi-chem transfer here
        } else if (sourceCont && !thisTargetCont) {
          log("Transfer from " + sourceCont.entry + " to where?");
        } else {
          log("Transfer what?");
        }
      } else {
       log("There's no alchemy table here.");
      }
    }
  },
  {
    entry: 'heat',
    input: ['heat', 'burn', 'burner'],
    class: ['alchemy'],
    desc: "Use a burner to heat a chemical, such as <w>heat Estrum</w> or <w>heat beaker</w>.",
    func: function(thisRoomIndex, dirObj, indirObj, directAct, fullCommand) {
      var tableMatch = alcTableMatch(dirObj, indirObj, fullCommand, 'burner'); //this returns an array of the results.
      //order: chem, theseChems, container, thisContainer, niceContainer, thisTool
      var chem = tableMatch[0];
      var theseChems = tableMatch[1];
      var container = tableMatch[2];
      var thisContainer = tableMatch[3];
      var niceContainer = tableMatch[4];
      var thisTool = tableMatch[5];

      if (Object.keys(alcTable).length > 0) {
        if ( thisContainer && thisContainer.attr.includes('broken') ) {
          log("That broken " + niceContainer + " can't hold anything.");
        } else if (thisTool && thisContainer && theseChems && !(thisTool.uses <= 0) && !thisContainer.attr.includes('fragile') && !thisContainer.attr.includes('insulated') ) {
          log("You heat the " + niceContainer + " over the burner's flame.");
          if (thisTool.uses) {
            thisTool.uses--;
          }
          alcCheckReactions(thisContainer, container, 'heat');
        } else if (thisTool && thisContainer && theseChems && !(thisTool.uses <= 0) && thisContainer.attr.includes('fragile')) {
          log("The sudden change in temperature shatters the " + niceContainer + "!");
          thisContainer.attr = 'broken';
          alcDumpContainer(thisContainer, container);
        } else if (thisTool && thisContainer && theseChems && thisTool.uses <= 0) {
          log("The burner is out of fuel.");
        } else if (thisTool && thisContainer && theseChems && thisContainer.attr.includes('insulated')) {
          log("The " + niceContainer + "'s insulation protects it from the heat.");
        } else if (thisTool && thisContainer && !theseChems) {
          log("That doesn't have any chemicals to heat.");
        } else if (thisTool && chem && !thisContainer) {
          log("Can't find that chemical.");
        } else if (thisTool && container && !thisContainer) {
          log("Can't find that container.");
        } else if (!container) {
          log("Heat what?");
        } else {
          log("You don't have a burner right now.");
        }
      } else {
        log("There's no alchemy table here.");
      }
    }
  },
  {
    entry: 'chill',
    input: ['chill', 'cool', 'chiller'],
    class: ['alchemy'],
    desc: "Use a chiller to chill a chemical, such as <w>chill Estrum</w> or <w>chill beaker</w>.",
    func: function(thisRoomIndex, dirObj, indirObj, directAct, fullCommand) {
      var tableMatch = alcTableMatch(dirObj, indirObj, fullCommand, 'chiller'); //this returns an array of the results.
      //order: chem, theseChems, container, thisContainer, niceContainer, thisTool
      var chem = tableMatch[0];
      var theseChems = tableMatch[1];
      var container = tableMatch[2];
      var thisContainer = tableMatch[3];
      var niceContainer = tableMatch[4];
      var thisTool = tableMatch[5];

      if (Object.keys(alcTable).length > 0) {
        if ( thisContainer && thisContainer.attr.includes('broken') ) {
          log("That broken " + niceContainer + " can't hold anything.");
        } else if (thisTool && thisContainer && theseChems && !(thisTool.uses <= 0) && !thisContainer.attr.includes('fragile') && !thisContainer.attr.includes('insulated') ) {
          log("You chill the " + niceContainer + " in the cryo bath.");
          if (thisTool.uses) {
            thisTool.uses--;
          }
          alcCheckReactions(thisContainer, container, 'chill');
        } else if (thisTool && thisContainer && theseChems && !(thisTool.uses <= 0) && thisContainer.attr.includes('fragile')) {
          log("The sudden change in temperature shatters the " + niceContainer + "!");
          thisContainer.attr = 'broken';
          alcDumpContainer(thisContainer, container);
        } else if (thisTool && thisContainer && theseChems && thisTool.uses <= 0) {
          log("The chiller is no longer cold.");
        } else if (thisTool && thisContainer && theseChems && thisContainer.attr.includes('insulated')) {
          log("The " + niceContainer + "'s insulation protects it from the chill.");
        } else if (thisTool && thisContainer && !theseChems) {
          log("That doesn't have any chemicals to chill.");
        } else if (thisTool && chem && !thisContainer) {
          log("Can't find that chemical.");
        } else if (thisTool && container && !thisContainer) {
          log("Can't find that container.");
        } else if (!container) {
          log("Chill what?");
        } else {
          log("You don't have a chiller right now.");
        }
      } else {
        log("There's no alchemy table here.");
      }
    }
  },
  {
    entry: 'charge',
    input: ['charge', 'char', 'cha', 'ionize'],
    class: ['alchemy'],
    desc: "Use an ion charger to charge a chemical with electrons, such as <w>charge Estrum</w> or <w>charge beaker</w>.",
    func: function(thisRoomIndex, dirObj, indirObj, directAct, fullCommand) {
      var tableMatch = alcTableMatch(dirObj, indirObj, fullCommand, 'charger'); //this returns an array of the results.
      //order: chem, theseChems, container, thisContainer, niceContainer, thisTool
      var chem = tableMatch[0];
      var theseChems = tableMatch[1];
      var container = tableMatch[2];
      var thisContainer = tableMatch[3];
      var niceContainer = tableMatch[4];
      var thisTool = tableMatch[5];

      if (Object.keys(alcTable).length > 0) {
        if ( thisContainer && thisContainer.attr.includes('broken') ) {
          log("That broken " + niceContainer + " can't hold anything.");
        } else if (thisTool && thisContainer && theseChems && !(thisTool.uses <= 0) && !thisContainer.attr.includes('fragile') && !thisContainer.attr.includes('rubber') ) {
          log("You charge the " + niceContainer + " with raw electricity.");
          if (thisTool.uses) {
            thisTool.uses--;
          }
          alcCheckReactions(thisContainer, container, 'charge');
        } else if (thisTool && thisContainer && theseChems && !(thisTool.uses <= 0) && thisContainer.attr.includes('fragile')) {
          log("The shock shatters the " + niceContainer + "!");
          thisContainer.attr = 'broken';
          alcDumpContainer(thisContainer, container);
        } else if (thisTool && thisContainer && theseChems && thisTool.uses <= 0) {
          log("The charger is out of energy.");
        } else if (thisTool && thisContainer && theseChems && thisContainer.attr.includes('insulated')) {
          log("The " + niceContainer + "'s rubber insulates it from the charge.");
        } else if (thisTool && thisContainer && !theseChems) {
          log("That doesn't have any chemicals to charge.");
        } else if (thisTool && chem && !thisContainer) {
          log("Can't find that chemical.");
        } else if (thisTool && container && !thisContainer) {
          log("Can't find that container.");
        } else if (thisTool && !container) {
          log("Charge what?");
        } else {
          log("You don't have a charger right now.");
        }
      } else {
        log("There's no alchemy table here.");
      }
    }
  },
  {
    entry: 'discharge',
    input: ['discharge', 'dischar', 'disch', 'dis'],
    class: ['alchemy'],
    desc: "Use an ion discharger to discharge electricity from a chemical, such as <w>dis Estrum</w> or <w>dis beaker</w>.",
    func: function(thisRoomIndex, dirObj, indirObj, directAct, fullCommand) {
      var tableMatch = alcTableMatch(dirObj, indirObj, fullCommand, 'discharger'); //this returns an array of the results.
      //order: chem, theseChems, container, thisContainer, niceContainer, thisTool
      var chem = tableMatch[0];
      var theseChems = tableMatch[1];
      var container = tableMatch[2];
      var thisContainer = tableMatch[3];
      var niceContainer = tableMatch[4];
      var thisTool = tableMatch[5];

      if (Object.keys(alcTable).length > 0) {
        if ( thisContainer && thisContainer.attr.includes('broken') ) {
          log("That broken " + niceContainer + " can't hold anything.");
        } else if (thisTool && thisContainer && theseChems && !(thisTool.uses <= 0) && !thisContainer.attr.includes('fragile') && !thisContainer.attr.includes('rubber') ) {
          log("You discharge the " + niceContainer + " of its electricity.");
          if (thisTool.uses) {
            thisTool.uses--;
          }
          alcCheckReactions(thisContainer, container, 'discharge');
        } else if (thisTool && thisContainer && theseChems && !(thisTool.uses <= 0) && thisContainer.attr.includes('fragile')) {
          log("The shock shatters the " + niceContainer + "!");
          thisContainer.attr = 'broken';
          alcDumpContainer(thisContainer, container);
        } else if (thisTool && thisContainer && theseChems && thisTool.uses <= 0) {
          log("The discharger can't absorb any more electricity.");
        } else if (thisTool && thisContainer && theseChems && thisContainer.attr.includes('insulated')) {
          log("The " + niceContainer + "'s rubber insulates it from the discharge.");
        } else if (thisTool && thisContainer && !theseChems) {
          log("That doesn't have any chemicals to discharge.");
        } else if (thisTool && chem && !thisContainer) {
          log("Can't find that chemical.");
        } else if (thisTool && container && !thisContainer) {
          log("Can't find that container.");
        } else if (thisTool && !container) {
          log("Charge what?");
        } else {
          log("You don't have a discharger right now.");
        }
      } else {
        log("There's no alchemy table here.");
      }
    }
  },
  {
    entry: 'solve',
    input: ['solve', 'sol', 'complete', 'check'],
    class: ['alchemy'],
    desc: "Check your solution to see if you <w>solve</w>ed the puzzle.",
    func: function() {
      if (Object.keys(alcTable).length > 0) {
        alcCheckGoal();
      } else {
        log("There's no alchemy table here.");
      }
    }
  },
  {
    entry: 'set',
    input: ['set'],
    class: ['alchemy', 'dev'],
    desc: "set the alchemy table with a certain puzzle.",
    func: function(thisRoomIndex, dirObj, indirObj) {
      if (Number(dirObj)) {
        log("Setting the alchemy table for puzzle #" + dirObj);
        alcSetTable(Number(dirObj));
      } else {
        console.log("set which puzzle?");
        log("Huh?");
      }
    }
  },

  /////////////////////////////////////////////
  /* PLASMOID SKILLS */
  /////////////////////////////////////////////

  {
    entry: 'skills',
    input: ['skills', 'skill', 'sk'],
    class: ['settings'],
    desc: "Type <w>skills</w> to see a list of your skills and what they do.",
    locked: true,
    func: function() {
      log("Your current skills are:");
      $.each(actLibrary, function() {
        if (inArray('skill', this.class) && !this.locked) {
          log(this.title + " <span class='info'> - " + this.desc + "</span>", "ul")
        }
      });
    }
  },
  {
    entry: 'summon',
    input: ['summon', 'sum', 'sm'],
    class: ['summon', 'noBattle'],
    desc: "Type <w>summon</w> to see a list of weapons you can summon from the dark dimension.",
    locked: true,
    func: function(thisRoomIndex, dirObj, indirObj) {
      var sum = checkArray(summonLibrary, dirObj);
      var inv = checkArray(invLibrary, dirObj);
      if (!dirObj) {
        log("You know how to summon:");
        $.each(summonLibrary, function() {
          if (!this.locked) {
            log(this.title + " <span class='info'> - " + this.desc + "</span>", "ul")
          }
        });
        log("Type summon [weapon] to bring a weapon over from the dark dimension, such as <w>sum chrystus</w>.")
      } else if (dirObj && sum) {
        var ableToSummon = false;
        if (!sum.locked) {
          if (!inv) {
            addInv(sum, 1, sum.class);
            log(sum.summonDesc);
          }
          act('eq',dirObj);
        } else {
          log("You can't summon that yet.");
        }
      } else if (dirObj) {
        log("Summon what?");
      } else {
        log("Type <w>? summon</w> to get help.");
      }
    }
  },
  {
    entry: 'stun',
    title: 'Stun',
    input: ['stun'],
    class: ['battle', 'skill'],
    type: 'universal',
    desc: "Bash an enemy to delay its attack. Interrupts skills and breaks guard.",
    locked: true,
    interruptable: false,
    interrupter: true,
    guardBreak: true,
    startup: 0,
    skillWait: 7,
    atkWait: 0,
    numOfAtks: 1,
    dmgFactor: 2,
    target: 'single',
    hit: .9,
    purchaseCost: 1,
    plasmoidCost: 8,
    skill: true,
    atkVerb: 'bash',
    customLog: "You come down hard to stun the enemy!",
    func: function(thisRoomIndex, dirObj, indirObj, mob, thisMob) {
      //console.log("this.numOfAtks: " + this.numOfAtks);
      //console.log("thisMob: " + thisMob);
      if (mob && thisMob.living) {
        var ailment = {
          type: 'delay',
          hit: 1, // 100% to hit
          duration: 15, // delay for 15 ticks // attempt to afflict on the first attack
        }
        //console.log("trying to fire a skill...");
        addSkillQueue(this, 'player', ailment)
      }
    }
  },
  {
    entry: 'eye',
    title: 'Eye on the Prize',
    input: ['eye'],
    class: ['battle', 'skill'],
    type: 'universal',
    desc: 'Mark an enemy. That enemy yields more Plasmoid, XP, and has higher drop rates for items and health.',
    locked: true,
    interruptable: false,
    interrupter: false,
    guardBreak: false,
    startup: 0,
    skillWait: 4,
    atkWait: 0,
    numOfAtks: 1,
    dmgFactor: 0,
    target: 'single',
    hit: 1,
    purchaseCost: 0,
    plasmoidCost: 0,
    skill: true,
    customLog: "!",
    func: function(thisRoomIndex, dirObj, indirObj, mob, thisMob) {
      if (mob && thisMob.living) {
        addSkillQueue(this, 'player');
      }
    }
  },
  {
    entry: 'roar',
    title: 'Roar',
    input: ['roar'],
    class: ['battle', 'skill'],
    type: 'universal',
    desc: 'Causes weaker enemies to disengage from battle. Interrupts skills.',
    locked: true,
    interruptable: false,
    interrupter: true,
    guardBreak: false,
    startup: 0,
    skillWait: 4,
    atkWait: 4,
    numOfAtks: 1,
    dmgFactor: 0,
    target: 'all',
    hit: .7,
    purchaseCost: 0,
    plasmoidCost: 0,
    skill: true,
    customLog: "!",
    func: function(thisRoomIndex, dirObj, indirObj, mob, thisMob) {
      if (mob && thisMob.living) {
        addSkillQueue(this, 'player');
        //this is where I'd make enemies flee...
      }
    }
  },
  {
    entry: 'taunt',
    title: 'Taunt',
    input: ['taunt'],
    class: ['battle', 'skill'],
    type: 'universal',
    desc: 'Berserk and taunt all enemies to attack you at once.',
    locked: true,
    interruptable: false,
    interrupter: false,
    guardBreak: false,
    startup: 0,
    skillWait: 7,
    atkWait: 0,
    numOfAtks: 1,
    dmgFactor: 0,
    target: 'room',
    hit: 1,
    purchaseCost: 0,
    plasmoidCost: 0,
    skill: true,
    customLog: "!",
    func: function(thisRoomIndex, dirObj, indirObj, mob, thisMob) {
      if (mob && thisMob.living) {
        var ailment = {
          type: 'berserk',
          hit: .9,
        }
        addSkillQueue(this, 'player', ailment);
        //this is where I'd cause all enemies in the room to attack...
      }
    }
  },
  {
    entry: 'countdown',
    title: 'Countdown',
    input: ['countdown', 'count', 'down'],
    class: ['battle', 'skill'],
    type: 'universal',
    desc: 'Put one enemy to death after a short time. Strong enemies will often resist it.',
    locked: true,
    interruptable: false,
    interrupter: false,
    guardBreak: false,
    startup: 0,
    skillWait: 4,
    atkWait: 4,
    numOfAtks: 1,
    dmgFactor: 1,
    target: 'single',
    hit: .3,
    purchaseCost: 0,
    plasmoidCost: 0,
    skill: true,
    customLog: "!",
    func: function(thisRoomIndex, dirObj, indirObj, mob, thisMob) {
      if (mob && thisMob.living) {
        addSkillQueue(this, 'player');
      }
    }
  },
  {
    entry: 'flurry',
    title: 'Flurry of Blows',
    input: ['flurry'],
    class: ['battle', 'skill'],
    type: 'dual blade',
    desc: 'Deal a flurry of attacks in rapid succession to a single enemy. Interrupts skills.',
    locked: true,
    interruptable: false,
    interrupter: true,
    guardBreak: false,
    startup: 0,
    skillWait: 14,
    atkWait: 6,
    numOfAtks: 6,
    dmgFactor: 1,
    target: 'single',
    hit: .9,
    purchaseCost: 0,
    plasmoidCost: 12,
    skill: true,
    atkVerb: 'slice',
    customLog: "You unleash a flurry of attacks on your enemy!",
    func: function(thisRoomIndex, dirObj, indirObj, mob, thisMob) {
      if (mob && thisMob.living) {
        addSkillQueue(this, 'player');
      }
    }
  },
  {
    entry: 'skewer',
    title: 'Skewer',
    input: ['skewer'],
    class: ['battle', 'skill'],
    type: 'dual blade',
    desc: 'Deal massive damage to a single enemy. Can cause bleeding.',
    locked: true,
    interruptable: true,
    interrupter: false,
    guardBreak: false,
    startup: 6,
    skillWait: 12,
    atkWait: 4,
    numOfAtks: 1,
    dmgFactor: 1,
    target: 'single',
    hit: 1,
    purchaseCost: 0,
    plasmoidCost: 14,
    skill: true,
    atkVerb: 'skewer',
    customLog: "You extend your blade to skewer the enemy!",
    func: function(thisRoomIndex, dirObj, indirObj, mob, thisMob) {
      if (mob && thisMob.living) {
        var ailment = {
          type: 'bleed',
          hit: .25,
        }
        addSkillQueue(this, 'player', ailment);
      }
    }
  },
  {
    entry: 'rush',
    title: 'Rush',
    input: ['rush'],
    class: ['battle', 'skill'],
    type: 'dual blade',
    desc: 'Rush at the enemy, breaking their guard. Interrupts skills.',
    locked: true,
    interruptable: false,
    interrupter: true,
    guardBreak: true,
    startup: 0,
    skillWait: 10,
    atkWait: 7,
    numOfAtks: 2,
    dmgFactor: 2.5,
    target: 'single',
    hit: .9,
    purchaseCost: 0,
    plasmoidCost: 0,
    skill: true,
    customLog: "!",
    func: function(thisRoomIndex, dirObj, indirObj, mob, thisMob) {
      if (mob && thisMob.living) {
        addSkillQueue(this, 'player');
      }
    }
  },
  {
    entry: 'pestilence',
    title: 'Pestilence',
    input: ['pestilence', 'pest'],
    class: ['battle', 'skill'],
    type: 'dual blade',
    desc: 'Rapidly strike an enemy and inflict status ailments (stun, bleed, berserk, confuse).',
    locked: true,
    interruptable: true,
    interrupter: false,
    guardBreak: false,
    startup: 7,
    skillWait: 7,
    atkWait: 0,
    numOfAtks: 4,
    dmgFactor: 1.5,
    target: 'single',
    hit: .9,
    purchaseCost: 0,
    plasmoidCost: 0,
    skill: true,
    customLog: "!",
    func: function(thisRoomIndex, dirObj, indirObj, mob, thisMob) {
      if (mob && thisMob.living) {
        var ailments = [
          {
            type: 'delay',
            hit: .5,
            duration: 15,
            afflictOn: 1, // attempt to afflict on the first attack
          },
          {
            type: 'bleed',
            hit: .5,
            afflictOn: 2, // attempt to afflict on the second attack
          },
          {
            type: 'berserk',
            hit: .5,
            afflictOn: 3,
          },
          {
            type: 'confuse',
            hit: .5,
            afflictOn: 4,
          },
        ]
        addSkillQueue(this, 'player', ailments);
      }
    }
  },
  {
    entry: 'whirlwind',
    title: 'Whirlwind',
    input: ['whirlwind', 'whirl', 'wind'],
    class: ['battle', 'skill'],
    type: 'dual blade',
    desc: 'Charge up a vicious whirlwind. Stun an confuse all enemies.',
    locked: true,
    interruptable: true,
    interrupter: false,
    guardBreak: false,
    startup: 10,
    skillWait: 4,
    atkWait: 4,
    numOfAtks: 1,
    dmgFactor: 4,
    target: 'engaged',
    hit: .9,
    purchaseCost: 0,
    plasmoidCost: 0,
    skill: true,
    customLog: "!",
    func: function(thisRoomIndex, dirObj, indirObj, mob, thisMob) {
      if (mob && thisMob.living) {
        var ailments = [
          {
            type: 'delay',
            hit: .75,
            duration: 15,
          },
          {
            type: 'confuse',
            hit: .5,
          },
        ]
        addSkillQueue(this, 'player', ailments);
      }
    }
  },
  {
    entry: 'duel',
    title: 'Duel',
    input: ['duel'],
    class: ['battle', 'skill'],
    type: 'dual blade',
    desc: 'Forego attacking to enter a countering stance. The next successful parry deals massive damage with a chance for instant kill.',
    locked: true,
    interruptable: false,
    interrupter: true,
    guardBreak: true,
    startup: 0,
    skillWait: 15,
    atkWait: 15,
    numOfAtks: 1,
    dmgFactor: 12,
    target: 'single',
    hit: 1,
    purchaseCost: 0,
    plasmoidCost: 0,
    skill: true,
    customLog: "!",
    func: function(thisRoomIndex, dirObj, indirObj, mob, thisMob) {
      if (mob && thisMob.living) {
        addSkillQueue(this, 'player');
      }
    }
  },
  {
    entry: 'double slice',
    title: 'Double Slice',
    input: ['double'],
    class: ['battle', 'skill'],
    type: 'light blade',
    desc: 'Quickly strike twice. Interrupts skills.',
    locked: true,
    interruptable: false,
    interrupter: true,
    guardBreak: false,
    startup: 0,
    skillWait: 9,
    atkWait: 4,
    numOfAtks: 2,
    dmgFactor: 3,
    target: 'single',
    hit: .9,
    purchaseCost: 0,
    plasmoidCost: 0,
    skill: true,
    customLog: "You unleash two vicious strikes!",
    func: function(thisRoomIndex, dirObj, indirObj, mob, thisMob) {
      if (mob && thisMob.living) {
        addSkillQueue(this, 'player');
      }
    }
  },
  {
    entry: 'dash',
    title: 'Dash',
    input: ['dash'],
    class: ['battle', 'skill'],
    type: 'light blade',
    desc: 'Dash forward, striking each attacking enemy.',
    locked: true,
    interruptable: true,
    interrupter: false,
    guardBreak: false,
    startup: 7,
    skillWait: 9,
    atkWait: 7,
    numOfAtks: 1,
    dmgFactor: 3.5,
    target: 'engaged',
    hit: .9,
    purchaseCost: 0,
    plasmoidCost: 0,
    skill: true,
    customLog: "!",
    func: function(thisRoomIndex, dirObj, indirObj, mob, thisMob) {
      if (mob && thisMob.living) {
        addSkillQueue(this, 'player');
      }
    }
  },
  {
    entry: 'drive',
    title: 'Drive',
    input: ['drive'],
    class: ['battle', 'skill'],
    type: 'light blade',
    desc: 'Finds the gaps in their armor and drives your blade home. Can cause bleeding. Breaks guard.',
    locked: true,
    interruptable: false,
    interrupter: false,
    guardBreak: true,
    startup: 6,
    skillWait: 12,
    atkWait: 4,
    numOfAtks: 1,
    dmgFactor: 8,
    target: 'single',
    hit: .9,
    purchaseCost: 0,
    plasmoidCost: 0,
    skill: true,
    customLog: "!",
    func: function(thisRoomIndex, dirObj, indirObj, mob, thisMob) {
      if (mob && thisMob.living) {
        var ailment = {
          type: 'bleed',
          hit: .25,
        }
        addSkillQueue(this, 'player', ailment);
      }
    }
  },
  {
    entry: 'siphon',
    title: 'Siphon',
    input: ['siphon'],
    class: ['battle', 'skill'],
    type: 'light blade',
    desc: 'Strike in a large radius, recovering Plasmoid for each enemy hit.',
    locked: true,
    interruptable: true,
    interrupter: false,
    guardBreak: false,
    startup: 7,
    skillWait: 7,
    atkWait: 5,
    numOfAtks: 2,
    dmgFactor: 1.25,
    target: 'engaged',
    hit: .9,
    purchaseCost: 0,
    plasmoidCost: 0,
    skill: true,
    customLog: "!",
    func: function(thisRoomIndex, dirObj, indirObj, mob, thisMob) {
      if (mob && thisMob.living) {
        addSkillQueue(this, 'player');
      }
    }
  },
  {
    entry: 'quake',
    title: 'Quake',
    input: ['quake'],
    class: ['battle', 'skill'],
    type: 'light blade',
    desc: 'Send a shockwave that stuns enemies. Interrupts skills.',
    locked: true,
    interruptable: false,
    interrupter: true,
    guardBreak: false,
    startup: 5,
    skillWait: 7,
    atkWait: 0,
    numOfAtks: 1,
    dmgFactor: 5,
    target: 'engaged',
    hit: .9,
    purchaseCost: 0,
    plasmoidCost: 0,
    skill: true,
    customLog: "!",
    func: function(thisRoomIndex, dirObj, indirObj, mob, thisMob) {
      if (mob && thisMob.living) {
        var ailment = {
          type: 'delay',
          hit: 1,
          duration: 15,
        }
        addSkillQueue(this, 'player', ailment);
      }
    }
  },
  {
    entry: 'rift',
    title: 'Rift',
    input: ['rift'],
    class: ['battle', 'skill'],
    type: 'light blade',
    desc: 'Charge up a trans-dimensional strike on a single foe. Interrupts skills and breaks guard.',
    locked: true,
    interruptable: false,
    interrupter: true,
    guardBreak: true,
    startup: 12,
    skillWait: 10,
    atkWait: 9,
    numOfAtks: 1,
    dmgFactor: 15,
    target: 'single',
    hit: .9,
    purchaseCost: 0,
    plasmoidCost: 0,
    skill: true,
    customLog: "!",
    func: function(thisRoomIndex, dirObj, indirObj, mob, thisMob) {
      if (mob && thisMob.living) {
        addSkillQueue(this, 'player');
      }
    }
  },
  {
    entry: 'break',
    title: 'Break',
    input: ['break'],
    class: ['battle', 'skill'],
    type: 'heavy blade',
    desc: 'A wide swing that breaks enemy guard and interrupts skills.',
    locked: true,
    interruptable: false,
    interrupter: true,
    guardBreak: true,
    startup: 9,
    skillWait: 7,
    atkWait: 5,
    numOfAtks: 1,
    dmgFactor: 4,
    target: 'engaged',
    hit: .9,
    purchaseCost: 0,
    plasmoidCost: 0,
    skill: true,
    customLog: "!",
    func: function(thisRoomIndex, dirObj, indirObj, mob, thisMob) {
      if (mob && thisMob.living) {
        addSkillQueue(this, 'player');
      }
    }
  },
  {
    entry: 'bloodlust',
    title: 'Bloodlust',
    input: ['bloodlust', 'blood', 'lust', 'bl'],
    class: ['battle', 'skill'],
    type: 'heavy blade',
    desc: 'Every creature you defeat raises your attack for a short time. Each kill stacks and extends the duration of this skill.',
    locked: true,
    interruptable: false,
    interrupter: false,
    guardBreak: false,
    startup: 0,
    skillWait: 9,
    atkWait: 0,
    numOfAtks: 1,
    dmgFactor: 0,
    target: 'self',
    hit: .9,
    purchaseCost: 0,
    plasmoidCost: 0,
    skill: true,
    customLog: "!",
    func: function(thisRoomIndex, dirObj, indirObj, mob, thisMob) {
      if (mob && thisMob.living) {
        addSkillQueue(this, 'player');
      }
    }
  },
  {
    entry: 'skull splitter',
    title: 'Skull Splitter',
    input: ['skullsplitter', 'skull', 'split', 'splitter'],
    class: ['battle', 'skill'],
    type: 'heavy blade',
    desc: 'Devastate a single enemy. Can cause bleeding. Interrupts skills.',
    locked: true,
    interruptable: true,
    interrupter: true,
    guardBreak: false,
    startup: 9,
    skillWait: 9,
    atkWait: 7,
    numOfAtks: 1,
    dmgFactor: 9,
    target: 'single',
    hit: .9,
    purchaseCost: 0,
    plasmoidCost: 0,
    skill: true,
    customLog: "!",
    func: function(thisRoomIndex, dirObj, indirObj, mob, thisMob) {
      if (mob && thisMob.living) {
        var ailment = {
          type: 'bleed',
          hit: .25,
        }
        addSkillQueue(this, 'player', ailment);
      }
    }
  },
  {
    entry: 'shockwave',
    title: 'Shockwave',
    input: ['shockwave', 'shock', 'wave'],
    class: ['battle', 'skill'],
    type: 'heavy blade',
    desc: 'Slam the ground to damage and confuse all enemies.',
    locked: true,
    interruptable: false,
    interrupter: false,
    guardBreak: false,
    startup: 12,
    skillWait: 9,
    atkWait: 5,
    numOfAtks: 1,
    dmgFactor: 4.5,
    target: 'engaged',
    hit: .9,
    purchaseCost: 0,
    plasmoidCost: 0,
    skill: true,
    customLog: "!",
    func: function(thisRoomIndex, dirObj, indirObj, mob, thisMob) {
      if (mob && thisMob.living) {
        var ailment = {
          type: 'confuse',
          hit: .75,
        }
        addSkillQueue(this, 'player', ailment);
      }
    }
  },
  {
    entry: 'shoulder charge',
    title: 'Shoulder Charge',
    input: ['shoulder', 'charge', 'shoulder charge'],
    class: ['battle', 'skill'],
    type: 'heavy blade',
    desc: 'Charge into the enemy and strike with a powerful blow. Stuns, interrupts skills, and breaks guard.',
    locked: true,
    interruptable: false,
    interrupter: true,
    guardBreak: true,
    startup: 0,
    skillWait: 15,
    atkWait: 15,
    numOfAtks: 1,
    dmgFactor: 12,
    target: 'single',
    hit: .9,
    purchaseCost: 0,
    plasmoidCost: 0,
    skill: true,
    customLog: "!",
    func: function(thisRoomIndex, dirObj, indirObj, mob, thisMob) {
      if (mob && thisMob.living) {
        var ailment = {
          type: 'delay',
          hit: 1,
          duration: 15,
        }
        addSkillQueue(this, 'player', ailment);
      }
    }
  },
  {
    entry: 'shatter',
    title: 'Shatter',
    input: ['shatter'],
    class: ['battle', 'skill'],
    type: 'heavy blade',
    desc: 'Charge up 3 earth-shattering blows that crush all enemies in your path.',
    locked: true,
    interruptable: false,
    interrupter: true,
    guardBreak: true,
    startup: 25,
    skillWait: 12,
    atkWait: 7,
    numOfAtks: 3,
    dmgFactor: 4,
    target: 'engaged',
    hit: .9,
    purchaseCost: 0,
    plasmoidCost: 0,
    skill: true,
    customLog: "!",
    func: function(thisRoomIndex, dirObj, indirObj, mob, thisMob) {
      if (mob && thisMob.living) {
        addSkillQueue(this, 'player');
      }
    }
  },

  /////////////////////////////////////////////
  /* EASTER EGGS */
  /////////////////////////////////////////////

  {
    entry: 'ok',
    title: 'OK',
    input: ['ok', 'ok?', 'ok!'],
    hidden: true,
    func: function() {
      log("ok!");
    }
  },
  {
    entry: 'dip the toast',
    title: 'Dip the Toast',
    input: ['dip the toast'],
    hidden: true,
    func: function() {
      log("Consider it dipped!");
    }
  }
];

/////////////////////////////////////////////
/* Error library */
/////////////////////////////////////////////

let errLibrary = [
  "What do you mean?",
  "Huh?",
  "I don't understand",
  "I don't get it",
  "Say that again?",
  "Wait, what?",
  "Is that a typo?",
]
