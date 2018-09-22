//settings
let playTimer;
let battleSpeed = 200; //milliseconds per round, default: 200
let endBattleDelay = 3000; // milliseconds that battle stats hang around after battle ends, default: 3000
let playerWait = 0;
let startedBy = false;
let saveGameNum = false;
let focusAction = false;

let turn;
let battling = false;
let battleTimer;
let aggroTimer;
let currentTarget; //copy of thisMob
let commands = "";
let $log = $('.log');
let $logInner = $('.log-inner');
let $console = $('.console');
let roomLoot; //string descriptions of loot
let roomExits; //string of room exits
let currentRoom; //ID of the player's current room
let thisRoomIndex; //index of the currentRoom inside the roomLibrary array
let thisMob; //object of the current mob inside currentRoom
let theseMobs; //array of the mobs in the current room and their stats
let battlingMobs = []; //array of the thisMob.instanceID currently in battle
let thisInstanceID;
let currentInstance = 1000; //a unique integer assigned to each mob as they spawn
let mobWrapper = '<div id="" class="mob-wrapper"><div class="wait-bar"></div><div class="hit-bar"></div><div class="gethit-bar"></div><div class="guard-bar"></div></div>';

//all the past things you've typed
let consoleLibrary = [];
let consolePos = false;

//blank array that will be populated with items whenever a room is set or reset
let roomObjLibrary = [];

/////////////////////////////////////////////
/* INVENTORY & CRAFTING */
/////////////////////////////////////////////

function addInv(obj, qty, itemClass) {
  var craftingBag
  //this is for regerating the crafting bag on load
  if (invLibrary.length > 0) {
    craftingBag = invLibrary[0].contents;
  }
  //you can use just the item ID as shorthand. here's the interpreter.
  if ( Number(obj) && obj <= 401 ) {
    obj = checkArrayID(objLibrary, obj);
  } else if ( Number(obj) && obj >= 500 ) {
    obj = checkArrayID(recipeLibrary, obj);
  } else if ( Number(obj) ) {
    obj = checkArrayID(summonLibrary, obj);
  }
  //put the item class in there if it's not specified
  if (!itemClass) {
    itemClass = obj.class;
  }
  //default to 1 of each thing
  if (!qty) {
    qty = 1;
  } else {
    qty = Number(qty);
  }
  //if it's a crafting item, add it to the crafting bag
  if ( inArray('craft', obj.type) ) {
    var itemInBag = checkArrayID(craftingBag, obj.ID)
    var addQty = qty * obj.defaultQty;
    if (itemInBag) {
      itemInBag.qty += addQty;
    } else if (!itemInBag) {
      craftingBag.push({'ID': obj.ID, 'qty': addQty});
    }
  } else {
    var inInv = checkArrayID(invLibrary, obj.ID);
    if (inInv) {
      //console.log(obj.title + " is in your inv already");
      inInv.qty += qty;
    } else {
      //console.log("putting a new " + obj.title + " in your inv");
      //put 1 new version in the bag!
      invLibrary.push(obj);
      checkArrayID(invLibrary, obj.ID).qty = 1;
      //if there are more, then add the rest
      if (qty > 1) {
        addInv(obj, qty-1, itemClass);
      }
    }
    if (itemClass == 'quest' || itemClass == 'unique') {
      log("You receive " + obj.article + obj.title, 'white loot');
    }
  }
  checkCollectQuests();
}

function addObj(thisRoomIndex, obj) {
  roomObjLibrary.push(obj);
  roomLibrary[thisRoomIndex].cont.push(obj.ID);
}

function removeInv(thisRoomIndex, inv, qty) {
  var inInv = checkArrayID(invLibrary, inv.ID);
  //default to 1 of each thing
  if (!qty) {
    qty = 1;
  } else {
    qty = Number(qty);
  }
  if (inInv && inInv.qty > 1) {
    //console.log("you had more than one " + inv.entry + " in your inv");
    inInv.qty -= qty;
  } else if ( inInv && (inInv.qty <= 1 || qty == 'all') ) {
    removeThis(inv, invLibrary, "removing your last " + inv.entry + " from inv");
  } else {
    console.log("can't find " + inv.entry + " to remove from inv!");
  }
  checkCollectQuests();
}

function removeObj(thisRoomIndex, obj) {
  //because you can't do indexOf inside an array inside an array, copy the inner array to a temp
  removeThis(obj.ID, roomLibrary[thisRoomIndex].cont, "removing item from the room");
  roomReset();
}

function craft(recipe, qty, removeIngreds, craftingBag) {
  var craftingBag = invLibrary[0].contents;
  addInv(recipe, qty, false);
  removeMaterials(removeIngreds, craftingBag);
}

function removeMaterials(removeIngreds, craftingBag) {
  $.each(removeIngreds, function() {
    var inBag = checkArrayID(craftingBag, this.ingred);
    inBag.qty -= this.qty;
    console.log('removing ' + this.qty + " from " + inBag.ID);
  });
}

function discoverRecipe(entry, hidden) {
  var recipe = checkArrayID(recipeLibrary, entry);
  if (!recipe) {
    recipe = checkArray(recipeLibrary, recipeID);
  }
  var recipeID = recipe.ID;
  if ( recipe && !inArray(recipeID, knownRecipes) ) {
    knownRecipes.push( Number(recipeID) );
    if (!hidden) {
      log("You learned how to craft " + recipe.title + "!", 'craft');
    } else {
      console.log("You learned how to craft " + recipe.title);
    }
  } else if (recipe) {
    if (!hidden) {
      log("You already knew how to craft " + recipe.title + ".");
    } else {
      console.log("You already knew how to craft " + recipe.title);
    }
  } else {
    console.log("Can't find recipeID: " + recipeID);
  }
}

/////////////////////////////////////////
/* LOGS */
/////////////////////////////////////////

function logHealth() {
  var currentHP = parseInt(player.HP);
  var currentHPString = currentHP;
  var maxHP = parseInt(player.baseHP);
  if (player.stHPMax) {
    currentHPString += '</span>/<span class="info">' + maxHP;
  }
  if (currentHP >= maxHP * .85) {
    log("You are in great health" + ' (<span class="green">' + currentHPString + "</span>)", 'stats');
  } else if (currentHP >= maxHP * .6) {
    log("You have a few cuts and bruises" + ' (<span class="yellow">' + currentHPString + "</span>)", 'stats');
  } else if (currentHP >= maxHP * .2) {
    log("You need medical attention" + ' (<o>' + currentHPString + "</o>)", 'stats');
  } else {
    log("You don't have much longer to live" + ' (<span class="red">' + currentHPString + "</span>)", 'stats');
  }
}

function logPlasmoid() {
  var currentPlasmoid = player.plasmoid;
  var maxPlasmoid = player.basePlasmoid;
  var currentPlasmoidLog;
  if (player.plasmoidEnabled) {
    currentPlasmoidLog = ' (<span class="plasmoid">' + currentPlasmoid + "</span>";
    if (player.stPlasmoidMax) {
      currentPlasmoidLog += '</span>/<span class="info">' + maxPlasmoid;
    }
    currentPlasmoidLog += ")";
    if (currentPlasmoid >= maxPlasmoid * .9) {
      log("You feel powerful" + currentPlasmoidLog, 'stats');
    } else if (currentPlasmoid >= maxPlasmoid * .5) {
      log("You've used up some plasmoid" + currentPlasmoidLog, 'stats');
    } else if (currentPlasmoid >= maxPlasmoid * .3) {
      log("You should refill on plasmoid" + currentPlasmoidLog, 'stats');
    } else if (currentPlasmoid > 0) {
      log("You're almost out of plasmoid" + currentPlasmoidLog, 'stats');
    } else {
      log("You're out of plasmoid" + ' (<span class="red">' + currentPlasmoid + "</span>)", 'stats');
    }
  } else {
    console.log("Plasmoid is disabled");
  }
}

function logDmg() {
  var color;
  var speed = " " + tickTranslator[player.atkSpd];
  if (player.atkSpd <= 7) {
    color = 'green';
  } else if (player.atkSpd >= 12) {
    color = 'red';
  } else {
    color = 'orange';
  }
  if (!tickTranslator[player.atkSpd]) {
    speed = "";
  }
  //var atkSpd = Math.round(player.atkSpd/(1000/battleSpeed));
  log("You deal <span class='dmg'>" + player.dmgMin + "</span> to <span class='dmg'>" + player.dmgMax + "</span> damage<span class='" + color + "'>" + speed + "</span>.", 'stats');
}

function logHit() {
  var hit = player.hit;
  if (hit > .85) {
    log("You almost <span class='green'>always</span> hit your target.", 'stats');
  } else if (hit > .7) {
    log("You hit your target <span class='yellow'>most</span> of the time.", 'stats');
  } else if (hit > .5) {
    log("You hit your target about <o>half</o> the time.", 'stats');
  } else if (hit > .35) {
    log("You have a <span class='red'>hard time</span> hitting your target.", 'stats');
  }
}

function logEquip() {
  var equippedItems = 0;
  $.each(equipList, function() {
    if (player[this]) {
      var equipment = checkArrayID(summonLibrary, player[this]);
      if (!equipment) {
        equipment = checkArrayID(objLibrary, player[this]);
      }
      //capitalize the first letter
      log( translator[this].substr(0,1).toUpperCase() + translator[this].substr(1) + ": " + equipment.title, 'stats');
      equippedItems += 1;
    }
  });
  if (!equippedItems) {
    log("You don't have anything equipped.", 'stats');
  }
}

function logBuffs(target) {
  if (!target) {
    target = 'player';
  }
  if (target = 'player') {
    if (player.buffs.length > 0) {
      log("Status Effects:");
      $.each(player.buffs, function() {
        var thisLog = this.title + '<span class="info"> - ' + this.desc;
        if (this.uses) {
          thisLog += ' (' + this.uses + ' uses)'
        } else if (this.duration) {
          thisLog += ' (' + this.duration + ' duration)'
        }
        thisLog += '</span>';
        log(thisLog, 'ul');
      });
    }
  }
}

function logLevel() {
  if (player.stLevel) {
    log("Level " + player.level, 'white');
  }
}

function logXP() {
  var message = "You've amassed <o>" + player.XP + "</o>";
  if (player.stXPNext) {
    message += " / " + player.nextXP;
  }
  message += " experience.";
  log(message);
}

function logProps(object) {
  $.each(object, function(prop) {
    console.log(prop + ": " + this);
  })
}

/////////////////////////////////////////////
/* NAVIGATION */
/////////////////////////////////////////////

function addDoorAction(doorObj) {
  var thisRoom = checkArrayID(roomLibrary, player.inRoom);
  //check the exits
  if (doorObj.state == 'closed') {
    var tempDesc;
    var tempVerb;
    var tempClass = "";
    tempVerb = doorObj.openVerb;
    if (doorObj.openable) {
      tempDesc = doorObj.openDesc;
      tempClass = 'yellow';
    } else if (!doorObj.openable && doorObj.descOpenErr) {
      tempDesc = doorObj.descOpenErr;
    } else {
      console.log("something's missing in the door description.");
    }
    addUniqueAction({
      entry: [ tempVerb, tempVerb + " " + doorObj.entry[0] ],
      onlyInRoom: Number(thisRoom.ID),
      once: true, //change this and a few other things to allow multiple door opens
      hidden: true,
      func: function() {
        log(tempDesc, tempClass);
        if (doorObj.openable) {
          if (doorObj.exitN) {
            thisRoom.exitN = doorObj.exitN;
            console.log("opened an exit to the north.");
          }
          if (doorObj.exitS) {
            thisRoom.exitS = doorObj.exitS;
            console.log("opened an exit to the south.");
          }
          if (doorObj.exitE) {
            thisRoom.exitE = doorObj.exitE;
            console.log("opened an exit to the east.");
          }
          if (doorObj.exitW) {
            thisRoom.exitW = doorObj.exitW;
            console.log("opened an exit to the west.");
          }
        }
        doorObj.state = 'open';
      }
    });
  } else if (doorObj.state == 'open') {
    var tempDesc;
    var tempVerb;
    var tempClass = "";
    tempVerb = doorObj.closeVerb;
    if (doorObj.closable) {
      tempDesc = doorObj.closeDesc;
      tempClass = 'yellow';
    } else if (!doorObj.closable && doorObj.descCloseErr) {
      tempDesc = doorObj.descCloseErr;
    } else {
      console.log("something's missing in the door description.");
    }
    addUniqueAction({
      entry: [ tempVerb, tempVerb + " " + doorObj.entry[0] ],
      onlyInRoom: thisRoom.ID,
      once: true, //change this and a few other things to allow multiple door opens
      hidden: true,
      func: function() {
        log(tempDesc, tempClass);
        if (doorObj.closable) {
          if (doorObj.exitN) {
            thisRoom.exitN = false;
            console.log("closed an exit to the north.");
          }
          if (doorObj.exitS) {
            thisRoom.exitS = false;
            console.log("closed an exit to the south.");
          }
          if (doorObj.exitE) {
            thisRoom.exitE = false;
            console.log("closed an exit to the east.");
          }
          if (doorObj.exitW) {
            thisRoom.exitW = false;
            console.log("closed an exit to the west.");
          }
        }
        doorObj.state = 'closed';
      }
    });
  }
}

function qLogAdd(qLogObject) {
  var duplicate = false;
  $.each(qLogObject.array, function() {
    if (this.ID == qLogObject.ID) {
      duplicate = true;
      console.log("qLog ID " + qLogObject.ID + " already exists in qLog " + qLogObject.array);
    }
  });
  if (!duplicate) {
    qLogObject.array.push(qLogObject);
    console.log("Pushing qLog ID " + qLogObject.ID + " to array " + qLogObject.array);
  }
}

//Remove the room-based qLogs when you reset the room.
function qLogClean(qLog) {
  $.each(qLog, function() {
    if (this.type == 'room') {
      removeThis(this, qLog, "removing qLog ID " + this + " from " + qLog);
    }
  });
}

function qLogCleanAll() {
  qLogClean(qLog1);
  qLogClean(qLog2);
  qLogClean(qLog3);
  qLogClean(qLog4);
  qLogClean(qLog5);
}

function qLogRemove(qLogID, reason) {
  $.each(qLog1, function() {
    if (this.ID == qLogID) {
      removeThis(this, qLog1, reason);
    }
  });
  $.each(qLog2, function() {
    if (this.ID == qLogID) {
      removeThis(this, qLog2, reason);
    }
  });
  $.each(qLog3, function() {
    if (this.ID == qLogID) {
      removeThis(this, qLog3, reason);
    }
  });
  $.each(qLog4, function() {
    if (this.ID == qLogID) {
      removeThis(this, qLog4, reason);
    }
  });
  $.each(qLog5, function() {
    if (this.ID == qLogID) {
      removeThis(this, qLog5, reason);
    }
  });
}

function newRoom(exit, directAct) {
  //check to make sure you're not disabled first
  if (player.moveEnabled) {
    var prevRoom = checkArrayID(roomLibrary, player.inRoom);
    var nextRoom = checkArrayID(roomLibrary, prevRoom[exit]);
    //if the room exists and isn't locked
    if (nextRoom && !nextRoom.locked) {
      removeUniqueAction('load');
      enterRoom(prevRoom[exit], prevRoom, nextRoom, exit, directAct);
    } else if (nextRoom && nextRoom.locked) {
      if (nextRoom.lockedDesc) {
        log(nextRoom.lockedDesc);
      } else {
        log("That way is blocked.");
      }
    } else {
      log("You can't go in that direction.");
    }
  } else {
    console.log("player.moveEnabled: " + player.moveEnabled);
  }
}

function enterRoom(roomID, prevRoom, nextRoom, direction, directAct, hidden) {
  prevRoom.current = false;
  player.inRoom = roomID;
  nextRoom.current = true;
  stopTalking();
  //console.log("directAct: " + directAct);
  console.log("traveling to: " + roomID);
  roomReset();
  if (!hidden) {
    look();
  }
  if (nextRoom.func) {
    nextRoom.func();
  }
  //put a message in there if you escape. Can't put it earlier, because we don't know if you can go that way until now!
  if (directAct == 'escape') {
    log("You successfully escape to the " + translator[direction] + "!", 'green');
  }
}

function respawnMobs(thisPOIentry) {
  console.log("trying to respawn mobs...")
  var result = $.grep(roomLibrary, function (room) {
    return room.POI == thisPOIentry && room.mobs.length > 0;
  });
  $.each(result, function() {
    var thisRoom = this;
    $.each(this.mobs, function() {
      var mob = checkArrayID(mobLibrary, this.ID);
      //check if it's a unique enemy, and if it should be living
      if ( !mob.unique || (mob.unique && mob.living) ) {
        this.living = true;
        this.HPRatio = 1;
        this.currentHP = 1;
        this.maxHP = 0;
        this.instanceID = false;
        clearAggro(this, mob);
      }
    })
    console.log("respawned mobs in room " + thisRoom.ID);
  })
  return result[0];
}

function roomReset() {
  currentRoom = checkArrayID(roomLibrary, player.inRoom);
  thisRoomIndex = roomLibrary.indexOf(currentRoom);
  theseMobs = roomLibrary[thisRoomIndex].mobs;
  var aggroRoom = false;
  clearAggro();
  clearInterval(aggroTimer);
  if (currentRoom) {
    currentRoom.current = true;
    player.inRoom = currentRoom.ID;
    //reset the current items
    roomObjLibrary = [];
    //clean the qLogs
    qLogCleanAll();
    //activate NPCs
    activateNPCs();
    //console.log("currentRoom.cont: " + currentRoom.cont);
    //spawn the items
    $.each(currentRoom.cont, function() {
      var obj = checkArrayID(objLibrary, this);
      var recipeObj = checkArrayID(recipeLibrary, this);
      //spawn regular objects and crafted items separately
      if (obj) {
        roomObjLibrary.push(obj);
        //console.log("Pushing " + obj.title + " to the current currentRoom");
      } else if (recipeObj) {
        roomObjLibrary.push(recipeObj);
      } else {
        console.log("Can't find object ID " + this + " to push");
      }
    });
    //spawn all the enemies
    $.each(theseMobs, function() {
      var mob = checkArrayID(mobLibrary, this.ID);
      //set the health to a number
      if (this.living) {
        console.log("scaling mob HP to player level");
        //this.maxHP = Math.round(((mob.HPFactor^1.5)*(player.level*10 + 20)) + 10);
        this.maxHP = Math.round( mob.HPFactor*Math.pow( 5, Math.pow(player.level, .475) ) + 75 );
        if (this.maxHP < mob.HPMin) {
          this.maxHP = mob.HPMin;
        } else if (this.maxHP > mob.HPMax) {
          this.maxHP = mob.HPMax;
        }
        //console.log("mob.HPFactor: " + mob.HPFactor + ", player.level^.5: " + Math.pow(player.level, .5) + ", this.maxHP: " + this.maxHP);
        this.currentHP = Math.round(this.HPRatio*(this.maxHP));
        //if the mob doesn't have a guard counter already, add one
        if (mob.guard) {
          console.log('setting up guard for ' + mob.title);
          this.guardCounter = 0;
          this.guarding = false;
        }
        if (mob.aggro) {
          aggroRoom = true;
        }
      }
      //set an instanceID if it doesn't have one yet.
      if (!this.instanceID) {
        currentInstance++
        //console.log("setting instanceID for mobID " + this.ID + " to: " + currentInstance);
        this.instanceID = currentInstance;
      }
    });
    //set the aggro timer if there are any aggro mobs in the room
    if (theseMobs.length > 0 && aggroRoom) {
      console.log("Starting aggroTimer");
      aggroTimer = setInterval(function(){
        advanceAggro();
      }, 1000);
    }
    //console.log("Room reset.")
  } else {
    log("Can't find the current room.");
  }
}

function clearAggro(thisMob, mob) {
  //if one mob is specified
  if (thisMob && mob) {
    thisMob.aggroCounter = 0;
    thisMob.brokeAggro = false;
    thisMob.aggro = false;
    console.log("Reset aggroCounter for " + mob.title)
  //otherwise reset the whole room
  } else {
    $.each(theseMobs, function() {
      this.aggroCounter = 0;
      this.brokeAggro = false;
      this.aggro = false;
    });
    //console.log("reset aggro for the whole room");
  }
}

function advanceAggro() {
  $.each(theseMobs, function() {
    var mob = checkArrayID(mobLibrary, this.ID);
    //check if the mob needs its aggro counter set or reset
    if (!this.aggroCounter || this.brokeAggro) {
      clearAggro(this, mob);
    }
    this.aggroCounter++
    //if it's time to aggro, do it!
    if (mob.aggro && this.living && this.aggroCounter > mob.aggroWait && !this.aggro) {
      aggroMob(this, mob);
    }
  });
  //console.log("advancing aggro");
}

function aggroMob(thisMob, mob) {
  if (!mob) {
    mob = checkArrayID(mobLibrary, thisMob.ID);
  }
  if ( thisMob && mob && thisMob.living && !inArray(thisMob.instanceID, battlingMobs) ) {
    battlingMobs.push(thisMob.instanceID);
    console.log("aggravating " + mob.title);
    //logProps(battlingMobs);
    thisMob.aggro = true;
    thisMob.mobWait = 0;
    if (!battling) {
      startedBy = 'mob';
      startBattle(thisRoomIndex, mob, thisMob);
    } else if (battling && battlingMobs.length > 1) {
      log(mob.title + " joins the battle!", 'orange');
      addMobWrapper(thisMob.instanceID);
    } else if (battling && battlingMobs.length < 1) {
      console.log("something's wrong with aggro - in battle but no battlingMobs");
    } else {
      addMobWrapper(thisMob.instanceID);
      console.log("something's wrong with aggro");
    }
  } else if (thisMob && thisMob.living) {
    console.log(mob.title + " already in battlingMobs");
  } else {
    console.log(mob.title + " is already aggravated");
  }
}

/////////////////////////////////////////////
/* WORLD MAP */
/////////////////////////////////////////////

function worldMoveX(vector) {
  if (worldMap) {
    var tempX = mapCoord[0] + vector;
    //console.log("mapCoord[0]: " + mapCoord[0]);
    var blocked = checkBlockedCoords(tempX, mapCoord[1]);
    //if it's not blocked, go there!
    if (!blocked || mapNoClip) {
      mapCoord[0] = mapCoord[0] + vector;
      stepsSinceLastBattle++
      worldUpdateXY(mapCoord[0], mapCoord[1]);
    } else {
      //console.log("blocked: " + blocked)
      //console.log("blocked from moving left/right");
    }
  } else {
    //console.log("Can't move the map when not on worldMap");
  }
}

function worldMoveY(vector) {
  if (worldMap) {
    var tempY = mapCoord[1] + vector;
    //console.log("mapCoord[1]: " + mapCoord[1]);
    var blocked = checkBlockedCoords(mapCoord[0], tempY);
    //if it's not blocked, go there!
    if (!blocked || mapNoClip) {
      mapCoord[1] = mapCoord[1] + vector;
      stepsSinceLastBattle++
      worldUpdateXY(mapCoord[0], mapCoord[1]);
    } else {
      //console.log("blocked: " + blocked)
      //console.log("blocked from moving up/down");
    }
  } else {
    //console.log("Can't move the map when not on worldMap");
  }
}

function worldUpdateXY(coordX, coordY, directMove) {
  //check if you need to switch territories
  if (!directMove) {
    checkTerritorySwitch(coordX, coordY);
    var poi = checkCoords(coordX, coordY);
    if (poi && poi.forcedEntry) {
      enterPOI();
    } else if (!poi && mapEncounters) {
      // roll for random battle!
      var encounterTypeRoll = Math.random();
      //if you're within the range for a random battle and you AREN'T in territory 1
      if ( mapBattleStepsMin < stepsSinceLastBattle < mapBattleStepsMax && currentTerritory != 1) {
        // roll for a battle, and compare that with the distributed chance
        // between steps 7 and 15, you have a 1/8 chance of having a battle.
        var battleRoll = Math.random();
        var battleChance = 1/(mapBattleStepsMax - mapBattleStepsMin);
        if (battleRoll < battleChance) {
          console.log("This would be where you get into a battle!");
          mapBattleStart();
        }
      } else if (stepsSinceLastBattle > mapBattleStepsMax && currentTerritory != 1) {
        //if it's been more than 15 steps, force an encounter
        console.log("It's been too many steps, time to battle!");
        mapBattleStart();
      }
    }
  }
  //calculate the new location AFTER POI.func just in case it bumps you out
  var translate = "translate(" + mapCoord[0] + "em, " + mapCoord[1] + "em)"
  //move there!
  $('.map').css('transform', translate);
  //console.log("moving");
}

function switchForcedEntry(POITitle) {
  var poi = checkPOI(POITitle)
  if (poi) {
    poi.forcedEntry = !poi.forcedEntry;
    console.log(POITitle + " forced entry switched");
  } else {
    console.log("Couldn't find " + POITitle + " to switch forced entry!");
  }
}

function mapBattleStart() {
  worldRoom = checkArrayID(roomLibrary, 9020);
  mapBattling = true;
  stepsSinceLastBattle = 0;
  worldRoom.cont = [];
  worldRoom.mobs.push(
    {ID:1, HPRatio:1, currentHP:1, maxHP:0, aggro:false, living:true, instanceID: false}
  );
  act('goto', '9020');
  act('cl');
  switchMap('room');
  log("Random encounter!", 'yellow');
  look();
  act('k', 'spawn');
  //battle(thisRoomIndex, mob, thisMob, startedBySkill);
}

function mapBattleEnd() {
  mapBattling = false;
  checkArrayID(roomLibrary, 9020).mobs = [];
  setTimeout(function() {
    fadeOutConsole();
    switchMap('map');
    fadeInConsole();
  }, 3500)
}

function checkTerritorySwitch(coordX, coordY) {
  //check territory switching points
  if (currentTerritory == 1) {
    if(coordX == -41 && coordY == -29) {
      switchTerritory(2);
    }
  } else if (currentTerritory == 2) {
    if (coordX == -40 && coordY == -29) {
      switchTerritory(1);
    } else if (coordX == -33) {
      if (coordY == -22 || coordY == -23) {
        switchTerritory(5);
      }
    } else if ( (coordX == -65 && coordY == -13) || (coordX == -65 && coordY == -14) || (coordX == -64 && coordY == -15) || (coordX == -63 && coordY == -16) ) {
      switchTerritory(4);
    } else if ( coordX == -114 && coordY == -24 ) {
      switchTerritory(6);
    } else if ( coordX == -121 && coordY == -40) {
      switchTerritory(7);
    }
  } else if (currentTerritory == 3) {

  } else if (currentTerritory == 4) {
    if ( (coordX == -63 && coordY == -17) || (coordX == -64 && coordY == -16) || (coordX == -65 && coordY == -15) || (coordX == -66 && coordY == -13) ) {
      switchTerritory(2);
    } else if (coordX ==-31 && coordY == -15) {
      switchTerritory(5)
    }
  } else if (currentTerritory == 5) {
    if (coordX == -34 && (coordY == -22 || coordY == -23) ) {
      switchTerritory(2);
    } else if (coordX == -23 && coordY == -33) {
      switchTerritory(1);
    }
  } else if (currentTerritory == 6 && (coordX == -113 && coordY == -24) || (coordX == -106 && coordY == -18) ) {
    switchTerritory(2);
  } else if (currentTerritory == 7 && coordX == -114 && coordY == -38) {
    switchTerritory(2);
  }
}

function enterPOI(destination) {
  var poi = checkCoords(mapCoord[0], mapCoord[1]);
  //console.log(poi);
  if (!destination && poi) {
    if (poi.accessible && poi.entrance) {
      var nextRoom = checkArrayID(roomLibrary, poi.entrance);
      respawnMobs(poi.entry);
      enterRoom(poi.entrance, player.inRoom, nextRoom)
      console.log("Entering " + poi.title);
      act('cl');
      log("You enter " + poi.title, 'yellow');
      look();
      switchMap('room');
    }
  } else if (destination) {
  } else {
    console.log("Can't find any POIs to enter.");
  }
}

function checkPOITitle(entry) {
  if ( checkArray(bastions, entry) ) {
    return checkArray(bastions, entry).title;
  } else if ( checkArray(terr1POIs, entry) ) {
    return checkArray(terr1POIs, entry).title;
  } else if ( checkArray(terr23POIs, entry) ) {
    return checkArray(terr23POIs, entry).title;
  } else if ( checkArray(terr4POIs, entry) ) {
    return checkArray(terr4POIs, entry).title;
  } else if ( checkArray(terr5POIs, entry) ) {
    return checkArray(terr5POIs, entry).title;
  } else {
    console.log("couldn't find POI title for " + entry);
  }
}

function checkPOI(entry) {
  if ( checkArray(bastions, entry) ) {
    return checkArray(bastions, entry);
  } else if ( checkArray(terr1POIs, entry) ) {
    return checkArray(terr1POIs, entry);
  } else if ( checkArray(terr23POIs, entry) ) {
    return checkArray(terr23POIs, entry);
  } else if ( checkArray(terr4POIs, entry) ) {
    return checkArray(terr4POIs, entry);
  } else if ( checkArray(terr5POIs, entry) ) {
    return checkArray(terr5POIs, entry);
  } else {
    console.log("couldn't find POI title for " + entry);
  }
}

function checkCoords(coordX, coordY) {
  var poi;
  //search through the bastions, compare each coordinate
  var bastion = checkPOIs(bastions, coordX, coordY);
  if (bastion) {
    poi = bastion;
  }
  if (currentTerritory == 1) {
    var poi1 = checkPOIs(terr1POIs, coordX, coordY);
    if (poi1) {
      poi = poi1;
    }
  } else if (currentTerritory == 2) {
    var poi2 = checkPOIs(terr23POIs, coordX, coordY);
    if (poi2) {
      poi = poi2;
    }
  } else if (currentTerritory == 4) {
    var poi4 = checkPOIs(terr4POIs, coordX, coordY);
    if (poi4) {
      poi = poi4;
    }
  } else if (currentTerritory == 5) {
    var poi5 = checkPOIs(terr5POIs, coordX, coordY);
    if (poi5) {
      poi = poi5;
    }
  } else if (currentTerritory == 6) {
    var poi6 = checkPOIs(terr6POIs, coordX, coordY);
    if (poi6) {
      poi = poi6;
    }
  } else if (currentTerritory == 7) {
    var poi7 = checkPOIs(terr7POIs, coordX, coordY);
    if (poi7) {
      poi = poi7;
    }
  }
  return poi;
}

function checkPOIs(array, coordX, coordY) {
  var result;
  $.each(array, function() {
    var coords = this.coords;
    if (coords.x == coordX && coords.y == coordY) {
      result = this;
      if (!this.discovered && this.accessible) {
        discoverPOI(array, this.entry);
      }
      if (this.accessible) {
        console.log("Arrived at " + this.title);
      } else {
        console.log(this.title + " is inaccessible");
      }
    }
  });
  return result;
}

function discoverPOI(array, entry) {
  var poi = checkArray(array, entry);
  poi.discovered = true;
  $('.map-POIs #' + poi.entry).addClass('hidden');
  console.log("discovered " + poi.title);
}

function switchTerritory(terr) {
  currentTerritory = terr;
  console.log("switching to territory: " + currentTerritory);
}

function switchMap(map) {
  if (map == 'battle') {
    activateConsole();
    $('.map-wrapper').removeClass('active');
    $('.battle-wrapper').addClass('active');
    $('.input-wrapper').addClass('active battling');
    battleScreen = true;
    worldMap = false;
    scrollLogToBottom();
  } else if (map == 'room' || worldMap) {
    activateConsole();
    $('.map-wrapper').removeClass('active');
    $('.battle-wrapper').removeClass('active');
    $('.input-wrapper').addClass('active').removeClass('battling');
    battleScreen = false;
    worldMap = false;
    scrollLogToBottom();
  } else if (map == 'world' || !worldMap) {
    $('.map-wrapper').addClass('active');
    $('.battle-wrapper').removeClass('active');
    $('.input-wrapper').removeClass('active');
    battleScreen = false;
    worldMap = true;
    deactivateConsole();
  }
}

function checkBlockedCoords(coordX, coordY) {
  var blockedCoords;
  switch (currentTerritory) {
    case 1:
      blockedCoords = blockedCoordsTerr1;
    break;

    case 2:
      blockedCoords = blockedCoordsTerr23;
    break;

    case 4:
      blockedCoords = blockedCoordsTerr4;
    break;

    case 5:
      blockedCoords = blockedCoordsTerr5;
    break;

    case 6:
      blockedCoords = blockedCoordsTerr6;
    break;

    case 7:
      blockedCoords = blockedCoordsTerr7;
    break;
  }
  //var blocked = false;
  var result = $.grep(blockedCoords, function (coord) {
    return coord.x == coordX && coord.y == coordY;
  });

  return result[0];
}

function setPOIHiders(terr) {
  $.each(terr, function() {
    //console.log("checking hider for " + this.title);
    var transform = 'left: ' + (-this.coords.x) + 'em; top: ' + (-this.coords.y) + 'em;';
    if (!this.discovered) {
      $('.map-POIs').append('<div id="' + this.entry + '" class="poi-hider" style="' + transform + '"></div>');
    }
  });
}


/////////////////////////////////////////////
/* PLAYER STATS */
/////////////////////////////////////////////


function updateStat(stat, operand, value, duration) {
  if ( Number(value) ) {
    value = parseFloat(value);
  }
  if (operand === 'add' || operand === 'subtract') {
    //check if it's a ratio or set value
    if (value < 1) {
      //get the right capitalization, like basePlasmoid
      var statCap = stat.substr(0,1).toUpperCase()+stat.substr(1);
      var baseStat = player["base" + statCap];
      console.log("statCap: " + statCap);
      console.log("baseStat: " + baseStat);
      //get the current ratio, like .5
      var statRatio = (player[stat] / baseStat);
      // .5 + .3
      console.log("converting value ratio: " + value + " and statRatio: " + statRatio);
      //console.log("statRatio " + $.isNumeric(statRatio))
      if (operand === 'subtract') {
        statRatio -= value;
      } else if (operand === 'add') {
        statRatio += value;
      }
      //convert the stat back (.8 * basePlasmoid)
      player[stat] = Math.round(statRatio * baseStat);
    } else if ($.isNumeric(value)) {
      //console.log("adding static value: " + value);
      if (operand === 'subtract') {
        player[stat] -= value;
      } else if (operand === 'add') {
        player[stat] += value;
      }
    } else {
      log("something's wrong with stat updates");
    }
  } else if (operand === 'set') {
    if (value === 'full') {
      console.log("updating " + stat + " to full");
      //capitalize the first letter of the stat when looking for its baseStat
      player[stat] = player['base' + stat.substr(0,1).toUpperCase() + stat.substr(1) ];
    } else {
      console.log("updating " + stat + " to: " + value);
      player[stat] = value;
    }
  } else if (operand === 'subtract') {
    player[stat] -= value
  }
  playerReset();
}

function equipReset() {
  var hitTemp = 0;
  var dmgTemp = 0;
  var spdTemp = 0;
  var critChanceTemp = 0;
  var critFactorTemp = 0;
  $.each(invLibrary, function() {
    if (this.equipped) {
      //log(this.title + " is equipped");
      if (this.hitMod) {
        hitTemp += this.hitMod;
        //console.log("hitTemp: " + hitTemp + ", " + typeof hitTemp);
      }
      if (this.dmgMod) {
        dmgTemp += this.dmgMod;
        //console.log("dmgTemp: " + dmgTemp + ", " + typeof dmgTemp);
      }
      if (this.atkSpd) {
        spdTemp += this.atkSpd;
        //console.log("atkSpd: " + atkSpd + ", " + typeof atkSpd);
      }
      if (this.critChance) {
        critChanceTemp += this.critChance;
      }
      if (this.critFactor) {
        critFactorTemp += this.critFactor;
      }
    }
  });
  //cap hit at 99%
  hitTemp = parseFloat( player.baseHit + hitTemp ).toFixed(3);
  if (hitTemp < .99) {
    player.hit = hitTemp;
  } else if (hitTemp > .99) {
    player.hit = .99;
  }

  player.dmgMin = player.baseDmgMin;
  player.dmgMax = player.baseDmgMax;
  //if something's affecting dmg, do the math
  if (dmgTemp) {
    player.dmgMin = parseInt(((player.baseDmgMin*(1+parseFloat(dmgTemp)))+(parseFloat(dmgTemp)*(4+player.level*2)))/4+1);
    player.dmgMax = parseInt(((player.baseDmgMax*(1+parseFloat(dmgTemp)))+(parseFloat(dmgTemp)*(4+player.level*3)))/4+2);
  // otherwise set it to player mins
  }
  // set dmgMin floor at 0
  if (player.dmgMin < 0) {
    player.dmgMin = 0;
  }

  player.atkSpd = player.baseAtkSpd;
  if (spdTemp) {
    player.atkSpd = Math.round(spdTemp);
  }

  player.critChance = player.baseCritChance;
  if (critChanceTemp) {
    player.critChance += parseFloat(critChanceTemp).toFixed(4);
  }

  player.critFactor = player.baseCritFactor;
  if (critFactorTemp) {
    player.critFactor += critFactorTemp;
  }
  if (player.atkTitle) {
    $('.player-weapon').html(player.atkTitle);
  } else {
    $('.player-weapon').html(player.baseAtkTitle);
  }
  //console.log("player.dmgMin: " + player.dmgMin);
  //console.log("player.dmgMax: " + player.dmgMax);
}

function playerReset(HPRatio, plasmoidRatio) {
  if (player.plasmoid < 0) {
    var plasmoidDeficitRatio = (-player.plasmoid / player.basePlasmoid);
    HPRatio = (player.HP / player.baseHP) - plasmoidDeficitRatio*2;
    player.plasmoid = 0;
    log("You used some <r>blood</r> instead of <pu>plasmoid</pu>!");
  }
  if (HPRatio <= 0) {
    player.HP = 0;
    player.living = false;
    log("You're dead!", "red");
  } else {
    if (!HPRatio) {
      HPRatio = (player.HP / player.baseHP).toFixed(10);
    }
    if (!plasmoidRatio) {
      plasmoidRatio = (player.plasmoid / player.basePlasmoid).toFixed(10);
    }
    player.HP = Math.round(player.baseHP * HPRatio);
    player.plasmoid = Math.round(player.basePlasmoid * plasmoidRatio);
    //cap HP
    if (player.HP > player.baseHP) {
      player.HP = player.baseHP;
    }
    //cap plasmoid
    if (player.plasmoid > player.basePlasmoid) {
      player.plasmoid = player.basePlasmoid;
    }
    player.dmgMin = player.baseDmgMin;
    player.dmgMax = player.baseDmgMax;
    checkLevelUnlocks();
    updateBars(HPRatio, plasmoidRatio);
    equipReset();
    console.log("player reset.")
  }
}

function checkLevelUnlocks() {
  if (player.level >= 2) {
    player.stLevel = true;
  }
  if (player.level >= 3) {
    player.stXPNext = true;
  }
  if (player.level >= 4) {
    player.stHPMax = true;
    player.stPlasmoidMax = true;
  }
}

function updateBars(HPRatio, plasmoidRatio) {
  if (!HPRatio) {
    HPRatio = (player.HP / player.baseHP).toFixed(10);
  }
  if (!plasmoidRatio) {
    plasmoidRatio = (player.plasmoid / player.basePlasmoid).toFixed(10);
  }
  if (HPRatio < 0) {
    HPRatio = 0;
  } else if (HPRatio > 1) {
    HPRatio = 1;
  }
  if (plasmoidRatio < 0) {
    plasmoidRatio = 0;
  } else if (plasmoidRatio > 1) {
    plasmoidRatio = 1;
  }
  var hpBarNum = parseInt(Math.ceil(maxBars*parseFloat(HPRatio)));
  var plasmoidBarNum = parseInt(Math.ceil( maxBars*parseFloat(plasmoidRatio)));
  //console.log("hpBarNum: " + hpBarNum);
  //console.log("plasmoidBarNum: " + plasmoidBarNum);
  //set the bars!
  var hpBars = "|".repeat( hpBarNum );
  var plasmoidBars = "|".repeat( Math.ceil( maxBars*parseFloat(plasmoidRatio) ) );
  $(".bars.hp").html(hpBars);
  $(".bars.plasmoid").html(plasmoidBars);
}

/*
function updateBattleHeight(value) {
  if (!value) {
    value = $('.battle-wrapper').outerHeight();
  }
  $('.input.log').css({ 'padding-bottom': value });
}
*/

/////////////////////////////////////////////
/* UNIQUE ACTIONS */
/////////////////////////////////////////////

function addUniqueAction(action) {
  var preExisting = false;
  // pushing more than one action?
  if ( $.isArray(action) ) {
    $.each(action, function() {
      //check to make sure it's not adding duplicates!
      preExisting = checkArray(uniqueActions, this.entry);
      if (!preExisting) {
        if ( !this.input ) {
          this.input = this.entry;
        }
        uniqueActions.push(this);
        console.log("pushing a unique action to the library");
        console.log("preExisting: " + preExisting);
      } else {
        console.log("unique action " + this.entry + " already exists in library");
      }
    });
  } else {
    preExisting = checkArray(uniqueActions, action.entry);
    //console.log("preExisting: " + preExisting);
    //console.log("action.entry: " + action.entry);
    //logProps(uniqueActions[0]);
    if (!preExisting) {
      if ( !action.input ) {
        action.input = action.entry;
      }
      uniqueActions.push(action);
      console.log("pushing a unique action to the library");
    } else {
      console.log("unique action " + action.entry + " already exists in library");
    }
  }
}

function showUniqueActions() {
  $.each(uniqueActions, function() {
    if (this.onlyInRoom == player.inRoom && !this.hidden) {
      //only display talking points when in dialog
      if ( (player.talking && this.talk) || (!player.talking && !this.talk) ) {
        log(this.entry + "?", 'unique');
      }
    } else if (this.onlyInRoom == player.inRoom && this.hidden) {
      console.log("can use hidden action: " + this.entry);
      console.log("this.onlyInRoom: " + this.onlyInRoom);
    } else {
      console.log("can't use action right now: " + this.entry);
    }
  })
}

function removeUniqueAction(entry) {
    //check if it pushed an array of entries
  $.each(uniqueActions, function() {
    if ($.isArray(this.entry)) {
      var thisEntries = this.entry
      $.each(thisEntries, function() {
        if (entry == this) {
          var thisActionIndex = uniqueActions.indexOf(this);
          uniqueActions.splice(thisActionIndex, 1);
          console.log("removing unique action " + entry + " from the library (array)");
        }
      });
    } else if (this.entry == entry) {
      var thisActionIndex = uniqueActions.indexOf(this);
      uniqueActions.splice(thisActionIndex, 1);
      console.log("removing unique action " + entry + " from the library");
    } else {
      console.log("Can't find entry " + entry + " to remove from uniqueActions");
    }
  });
}

/////////////////////////////////////////////
/* STANDARD ACTIONS */
/////////////////////////////////////////////

function checkActions(thisRoomIndex, actLibrary, command, dirObj, indirObj, directAct, fullCommand) {
  var error;
  //search through the list of actions
  var searching = true;
  var currentEntry;
  var result;
  var unique = false;
  // first check the unique actions
  if (uniqueActions.length > 0) {
    $.each(uniqueActions, function() {
      currentEntry = $(this);
      var npc;
      if (player.talking) {
        npc = checkArrayID(npcLibrary, player.talking);
      }
      if ( !$.isArray(this.input) && player.inRoom == this.onlyInRoom && (fullCommand == this.input || fullCommand == this.input + '?') ) {
        if (this.once) {
          var thisActionIndex = uniqueActions.indexOf(this);
          uniqueActions.splice(thisActionIndex, 1);
        } else {
          console.log("leaving " + this.input + " in uniqueActions");
        }
        this.func(npc);
        unique = true;
        searching = false;
      } else if ( $.isArray(this.input) && player.inRoom == this.onlyInRoom ) {
        var aliases = this.input;
        $.each(aliases, function(thisIndex, thisVal) {
          //console.log("checking alias: " + this + " for match to " + command);
          if (this == fullCommand) {
            if (this.once) {
              removeThis(this, uniqueActions);
            } else {
              console.log("leaving " + this.input + " in uniqueActions");
            }
            //console.log("found a match for " + currentEntry[0].input);
            currentEntry[0].func(npc);
            unique = true;
            searching = false;
          }
        });
      }
    })
  }
// if it's still searching, check the action library for it
  if (searching) {
    $.each(actLibrary, function(index, val) {
      currentEntry = $(this);
      //if it's a single option, match the whole command
      if ( !$.isArray(this.input) && this.input == command ) {
        //set the result to the current one
        result = this;
        //use this to break the each loop and stop looking
        searching = false;
      } else if ( $.isArray(this.input) ) {
        var aliases = this.input;
        $.each(aliases, function(thisIndex, thisVal) {
          //console.log("checking alias: " + this + " for match to " + command);
          if (this == command) {
            result = currentEntry[0];
            //console.log("found a match for " + currentEntry[0].entry);
            searching = false;
          }
        });
      }
      return searching;
    });
  }
  //make sure you can use them at the right times
  if (result && (directAct === 'directAct' || directAct === 'escape') ) {
    result.func(thisRoomIndex, dirObj, indirObj, directAct);
  //check if the player can generally take that action
  } else if (result && !result.locked && !unique && player.actEnabled) {
    //now check if you can specifically us this action at this time
    var actionClass = result.class;
    var actionAllowed = false;
    if ( inArray('battle', actionClass) ) {
      if (!battling) {
        //start battle with a skill so it doesn't double up on confirmation texts
        act('k', dirObj, indirObj, 'skill', fullCommand);
      }
      actionAllowed = true;
    } else if ( inArray('battleOnly', actionClass) && !battling) {
      log("You can't do that outside of battle.");
      //check if you're trying to escape
    } else if ( inArray('noBattle', actionClass) && battling ) {
      log("You can't do that in battle!", 'orange');
    } else if (!player.moveEnabled && actionClass == 'nav') {
      log("You're unable to move.");
    } else if (!player.actEnabled && actionClass != 'nav') {
      log("Can't do that right now.");
    } else {
      actionAllowed = true;
    }
    if (actionAllowed) {
      if ( inArray('battle', actionClass) ) {
        var mob = checkArray(mobLibrary, dirObj);
        if (!dirObj && currentTarget) {
          thisMob = currentTarget;
          mob = checkArrayID(mobLibrary, currentTarget.ID)
        }
        result.func(thisRoomIndex, dirObj, indirObj, mob, thisMob);
      } else {
        result.func(thisRoomIndex, dirObj, indirObj, directAct, fullCommand);
      }
    }
  //If it finds an action but you can't do it, throw an error
  } else if ( result &&  !unique && (!player.actEnabled || result.locked) ) {
    log("Can't do that right now.")
  //If it doesn't find anything at all, pick a random response from the log
  } else if (!unique) {
    var errRoll = Math.floor(Math.random()*errLibrary.length)
    log(errLibrary[errRoll]);
  }
}

function inArray(object, array) {
  //console.log(object);
  //logProps(object);
  if (array && array.indexOf(object) != -1) {
    return true;
  } else {
    return false;
  }
}

/////////////////////////////////////////////
/* QUESTS */
/////////////////////////////////////////////

function acceptQuest(entry, hidden) {
  var quest = checkQuest(entry);
  //check if it's already accepted
  if (quest && !quest.accepted) {
    quest.accepted = true;
    if (!hidden) {
      log("New quest: " + quest.title + "!", 'green');
    }
    if (quest.acceptFunc) {
      quest.acceptFunc();
    }
    checkCollectQuests();
    //console.log("accepted quest: " + entry);
  } else if (quest) {
    console.log("Quest: " + entry + " has already been accepted");
  } else {
    console.log("Can't find quest: " + entry + "!");
  }
}

function completeQuest(entry, hidden) {
  var quest = checkQuest(entry);
  //make sure you took the quest first
  if (quest.accepted && !quest.completed) {
    quest.completed = true;
    if (!hidden) {
      log("Completed quest: " + quest.title + "!", 'green');
    }
    if (quest.completeFunc) {
      quest.completeFunc();
    }
    //console.log("completed quest: " + entry);
  } else if (quest.completed) {
    console.log("Tried to turn in quest: " + quest.title + ", but it was already complete!");
    return false;
  }
}

function uncompleteQuest(entry, hidden) {
  //make room for IDs
  var quest = checkQuest(entry);
  if (quest.completed && !quest.turnedIn) {
    quest.completed = false;
    log("You no longer meet the requirements for " + quest.title, 'info');
  }
}

function turnInQuest(entry, hidden) {
  var quest = checkQuest(entry);
  if (quest.completed && !quest.turnedIn) {
    quest.turnedIn = true;
    console.log("Turned in quest: " + quest.title);
    if (quest.turnInFunc) {
      quest.turnInFunc();
    }
    return true;
    //console.log("completed quest: " + entry);
  } else if (quest.turnedIn) {
    console.log(quest.title + " was already turned in");
    return false;
  } else if (!quest.completed){
    console.log("Tried to turn in quest: " + quest.title + ", but it wasn't marked complete!");
    return false;
  }
}

function failQuest(entry, hidden) {
  var quest = checkQuest(entry);
  quest.failed = true;
  if (!hidden) {
    log("Failed quest: " + quest.title + "!", 'red');
  }
  if (quest.failFunc) {
    quest.failFunc();
  }
  //console.log("failed quest: " + entry);
}

function checkQuest(entry, currentOnly) {
  var acceptedQuests = $.grep(playerQuests, function (quest) {
    return quest.accepted && !quest.turnedIn;
  });
  //allow ID lookup of any quest
  if (Number(entry)) {
    return checkArrayID(playerQuests, entry);
  //restrict word lookup to accepted quests
  } else if (currentOnly) {
    return checkArray(acceptedQuests, entry);
  } else {
    return checkArray(playerQuests, entry);
  }
}

function checkKillQuests(thisMob, mob) {
  //console.log("checking kill quests...");
  if (thisMob && mob) {
    $.each(playerQuests, function() {
      if (this.killEnemyID == mob.ID) {
        completeQuest(this.entry[0]);
      }
    });
  } else {
    console.log("Can't checkKillQuests without thisMob and mob!");
  }
}

function checkCollectQuests() {
  //console.log("checking collect quests...");
  var craftingBag = invLibrary[0].contents;
  var thisQuest;
  $.each(playerQuests, function() {
    thisQuest = this;
    if (thisQuest.collectItems && thisQuest.accepted) {
      var satisfiedItems = 0;
      $.each(thisQuest.collectItems, function() {
        var inv = checkArrayID(invLibrary, this.ID);
        var mat = checkArrayID(craftingBag, this.ID);
        var foundItem;
        if (inv) {
          foundItem = inv;
        } else {
          foundItem = mat;
        }
        if (foundItem && foundItem.qty >= this.qty) {
          satisfiedItems++
          //console.log("You've got enough item " + foundItem.ID + " for " + thisQuest.title);
        } else if (foundItem) {
          //console.log("don't have enough item " + foundItem.ID + " to satisfy " + thisQuest.title);
        } else {
          //console.log("don't have any item " + this.ID + " for " + thisQuest.title);
        }
      });
      if (thisQuest.collectItems && satisfiedItems >= thisQuest.collectItems.length) {
        //console.log("got all the items for " + thisQuest.title + "!");
        completeQuest(thisQuest.ID);
      } else if (thisQuest.collectItems && thisQuest.completed && satisfiedItems < thisQuest.collectItems.length) {
        uncompleteQuest(thisQuest.ID)
        //console.log("didn't get all the items for " + thisQuest.title);
      } else if (thisQuest.collectItems) {
        //console.log("Don't yet have all the items for " + thisQuest.title);
      }
    } else {
      //console.log(thisQuest.title + " didn't need items")
    }
  });
}

/////////////////////////////////////////////
/* JOURNAL */
/////////////////////////////////////////////

/*
  player.level
  player.inRoom
  % of the way to next level - DON'T store currentXP
  Inventory & crafting bag contents

  Unlocked summons/skills/commands
  knownRecipes[] contents
  Currently equipped eqHand, eqArmor, eqAccessory
  Buffs - may need to re-push by checking ID and saving select stats, like duration.
  moveEnabled?, actEnabled?
  plasmoidEnabled
  player.milestone1, player.milestone2, etc.
  mapCoord
  currentTerritory
  mapTutorial

  playerQuests.accepted, .completed, .failed
  NPC talk positions
  Quest status

  Unlocked territories
  All In-room items
  In-room mobs (current POI only)
  All boss states
  Room locked/unlocked gate open/closed states
  Secret rooms/pathways discovered
  Discovered POIs

  Tutorial messages cleared

  alcPuzzle completion, eventually

  saving should interrupt and stop talking
  reroll all stats from level 1 to ensure up-to-date scaling
  repopulate deflectArray, modifiers,
  run checkCollectQuests and checkKillQuests to re-check in-progress quests
*/

function compareTimestamp(date) {
  console.log("comparing against timestamp: " + date);
  return moment(date).fromNow();
}

function saveGame(autosave) {
  var playerXPPercent = parseFloat( (player.XP - player.prevXP) / (player.nextXP - player.prevXP) );
  var playerInv = [];
  var timestamp = new Date( $.now() );
  var saveQuests = {};
  $.each(invLibrary, function() {
    playerInv.push(this.ID);
  })

  $.each(playerQuests, function() {
    if (this.failed) {
      saveQuests[this.ID] = 'failed';
    } else if (this.turnedIn) {
      saveQuests[this.ID] = 'turnedIn';
    } else if (this.completed) {
      saveQuests[this.ID] = 'completed';
    } else if (this.accepted) {
      saveQuests[this.ID] = 'accepted';
    } else {
      saveQuests[this.ID] = 'undiscovered';
      //console.log('Had an error saving quest ID ' + this.ID + '!');
    }
  });

  var currentData = {
    bookmark: {
      date: timestamp,
      //timePlayed: false
    },
    world: {
      mapCoord: mapCoord,
      currentTerritory: currentTerritory,
      mapTutorial: mapTutorial,
      worldMap: worldMap,
    },
    player: {
      level: player.level,
      inRoom: player.inRoom,
      playerXPPercent: playerXPPercent, //need to regenerate this into integer
      HPRatio: (player.HP / player.baseHP),
      plasmoidRatio: (player.plasmoid / player.basePlasmoid),
      invLibrary: playerInv, //these regenerate by ID
      craftingInv: checkArrayID(invLibrary, 99).contents, //this is a straight list of IDs and qty
      knownRecipes: knownRecipes,
      uniqueActions: uniqueActions, //this could get dangerous but regenerating these may be hard
      //stat unlocks
      stLevel: player.stLevel,
      stHPMax: player.stHPMax,
      stPlasmoidMax: player.stPlasmoidMax,
      stHitPercent: player.stHitPercent,
      stDPS: player.stDPS,
      stCrit: player.stCrit,
      stMobBleed: player.stMobBleed,
      stGuardBreak: player.stGuardBreak,
      stMobBerserk: player.stMobBerserk,
      stMobConfuse: player.stMobConfuse,
      stAssault: player.stAssault,
      stXPNext: player.stXPNext,
      //equipment
      eqHand: player.eqHand,
      eqArmor: player.eqArmor,
      eqAccessory: player.eqAccessory,
      atkTitle: player.atkTitle,
      plasmoidEnabled: player.plasmoidEnabled,
      moveEnabled: player.moveEnabled,
      milestone: player.milestone,
      playTimeSeconds: player.playTimeSeconds,
      playTimeMinutes: player.playTimeMinutes,
      playTimeHours: player.playTimeHours,
      playTime: player.playTime,
    },
    quests: saveQuests,
    NPCs: {

    },
    alchemy: {

    },
  }

  if (autosave) {
    //push it to a hidden extra savegame state
    localStorage.setItem( 'BloodSummonerAutosave', JSON.stringify(currentData) );
  } else {
    localStorage.setItem( 'BloodSummonerSaveGame', JSON.stringify(currentData) );
  }
}

function loadGame() {
  var recentSave = JSON.parse( localStorage.getItem('BloodSummonerSaveGame') );
  //var now = new Date( $.now() );
  log("Loading last journal entry.");
  init('load', recentSave);
  //logProps(recentSave);
}

function logSaveGame() {
  var recentSave = JSON.parse( localStorage.getItem('BloodSummonerSaveGame') );
  var timeSince = compareTimestamp(recentSave.bookmark.date);
  var currentPOI = checkArrayID(roomLibrary, player.inRoom).POI;
  console.log("SAVE GAME DATA:");
  $.each(recentSave, function() {
    logProps(this);
  });
  log("Last journal entry:");
  log('Written ' + timeSince, 'info indent');
  log("Level " + recentSave.player.level, 'info indent no-top');
  log(checkPOITitle(currentPOI), 'info indent no-top');
  log('Play time: ' + recentSave.player.playTime, 'info indent no-top');
  //logProps(recentSave);
}

/////////////////////////////////////////////
/* UNIVERSAL FUNCTIONS */
/////////////////////////////////////////////

function checkArray(array, dirObj, prop) {
  var searching = true;
  var currentEntry;
  var result;
  if (!prop) {
    prop = 'entry';
  }
  $.each(array, function(index, val) {
    currentEntry = $(this);
    if ( !$.isArray(this[prop]) && this[prop] == dirObj ) {
      //set the result to the current one
      result = this;
      //use this to break the each loop and stop looking
      searching = false;
    } else if ( $.isArray(this[prop]) ) {
      var aliases = this[prop];
      $.each(aliases, function(thisIndex, thisVal) {
        //console.log("checking alias: " + this + " for match to " + command);
        if (this == dirObj) {
          result = currentEntry[0];
          //console.log("found a match for " + currentEntry[0].entry);
          searching = false;
        }
      });
    }
    return searching;
  });
  return result;
}

function checkArrayID(array, ID, needsToBeLiving, targetAggroFirst) {
  var result;
  var foundAggro = false;
  if (needsToBeLiving) {
    if (targetAggroFirst) {
      result = $.grep(array, function (thing) {
        return parseInt(thing.ID) == parseInt(ID) && thing.living === true && thing.aggro === true;
      });
      if (result.length > 0) {
        foundAggro = true;
      }
      if (!foundAggro) {
        result = $.grep(array, function (thing) {
          return parseInt(thing.ID) == parseInt(ID) && thing.living === true;
        });
      }
    } else {
      result = $.grep(array, function (thing) {
        return parseInt(thing.ID) == parseInt(ID) && thing.living === true;
      });
    }
  } else {
    result = $.grep(array, function (thing) {
      return parseInt(thing.ID) == parseInt(ID);
    });
  }

  if (result.length === 1) {
    //return the whole object
    return result[0];
  } else if (result.length > 1) {
    result.splice(1, result.length - 1);
    return result[0];
  } else {
    error = "Can't find that.";
  }
}

function log(message, messageClass) {
  if (!messageClass) {
    messageClass = '';
  }
  $logInner.append('<p class="' + messageClass + '">' + message + '</p>');
  scrollLogToBottom();
}

function scrollLogToBottom() {
  $logInner.scrollTop($logInner[0].scrollHeight - $logInner.height());
}

function act(input, dirObj, indirObj, directAct, fullCommand) {
  var room = checkArrayID(roomLibrary, player.inRoom);
  checkActions(thisRoomIndex, actLibrary, input, dirObj, indirObj, directAct, fullCommand);
  //console.log("act(directAct): " + directAct);
}

/////////////////////////////////////////////
/* BATTLE */
/////////////////////////////////////////////

function setLevel(level, HPRatio, plasmoidRatio) {
  while (level > player.level) {
    player.XP = parseInt(player.nextXP - 1);
    levelUp('hidden');
    player.XP++;
  }
  if (!HPRatio) {
    HPRatio = 1;
  }
  if (!plasmoidRatio) {
    plasmoidRatio = 1;
  }
  playerReset(HPRatio, plasmoidRatio);
}

function addXP(amount) {
  player.XP += amount;
  log("You gain <o>" + amount + "xp</o>.", 'no-top');
  //preserve your HP % in case you level up
  var HPRatio = (player.HP / player.baseHP);
  var plasmoidRatio = (player.plasmoid / player.basePlasmoid);
  //level up!
  if (player.XP >= player.nextXP) {
    levelUp();
  }
  playerReset(HPRatio, plasmoidRatio);
}

function levelUp(hidden) {
  var leveling = true;
  while (leveling) {
    player.level++;
    if (player.level < 23) {
      player.baseHP = Math.floor((player.baseHP + 5) * 1.12);
    } else if (player.level >= 23) {
      player.baseHP = Math.floor((player.baseHP-player.level*5)*1.05+240);
    }
    player.basePlasmoid = Math.floor((player.basePlasmoid + 8) * 1.07);
    player.baseDmgMin = Math.floor((player.baseDmgMin + 1) * 1.12);
    player.baseDmgMax = Math.floor((player.baseDmgMax + 1) * 1.12);
    player.baseHit = parseFloat(Number(player.baseHit + .005).toFixed(3));
    player.baseCritChance = parseFloat(player.baseCritChance + .0015).toFixed(4);
    player.prevXP = player.nextXP;
    player.nextXP += Math.floor( player.XPincrement + Math.pow(player.level*10, 1.38) - (player.level*10) - 20 );
    if (player.XP >= player.nextXP) {
      leveling = true;
    } else {
      leveling = false;
    }
  }
  if (!hidden) {
    log("You feel stronger!", "green");
  }
  console.log("You reached level: " + player.level);
}

function getLoot(thisLoot) {
  if ($.isArray(thisLoot)) {
    $.each(thisLoot, function() {
      addInv(this.ID, this.qty);
    });
  } else {
    addInv(thisLoot.ID, thisLoot.qty);
  }
}

function rollLoot(thisLoot, qty) {
  //default chance to mob's drop rate
  var lootChance = thisLoot[2];
  var lootRoll = Math.random();
  if (lootChance) {
    lootChance = 1;
  }
  //default to 1 of each thing
  if (!qty) {
    qty = 1;
  }
  //if you roll within the loot's chance, add that item to inventory
  if (lootRoll < lootChance) {
    var lootItem;
    //get all the items of that kind
    var lootItems = $.grep(objLibrary, function (item) {
      return (inArray(thisLoot[0], item.class) && item.tier == thisLoot[1]); // [0] = class, [1] = tier
    });
    //if there's more than one type, roll which one you get
    if (lootItems.length > 1) {
      lootRoll = Math.floor(lootRoll * (lootItems.length + 1));
      //console.log("lootRoll: " + lootRoll);
      lootItem = lootItems[lootRoll];
    //otherwise just pass it through as the only option
    } else if (lootItems.length == 1) {
      lootItem = lootItems[0];
    }
    if (!lootItem) {
      console.log("Couldn't find the lootItem");
    } else {
      //console.log("lootItem.class: " + lootItem.class);
      log("You scavenge " + lootItem.article + lootItem.title + ".", 'loot');
      addInv(lootItem, qty, lootItem.class);
    }
  } else {
    console.log("Failed to roll for type: " + thisLoot[0]);
  }
}

function getSpoils(mob, thisMob) {
  var thisLoot1 = mob.loot1;
  var thisLoot2 = mob.loot2;
  var questLoot = thisMob.questLoot;
  var uniqueLoot = mob.uniqueLoot;
  var spoilsMessage;
  var thisXP = Math.floor( (mob.HPFactor+mob.dmgFactor+mob.XPFactor)*player.level*0.5+10 );
  if (mob.passive) {
    thisXP = 0;
  }
  //if they yeild plasmoid
  if (mob.plasmoidFactor && player.plasmoidEnabled) {
    var plasmoidRoll = Math.random();
    if (plasmoidRoll < player.plasmoidRecoveryChance || mob.plasmoidFactor == 1) {
      if (mob.plasmoidFactor == 1) {
        log("All your Plasmoid is restored!", 'purple');
          updateStat('plasmoid', 'set', 'full');
      } else {
        log("You restore some Plasmoid.", 'purple');
          updateStat('plasmoid', 'add', mob.plasmoidFactor);
      }
    }
  } else {
    //console.log("Tried to restore plasmoid, but you don't have plasmoid enabled");
  }
  //if they yield XP
  if (thisXP) {
    addXP(thisXP);
  }
  //if they yield loot
  if (thisLoot1) {
    rollLoot(thisLoot1);
  }
  if (thisLoot2) {
    rollLoot(thisLoot2);
  }
  if (questLoot) {
    getLoot(questLoot)
  }
  if (uniqueLoot) {
    getLoot(uniqueLoot)
  }
  //console.log("thisLoot1: " + thisLoot1);
  //console.log("thisLoot2: " + thisLoot2);
  //console.log("questLoot: " + questLoot);
  //console.log("uniqueLoot: " + uniqueLoot);
}

function checkArmedItems() {
  var armed = $.grep(roomObjLibrary, function (obj) {
    return obj.state == 'armed' && obj.detonateOn == 'battleStart';
  });

  if (armed.length > 0) {
    return armed;
  } else {
    return false;
  }
}

function detonateArmedItems() {
  var armedItems = checkArmedItems();
  if ( armedItems.length >= 1 ) {
    $.each(armedItems, function() {
      removeThis(this, armedItems, 'detonated');
      this.detonate();
      scrollLogToBottom();
    });
  } else {
    return false;
  }
}

function startBattle(thisRoomIndex, mob, thisMob) {
  clearMobWrappers();
  clearWaitBars();
  var armedItems = checkArmedItems();

  if (!startedBy || startedBy == 'player') {
    log("You attack the " + mob.title + "!", 'orange');
  } else if (startedBy == 'skill') {
    checkPlayerSkills(mob, thisMob);
  } else if (startedBy == 'mob') {
    if (mob.aggroDesc) {
      log(mob.aggroDesc, 'orange');
    } else {
      log(mob.title + " attacks!", 'orange');
    }
  }
  battling = true;
  playerWait = 0;
  aggroMob(thisMob, mob);
  switchMap('battle');
  addAllMobWrappers();
  scrollLogToBottom();
  var targetedMob = targetMob(thisMob, mob);
  if (targetedMob) {
    turn = 1;
    battleTimer = setInterval(function(){
      battleRound(mob, thisMob);
    }, battleSpeed);
  }
  //detonate any armed items at the beginning of battle
  detonateArmedItems();
}

function targetMob(thisMob, mob) {
  //account for instanceID too
  if ( Number(thisMob) ) {
    thisMob = checkArray(theseMobs, mob, 'instanceID');
  }
  if (!thisMob || !thisMob.living) {
    thisMob = checkArray(theseMobs, battlingMobs[0], 'instanceID');
  }
  if (thisMob && !mob) {
    mob = checkArrayID(mobLibrary, thisMob.ID);
  }
  if (thisMob && thisMob.living) {
    aggroMob(thisMob, mob);
    currentTarget = thisMob;
    player.battlingInstanceID = thisMob.instanceID;
    $('.mob-wrapper').removeClass('current-target');
    findMobWrapper(thisMob.instanceID).addClass('current-target');
    //logProps(findMobWrapper(thisMob.instanceID));
    console.log("Targeting mob ID" + thisMob.ID + " with instanceID: " + thisMob.instanceID);
    return thisMob;
  } else if (battlingMobs.length < 1) {
    endBattle();
    console.log("Couldn't find mob to target!");
  }
}

function removeThis(instance, array, reason) {
  var thisIndex = array.indexOf(instance);
  array.splice(thisIndex, 1);
  if (reason) {
    console.log(reason);
  }
}

/* battle screen */

function findMobWrapper(instanceID) {
  return $('.battle-wrapper .mobs').find('#' + instanceID);
}

function addAllMobWrappers() {
  $.each(battlingMobs, function() {
    if ( !findMobWrapper(this).html() ) {
      addMobWrapper(this);
    } else {
      console.log('instanceID ' + this + ' already has a mob-wrapper');
    }
  });
}

function clearMobWrappers(delay) {
  if (delay) {
    setTimeout(function() {
      if (!battling) {
        $('.battle-wrapper .mobs').children().remove();
      }
    }, endBattleDelay);
  } else {
    $('.battle-wrapper .mobs').children().remove();
  }
}

function addMobWrapper(instanceID) {
  var thisMob = checkArray(theseMobs, instanceID, 'instanceID');
  var mob = checkArrayID(mobLibrary, thisMob.ID);
  var name = '<p class="mob-name">' + mob.title + '</p>';
  if (instanceID && thisMob && mob) {
    $('.battle-wrapper .mobs').prepend(mobWrapper).children('.mob-wrapper:first-of-type').attr('id', instanceID).prepend(name);
    console.log("mob-wrapper instanceID " + instanceID + " added");
  } else {
    console.log("instanceID " + instanceID + " failed to add mob-wrapper");
  }
}

function removeMobWrapper(instanceID, dead, delay) {
  if (instanceID) {
    if (delay) {
      console.log("mob-wrapper instanceID " + instanceID + " removed");
      if (dead) {
        findMobWrapper(instanceID).addClass('dead');
      }
      setTimeout(function() {
        findMobWrapper(instanceID).remove();
      }, endBattleDelay);
    } else {
      findMobWrapper(instanceID).remove();
    }

  } else {
    console.log("Can't remove a mob-wrapper without instanceID");
  }
}

function updateWaitBar(source, ratio) {
  if (!ratio) {
    ratio = 0;
  }
  var percent = (ratio * 100).toFixed(2).toString() + '%';
  //console.log('percent: ' + percent);
  //console.log('ratio: ' + ratio);
  if (source == 'player') {
    source = $('.player-wrapper .wait-bar');
  } else if (Number(source)) {
    source = findMobWrapper(source).children('.wait-bar');
  } else {
    console.log("no wait bar to update!")
  }
  if (ratio > 0) {
    source.addClass('transition').css({'width': percent});
  } else {
    source.removeClass('transition').css({'width': percent});
  }
}

function clearWaitBars() {
  $('.wait-bar').css({'width': 0});
}

function showHitBars(source, target) {
  if (source == 'player') {
    source = $('.player-wrapper .hit-bar');
  } else if ( Number(source) ) {
    source = findMobWrapper(source).children('.hit-bar');
  } else {
    console.log("Error showing hitbar for " + source);
  }

  if (target == 'player') {
    target = $('.player-wrapper .gethit-bar');
  } else if ( Number(target) ) {
    target = findMobWrapper(target).children('.gethit-bar');
  } else {
    console.log("Error showing hitbar for " + target);
  }

  source.addClass('active');
  target.addClass('active');

  setTimeout( function() {
    target.removeClass('active');
  }, 500);
  setTimeout( function() {
    source.removeClass('active');
  }, 500);
}

function showGuarding(target) {
  if (target == 'player') {
    target = $('.player-wrapper .guard-bar');
  } else if ( Number(target) ) {
    target = findMobWrapper(target).children('.guard-bar');
  } else {
    console.log("Error showing hitbar for " + target);
  }
  target.addClass('active');
}

function hideGuarding(target) {
  if (target == 'player') {
    target = $('.player-wrapper .guard-bar');
  } else if ( Number(target) ) {
    target = findMobWrapper(target).children('.guard-bar');
  } else {
    console.log("Error showing hitbar for " + target);
  }

  target.addClass('hiding');
  setTimeout( function() {
    target.removeClass('active').removeClass('hiding');
  }, 1000);
}

function showDmgSplash(target, value, classes) {
  if (!classes) {
    classes = '';
  }
  if (target == 'player') {
    target = $('.player-wrapper');
  } else if ( Number(target) ) {
    target = findMobWrapper(target);
  }

  var span = '<span class="dmg-splash' + classes + '">' + value + '</span>'
  target.append(span);
  setTimeout( function() {
    target.children('span:not(.fade)').addClass('fade');
  }, 10);
  setTimeout( function() {
    target.children('span.fade').remove();
  }, 1500);
}

function showMissSplash(target) {
  if (target == 'player') {
    target = $('.player-wrapper');
  } else if (target == 'mob') {
    target = $('.mob-wrapper')
  }

  target.addClass('miss-splash');
  setTimeout( function() {
    target.removeClass('miss-splash').removeClass('miss-fade');
  }, 500);
}

function battleRound(mob, thisMob) {
  mob = checkArrayID(mobLibrary, currentTarget.ID);
  if (battling && battlingMobs.length > 0) {
    if (currentTarget.living && startedBy != 'mob') {
      playerWait++
      updateWaitBar('player', ( (playerWait) / (player.atkSpd - 1)) );
      turn++
      if (playerWait >= player.atkSpd) {
        playerAttack('atk', mob, currentTarget);
        playerWait = 0;
        updateWaitBar('player', 0);
      }
      checkPlayerSkills(mob, currentTarget);
    } else if (startedBy == 'mob') {
      mobAttack(mob, thisMob);
      //reset to player initiated
      startedBy = 'player';
      //console.log("Mob started battle - foregoing player attack");
    } else if (battlingMobs.length > 0) {
      targetMob(battlingMobs[0]);
      console.log("forcing last target in battlingMobs");
    } else {
      console.log("currentTarget isn't working");
    }
    $.each(mobSkillQueue, function() {
      var thisSkillMob = checkArray(theseMobs, this.source, 'instanceID');
      var skillMob = checkArrayID(mobLibrary, thisSkillMob.ID);
      //check if living, else remove from the queue
      if (!thisSkillMob.living) {
        removeThis(this, mobSkillQueue, "thisSkillMob is dead. Removed " + this.title + " from the queue.");
      } else {
        this.startupCounter--;
        if (this.startupCounter <= 0) {
          executeMobSkill(this, thisSkillMob, skillMob);
          removeThis(this, mobSkillQueue);
        }
      }
    });
    $.each(battlingMobs, function() {
      thisInstanceID = this;
      var thisAttackingMob = checkArray(theseMobs, thisInstanceID, 'instanceID');
      var attackingMob = checkArrayID(mobLibrary, thisAttackingMob.ID);
      //console.log("thisInstanceID: " + thisInstanceID);
      //console.log("thisAttackingMob: " + thisAttackingMob);
      //make sure it's alive and not passive
      if(thisAttackingMob.living) {
        if (!attackingMob.passive) {
          thisAttackingMob.mobWait++
          updateWaitBar(this, (thisAttackingMob.mobWait / (attackingMob.atkSpd - 1)) );
          thisAttackingMob.aggro = true;
          if (thisAttackingMob.mobWait >= attackingMob.atkSpd) {
            mobAttack(attackingMob, thisAttackingMob);
            thisAttackingMob.mobWait = 0;
            updateWaitBar(this, 0);
          }
        }
        //check if it has any bleeding
        if (thisAttackingMob.bleedDuration > 0) {
          //add to the counter
          thisAttackingMob.bleedCounter++
          // bleed threshold, duration, and severity is set in the player stats.
          if (thisAttackingMob.bleedCounter >= player.mobBleedInterval) {
            var bleedDmg = player.baseDmgMax*2*player.mobBleedDmgFactor
            log(attackingMob.title + " <dmg>bleeds</dmg> for <dmg>" + bleedDmg + "</dmg> damage!", 'battle');
            thisAttackingMob.currentHP -= bleedDmg;
            thisAttackingMob.bleedCounter = 0;
            thisAttackingMob.bleedDuration--;
          } else if (thisAttackingMob.bleedDuration <= 0) {
            thisAttackingMob.bleeding = false;
            console.log(attackingMob.title + " stopped bleeding");
          }
        }
      }
    });
  } else {
    endBattle('delay');
    clearInterval(battleTimer);
  }
  //scrollLogToBottom();
}

function checkPlayerSkills(mob, thisMob) {
  //check each entry in the skill queue and count it down
  $.each(playerSkillQueue, function() {
    this.startupCounter--
    //if it's time to execute, kill the thing!
    if (this.startupCounter <= 0 && thisMob.living) {
      //console.log("Startup time satisfied for skill " + this.entry);
      executePlayerSkill(this, mob, thisMob);
      //now add wait times to attack and skills
      if (this.skillWait) {
        addSkillWait(this.skillWait, 'player');
      }
      if (this.atkWait) {
        //console.log("delaying player atk by " + this.atkWait + " ticks");
        playerWait -= this.atkWait;
      }
      removeThis(this, playerSkillQueue);
    }
  });
}

function addSkillWait(ticks, target) {
  if (target = 'player') {
    //console.log("delaying all skills by " + ticks + " ticks");
    $.each(playerSkillQueue, function() {
      this.startupCounter += ticks;
    });
  }
}

function battleUpdate(mob, thisMob) {
  updateBars();
  //updateBattleHeight();
  thisMob.HPRatio = (thisMob.currentHP / thisMob.maxHP);
  if (thisMob.currentHP <= 0 && thisMob.living) {
    thisMob.living = false;
    if (mob.deathFunc) {
      mob.deathFunc(thisMob);
    }
    //if it's a unique enemy, kill it forever!
    if (mob.unique) {
      mob.living = false;
    }
    killMob(thisMob, mob);
  } else if (!thisMob.living) {
    console.log("battleUpdate, but it's already dead");
  }
  if (player.HP <= 0) {
    player.living = false;
    log("You died!", 'red');
    endBattle('delay');
    clearAggro();
    clearInterval(aggroTimer);
    player.actEnabled = false;
    player.moveEnabled = false;
    /*
    setTimeout(function() {
      fadeOutConsole();
    }, 2500)
    setTimeout(function() {
      init('died');
      fadeInConsole();
    }, 5000)
    */
    //scrollLogToBottom();
  }
}

function killMob(thisMob, mob) {
  checkKillQuests(thisMob, mob);
  log(mob.deathDesc, 'red', 'death');
  getSpoils(mob, thisMob);
  //remove the mobInstance from battlingMobs
  removeThis(thisMob.instanceID, battlingMobs, mob.title + " died.");
  if (battlingMobs.length < 1) {
    battleUpdate(mob, thisMob);
  } else if (battlingMobs.length >= 1) {
    //attack the next mob
    targetMob(battlingMobs[0]);
  }
  removeMobWrapper(thisMob.instanceID, 'dead', 'delay');
}

function endBattle(delay) {
  battling = false;
  player.battlingInstanceID = false;
  startedBySkill = false;
  battlingMobs = [];
  $.each(theseMobs, function() {
    this.aggro = false;
  });
  clearAggro();
  //empty out the queues. Later this will include a condition to only clear out single-serving attacks from the queue.
  playerSkillQueue = [];
  mobSkillQueue = [];
  if (mapBattling) {
    mapBattleEnd();
  }
  clearWaitBars();
  clearMobWrappers('delay');
  if (delay) {
    setTimeout(function() {
      if (!battling) {
        switchMap('room');
      }
    }, endBattleDelay);
  } else {
    switchMap('room');
  }
}

let playerSkillQueue = [];
let mobSkillQueue = [];

function addSkillQueue(skill, source, ailment) {
  if (source == 'player') {
    //don't do the skill if it would kill you.
    if ( skill.plasmoidCost && skill.plasmoidCost+player.level > player.plasmoid && (player.HP / player.baseHP <= .35) ) {
      log("Without <pu>plasmoid</pu>, <r>using so much blood</r> for " + skill.title + " would be <r>deadly</r>!");
      return false;
    } else {
      log(skill.customLog, 'battle skill');
      //put the skill in the queue
      playerSkillQueue.push(skill);
      //add the wait time to it
      var thisSkillQueue = playerSkillQueue[playerSkillQueue.length-1];
      thisSkillQueue.startupCounter = skill.startup;
      thisSkillQueue.ailment = ailment;
    }
  //otherwise, source is the instanceID of the mob
  } else if ( Number(source) ) {
    //tell 'em they're gonna do it
    log(skill.telegraph, "battle skill");
    mobSkillQueue.push(skill);
    //add the wait time to it
    var thisSkillQueue = mobSkillQueue[mobSkillQueue.length-1]
    thisSkillQueue.startupCounter = skill.startup;
    thisSkillQueue.source = source;
    skill.onHold = true;
    console.log(skill.title + " added to the mobSkillQueue");
    console.log("skill source: " + source);
    //logProps(skill);
  }
}

function playerAttack(type, mob, currentTarget, dmgMod) {
  var hitRoll = Math.random();
  var dmgRoll = Math.random();
  var currentWeapon = checkArrayID(summonLibrary, player.eqHand);
  var mobEvade = mob.evade;
  var hitCheck = parseFloat(player.hit) + mobEvade
  if (!mob.evade) {
    mobEvade = 0;
  }
  //check enemy type to see if they get an evade bonus
  if ( currentWeapon && inArray('heavy blade', currentWeapon.class) && inArray('small', mob.class) ) {
    mobEvade = mobEvade + 0.4;
    console.log("small enemy evading heavy blades " + mobEvade + " of the time");
  } else if ( currentWeapon && inArray('light blade', currentWeapon.class) && inArray('small', mob.class) ) {
    mobEvade = mobEvade + 0.2; //0.2
    console.log("small enemy evading light blades " + mobEvade + " of the time");
  }

  if (hitRoll <= hitCheck) {
    if (hitRoll <= mobEvade) {
      log(mob.title + " dodges your attack!", 'battle yellow');
    } else if (currentTarget.guarding) {
      log("Your attack bounces off " + mob.title + "'s guard!", 'battle yellow');
    } else if (!currentTarget.guarding) {
      damageMob(false, mob, currentTarget, dmgMod);
    }
    //check if it's still alive
    if (currentTarget.living) {
      //trigger any relevant buffs
      triggerBuffs('player', 'playerAttack');
    }
  } else if (hitRoll > hitCheck) {
    //log('You <span class="red">miss</span>!', 'battle');
    showMissSplash('player');
  } else {
    console.log("player.hit + mobEvade: " + hitCheck);
    log("Something's wrong with the player's attack damage.");
  }
  battleUpdate(mob, currentTarget);
}

function breakGuard(skill, mob, currentTarget) {
  log(skill.title + " breaks " + mob.title + "'s guard!", 'battle skill');
  currentTarget.guarding = false;
  //reset the mob's gaurd counter and delay it by the player's guard break duration
  currentTarget.guardCounter = 0 - player.guardBreakDuration;
  hideGuarding(currentTarget.instanceID);
}

function executePlayerSkill(skill, mob, currentTarget) {
  console.log("Executing skill: " + skill.entry);
  var atkAllowed = true;
  var attackSucceeded = false;
  var atkVerb = skill.atkVerb;
  if (!skill.atkVerb) {
    atkVerb = player.atkVerb;
  }
  if (skill.plasmoidCost) {
    updateStat('plasmoid', 'subtract', skill.plasmoidCost+player.level);
  }
  for (i = 0; i < skill.numOfAtks && currentTarget.living && battling; i++) {
    //console.log("Starting damage iterations");
    var hitRoll = Math.random();
    if (hitRoll <= skill.hit) {
      //If the mob is guarding and this skill doesn't guard break or pierce, bounce off
      if (currentTarget.guarding && !skill.guardBreak && !skill.pierce) {
        log("Your attack bounces off " + mob.title + "'s guard!", 'battle yellow');
      //If the mob is guarding and this skill DOES guard break, break it!
      } else if (currentTarget.guarding && skill.guardBreak) {
        breakGuard(skill, mob, currentTarget);
      }
      //If the mob isn't guarding or you have pierce, you're good to go
      if (!currentTarget.guarding || skill.pierce) {
        damageMob(skill, mob, currentTarget);
        checkInterrupt('player', skill, mob, currentTarget);
        //gotta put this here to check living/dead before afflicting ailments
        battleUpdate(mob, currentTarget);
        //if the skill connects and the order of the ailment is the same as the current hit, roll for the ailment
        //first check if it's an array of ailments
        if ( $.isArray(skill.ailment) && thisMob.living) {
          //console.log("check array of ailments");
          $.each(skill.ailment, function() {
            //set default affliction to 1st attack
            var afflictOn = this.afflictOn;
            if (!afflictOn) {
              afflictOn = 1;
            }
            if (this && afflictOn == i+1) {
              afflictMob(this, mob, currentTarget);
            }
          });
        //if it's a single ailment, just do it
        } else if (skill.ailment && thisMob.living) {
          //set default affliction to 1st attack
          var afflictOn = skill.ailment.afflictOn;
          if (!afflictOn) {
            afflictOn = 1;
          }
          //console.log("check single ailment");
          if (afflictOn == i+1) {
            afflictMob(skill.ailment, mob, currentTarget);
          }
        } else {
          //console.log("ailment: " + skill.ailment);
          //console.log("skill.ailment.afflictOn: " + skill.ailment.afflictOn + ", i = " + i);
        }
      }
    } else if (atkAllowed) {
      log('Your ' + skill.entry + ' <span class="red">misses</span>!', 'battle');
    }
  }
  battleUpdate(mob, currentTarget);
}

function checkInterrupt(source, skill, mob, currentTarget) {
  if (source == 'player' && skill.interrupter && mobSkillQueue.length > 0) {
    var mobSkillsChecked = 0;
    $.each(mobSkillQueue, function() {
      if (this.source == currentTarget.instanceID) {
        //remove it from the queue
        removeThis(this, mobSkillQueue);
        //make the skill usable again
        checkArray(mob.skills, this.title, 'title').onHold = false;
        log("Your " + skill.title + " interrupts " + mob.title + "!", 'green battle' );
        mobSkillsChecked++;
      }
    });
    //console.log("mobSkillsChecked: " + mobSkillsChecked);
  } else if (source == 'player' && skill.interrupter) {
    console.log("No monster skills to interrupt");
  } else if ( Number(source) ) {

  } else {
    console.log("something's wrong with the interrupt source");
  }
}

function executeMobSkill(skill, thisMob, mob) {
  var hitRoll = Math.random();
  //if the skill hits
  if (hitRoll <= skill.hit) {
    damagePlayer(mob, thisMob, skill.dmgFactor, skill.hitLog);
  } else if (skill.missLog) {
    log(skill.missLog, 'battle');
  } else {
    log(mob.title + " <g>misses</g> with " + skill.title + "!", 'battle');
  }
  //skill is no longer on hold - it can be used again
  skill.onHold = false;
}

function calculateMobDamage(dmgFactor, playerLevel, dmgMod) {
  var dmg = 0;
  if (!dmgMod) {
    dmgMod = 1;
  }
  if (playerLevel < 23) {
    //split damage formula into several variables, because it was buggy before
    var dmgB = (dmgFactor + 3) / 2.5; //damage base
    var dmgE = 1 + playerLevel / 12; //damage exponent
    dmg = Math.floor( (Math.pow(dmgB, dmgE) * 4 - 3)*dmgMod );
  } else if (playerLevel >= 23) {
    dmg = Math.floor( (Math.pow(dmgFactor, 1.2)*Math.pow(playerLevel/4, 1.7)-20)*dmgMod );
  }
  return dmg;
}

function damagePlayer(mob, thisMob, dmgMod, customLog) {
  var dmgRoll = Math.random();
  var dmg = 0;
  var logAppend;
  if (!dmgMod) {
    dmgMod = 1;
  }
  dmg = calculateMobDamage(mob.dmgFactor, player.level, dmgMod)
  //define the damage part of the log
  logAppend = ' for <span class="red">' + dmg + '</span> damage.';
  //check to see if it's suppressing the default log
  if (!customLog) {
    //log(mob.title + ' ' + mob.atkVerb + logAppend, 'battle');
  } else {
    log(customLog + logAppend, 'battle yellow');
  }
  player.HP -= dmg;
  showHitBars(thisMob.instanceID, 'player');
  showDmgSplash('player', dmg);

  //dmg = Math.floor(Math.random()*(mob.dmgMax - mob.dmgMin) + mob.dmgMin);
  //dmgRoll = Math.floor(player.level*2+( (mob.spreadFactor*player.level*dmg)*mob.dmgFactor)/3);
  //dmg = Math.floor(dmg*( (dmgRoll*-.5) * (mob.spreadFactor/3) + 1));
};

function damageMob(source, mob, currentTarget, dmgMod, customLog) {
  var dmgRoll = Math.random();
  var critRoll = Math.random();
  var spread = player.dmgMax - player.dmgMin;
  var baseSpread = player.baseDmgMax - player.baseDmgMin;
  var currentWeapon = checkArrayID(summonLibrary, player.eqHand);
  var dmg = 0;
  if (!dmgMod) {
    dmgMod = 1;
  }
  if ( source.class && source.class.includes("skill") ) {
    //console.log(source.title + " succeeded!");
    dmg = Math.floor( Number( (player.baseDmgMin + (dmgRoll*baseSpread) )*2*dmgMod ) );
    log('You ' + source.atkVerb + ' for <span class="dmg">' + dmg + '</span> damage.', 'battle');
  } else if (source == 'confusion') {
    dmg = calculateMobDamage(mob.dmgFactor, player.level, dmgMod)
    //define the damage part of the log
    log(mob.title + ' hurts itself in its confusion for <span class="dmg">' + dmg + '</span> damage.');
  } else {
    dmg = Math.floor( Number( (player.dmgMin + (dmgRoll*spread) )*dmgMod ) );
    if ( currentWeapon && inArray('dual blades', currentWeapon.class) && inArray('large', mob.class) ) {
      console.log("dual blades deal 60% damage to large enemies");
      dmg = Math.floor(dmg * 0.6);
    } else if ( currentWeapon && inArray('light blade', currentWeapon.class) && inArray('large', mob.class) ) {
      console.log("light blade deals 80% damage to large enemies");
      dmg = Math.floor(dmg * 0.8);
    }
    //roll for crit!
    if (critRoll <= player.critChance) {
      dmg = Math.floor(dmg*player.critFactor);
      log('You ' + player.atkVerb + " " + mob.title + ' with a <o>critical hit</o> for <o>' + dmg + '</o> damage!', 'battle');
    } else {
      //log('You ' + player.atkVerb + " " + mob.title + ' for <span class="dmg">' + dmg + '</span> damage.', 'battle');
    }
  }
  currentTarget.currentHP -= dmg;
  showHitBars('player', currentTarget.instanceID);
  showDmgSplash(currentTarget.instanceID, dmg);
}

function damageAllMobs(source, dmgMod, customLog) {
  if (theseMobs.length > 0) {
    var dmg = 0;
    var dmgRoll = 0;
    var mob;
    var baseSpread = player.baseDmgMax - player.baseDmgMin;

    $.each(theseMobs, function() {
      if (this.living) {
        //dmgRoll = Math.random();
        mob = checkArrayID(mobLibrary, this.ID);
        //dmg = Math.floor( Number( (player.baseDmgMin + (dmgRoll*baseSpread) )*dmgMod ) );
        damageMob(false, mob, this, dmgMod, customLog + " " + mob.title + ' for <span class="dmg">' + dmg + '</span> damage.', 'orange')
        //log(customLog + " " + mob.title + ' for <span class="dmg">' + dmg + '</span> damage.', 'orange');
        //this.currentHP -= dmg;
      }
    });

    // if not battling, attack the first enemy in the room
    if (!battling && theseMobs.length > 0 && battlingMobs.length < 1) {
      startedBy = 'player';
      startBattle(thisRoomIndex, checkArrayID(mobLibrary, theseMobs[0].ID), theseMobs[0]);
      console.log("Starting battle with the first enemy in theseMobs");
    }

    // aggro all the enemies in the room
    for (i = 0; i < theseMobs.length; i++) {
      var thisMob = theseMobs[i];
      var mob = checkArrayID(mobLibrary, thisMob.ID);
      var mobOffset = i * 4;
      aggroMob(thisMob, mob);
      thisMob.mobWait += mobOffset;
      console.log("Delaying mob by " + mobOffset);
    }
  } else {
    log("No nearby creatures to absorb the blow.");
  }
}

function mobAttack(mob, thisMob) {
  var hitRoll = Math.random();

  //if it's confused, roll for miss/self damage
  if (thisMob.confused) {
    var confuseHitRoll = Math.random() + player.mobConfuseHitMod;
    //flipping the operation here to make math make common sense
    if (confuseHitRoll >= .75) {
      damageMob('confusion', mob, currentTarget, 1);
    } else if (confuseHitRoll >= .5) {
      log(mob.title + " is lost in confusion!", 'battle');
    } else {
      damagePlayer(mob, thisMob);
    }
    thisMob.confuseDuration--;
    if (thisMob.confuseDuration <= 0) {
      log(mob.title + " regained its senses!", 'battle orange');
      thisMob.confused = false;
      thisMob.confuseDuration = 0;
    }
  } else if (hitRoll < mob.hit) {
    damagePlayer(mob, thisMob);
  } else {
    //log(mob.title + " <span class='green'>misses</span>!", 'battle');
    showMissSplash('mob');
  }
  //only do skills and guard if it's not berserk
  if (!thisMob.berserk) {
    //leaving this here vvv will mean mobs pause their guard counter while berserk
    thisMob.guardCounter++
    if (mob.skills) {
      //set the skill counter if it doesn't have one
      if(!thisMob.skillCounter) {
        thisMob.skillCounter = 0;
      }
      thisMob.skillCounter++;
      //cycle through the skills and check if any are due to be used
      $.each(mob.skills, function() {
        var skillRoll = Math.random();
        //dividing to check if the remainder is 0 (9 turns, use every 3 turns, remainder 0)
        //make sure not to start a skill twice before the first one executes - hence the onHold
        if (thisMob.skillCounter % this.freq == 0 && skillRoll <= this.freqChance && !this.onHold) {
          //add to the mobSkillQueue;
          addSkillQueue(this, thisMob.instanceID);
        }
      });
    }
    //check if it's time to guard (and that the mob is able to guard)
    if (mob.guard) {
      if (thisMob.guardCounter >= mob.guardWait && !thisMob.guarding) {
        //then guard! 50% chance after it reaches the threshold
        var guardRoll = Math.random();
        if (guardRoll > .5) {
          thisMob.guarding = true;
          log(mob.title + " puts up its guard!", 'yellow battle');
          thisMob.guardCounter = 0;
          showGuarding(thisMob.instanceID);
        }
      }
    }
  //else the mob is berserk
  } else {
    thisMob.berserkDuration--;
    if (thisMob.berserkDuration <= 0) {
      //catch sub-zero values
      thisMob.berserkDuration = 0;
      thisMob.berserk = false;
      log(mob.title + " regains its senses.", 'battle orange');
    }
  }
  battleUpdate(mob, thisMob);
}

function addBuff(source, buff, target) {
  if (!target) {
    target = 'player';
  }
  if (buff && source && target == 'player') {
    player.buffs.push(buff);
    //var thisBuff = player.buffs[player.buffs.length-1];
    //console.log("Added buff " + buff.title + " to player.buffs from " + source);
  } else if (buff && source && target != 'player') {
    target.buffs = [];
    target.buffs.push(buff);
  } else {
    console.log("Something went wrong adding a buff");
  }
}

function triggerBuffs(target, triggerType) {
  if (!target) {
    target = 'player';
  }

  if (target == 'player' && triggerType) {
    //get buffs that match the trigger and that aren't both out of duration and out of uses
    var matchingTriggerBuffs = $.grep(player.buffs, function (buff) {
      return inArray(triggerType, buff.triggerType) && (buff.duration || buff.uses);
    });
    //trigger each one
    $.each(matchingTriggerBuffs, function() {
      this.triggerFunc();
      //consume one use if it's into that kinda thing
      if (this.uses) {
        this.uses--
        //console.log("Player's " + this.title + " has " + this.uses + " uses left");
      }
    });
  } else if (triggerType) {
    //mobs go here
  } else {
    console.log("No triggerType define to trigger buffs on " + target);
  }
  cleanBuffs(target);
}

function cleanBuffs(target, buffClass) {
  if (!target) {
    target = 'player'
  }
  //find buffs that don't have a defined non-zero value for either duration or uses
  if (target == 'player' && !buffClass) {
    var expiredBuffs = $.grep(player.buffs, function (buff) {
      return (!buff.duration || buff.duration <= 0) && (!buff.uses || buff.uses <= 0);
    });
    //remove it from the buffs!
    $.each(expiredBuffs, function() {
      removeThis(this, player.buffs, 'removing expired buff ' + this.title + ' from player');
      log(this.title + " wore off.", 'buff');
    });
  } else if (target == 'player' && buffClass) {
    //if a specific type of buff is defined, match that instead
    var matchingBuffs = $.grep(player.buffs, function (buff) {
      return inArray(buffClass, buff.class);
    });
    //remove it from the buffs!
    $.each(matchingBuffs, function() {
      removeThis(this, player.buffs, 'removing buff ' + this.title + ' from player because it matches buffClass ' + buffClass);
      log(this.title + " no longer affects you.", 'buff');
    });
  } else if (target) {
    //mobs go here
  } else {
    console.log("No target defined for cleanBuffs")
  }
}

function afflictMob(ailment, mob, thisMob) {
  if (!ailment.hit) {
    ailment.hit = 1;
  }
  var hitRoll = Math.random();
  if (hitRoll <= ailment.hit && thisMob.living) {
    if (ailment.type == 'delay') {
      //value = ticks delayed
      if (ailment.customLog) {
        log(ailment.customLog, 'battle skill effect');
      } else {
        log("Your powerful blow delays " + mob.title + "!", "battle skill effect");
      }
      thisMob.mobWait -= ailment.duration;
      //console.log("delaying mob by " + ailment.duration + " rounds.")
    } else if (ailment.type == 'bleed') {
      var bleedDuration = player.mobBleedDuration;
      if (ailment.duration) {
        bleedDuration = ailment.duration;
      }
      if (ailment.customLog) {
        log(ailment.customLog, 'battle skill effect');
      }
      if (!thisMob.bleeding) {
        log(mob.title + " is <dmg>bleeding</dmg>!", 'battle');
        thisMob.bleeding = true;
        thisMob.bleedDuration = bleedDuration;
        thisMob.bleedCounter = 0;
        console.log("afflicting " + mob.title + " with bleed for " + bleedDuration + " repeats" );
      } else {
        //this is where bleeding would stack
        thisMob.bleedDuration += Math.floor(bleedDuration/2);
        thisMob.bleedCounter += 4;
      }
    } else if (ailment.type == 'berserk') {
      var berserkDuration = player.mobBerserkDuration;
      if (ailment.duration) {
        berserkDuration = ailment.duration;
      }
      if (!thisMob.berserk) {
        if (ailment.customLog) {
          log(ailment.customLog, 'battle skill effect');
        } else {
          log(mob.title + " goes berserk!", 'battle skill effect');
        }
        thisMob.berserk = true;
        //if it doesn't have the stat, make it
        if (!thisMob.berserkDuration) {
          thisMob.berserkDuration = berserkDuration;
        //if it does, add the value
        } else {
          thisMob.berserkDuration += berserkDuration;
        }
      }
    } else if (ailment.type == 'confuse') {
      var confuseDuration = player.mobConfuseDuration;
      if (ailment.duration) {
        confuseDuration = ailment.duration;
      }
      if (!thisMob.confused) {
        if (ailment.customLog) {
          log(ailment.customLog, 'battle skill effect');
        } else {
          log(mob.title + " gets confused!", 'battle skill effect');
        }
        thisMob.confused = true;
        //if it doesn't have the stat, make it
        if (!thisMob.confuseDuration) {
          thisMob.confuseDuration = parseInt(confuseDuration);
        //if it does, add the value
        } else {
          thisMob.confuseDuration += parseInt(confuseDuration);
        }
      }
    } else {
      console.log("tried to afflictMob but couldn't find ailment: " + ailment.type);
    }
  } else if (hitRoll > ailment.hit) {
    console.log("missed with " + ailment.type);
  }
}

function startTimer() {
  battleTimer = setInterval(function(){
    battleRound(mob, thisMob);
  }, battleSpeed);
}

/////////////////////////////////////////////
/* NPCs & TALKING */
/////////////////////////////////////////////

function activateNPCs() {
  if (currentRoom.NPCs) {
    $.each(currentRoom.NPCs, function() {
      var npc = checkArrayID(npcLibrary, this);
      if (npc.step) {
        var step = 'step' + npc.step;
        npc[step](npc);
        //console.log("trying to do npc[step]: " + npc[step]);
      }
    });
  }
}

function advanceStep(npc, number) {
  var thisNPC = checkArray(npcLibrary, npc);
  if (!thisNPC) {
    thisNPC = checkArrayID(npcLibrary, npc)
  }
  thisNPC.step = thisNPC.nextStep;
  thisNPC.nextStep++;
}

function advanceTalkPosition(thisNPC, number) {
  //if it's trying to pass a name through, look it up!
  if ( !$.isPlainObject(thisNPC) ) {
    thisNPC = checkArray(npcLibrary, thisNPC);
  }
  if (!number) {
    thisNPC.nextTalk++
    thisNPC.talk++
  } else if (number) {
    thisNPC.nextTalk = number;
    thisNPC.talk = number - 1;
  }
  if (thisNPC.nextTalk && player.talking) {
    log('>','info');
  }
}

function loopTalkPosition(thisNPC, number) {
  if (!number) {
    thisNPC.talk = thisNPC.nextTalk;
  } else if (number) {
    thisNPC.talk = number;
  }
  thisNPC.nextTalk = false;
  stopTalking();
}

function stopTalking() {
  player.talking = false;
}

function advanceDialog(npcID) {
  var npc = checkArrayID(npcLibrary, npcID);
  if (npc.nextTalk) {
    npc['talk' + npc.nextTalk](npc);
  }
}

/////////////////////////////////////////////
/* UI & EFFECTS FX */
/////////////////////////////////////////////

function activateConsole() {
  $('.input.console').removeAttr("readonly");
}

function deactivateConsole() {
  $('.input.console').attr("readonly", "readonly");
}

function fadeOutConsole() {
  deactivateConsole();
  $('.input-wrapper, .map-wrapper').addClass('blackout');
}

function fadeInConsole() {
  activateConsole();
  $('.input-wrapper, .map-wrapper').addClass('long-transition').removeClass('blackout');
  setTimeout( function() {
    $('.input-wrapper, .map-wrapper').removeClass('long-transition');
  }, 2500)
}

function setOpacity(number) {
  var wrapper;
  if ( $('.input-wrapper').hasClass('active') ) {
    wrapper = '.input-wrapper';
  } else {
    wrapper = '.map-wrapper';
  }
  $(wrapper).addClass('transition').css('opacity', number);
  setTimeout( function() {
    $(wrapper).removeClass('transition');
  }, 1200)
}

function resetOpacity() {
  var wrapper;
  if ( $('.input-wrapper').hasClass('active') ) {
    wrapper = '.input-wrapper';
  } else {
    wrapper = '.map-wrapper';
  }
  $(wrapper).addClass('transition').css('opacity', 1);
  setTimeout( function() {
    $(wrapper).removeClass('transition').css('opacity','');
  }, 1200)
}

/////////////////////////////////////////////
/* MILESTONES */
/////////////////////////////////////////////

function moveNPC(npcName, newRoomID) {
  var npc = checkArray(npcLibrary, npcName);
  //check for ID
  if (!npc) {
    checkArrayID(npcLibrary, npcName);
  }
  if (npc) {
    var prevRoomNPCs = checkArrayID(roomLibrary, npc.inRoom).NPCs;
    //remove the NPC from the previous room
    if (prevRoomNPCs) {
      removeThis(npc.ID, prevRoomNPCs);
      //change the room
      npc.inRoom = newRoomID;
      //add them to their new room
      var newRoom = checkArrayID(roomLibrary, newRoomID);
      if (newRoom) {
        newRoom.NPCs.push(npc.ID);
        console.log("Moved " + npc.title + " to room " + newRoomID);
      } else {
        console.log("Couldn't find newRoom ID " + newRoomID + " to add NPC to!");
      }
    } else {
      console.log("Couldn't remove NPC " + npcName + " from previous room!");
    }
  } else {
    console.log("Can't find NPC " + npcName + " to move to room ID " + newRoom + "!");
  }

}

function unlockRoom(roomID) {
  var room = checkArrayID(roomLibrary, roomID);
  if (room) {
    room.locked = false;
    console.log("RoomID " + roomID + " unlocked");
  } else {
    console.log("Can't find roomID " + roomID + " to unlock!");
  }
}

function milestone(num, loadGame, dev) {
  if (num == 1) {
    uniqueActions = [];
    var bastion1 = checkArray(bastions, 'bastion1');
    //player changes
    player.plasmoidEnabled = true;
    player.milestone = 1;
    unlockAction('stun');
    unlockAction('skills');
    unlockAction('summon');
    unlockSummon('chrystus');
    completeQuest('marcus', 'hidden');
    turnInQuest('marcus', 'hidden');
    //unlockSummon('arditi');
    //unlockSummon('virno');
    //npc changes
    marcus.talk = 31;
    marcus.nextTalk = 32;
    moveNPC('marcus', 1080);
    advanceStep('marcus');
    if (graff.talk == 4) {
      advanceTalkPosition(graff, 8);
    }
    //room changes
    checkArrayID(roomLibrary, 1052).exitN = 1080; //open access inside Marcus' estate
    //mob changes
    checkArrayID(mobLibrary, 2).guard = true; //enable and aggro for Dark Ones
    checkArrayID(mobLibrary, 2).aggro = true;
    //world changes
    discoverPOI(bastions, 'bastion1');
    discoverPOI(terr1POIs, 'graff');
    // HUD changes
    $('.bars.plasmoid').removeClass('hidden');

    // only do the following the FIRST time you hit the milestone. i.e. not when loading the game
    if (!loadGame) {
      act('goto', '1080', true, 'directAct');
      //world travel
      mapCoord = [bastion1.coords.x, bastion1.coords.y];
      worldUpdateXY(mapCoord[0], mapCoord[1]);
      switchTerritory(1);
    }
    if (dev) {
      //dev helpers
      playerReset(1, 1);
      act('sum', 'chrystus');
      discoverRecipe(501);
    }
    console.log("player reached milestone 1!");
  } else if (num == 2) {
    //check through all the other milestones, make sure they've been hit.
    for (i = 1; i < num; i++) {
      var mil = "milestone" + i;
      if (!player[mil]) {
        milestone(i);
      }
    }
    player.milestone = 2;
    addXP(1100);
    discoverRecipe(502);
    addInv(501, 2);
    addInv(502);
    discoverPOI(terr23POIs, 'tower');
    unlockSummon('arditi');
    unlockAction('flurry');
    act('sum', 'arditi');
    act('goto', '1200', true, 'directAct');
    //world changes
    mapCoord = [-56, -26];
    worldUpdateXY(mapCoord[0], mapCoord[1]);
    switchTerritory(2);
  } else {
    console.log("can't find milestone: " + num);
  }
}

function unlockAction(action) {
  var result = checkArray(actLibrary, action, 'input');
  if (result && result.locked) {
    result.locked = false;
    console.log("Unlocked action: " + result.entry);
  } else {
    console.log("can't find the action " + action + " to unlock it!");
  }
}

function lockAction(action) {
  var result = checkArray(actLibrary, action, 'input');
  if (result && !result.locked) {
    result.locked = true;
    console.log("Locked action: " + result.entry);
  } else {
    console.log("can't find the action " + action + " to lock it!");
  }
}

function unlockSummon(summonID) {
  if ( !Number(summonID) ) {
    summonID = checkArray(summonLibrary, summonID).ID;
    //console.log("searched for summonID and found: " + summonID)
  }
  var result = checkArrayID(summonLibrary, summonID);
  if (result) {
    result.locked = false;
    console.log("Unlocked summon: " + result.title);
  } else {
    console.log("can't find the summonID " + summonID + " to unlock it!");
  }
}

/////////////////////////////////////////////
/* MISC */
/////////////////////////////////////////////

function look() { act('l'); }

function showHint() {
  log('type ? to see a list of commands.', 'debug');
}

/////////////////////////////////////////////
/* INPUT & INITIALIZATION */
/////////////////////////////////////////////

function logStepBack() {
  if (consolePos === false) {
    //if you're at the latest
    consolePos = consoleLibrary.length - 1;
  } else if (consolePos > 0) {
    // if you're in the middle, keep going
    consolePos--;
  } else {
    //don't do anything if you're already at the beginning;
  }
  //console.log("stepping back to consolePos: " + consolePos);
  $console.val(consoleLibrary[consolePos]);
}

function logStepForward() {
  if (consolePos === false) {
    //don't do anything if you're already at the latest;
  } else if (consolePos < consoleLibrary.length - 1) {
    // if you're in the middle, keep going
    consolePos++;
  }
  //console.log("stepping back to consolePos: " + consolePos);
  $console.val(consoleLibrary[consolePos]);
}

function resetLog() {
  $('.log.input .log-inner').children(':not(.no-clear)').remove();
}

function resetConsole(string) {
  if (string) {
    $console.val(string);
  } else {
    $console.val('');
  }
}

$('.console-form').submit(function (e) {
  e.preventDefault();
  //reset the consoleLibrary Position
  consolePos = false;
  var rawInput = $console.val().trim();
  //lower-case the first letter for mobile devices
  rawInput = rawInput.substr(0,1).toLowerCase() + rawInput.substr(1);
  //death
  /*if (!player.living) {
    e.preventDefault();
    log("You're dead!", "red");
    $console.val('');
  }*/
  //don't do anything if it's blank or you're dead
  if (player.talking && !rawInput && player.living) {
    advanceDialog(player.talking);
  } else if (rawInput && player.living) {
    //add it to the bank
    consoleLibrary.push(rawInput);
    //split what the player types into action, direct object, and indirect object
    var splitInput = rawInput.split(" ");
    //show what they type in the log
    log(rawInput, 'raw-input');
    //reset the console
    $console.val('');
    //split the input into action, direct object, and indirect object
    act(splitInput[0], splitInput[1], splitInput[2], false, rawInput);
    //console.log(splitInput[0] + " " + splitInput[1] + " " + splitInput[2]);
  } else if (!rawInput) {
    //if the console is empty, don't do anything!
    e.preventDefault();
  }
});

//var bgmWhiteCrag = $buzz('https://drive.google.com/open?id=1_wIJB8-OVMIULtlMcMJm4-Un1oTg3-dR');


const bgmWhiteCrag = new Howl({
  src: ['https://drive.google.com/uc?export=download&id=1_wIJB8-OVMIULtlMcMJm4-Un1oTg3-dR'],
  loop: true,
  volume: 1,
  autoplay: false,
  //loopPos: 0 //# of milliseconds into the file when the loop should shard
});

function playMusic() {
  bgmWhiteCrag.play();
  //document.removeEventListener("mousemove", playMusic);
  console.log("Playing music");
}


/*

$('.fullBody').on('click', function(){
		bgmWhiteCrag.play();
	});
}

function listenForFirstInput() {
  bgmWhiteCrag.once('load', function(){
    sound.play();
  });
  //document.addEventListener("mousemove", playMusic);
}

*/

function showTitle() {
  var recentSave = localStorage.getItem('BloodSummonerSaveGame');

  $('.log.input, .bars.hp').addClass('hidden');
  $('.title-wrapper').removeClass('hidden');
  playMusic();
  if (recentSave) {
    $('.sub-line.load').removeClass('hidden');
  } else {
    console.log("Didn't find recentSave: " + recentSave);
  }
}

function hideTitle() {
  $('.title-wrapper').addClass('hidden');
  setTimeout(function() {
    $('.log.input, .bars.hp').removeClass('hidden');
  }, 1500);
}

$('.title-wrapper, .input-wrapper, html, body').click(function() {
  $('.console.input').focus();
});

// NPC shorthand

let marcus = checkArrayID(npcLibrary, 901);
let trimble = checkArrayID(npcLibrary, 902);
let bart = checkArrayID(npcLibrary, 903);
let graff = checkArrayID(npcLibrary, 904);

function init(reason, loadGame) {
  hideTitle();
  if (reason == 'load' && loadGame) {
    //world
    mapCoord = loadGame.world.mapCoord;
    currentTerritory = loadGame.world.currentTerritory;
    mapTutorial = loadGame.world.mapTutorial;
    worldMap = loadGame.world.worldMap;
    //player
    setLevel(loadGame.player.level, loadGame.player.HPRatio, loadGame.player.plasmoidRatio);
    player.inRoom = loadGame.player.inRoom;
    player.XP = parseInt(player.prevXP + ((player.nextXP - player.prevXP) * loadGame.player.playerXPPercent));
    invLibrary = [];
    $.each(loadGame.player.invLibrary, function() {
      addInv(this);
    });
    checkArrayID(invLibrary, 99).contents = loadGame.player.craftingInv;
    knownRecipes = loadGame.player.knownRecipes;
    uniqueActions = loadGame.player.uniqueActions;
    act('equip', loadGame.player.eqHand, 'directAct');
    act('equip', loadGame.player.eqArmor, 'directAct');
    act('equip', loadGame.player.eqAccessory, 'directAct');
    //stat unlocks
    player.stLevel = loadGame.player.stLevel;
    player.stHPMax = loadGame.player.stHPMax;
    player.stPlasmoidMax = loadGame.player.stPlasmoidMax;
    player.stHitPercent = loadGame.player.stHitPercent;
    player.stDPS = loadGame.player.stDPS;
    player.stCrit = loadGame.player.stCrit;
    player.stMobBleed = loadGame.player.stMobBleed;
    player.stGuardBreak = loadGame.player.stGuardBreak;
    player.stMobBerserk = loadGame.player.stMobBerserk;
    player.stMobConfuse = loadGame.player.stMobConfuse;
    player.stAssault = loadGame.player.stAssault;
    player.stXPNext = loadGame.player.stXPNext;

    player.atkTitle = loadGame.player.atkTitle;
    player.plasmoidEnabled = loadGame.player.plasmoidEnabled;
    player.moveEnabled = loadGame.player.moveEnabled;
    player.milestone = loadGame.player.milestone;
    player.playTimeSeconds = loadGame.player.playTimeSeconds;
    player.playTimeMinutes = loadGame.player.playTimeMinutes;
    player.playTimeHours = loadGame.player.playTimeHours;
    playerReset(loadGame.player.HPRatio, loadGame.player.plasmoidRatio);
    if (player.milestone) {
      milestone(player.milestone, 'load');
    }
    //update playerQuests with their previous state
    $.each(playerQuests, function() {
      if (loadGame.quests[this.ID] == 'failed') {
        this.failed = true;
        this.accepted = true;
      } else if (loadGame.quests[this.ID] == 'turnedIn') {
        this.turnedIn = true;
        this.completed = true;
        this.accepted = true;
      } else if (loadGame.quests[this.ID] == 'completed') {
        this.completed = true;
        this.accepted = true;
      } else if (loadGame.quests[this.ID] == 'accepted') {
        this.accepted = true;
      } else {
        console.log('Quest ID ' + this.ID + ' remains undiscovered.');
      }
    });
    //checkKillQuests();
    checkCollectQuests();
  } else if (reason == 'died') {
    console.log()
  } else {
    //set map to default
    mapCoord = [-22,-41];
    worldMap = false;
    playerReset(1, 1);
  }
  lockAction('new');
  lockAction('load');
  resetLog();
  showHint();
  worldUpdateXY(mapCoord[0], mapCoord[1]);
  if (worldMap) {
    switchMap('world');
  } else {
    switchMap('room');
  }
  setPOIHiders(terr1POIs);
  setPOIHiders(terr23POIs);
  setPOIHiders(terr4POIs);
  setPOIHiders(terr5POIs);
  setPOIHiders(terr6POIs);
  setPOIHiders(terr7POIs);
  setPOIHiders(bastions);
  //reset player to full health and plasmoid
  roomReset();
  //not currently using this
  if (reason == 'died') {
    player.living = true;
    player.actEnabled = true;
    player.moveEnabled = true;
    act('goto', 1003, 'hidden');
    act('cl');
    log("You're back... but how?")
  } else if (reason == 'load') {
    act('goto', player.inRoom, 'hidden');
    act('cl');
    look();
  } else {
    look();
  }
  if (currentRoom.func) {
    currentRoom.func();
  }
  //listenForFirstInput();
  clearInterval(playTimer);
  //this playTime interpreter is stupidly long.
  playTimer = setInterval(function() {
    var secs;
    player.playTimeSeconds++;
    if (player.playTimeSeconds >= 60) {
      player.playTimeMinutes++;
      player.playTimeSeconds = 0;
    }
    if (player.playTimeMinutes >= 60) {
      player.playTimeHours++;
      player.playTimeMinutes = 0;
    }
    if (player.playTimeHours) {
      player.playTime = player.playTimeHours + ':';
    } else {
      player.playTime = '00:';
    }
    if (player.playTimeMinutes) {
      if (player.playTimeMinutes < 10) {
        player.playTime += '0' + player.playTimeMinutes + ':';
      } else {
      player.playTime += player.playTimeMinutes + ':';
      }
    } else {
      player.playTime += '00:';
    }
    if (player.playTimeSeconds < 10) {
      player.playTime += ('0' + player.playTimeSeconds);
    } else {
      player.playTime += player.playTimeSeconds;
    }
  }, 1000);
}

showTitle();
