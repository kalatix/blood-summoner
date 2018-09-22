/* NPC Types:
follow
quest
interactive
static
*/

//Set up quest log arrays, to display persistent quest-related info as you travel. contents are strings.
let qLog1 = []; //displayed at the top
let qLog2 = []; //displayed below qlog1, above the room desc
let qLog3 = []; //displayed between objects and enemies
let qLog4 = []; //displayed between enemies and exits
let qLog5 = []; //displayed after exits
/* quest logs are objects:
 { log, class, type, source }
//Quest log types:
 room: only displays in the room
 perm: displays until removed manually
*/

let npcLibrary = [
  {
    entry: 'marcus',
    title: 'Marcus',
    ID: 901,
    type: 'interactive',
    step: 1,
    nextStep: 2,
    talk: 1,
    nextTalk: 2,
    talkable: true,
    inRoom: 1052,
    firstMeeting: false,
    roomDesc: "A hulking man stands here, with biceps are as big as your chest. His leather wraps are worn and bloodied, but it doesn't look like his blood.",
    type: 'marcus',
    step1: function(thisNPC) {
      addUniqueAction({
        entry: 'knock',
        onlyInRoom: this.inRoom,
        talk: true,
        once: true,
        hidden: false,
        func: function() {
          log('You approach the massive mahogany door and lift the heavy metal knocker. It falls with a loud, hollow clang. After a moment the door creaks open.');
          act('talk', 'marcus');
        }
      });
    },
    step2: function(thisNPC) {
      qLogAdd({
        array: qLog3,
        log: "<w>Marcus</w>'s huge frame towers over you.",
        class: "",
        type: "room",
        source: 'marcus',
        ID: 820
      });
    },
    talk1: function(thisNPC) {
      log("The heavy wooden door swings open enough to show Marcus' giant frame, with his hands behind his back. He stares at you with hard, intense eyes.");
      advanceTalkPosition(thisNPC, 2);
    },
    talk2: function(thisNPC) {
      log("At length, he intones: ");
      log("I assume you've come here for something. What is it?", 'dialog');
      addUniqueAction({
        entry: 'show letter',
        onlyInRoom: thisNPC.inRoom,
        talk: true,
        once: true,
        func: function(thisNPC) {
          thisNPC.talk3(thisNPC);
        }
      });
      showUniqueActions();
    },
    talk3: function(thisNPC) {
      log("Marcus reads the letter twice over. After a moment he meets you with that same wide stare. You feel pressure on your eyes as if his stare is enough to push you away.")
      log("...And? If you think a letter is going to get me to recind my vow and make you a Blood Summoner, you're gravely mistaken.",'dialog');
      advanceTalkPosition(thisNPC, 4);
    },
    talk4: function(thisNPC) {
      log("Marcus' face reddens, becoming angrier than before. He spits his words at you.");
      log("And what a foul cry, coming at me with that. And from Verne, no less!", 'dialog');
      addUniqueAction({
        entry: 'verne',
        onlyInRoom: thisNPC.inRoom,
        talk: true,
          once: true,
        func: function(thisNPC) {
          thisNPC.talk5(thisNPC);
        }
      });
      showUniqueActions();
    },
    talk5: function(thisNPC) {
      log("Yes, of course I know Verne. At least I thought I knew him, but it turns out he's gone back on everything just like I thought he would. The question is, how do you know him?", 'dialog');
      addUniqueAction({
        entry: 'family',
        onlyInRoom: thisNPC.inRoom,
        talk: true,
        once: true,
        func: function(thisNPC) {
          log("You tell Marcus that Verne is your father. Marcus is silent for a while, something brooding inside him.");
          thisNPC.talk6(thisNPC);
        }
      });
      showUniqueActions();
    },
    talk6: function(thisNPC) {
      log("...Did he do it? Did he find a way?", 'dialog');
      advanceTalkPosition(thisNPC, 7);
    },
    talk7: function(thisNPC) {
      log("His experiments, his research, his whole reason for leaving! Did he succeed or fail?", 'dialog');
      addUniqueAction({
        entry: 'unsure',
        onlyInRoom: thisNPC.inRoom,
        talk: true,
          once: true,
        func: function(thisNPC) {
          log("Your father never shared with you what he was working on.", 'info');
          thisNPC.talk8(thisNPC);
        }
      });
      showUniqueActions();
    },
    talk8: function(thisNPC) {
      log("You don't know! You've come across the ocean from God-knows-where and you don't even know if his post-life's work amounted to anything!", 'dialog');
      advanceTalkPosition(thisNPC, 9);
    },
    talk9: function(thisNPC) {
      log("Marcus turns, gazing at something inside. At length, he sighs.");
      log("Your letter doesn't mean anything to me. Leave this place.", 'dialog');
      log("Marcus shuts the door in your face.", 'yellow');
      stopTalking();
      advanceTalkPosition(thisNPC);
      thisNPC.step2(thisNPC);
      thisNPC.firstMeeting = true;
      showUniqueActions();
      addUniqueAction({
        entry: ['n', 's', 'e', 'w', 'north', 'south', 'east', 'west', 'flee'],
        onlyInRoom: thisNPC.inRoom,
        talk: true,
          once: true,
        hidden: true,
        func: function(thisNPC) {
          marcus.step = 2;
          removeUniqueAction('n');
          showUniqueActions();
          player.talking = 901;
          player.moveEnabled = false;
          player.actEnabled = false;
          marcus.talk11(marcus);
        }
      });
    },
    talk10: function(thisNPC) {
      log("Go away.", 'dialog');
      stopTalking();
      thisNPC.step2(thisNPC);
    },
    talk11: function(thisNPC) {
      log("As you set your feet to leave, something explodes near you.", 'yellow');
      log("The world spins. Your ears ring loudly as you try to stand. Thick smoke strangles your breathing.");
      advanceTalkPosition(thisNPC, 12);
    },
    talk12: function(thisNPC) {
      log("Struggling see what's going on, you notice blood and a thick purple liquid on your hand. Everything feels like it's on fire. There's blood everywhere. It's yours.");
      log("You try to call out to Marcus, but your throat fills with liquid. You can't seem to take a good breath. You gasp for air.");
      advanceTalkPosition(thisNPC);
    },
    talk13: function(thisNPC) {
      log("Your eyelids grow heavy. The world fades from view.");
      thisNPC.nextTalk = false;
      setTimeout(function() {
        fadeOutConsole();
      }, 2000);
      setTimeout(function() {
        act('goto', '1080', false, 'directAct');
        marcus.inRoom = 1080;
        resetConsole();
        resetLog();
        log("It's dark. You feel like you're floating.");
        fadeInConsole();
        setOpacity(.5);
        advanceTalkPosition(thisNPC, 14);
        act('talk', 'marcus', '15', 'directAct', 'talk marcus 15');
      }, 7000);
    },
    talk14: function(thisNPC) {
      log("You hear a low voice muttering something far away. There's a small bit of light above you.");
      setOpacity(.6);
      advanceTalkPosition(thisNPC);
    },
    talk15: function(thisNPC) {
      log("Thick liquid laps on your chest. It stings, but at the same time it sooths a dull pain.");
      advanceTalkPosition(thisNPC);
    },
    talk16: function(thisNPC) {
      log("The room grows a bit brighter. The talking gets closer. Reminds you of your father's voice.");
      setOpacity(.8);
      advanceTalkPosition(thisNPC);
    },
    talk17: function(thisNPC) {
      log("You're awake already? Don't move, don't do anything.", 'dialog');
      log("The voice belongs to Marcus.");
      thisNPC.nextTalk = false;
      addUniqueAction({
        entry: 'what happened',
        onlyInRoom: thisNPC.inRoom,
        talk: true,
          once: true,
        func: function(thisNPC) {
          thisNPC.talk18(thisNPC);
        }
      });
      showUniqueActions();
    },
    talk18: function(thisNPC) {
      log("You try to ask about the explosion, but your voice is weak. You choke on the grainy liquid enveloping you.");
      log("Just relax, you'll be better soon enough.", 'dialog')
      advanceTalkPosition(thisNPC, 19);
    },
    talk19: function(thisNPC) {
      setOpacity(0);
      setTimeout( function() {
        resetConsole();
        resetLog();
        resetOpacity();
        thisNPC.talk20(thisNPC);
      }, 2000)
    },
    talk20: function(thisNPC) {
      log("You feel a tugging on your chest, accompanied by a dull pain. Someone is standing over you.");
      log("Feeling any better?", 'dialog');
      advanceTalkPosition(thisNPC, 21);
    },
    talk21: function(thisNPC) {
      log("You've been sleeping for several days now. You've recovered quite well.", 'dialog');
      log("Marcus takes a long pause. He cuts a thread with medical scissors and puts down his tools beside you.");
      advanceTalkPosition(thisNPC);
    },
    talk22: function(thisNPC) {
      log("I'm sure you have questions. I'm also sure you won't like the answers. The only thing you need to know right now is that...", 'dialog');
      log("His voice grows quiet.");
      advanceTalkPosition(thisNPC);
    },
    talk23: function(thisNPC) {
      log("Any debt to your father Verne - consider it repayed.", 'dialog');
      addUniqueAction({
        entry: 'debt',
        onlyInRoom: thisNPC.inRoom,
        talk: true,
          once: true,
        func: function(thisNPC) {
          thisNPC.talk24(thisNPC);
        }
      });
      showUniqueActions();
    },
    talk24: function(thisNPC) {
      log("Marcus removes his medical gloves and begins helping you out of the basin of smoky liquid you were lying in.");
      log("You got what you wanted, kid.", 'dialog');
      advanceTalkPosition(thisNPC, 25);
    },
    talk25: function(thisNPC) {
      log("That's right, you're a <w>Blood Summoner</w> now.", 'dialog');
      thisNPC.nextTalk = false;
      addUniqueAction([
        {
          entry: 'explosion',
          talk: true,
          once: true,
          onlyInRoom: thisNPC.inRoom,
          func: function(thisNPC) {
            thisNPC.talk26(thisNPC);
          }
        },
        {
          entry: 'how',
          talk: true,
          once: true,
          onlyInRoom: thisNPC.inRoom,
          func: function(thisNPC) {
            thisNPC.talk27(thisNPC);
          }
        }
      ]);
      showUniqueActions();
    },
    talk26: function(thisNPC) {
      log("That wasn't an explosion, that was a Spitter. Its projectile venom burned you all over. Caustic stuff. Your neck, chest, left arm. But they're healing up quite nicely due to your new summoner blood.", 'dialog');
      showUniqueActions();
    },
    talk27: function(thisNPC) {
      removeUniqueAction('explosion');
      log("You wouldn't understand the full process, but the short of it is that I fused your blood with the blood from those creatures using this.", 'dialog');
      log("Marcus points to a silver and glass canister about the size of your forearm. It swirls with purple liquid that refracts light in an otherworldly way. A <w>Blood Syphon</w>.");
      advanceTalkPosition(thisNPC, 28);
    },
    talk28: function(thisNPC) {
      log("It was the only way to save your life. I knew it would take, because your father's capacity for summoning was something of legend.", 'dialog');
      log("But there's a catch.", 'dialog');
      addUniqueAction({
        entry: 'catch',
        onlyInRoom: thisNPC.inRoom,
        talk: true,
          once: true,
        func: function(thisNPC) {
          thisNPC.talk29(thisNPC);
        }
      });
      showUniqueActions();
    },
    talk29: function(thisNPC) {
      log("The path of a Blood Summoner is deadly and dark. Your blood is tainted forever. Seizures, hallucinations, dementia and dissociation, loss of vision and hearing - summoners suffer all of these and more. You're in a very fragile state right now, and those creatures can smell you from a mile away. They won't stop at anything before they tear you apart.", 'dialog');
      advanceTalkPosition(thisNPC, 30);
    },
    talk30: function(thisNPC) {
      log("I've prepared this clocktower to offer some protection, but it won't hide you for long. Come on, there's a lot to learn. Especially because you don't know a single thing yet.", 'dialog');
      log("Marcus leaves the room, beckoning you to follow.");
      thisNPC.nextTalk = false;
      addUniqueAction({
        entry: 'start training',
        talk: true,
          once: true,
        onlyInRoom: thisNPC.inRoom,
        func: function(thisNPC) {
          player.actEnabled = true;
          player.moveEnabled = true;
          advanceTalkPosition(thisNPC, 31);
          act('talk', 'marcus', false, 'directAct', 'talk marcus');
          milestone(1);
        }
      });
      showUniqueActions();
    },
    talk31: function(thisNPC) {
      log("Over the next several days, Marcus shows you the way of the Blood Summoner.", 'yellow');
      log("You learn how to tap into weapon <w>skills</w> using energy from the Dark Dimension, how to use <w>Plasmoid Pools</w> to restore your health and energy, and most importantly - how to <w>summon</w> ancient weapons to aid in your fight against the Dark Creatures.", 'info');
      advanceTalkPosition(thisNPC, 32);
      //thisNPC.talk32(thisNPC);
    },
    talk32: function(thisNPC) {
      log("Good work today. I think you're getting the hang of it. Although I wouldn't say you're ready by any means, I need to make a trip to the mainland and you're going to be on your own.", 'dialog');
      advanceTalkPosition(thisNPC);
    },
    talk33: function(thisNPC) {
      log("Summoning weapons is free, but using your powerful new skills consumes Plasmoid. You regenerate Plasmoid naturally over time and by killing enemies. If you don't have enough plasmoid to use a skill, you will subtract from your own health. Balance offense and defense wisely!", 'info');
      advanceTalkPosition(thisNPC);
    },
    talk34: function(thisNPC) {
      log("I believe General Graff wanted to speak with you. Make sure to see him at the ramparts.", 'dialog');
      log("Make sure to <w>summon</w> your weapon!");
      loopTalkPosition(thisNPC, 34);
    },
    talkX: function(thisNPC) {
      log("", 'dialog');
      advanceTalkPosition(thisNPC);
    },
    talkX: function(thisNPC) {
      log("", 'dialog');
      advanceTalkPosition(thisNPC);
    },
    talkX: function(thisNPC) {
      log("", 'dialog');
      advanceTalkPosition(thisNPC);
    },
    talkX: function(thisNPC) {
      log("", 'dialog');
      advanceTalkPosition(thisNPC);
    },
    talkX: function(thisNPC) {
      log("", 'dialog');
      advanceTalkPosition(thisNPC);
    },
    talkX: function(thisNPC) {
      log("", 'dialog');
      advanceTalkPosition(thisNPC);
    },
  },
  {
    entry: ['trimble', 'father', 'man'],
    title: 'Father Trimble',
    roomDesc: "A frail <w>man</w> picks through monster remains.",
    ID: 902,
    type: 'interactive',
    step: 1,
    nextStep: 2,
    talk: 1,
    nextTalk: 2,
    talkable: true,
    inRoom: 1012,
    askedCollege: false,
    introduced: false,
    step1: function(thisNPC) {
      qLogAdd({
        array: qLog3,
        log: "A frail <w>man</w> picks through monster remains.",
        class: "",
        type: "room",
        source: 'trimble',
        ID: 800
      });
      qLogAdd({
        array: qLog5,
        log: "Type <o>talk man</o> to start a conversation.",
        class: "",
        type: "room",
        source: 'trimble',
        ID: 801
      });
    },
    step2: function(thisNPC) {
      qLogRemove(800);
      qLogRemove(801);
      qLogAdd({
        array: qLog3,
        log: "Father <w>Trimble</w> picks through monster remains, looking for something.",
        class: "",
        type: "room",
        source: 'trimble',
        ID: 802
      });
    },
    talk1: function(thisNPC) {
      log("Eh, who are yeh?", 'dialog');
      log("press <o>enter</o> to advance dialog", "info");
      advanceTalkPosition(thisNPC, 2);
    },
    talk2: function(thisNPC) {
      log("How yeh get ta here? Not a fisherman by th'looks a yeh. Waves too rough round these parts anyhow. An' with the monsters vicious as they are wont ta these days, it's a wonder nobody travels at all. If yeh aren't no fisherman, are yeh lost?", "dialog");
      addUniqueAction({
        entry: 'show letter',
        onlyInRoom: thisNPC.inRoom,
        talk: true,
          once: true,
        func: function(thisNPC) {
          thisNPC.talk3(thisNPC);
        }
      });
      showUniqueActions();
      log("People and places will often have unique commands. Type <o>show letter</o> to show the letter you have in your inventory.", "info");
    },
    talk3: function(thisNPC) {
      log("Ah, Marcus. I know 'im. Big man, that one. Crush yeh like a poefruit, he will. Ye'll find 'im at the Bastion up north like always. Poor soul hardly leaves his courtyard anymore. Full a sadness, he.", "dialog");
      log("Why yeh lookin fer 'im, anyhow? Yeh from the college?", "dialog");
      checkQuest('find marcus').area = "Bastion north of White Crag";
      qLogRemove('802');
      discoverPOI(bastions, 'bastion1');
      thisNPC.nextTalk = false;
      addUniqueAction([
        {
          entry: 'college',
          onlyInRoom: thisNPC.inRoom,
          talk: true,
          once: true,
          func: function(thisNPC) {
            thisNPC.talk4(thisNPC);
          }
        },
        {
          entry: 'ask name',
          onlyInRoom: thisNPC.inRoom,
          talk: true,
          once: true,
          func: function(thisNPC) {
            thisNPC.talk5(thisNPC);
          }
        },
        {
          entry: 'goodbye',
          onlyInRoom: thisNPC.inRoom,
          talk: true,
          once: true,
          func: function(thisNPC) {
            thisNPC.talk6(thisNPC);
            stopTalking();
          }
        }
      ]);
      showUniqueActions();
    },
    //college?
    talk4: function(thisNPC) {
      log("Never heard a the college? Yeh must be from right far off. Thar's a place ta study what's left a the world far east a here. Not sure I could say exactly where, but I know they study the only book that matters anymore. The Dark Codex.", "dialog");
      thisNPC.askedCollege = true;
      showUniqueActions();
    },
    //ask name
    talk5: function(thisNPC) {
      log("Name's Father Trimble, meself. Ain't much of a father now though. 'Erebody near up an' died in my parts. All my church is gone, save me. Loved 'em ta the last of the light. No, I'm travelin meself - lookin fer somethin that I ain't sure even exists. A <span class='purple'>mystical necklace</span>.", "dialog");
      log("Well a right pleasure ta meet yeh, it is. Hope yeh find the big man Marcus up north.", "dialog");
      thisNPC.step = 2;
      thisNPC.introduced = true;
      showUniqueActions();
    },
    //goodbye
    talk6: function(thisNPC) {
      log("Stay safe and sane, young traveler. Thought I saw a <o>dagger</o> just north of here.", 'dialog');
      log("Father Trimble goes back to his searching.");
      loopTalkPosition(thisNPC, 6);
    }
  },
  {
    entry: ['bart', 'merchant', 'redcape'],
    title: 'Bart the Red-Caped Merchant',
    roomDesc: "A thrifty-looking merchant in a deep red cape becons you.",
    ID: 903,
    type: 'interactive',
    step: 1,
    nextStep: 2,
    talk: 1,
    nextTalk: false,
    talkable: true,
    offerAccepted: false,
    inRoom: 1032,
    step1: function(thisNPC) {
      qLogAdd({
        array: qLog3,
        log: "A thrifty-looking <w>merchant</w> in a deep red cape becons you.",
        class: "",
        type: "room",
        source: 'bart',
        ID: 803
      });
    },
    step2: function(thisNPC) {
      qLogRemove(803);
      qLogAdd({
        array: qLog3,
        log: "<w>Bart</w> the Merchant waves his red cape at you.",
        class: "",
        type: "room",
        source: 'bart',
        ID: 804
      });
    },
    talk1: function(thisNPC) {
      log("Come up, traveler. You're fresh-faced and open-eyed enough to say you haven't been here long. Where ye from?", "dialog");
      addUniqueAction({
        entry: 'introduce',
        onlyInRoom: thisNPC.inRoom,
        talk: true,
        once: true,
        func: function(thisNPC) {
          thisNPC.talk2(thisNPC);
        }
      });
    },
    talk2: function(thisNPC) {
      log("You tell him about your travels thus far.", "info");
      log("First-timer in the city, I see. Well you're not far from greatness here - this is the oft-proved fortress against the light-stealing creatures of darkness!", "dialog");
      advanceTalkPosition(thisNPC, 3);
    },
    talk3: function(thisNPC) {
      log("The merchant adjusts his red fur cape. Up close, it's clear the fur used to be white.");
      log("If you're like the well-armed travelers who frequent my storefront, you'll be neck-deep in monster entrails before long!", "dialog");
      advanceTalkPosition(thisNPC, 4);
    },
    talk4: function(thisNPC) {
      log("In this age it would be a grave shame to waste any part of a creature's carcass. I can help you turn those monster parts into something useful. All it takes is a bit of know-how... And a bit of the dark arts.", "dialog");
      thisNPC.nextTalk = false;
      addUniqueAction({
        entry: 'dark arts',
        onlyInRoom: thisNPC.inRoom,
        talk: true,
          once: true,
        func: function(thisNPC) {
          thisNPC.talk5(thisNPC);
        }
      });
      showUniqueActions();
    },
    talk5: function(thisNPC) {
      log("Those full-of-themselves summoners say it's simple science, but anybody with a head on their shoulders knows there's something else going on. My point is, it takes someone who knows what they're doing.", "dialog");
      advanceTalkPosition(thisNPC, 6);
    },
    talk6: function(thisNPC) {
      log("If you've won some valuables from those monsters, trade some to me for crafting recipes. You won't find a more sought-after trade in this great city! How does that sound?", "dialog");
      thisNPC.nextTalk = false;
      addUniqueAction({
        entry: 'accept',
        onlyInRoom: thisNPC.inRoom,
        talk: true,
          once: true,
        func: function(thisNPC) {
          thisNPC.talk7(thisNPC);
          thisNPC.step = 2;
          thisNPC.nextStep = false;
        }
      });
      showUniqueActions();
    },
    talk7: function(thisNPC) {
      log("Terrific! I can already see the joy on your face after you get your hands on these recipes. Here's one to start you out. I'll prepare more for you - come back a little later and I'll have them ready. The name's Bart, by-the-way.", "dialog");
      log("Bart turns back to his cart, sorting papers and muttering to himself.");
      if (!checkQuest('crafting1').accepted) {
        acceptQuest('crafting1');
        log("Crafting items is an important part of survival. Use <w>craft [item]</w> to make an item, such as <w>craft health shard</w>. Type <w>help craft</w> to learn more.");
      }
      loopTalkPosition(thisNPC, 8);
    },
    talk8: function(thisNPC) {
      if (checkQuest('crafting1').completed && !checkQuest('crafting1').turnedIn) {
        log("My well-worn traveler! Looks like ye've got the materials I need. Care to hand 'em over?", 'dialog');
        addUniqueAction([
          {
            entry: 'accept',
            onlyInRoom: thisNPC.inRoom,
            talk: true,
            once: true,
            func: function(thisNPC) {
              removeUniqueAction('later');
              log("Ah, I thank ye! Just what I needed to finish this god-awful shipment. Heading to a very self-important man.", 'dialog');
              log("And here's your recipe. I always keep my word!", 'dialog');
              turnInQuest('crafting1');
              advanceTalkPosition(thisNPC, 11);
            }
          },
          {
            entry: 'later',
            onlyInRoom: thisNPC.inRoom,
            talk: true,
            once: true,
            func: function(thisNPC) {
              log("Fair enough! Come back when yer ready.", 'dialog');
              stopTalking();
              removeUniqueAction('accept');
              loopTalkPosition(thisNPC, 8);
            }
          },
        ]);
      } else if (checkQuest('crafting1').accepted && !checkQuest('crafting1').turnedIn) {
        log("Ah, hello again! Found those materials yet?", 'dialog');
        loopTalkPosition(thisNPC, 8);
      } else {
        log("Ah, hello again! I don't have any new recipes just yet. Come back a little later.", 'dialog');
        loopTalkPosition(thisNPC, 8);
      }
    },
    talk11: function(thisNPC) {
      log("I've got another recipe for ye if yer willing to give those monsters the ol' one-two punch?", 'dialog');
      addUniqueAction([
        {
          entry: 'accept',
          onlyInRoom: thisNPC.inRoom,
          talk: true,
          once: true,
          func: function(thisNPC) {
            removeUniqueAction('later');
            acceptQuest('crafting2');
            log("Great! This one I think you'll like - it's a favorite among hunters.", 'dialog');
            advanceTalkPosition(thisNPC, 13);
          }
        },
        {
          entry: 'later',
          onlyInRoom: thisNPC.inRoom,
          talk: true,
          once: true,
          func: function(thisNPC) {
            log("Fair enough! Come back when yer ready.", 'dialog');
            stopTalking();
            removeUniqueAction('accept');
            loopTalkPosition(thisNPC, 11);
          }
        },
      ]);
      showUniqueActions();
    },
    talk12: function(thisNPC) {
    },
    talk13: function(thisNPC) {
      log("Come by when you've scavenged the parts. Until then, I've got work to finish.", 'dialog');
      log("Bart returns to his ledger.")
      loopTalkPosition(thisNPC, 15);
      stopTalking();
    },
    talk15: function(thisNPC) {
      if (checkQuest('crafting2').completed && !checkQuest('crafting2').turnedIn) {
        log("My well-worn traveler! Looks like ye've got the materials I need. Care to hand 'em over?", 'dialog');
        addUniqueAction([
          {
            entry: 'accept',
            onlyInRoom: thisNPC.inRoom,
            talk: true,
            once: true,
            func: function(thisNPC) {
              removeUniqueAction('later');
              turnInQuest('crafting2');
              log("Terrific! Thank you very much.", 'dialog');
              loopTalkPosition(thisNPC, 16);
              stopTalking();
            }
          },
          {
            entry: 'later',
            onlyInRoom: thisNPC.inRoom,
            talk: true,
            once: true,
            func: function(thisNPC) {
              log("Fair enough! Come back when yer ready.", 'dialog');
              stopTalking();
              removeUniqueAction('accept');
              loopTalkPosition(thisNPC, 15);
            }
          },
        ]);
      } else if (checkQuest('crafting2').accepted && !checkQuest('crafting2').turnedIn) {
        log("Ah, hello again! Found those materials yet?", 'dialog');
        loopTalkPosition(thisNPC, 15);
      } else {
        log("Ah, hello again! I don't have any new recipes just yet. Come back a little later.", 'dialog');
        loopTalkPosition(thisNPC, 15);
      }
    },
    talk16: function(thisNPC) {
      log("", 'dialog');
      advanceTalkPosition(thisNPC);
    },
    talkX: function(thisNPC) {
      log("", 'dialog');
      advanceTalkPosition(thisNPC);
    },
  },
  {
    entry: ['general', 'graff', 'robert'],
    title: 'General Graff',
    roomDesc: "General Graff proudly stands here.",
    ID: 904,
    type: 'interactive',
    step: 1,
    nextStep: 2,
    talk: 0,
    nextTalk: 1,
    talkable: true,
    inRoom: 1042,
    confirmedSpitter: false,
    step1: function(thisNPC) {
      qLogAdd({
        array: qLog3,
        log: "A decorated <w>general</w> sits here nursing a claw-sized gash in his leg.",
        class: "",
        type: "room",
        source: 'graff',
        ID: 805
      });
    },
    step2: function(thisNPC) {
      qLogRemove(805);
      qLogAdd({
        array: qLog3,
        log: "The decorated general <w>Graff</w> sits here nursing a claw-sized gash in his leg.",
        class: "",
        type: "room",
        source: 'graff',
        ID: 806
      });
    },
    talk0: function(thisNPC) {
      log("That will be all Reagan, thank you. Nothing more today.", "dialog");
      log("The messenger bows and turns to leave, giving you a disapproving look on his way.");
      advanceTalkPosition(thisNPC);
    },
    talk1: function(thisNPC) {
      log("Sighing heavily, the General walks away from the wall. He lowers himself into his chair and turns his attention to a large gash on his upper arm. It's oozing and discolored.");
      log("Staring at my wound like you wish you had one. Far easier to come by when yer on the other side a this wall.", "dialog");
      advanceTalkPosition(thisNPC);
    },
    talk2: function(thisNPC) {
      log("The general looks at you with tired eyes, saying nothing for a moment.");
      log("Staring at my wound like you wish you had one. Far easier to come by when yer on the other side of this wall.", "dialog");
      advanceTalkPosition(thisNPC, 3);
    },
    talk3: function(thisNPC) {
      log("Yer not much of a talker - ye just come to look? Be a mate and hand a wounded soldier a shard. It's in my satchel there.", "dialog");
      addUniqueAction({
        entry: 'help',
        onlyInRoom: thisNPC.inRoom,
        talk: true,
          once: true,
        func: function(thisNPC) {
          log("You hand the health shard to the general.");
          thisNPC.talk4(thisNPC);
        }
      });
      showUniqueActions();
    },
    talk4: function(thisNPC) {
      log("I thank ye. Doesn't look like yer from the city, and we've been without a caravan for several few weeks. Ye make it here through the wasteworld yerself?", "dialog");
      advanceTalkPosition(thisNPC, 5);
    },
    talk5: function(thisNPC) {
      log("You tell the general of your travels so far.");
      log("All the way across the ocean to see Marcus? I knew he was important but I didn't think anyone would sing his praises that far.", "dialog");
      if ( !(player.milestone >= 1) ) {
        thisNPC.nextTalk = 6;
      } else if (player.milestone >= 1) {
        thisNPC.nextTalk = 8;
      }
    },
    //haven't met marcus yet
    talk6: function(thisNPC) {
      log("I may have another favor to ask ye.","dialog");
      log("He gestures toward a thick wooden table sporting an elaborate map and its accoutrements.");
      advanceTalkPosition(thisNPC, 7);
    },
    talk7: function(thisNPC) {
      log("My men are on the warfront with those creatures. One of my battalions is on the brink - whether it's the brink of success or defeat, a coin flip could say better than I. After ye meet with Marcus return here, and we'll talk", 'dialog');
      log("The general goes back to dressing his wound.");
      loopTalkPosition(thisNPC, 5);
    },
    //after you meet marcus
    talk8: function(thisNPC) {
      log("The general turns from the war table and looks over the stone wall, silent for a moment.");
      log("As I was saying, my men are on the warfront with those creatures. That battalion is on the brink - whether it's the brink of success or defeat, a coin flip could say better than I. Although I can't be there with them, you might be able to help.", "dialog");
      advanceTalkPosition(thisNPC, 9);
    },
    talk9: function(thisNPC) {
      log("I don't know if ye've seen the battlefield or not, but the path of a Blood Summoner... ye'll see more bloodshed than any man cares to.", 'dialog');
      advanceTalkPosition(thisNPC);
    },
    talk10: function(thisNPC) {
      log("He plants his stubby finger on the map.");
      log("The fourth battalion is at the forefront of this battlefield. If the communication crystal was working, I would call for aid from another bastion. But sadly, that hasn't worked in several years. And Sir William... Nevermind. Forget I said anything.", 'dialog');
      log("He waves the idea away.");
      advanceTalkPosition(thisNPC);
    },
    talk11: function(thisNPC) {
      log("His voice grows spirited.");
      log("The fourth battalion. My battalion!... My... My daughter, my only daughter Alex... She is leading this battalion, protecting this city.", 'dialog');
      advanceTalkPosition(thisNPC);
    },
    talk12: function(thisNPC) {
      log("He slams his fist down onto the table.");
      log("I swore to protect this city! Yet here I am hiding behind these walls while my men are torn to shreds.", 'dialog');
      advanceTalkPosition(thisNPC);
    },
    talk13: function(thisNPC) {
      log("Alex is as stubborn as she is deadly, and will fight to her dying death if she has to. Please make sure she doesn't have to do that.", 'dialog');
      advanceTalkPosition(thisNPC);
    },
    talk14: function(thisNPC) {
      log("Graff's wizened eyes meet yours. He continues in a softer tone.");
      log("Apart from Marcus - who is in no condition to help - only another blood summoner such as yourself has any chance of changing the fate of this battle. Will you answer the soldier's call and stand up to defend the ones who can't defend themselves?", 'dialog');
      addUniqueAction({
        entry: 'accept',
        onlyInRoom: thisNPC.inRoom,
        talk: true,
          once: true,
        func: function(thisNPC) {
          acceptQuest('general', 'hidden');
          thisNPC.talk15(thisNPC);
        }
      });
      showUniqueActions();
    },
    talk15: function(thisNPC) {
      log("The general bows his head at lets out a sigh of relief.");
      log("Thank you, Summoner. You'll find them at the northeast edge of the peninsula. Please hurry.", 'dialog');
      loopTalkPosition(thisNPC, 16);
    },
    talk16: function(thisNPC) {
      log("Please help Alex defeat those creatures at the northeast edge of the peninsula", 'dialog');
      loopTalkPosition(thisNPC, 16);
    },
    //after completing quest "healing up"
    talk20: function(thisNPC) {
      log("The general adjusts his uniform and gives you a once-over");
      advanceTalkPosition(thisNPC, 21);
    },
    talk21: function(thisNPC) {
      log("You seem none too worse for wear. What brings you here on this fine but dangerous day?", 'dialog');
      log("The unvoiced question hangs in the air. His concern for his daughter hidden beneath the title of General.");
      advanceTalkPosition(thisNPC);
    },
    talk22: function(thisNPC) {
      log("You let the General know Alex is in good health. You see the tension melt from his shoulders.");
      log("If that's not the news, then what else do ye have for me, Summoner?", 'dialog');
      addUniqueAction([
        {
          entry: 'spitter',
          onlyInRoom: thisNPC.inRoom,
          talk: true,
          once: true,
          func: function(thisNPC) {
            thisNPC.talk25(thisNPC);
          }
        },
        {
          entry: 'supplies',
          onlyInRoom: thisNPC.inRoom,
          talk: true,
          once: true,
          func: function(thisNPC) {
            thisNPC.talk35(thisNPC);
          }
        },
      ]);
      showUniqueActions();
    },
    //spitter
    talk25: function(thisNPC) {
      log("Graff's eyes grow wide as you tell him how you defeated the Midnight Spitter. And how Officer Alex is poised to lead the battalion onward.");
      advanceTalkPosition(thisNPC, 26);
    },
    talk26: function(thisNPC) {
      log("Tis' true then, and not another rumor brought back by the runners?", 'dialog');
      log("He muses over this while glancing down at the large map on the table.");
      log("This changes everything.", 'dialog');
      advanceTalkPosition(thisNPC);
    },
    talk27: function(thisNPC) {
      log("He motions to a nearby guard while jotting something down.");
      log("Take this to the runners. Urgent orders for Officer Alex.", 'dialog');
      advanceTalkPosition(thisNPC);
    },
    talk28: function(thisNPC) {
      log("Yes, your highness.", 'dialog alt');
      log("The guard departs swiftly.");
      advanceTalkPosition(thisNPC);
    },
    talk29: function(thisNPC) {
      log("Oh, and John? Please let Marcus know after you've delivered the missive to the runner. I think he would be most interested. And pleased.", 'dialog');
      advanceTalkPosition(thisNPC);
    },
    talk30: function(thisNPC) {
      log("Of course, your highness.", 'dialog alt');
      log("The guard salutes and continues with his mission.");
      advanceTalkPosition(thisNPC);
    },
    talk31: function(thisNPC) {
      log("Graff stares down at the map. Although he doesn't smile, something about his face changes.");
      log("Yes, yes, this just might work now.", 'dialog');
      advanceTalkPosition(thisNPC, 32);
    },
    talk32: function(thisNPC) {
      log("The General notices you again.");
      log("Ah, Summoner. Is there anything else?", 'dialog');
      thisNPC.confirmedSpitter = true;
      if (checkQuest('healing').turnedIn) {
        addUniqueAction({
          entry: 'runners',
          onlyInRoom: thisNPC.inRoom,
          talk: true,
          once: true,
          func: function(thisNPC) {
            thisNPC.talk42(thisNPC);
          }
        });
      }
      showUniqueActions();
    },
    talk35: function(thisNPC) {
      log("What's this?", 'dialog');
      log("Graff frowns in disbelief as you procure the collected supplies and place them on the table.");
      advanceTalkPosition(thisNPC, 36);
    },
    talk36: function(thisNPC) {
      turnInQuest('healing');
      log("I see ye have become another of Alex's runner boys! Very well. While these supplies won't resolve the soldiers' suffering, it will help alleviate the pain.", 'dialog');
      log("Harper, take this to the Healer's Tent.", 'dialog');
      advanceTalkPosition(thisNPC);
    },
    talk37: function(thisNPC) {
      log("Harper appears and briefly touches her heart in salute.");
      log("Yes, General Graff, sir.", 'dialog alt');
      advanceTalkPosition(thisNPC);
    },
    talk38: function(thisNPC) {
      log("She collects the items and trots off to the west. Passing her on the stairs, a wiry young lad runs up and stands at attention. You recall seeing him before.");
      advanceTalkPosition(thisNPC);
    },
    talk39: function(thisNPC) {
      log("The General notices you again.");
      log("Ah, Summoner. Is there anything else?", 'dialog');
      if (thisNPC.confirmedSpitter) {
        addUniqueAction({
          entry: 'runners',
          onlyInRoom: thisNPC.inRoom,
          talk: true,
          once: true,
          func: function(thisNPC) {
            thisNPC.talk42(thisNPC);
          }
        });
      }
      showUniqueActions();
    },
    //RUNNERS
    talk42: function(thisNPC) {
      log("A runner is someone who takes orders, missives and personal mail to and from the battlefront. They are light on their feet and would sooner sneak around the enemy than engage in head-on combat. Don't want to risk losing the information they carry.", 'dialog');
      log("A runner's message is more important than his life.", 'dialog');
      advanceTalkPosition(thisNPC, 43);
    },
    talk43: function(thisNPC) {
      log("Speaking of which - what is it, Reagan?", 'dialog');
      log("Reagan pulls an envelope from his satchel and hands it to the General.");
      advanceTalkPosition(thisNPC);
    },
    talk44: function(thisNPC) {
      log("General Graff quickly scans it and suddenly tenses. He goes over it more deliberately a second time, gripping it tightly with both hands.");
      log("By God! Quick, go tell Blood Summoner Marcus to hurry things up!", 'dialog');
      advanceTalkPosition(thisNPC);
    },
    talk45: function(thisNPC) {
      log("coming soon...", 'dialog');
      //advanceTalkPosition(thisNPC);
    },
    talk46: function(thisNPC) {
      log(".", 'dialog');
      log(".");
      advanceTalkPosition(thisNPC);
    },
    talk47: function(thisNPC) {
      log(".", 'dialog');
      log(".");
      advanceTalkPosition(thisNPC);
    },
    talk48: function(thisNPC) {
      log(".", 'dialog');
      log(".");
      advanceTalkPosition(thisNPC);
    },
    talk49: function(thisNPC) {
      log(".", 'dialog');
      log(".");
      advanceTalkPosition(thisNPC);
    },
    talk50: function(thisNPC) {
      log(".", 'dialog');
      log(".");
      advanceTalkPosition(thisNPC);
    },
  },
  {
    entry: ['mother', 'woman', 'rose'],
    title: 'Rose',
    roomDesc: "A tired looking <w>woman</w> is scrubbing old clothes on a washboard.",
    ID: 905,
    type: 'interactive',
    step: 1,
    nextStep: 2,
    talk: 1,
    nextTalk: 2,
    talkable: true,
    offeredHelp: false,
    inRoom: 1063,
    step1: function(thisNPC) {
      qLogAdd({
        array: qLog3,
        log: "A tired looking <w>woman</w> is scrubbing old clothes on a washboard.",
        class: "",
        type: "room",
        source: 'rose',
        ID: 810
      });
    },
    step2: function(thisNPC) {
      qLogRemove(810);
      qLogAdd({
        array: qLog3,
        log: "<w>Rose</w> sits on her stoop, scrubbing old clothes on a washboard.",
        class: "",
        type: "room",
        source: 'rose',
        ID: 811
      });
    },
    talk1: function(thisNPC) {
      log("Yer not from roun' here are ye? Get tricked into comin' ta Blood Run, or ye just got that much unluck ta stumble here by accident?", 'dialog');
      log("Her voice sounds thin and worn.");
      advanceTalkPosition(thisNPC, 2);
    },
    talk2: function(thisNPC) {
      log("Ain't no secret this city's fallin' apart. Not much longer before the creatures overrun us entirely.", 'dialog');
        log("She keeps scrubbing the dirty clothes on her even dirtier washboard.");
      advanceTalkPosition(thisNPC, 4);
    },
    talk4: function(thisNPC) {
      log("Not much of a place ta raise children, but when yer 8 months pregnant with twins and yer hubby doesn't come home from patrol, ain't much ye can do.", 'dialog');
      log("Anyway, listen ta me goin' on with my sob story again. My name's Rose, by the way.", 'dialog');
      thisNPC.step = 2;
      addUniqueAction([
        {
          entry: 'offer help',
          onlyInRoom: thisNPC.inRoom,
          talk: true,
          once: true,
          func: function(thisNPC) {
            acceptQuest('william', 'hidden');
            thisNPC.talk5(thisNPC);
            thisNPC.offeredHelp = true;
          }
        },
        {
          entry: 'goodbye',
          onlyInRoom: thisNPC.inRoom,
          talk: true,
          once: true,
          func: function(thisNPC) {
            thisNPC.talk8(thisNPC);
          }
        }
      ]);
      showUniqueActions();
    },
    //if you offer to help...
    talk5: function(thisNPC) {
      removeUniqueAction('goodbye');
      log("Ye want ta help find him? Well that's... Very kind of you. Not what I expected from a stranger.", 'dialog');
      log("Last I knew he was headed east of here to <pu>Harpe Tower</pu> with a few soldiers on some sort of special patrol, but that was near 4 years ago. Name's William. William Lider.", 'dialog');
      discoverPOI(terr23POIs, 'tower');
      advanceTalkPosition(thisNPC, 6);
    },
    //end on an amiable note.
    talk6: function(thisNPC) {
      log("I do hope the kids get to see their father one day. Breaks my heart that they'll see even less of him than I did of mine.", 'dialog');
      log("Rose turns back to her washing");
      loopTalkPosition(thisNPC, 7);
    },
    //loop for reminding you about William
    talk7: function(thisNPC) {
      log("Thank you for looking for William. Last I heard he was headed to <pu>Harpe Tower</pu>. I do hope the kids get to see their father one day.", 'dialog');
      log("Rose turns back to her washing");
      loopTalkPosition(thisNPC);
    },
    //otherwise, leave the conversation open
    talk8: function(thisNPC) {
      removeUniqueAction('offer help');
      log("No sense in wasting my breath greiving. Got mouths ta feed.", 'dialog');
      log("Rose turns back to her washing");
      stopTalking();
      advanceTalkPosition(thisNPC, 5);
    },
  },
  {
    entry: ['alex', 'officer', 'graff'],
    title: 'Alex Graff',
    roomDesc: ".",
    ID: 906,
    type: 'interactive',
    step: 1,
    nextStep: 2,
    talk: 1,
    nextTalk: 2,
    talkable: true,
    inRoom: 1110,
    step1: function(thisNPC) {
      qLogAdd({
        array: qLog3,
        log: "A young field <w>officer</w> rests here with her soldiers.",
        class: "",
        type: "room",
        source: 'alex',
        ID: 820
      });
    },
    step2: function(thisNPC) {
      qLogRemove(820);
      qLogAdd({
        array: qLog3,
        log: "<w>Alex</w> Graff, field officer for Blood Run's 4th Battalion rests here with her soldiers.",
        class: "",
        type: "room",
        source: 'alex',
        ID: 821
      });
    },
    talk1: function(thisNPC) {
      log("Alex soaks a wounded thigh with salted rags. Her voice is bold and direct.");
      log("What are ye doing here?", 'dialog');
      if (player.milestone >= 1) {
        advanceTalkPosition(thisNPC, 3);
      } else {
        advanceTalkPosition(thisNPC, 2);
      }
    },
    //if you reach here before you get your powers
    talk2: function(thisNPC) {
      log("The battlefield is no place for civilians. Leave before ye get hurt.", 'dialog');
      stopTalking();
    },
    //after getting your powers
    talk3: function(thisNPC) {
      log("The battlefield is a dangerous place. Ye look too green to be of any use here. That Midnight Spitter would make short work of ye.", 'dialog');
      advanceTalkPosition(thisNPC, 4);
    },
    talk4: function(thisNPC) {
      log("I don't need help here. This battle is my responsibility.", 'dialog');
      addUniqueAction({
        entry: 'blood summoner',
        onlyInRoom: thisNPC.inRoom,
        talk: true,
          once: true,
        func: function(thisNPC) {
          thisNPC.talk5(thisNPC);
        }
      });
      showUniqueActions();
    },
    talk5: function(thisNPC) {
      completeQuest('general');
      turnInQuest('general');
      log("A Blood Summoner, huh? Thought I knew all the summoners from Blood Run.", 'dialog');
      thisNPC.step = 2;
      advanceTalkPosition(thisNPC, 6);
    },
    talk6: function(thisNPC) {
      log("Alex adjusts, and winces in pain as her fresh wounds flex.");
      log("Maybe we could use your help, then. Monsters have been pushing this line every day for the past four months. Not sure why they're so focused on getting through to the peninsula, but it's our job to make sure that doesn't happen.", 'dialog');
      advanceTalkPosition(thisNPC);
    },
    talk7: function(thisNPC) {
      log("The other day several monsters got through, including one hell of a spitter. Heard a few people were hurt in that attack.", 'dialog');
      log("It's my duty to make sure those people are safe, and I failed them.", 'dialog')
      addUniqueAction({
        entry: 'show scar',
        onlyInRoom: thisNPC.inRoom,
        talk: true,
          once: true,
        func: function(thisNPC) {
          thisNPC.talk8(thisNPC);
        }
      });
      showUniqueActions();
    },
    talk8: function(thisNPC) {
      log("Ah God, that was ye who was injured? I'm... so sorry.", 'dialog');
      advanceTalkPosition(thisNPC, 9);
    },
    talk9: function(thisNPC) {
      log("It looks like yer wound has healed nicely though. That dark magic of yers is quite a sight. Wish my wounds left me that quickly.", 'dialog');
      log("Her rags are saturated with blood, almost useless now.");
      advanceTalkPosition(thisNPC, 10);
    },
    talk10: function(thisNPC) {
      log("She hobbles to a box of medical supplies and retrieves a fresh cloth for herself.");
      log("Not sure even magic could turn the tide at this point. But if yer willing to put yer skills to use, there's plenty of fighting to be had.", 'dialog');
      advanceTalkPosition(thisNPC);
    },
    talk11: function(thisNPC) {
      log("Alex eases herself back down onto a gnarled wooden stool.");
      log("Not sure if yer new or just foreign, but there are a few things ye need to know about these monsters before ye go toe to toe with 'em.", 'dialog');
      advanceTalkPosition(thisNPC, 12);
    },
    talk12: function(thisNPC) {
      log("Ye can't just attack a monster head-on and expect to win. Monsters will <y>guard</y> to protect themselves from attacks. Once a monster puts up their guard, they're nearly invincible.", 'dialog');
      addUniqueAction({
        entry: 'break guard',
        onlyInRoom: thisNPC.inRoom,
        talk: true,
        once: true,
        func: function(thisNPC) {
          thisNPC.talk13(thisNPC);
        }
      });
      showUniqueActions();
    },
    talk13: function(thisNPC) {
      log("That's exactly right. Ye need to <y>break their guard</y> before ye can finish 'em off. Some skills like <w>stun</w> will make a monster vulnerable again.", 'dialog');
      advanceTalkPosition(thisNPC, 14);
    },
    talk14: function(thisNPC) {
      log("That Midnight Spitter puts up quite a fight. As soon as it puts its guard up, be sure to <w>break it with stun</w> or ye won't have a chance. That is, if ye get that far in the first place.", 'dialog');
      advanceTalkPosition(thisNPC);
    },
    talk15: function(thisNPC) {
      log("Not many of us are left, but by God we'll fight to the last woman to keep the city safe.", 'dialog');
      advanceTalkPosition(thisNPC);
    },
    talk16: function(thisNPC) {
      log("There aren't a lot of supplies I can spare, but I figure a blood summoner like ye can make better use of 'em than us regular soldiers.", 'dialog');
      log("Alex gives you <g>5 Health Shards</g> and <pu>3 Plasmoid Pouches</pu>.");
      addInv(501, 5);
      addInv(502, 3);
      advanceTalkPosition(thisNPC);
    },
    talk17: function(thisNPC) {
      log("Get out there and do some damage, kid. I'll be there as soon as I'm healed up.", 'dialog');
      log("Alex turns to tending her wounds.")
      log("Make sure to <w>summon</w> your weapon before battle!");
      acceptQuest('midnight spitter');
      loopTalkPosition(thisNPC, 17);
    },
    //After defeating the Midnight Spitter
    talk19: function(thisNPC) {
      log("Good, yer back in one piece.", 'dialog');
      log("Alex looks a bit livelier than before.");
      addUniqueAction({
        entry: 'spitter',
        onlyInRoom: thisNPC.inRoom,
        talk: true,
        once: true,
        func: function(thisNPC) {
          thisNPC.talk20(thisNPC);
        }
      });
      showUniqueActions();
    },
    talk20: function(thisNPC) {
      log("You tell her you killed the Midnight Spitter by yourself. Her mouth hangs open.");
      log("Are ye taking me for a ride?", 'dialog');
      addUniqueAction({
        entry: 'no kidding',
        onlyInRoom: thisNPC.inRoom,
        talk: true,
        once: true,
        func: function(thisNPC) {
          thisNPC.talk21(thisNPC);
        }
      });
      showUniqueActions();
    },
    talk21: function(thisNPC) {
      log("She slaps you on the shoulder.");
      log("That's about the best news ye could've brought me, kid! And that was right quick, too. Looks like yer no pushover.", 'dialog');
      turnInQuest('midnight spitter');
      log("The passage east of the battalion has opened!", 'yellow');
      unlockRoom(1121);
      switchForcedEntry('graff');
      mapCoord = [-41,-29];
      addUniqueAction([
        {
          entry: 'where were you',
          onlyInRoom: thisNPC.inRoom,
          talk: true,
          once: true,
          func: function(thisNPC) {
            thisNPC.talk23(thisNPC);
          }
        },
        {
          entry: 'now what',
          onlyInRoom: thisNPC.inRoom,
          talk: true,
          once: true,
          func: function(thisNPC) {
            thisNPC.talk25(thisNPC);
          }
        },
      ]);
      showUniqueActions();
    },
    //Where were you?
    talk23: function(thisNPC) {
      log("Her face goes flush with embarrassment.");
      log("Ye try spearing a Dark One through the heart when ye can barely stand! Us normies can't be as reckless as ye magic ones.", 'dialog');
      removeUniqueAction('where were you');
      advanceTalkPosition(thisNPC, 24);
    },
    talk24: function(thisNPC) {
      log("Ask any of my troops, I'm the first on the front lines and the last to leave. Far be it from me to hide behind the barricades, but sometimes it's smarter to wait and fight another day.", 'dialog');
      showUniqueActions();
    },
    //Now what?
    talk25: function(thisNPC) {
      log("Now we can stop cowering behind the barricades and take the fight back to the front lines, like true soldiers. On top of that, we can open up the roads for travel again.", 'dialog');
      removeUniqueAction('where were you');
      removeUniqueAction('now what');
      advanceTalkPosition(thisNPC, 26);
    },
    talk26: function(thisNPC) {
      log("Ye know, the wounded back at Blood Run could use some help. I bet ye scavenged quite a few monster parts that could be of use. Would ye mind taking some supplies back to Blood Run?", 'dialog');
      addUniqueAction([
        {
          entry: 'accept',
          onlyInRoom: thisNPC.inRoom,
          talk: true,
          once: true,
          func: function(thisNPC) {
            thisNPC.talk28(thisNPC);
            removeUniqueAction('later');
          }
        },
        {
          entry: 'later',
          onlyInRoom: thisNPC.inRoom,
          talk: true,
          once: true,
          func: function(thisNPC) {
            thisNPC.talk27(thisNPC);
            removeUniqueAction('accept');
          }
        },
      ]);
      showUniqueActions();
    },
    talk27: function(thisNPC) {
      log("Yer right, ye've probably got more important things to deal with...", 'dialog');
      log("Come back later if ye have time to help and I'll give ye the details", 'dialog');
      advanceTalkPosition(thisNPC, 30);
    },
    talk28: function(thisNPC) {
      log("<w>3 Health Shards</w> and <w>2 Feral Hides</w> should do the trick. Those hides are disgusting, but once ye clean 'em up they're the best thing to keep a soldier warm through the night.", 'dialog');
      log("General Graff will really appreciate yer help. Talk to him when ye've got what ye need.", 'dialog');
      acceptQuest('healing up');
      advanceTalkPosition(thisNPC, 30);
    },
    talk30: function(thisNPC) {
      log("Anyhow, I would head back to Blood Run if I were ye. The general will want to hear yer war story.", 'dialog');
      log("And there's a caped merchant up there who can show ye how to <g>craft</g> with those materials. I hear he just got a new shipment in, so it might be worth checking in with him.", 'dialog');
      advanceTalkPosition(thisNPC);
    },
    talk31: function(thisNPC) {
      log("Hey -", 'dialog');
      log("There's a sparkle in Alex's eye.");
      advanceTalkPosition(thisNPC);
    },
    talk32: function(thisNPC) {
      log("Thanks for yer help today, kid.", 'dialog');
      advanceTalkPosition(thisNPC, 33);
    },
    talk33: function(thisNPC) {
      log("Head on back to Blood Run. I'll make a way through so we can open up travel again.", 'dialog');
      loopTalkPosition(thisNPC, 35);
    },
    talk35: function(thisNPC) {
      log("Head on back to Blood Run. I'll make a way through so we can open up travel again.", 'dialog');
      if (checkQuest('healing up').accepted) {
        loopTalkPosition(thisNPC, 35);
      } else {
        advanceTalkPosition(thisNPC, 36);
      }
    },
    talk36: function(thisNPC) {
      log("On yer way back to Blood Run, have some time to gather supplies for the General?", 'dialog');
      addUniqueAction([
        {
          entry: 'accept',
          onlyInRoom: thisNPC.inRoom,
          talk: true,
          once: true,
          func: function(thisNPC) {
            thisNPC.talk38(thisNPC);
            removeUniqueAction('later');
          }
        },
        {
          entry: 'later',
          onlyInRoom: thisNPC.inRoom,
          talk: true,
          once: true,
          func: function(thisNPC) {
            thisNPC.talk37(thisNPC);
            removeUniqueAction('accept');
          }
        },
      ]);
      showUniqueActions();
    },
    talk37: function(thisNPC) {
      log("Yer right, ye've probably got more important things to deal with...", 'dialog');
      log("Come back later if ye have time to help and I'll give ye the details", 'dialog');
      stopTalking();
    },
    talk38: function(thisNPC) {
      log("<w>3 Health Shards</w> and <w>2 Feral Hides</w> should do the trick. Those hides are disgusting, but once ye clean 'em up they're the best thing to keep a soldier warm through the night.", 'dialog');
      log("General Graff will really appreciate yer help. Talk to him when ye've got what ye need.", 'dialog');
      acceptQuest('healing up');
      advanceTalkPosition(thisNPC, 35)
    },
    talkX: function(thisNPC) {
      log(".", 'dialog');
      advanceTalkPosition(thisNPC);
    },
  },
  {
    entry: ['man'],
    title: 'TITLE',
    roomDesc: ".",
    ID: 900,
    type: 'interactive',
    step: 1,
    nextStep: 2,
    talk: 1,
    nextTalk: 2,
    status: 'non-talkable',
    inRoom: 1000
  },
];
