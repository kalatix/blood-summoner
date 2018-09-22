let worldMap = false;
let battleScreen = false;
let mapCoord = [-22,-41];
let currentTerritory = 1;
let mapTutorial = true;
let mapNoClip = false;
let mapEncounters = true;
let mapBattleStepsMin = 7;
let mapBattleStepsMax = 15;
let mapBattling = false;
let stepsSinceLastBattle = 0;

let bastions = [
  {
    entry: 'bastion1',
    title: 'Blood Run',
    discovered: false,
    accessible: true,
    forcedEntry: false,
    entrance: 1030,
    coords: {x:-25, y:-36},
    bgm: false
  },
  {
    entry: 'bastion2',
    title: '[Prosperos]',
    discovered: false,
    accessible: true,
    forcedEntry: false,
    entrance: 1250,
    coords: {x:-74, y:-28}
  },
  {
    entry: 'bastion3',
    title: '',
    discovered: false,
    accessible: true,
    forcedEntry: false,
    entrance: false,
    coords: {x:-94, y:-38}
  },
  {
    entry: 'bastion4',
    title: '',
    discovered: false,
    accessible: true,
    forcedEntry: false,
    entrance: false,
    coords: {x:-82, y:-15}
  },
  {
    entry: 'bastion5',
    title: '',
    discovered: false,
    accessible: true,
    forcedEntry: false,
    entrance: false,
    coords: {x:-44, y:-8}
  },
  {
    entry: 'bastion6',
    title: '',
    discovered: false,
    accessible: true,
    forcedEntry: false,
    entrance: false,
    coords: {x:-3, y:-17}
  },
  {
    entry: 'bastion7',
    title: '',
    discovered: false,
    accessible: true,
    forcedEntry: false,
    entrance: false,
    coords: {x:-115, y:-24}
  },
  {
    entry: 'bastion8',
    title: '',
    discovered: false,
    accessible: true,
    forcedEntry: false,
    entrance: false,
    coords: {x:-131, y:-7}
  },
  {
    entry: 'bastion9',
    title: '',
    discovered: false,
    accessible: true,
    forcedEntry: false,
    entrance: false,
    coords: {x:-49, y:-18}
  },
  {
    entry: 'bastion10',
    title: '',
    discovered: false,
    accessible: true,
    forcedEntry: false,
    entrance: false,
    coords: {x:-138, y:-41}
  }
]

let terr1POIs = [
  {
    entry: 'crags',
    title: 'White Crags',
    discovered: true,
    accessible: true,
    forcedEntry: false,
    entrance: 1018,
    coords: {x:-22, y:-41}
  },
  {
    entry: 'graff',
    title: "General Graff's Battalion",
    discovered: false,
    accessible: true,
    forcedEntry: true,
    entrance: 1110,
    coords: {x:-40, y:-29}
  },
  {
    entry: "harbor1b",
    title: "Abandoned Harbor",
    discovered: false,
    accessible: false,
    forcedEntry: false,
    entrance: false,
    coords: {x:-23, y:-33}
  }
];

let terr23POIs = [
  {
    entry: 'tower',
    title: 'Harpe Tower',
    discovered: false,
    accessible: true,
    forcedEntry: false,
    entrance: 1200,
    coords: {x:-56, y:-26}
  },
  {
    entry: 'arameth',
    title: 'Statue of Arameth',
    discovered: false,
    accessible: true,
    forcedEntry: false,
    entrance: false,
    coords: {x:-47, y:-39}
  },
  {
    entry: 'witch',
    title: 'Blood Witch',
    discovered: false,
    accessible: true,
    forcedEntry: false,
    entrance: false,
    coords: {x:-58, y:-36}
  },
  {
    entry: 'swamp',
    title: 'Silph Swamp',
    discovered: false,
    accessible: true,
    forcedEntry: false,
    entrance: false,
    coords: {x:-69, y:-40}
  },
  {
    entry: 'yarba',
    title: "Yarba's Coliseum",
    discovered: false,
    accessible: true,
    forcedEntry: false,
    entrance: false,
    coords: {x:-80, y:-32}
  },
  {
    entry: 'college',
    title: 'Dunn College',
    discovered: false,
    accessible: true,
    forcedEntry: false,
    entrance: false,
    coords: {x:-99, y:-27}
  },
  {
    entry: 'lundt',
    title: 'Merchant Lundt',
    discovered: false,
    accessible: true,
    forcedEntry: false,
    entrance: false,
    coords: {x:-85, y:-21}
  },
  {
    entry: "harbor2a",
    title: "harbor",
    discovered: false,
    accessible: false,
    forcedEntry: false,
    entrance: false,
    coords: {x:-51, y:-38}
  },
  {
    entry: "harbor2b",
    title: "harbor",
    discovered: false,
    accessible: false,
    forcedEntry: false,
    entrance: false,
    coords: {x:-48, y:-39}
  },
  {
    entry: "harbor3a",
    title: "harbor",
    discovered: false,
    accessible: false,
    forcedEntry: false,
    entrance: false,
    coords: {x:-114, y:-38}
  },
  {
    entry: "harbor4a",
    title: "harbor & Crazed Seer",
    discovered: false,
    accessible: false,
    forcedEntry: false,
    entrance: false,
    coords: {x:-106, y:-18}
  },
];

let terr4POIs = [
  {
    entry: '',
    title: 'Blockade',
    discovered: true,
    accessible: true,
    forcedEntry: true,
    entrance: false,
    coords: {x:-64, y:-15}
  },
  {
    entry: 'floating',
    title: 'Floating Village',
    discovered: false,
    accessible: true,
    forcedEntry: false,
    entrance: false,
    coords: {x:-57, y:-2}
  },
  {
    entry: 'whet',
    title: "Whet's Grave",
    discovered: false,
    accessible: true,
    forcedEntry: false,
    entrance: false,
    coords: {x:-55, y:-8}
  },
  {
    entry: 'kratta',
    title: 'Monster of Kratta',
    discovered: false,
    accessible: true,
    forcedEntry: true,
    entrance: false,
    coords: {x:-37, y:-18}
  },
  {
    entry: 'lighthouse',
    title: 'Lighthouse',
    discovered: false,
    accessible: true,
    forcedEntry: false,
    entrance: false,
    coords: {x:-34, y:-5}
  },
  {
    entry: "harbor5a",
    title: "harbor",
    discovered: false,
    accessible: false,
    forcedEntry: false,
    entrance: false,
    coords: {x:-35, y:-14}
  },
];

let terr5POIs = [
  {
    entry: 'carey',
    title: 'Carey Bridge',
    discovered: false,
    accessible: true,
    forcedEntry: false,
    entrance: false,
    coords: {x:-17, y:-19}
  },
  {
    entry: '',
    title: 'Blockade',
    discovered: true,
    accessible: true,
    forcedEntry: true,
    entrance: true,
    coords: {x:-35, y:-23}
  },
  {
    entry: "harbor1a",
    title: "Harbor & Father Trimble",
    discovered: false,
    accessible: false,
    forcedEntry: false,
    entrance: false,
    coords: {x:-27, y:-29}
  },
  {
    entry: "harbor5b",
    title: "harbor",
    discovered: false,
    accessible: false,
    forcedEntry: false,
    entrance: false,
    coords: {x:-31, y:-15}
  },
];

let terr6POIs = [
  {
    entry: 'eye',
    title: 'The Great Stone Eye',
    discovered: false,
    accessible: true,
    forcedEntry: false,
    entrance: false,
    coords: {x:-102, y:-13}
  },
  {
    entry: '',
    title: 'person',
    discovered: false,
    accessible: true,
    forcedEntry: false,
    entrance: false,
    coords: {x:-111, y:-9}
  },
  {
    entry: 'rift',
    title: 'Dimensional Rift',
    discovered: false,
    accessible: true,
    forcedEntry: false,
    entrance: false,
    coords: {x:-125, y:-23}
  },
  {
    entry: 'temple',
    title: 'Sunken Temple',
    discovered: false,
    accessible: true,
    forcedEntry: false,
    entrance: false,
    coords: {x:-132, y:-14}
  },
  {
    entry: 'marjory',
    title: "Marjory's Bluff",
    discovered: false,
    accessible: true,
    forcedEntry: false,
    entrance: false,
    coords: {x:-138, y:-4}
  },
  {
    entry: "harbor4b",
    title: "harbor",
    discovered: false,
    accessible: false,
    forcedEntry: false,
    entrance: false,
    coords: {x:-106, y:-18}
  },
];

let terr7POIs = [
  {
    entry: 'forge',
    title: 'Mountain Forge',
    discovered: false,
    accessible: true,
    forcedEntry: false,
    entrance: false,
    coords: {x:-128, y:-44}
  },
  {
    entry: "harbor3b",
    title: "harbor & person",
    discovered: false,
    accessible: false,
    forcedEntry: true,
    entrance: false,
    coords: {x:-121, y:-40}
  },
];

let blockedCoordsTerr1 = [
  {x:-41, y:-30}, {x:-40, y:-30}, {x:-39, y:-30}, {x:-38, y:-30}, {x:-37, y:-30}, {x:-36, y:-30}, {x:-36, y:-31}, {x:-35, y:-31}, {x:-35, y:-32}, {x:-34, y:-32}, {x:-35, y:-33}, {x:-35, y:-34}, {x:-34, y:-34}, {x:-33, y:-34}, {x:-32, y:-34}, {x:-32, y:-35}, {x:-31, y:-35}, {x:-30, y:-35}, {x:-30, y:-36}, {x:-29, y:-36}, {x:-28, y:-36}, {x:-28, y:-37}, {x:-28, y:-38}, {x:-27, y:-38}, {x:-27, y:-39}, {x:-27, y:-40}, {x:-26, y:-40}, {x:-25, y:-40}, {x:-25, y:-41}, {x:-24, y:-41}, {x:-24, y:-42}, {x:-23, y:-42}, {x:-22, y:-42}, {x:-21, y:-42}, {x:-21, y:-41}, {x:-20, y:-41}, {x:-20, y:-40}, {x:-20, y:-39}, {x:-21, y:-39}, {x:-22, y:-39}, {x:-23, y:-39}, {x:-22, y:-38}, {x:-21, y:-38}, {x:-21, y:-37}, {x:-21, y:-36}, {x:-21, y:-35}, {x:-22, y:-35}, {x:-22, y:-34}, {x:-22, y:-33}, {x:-22, y:-32}, {x:-23, y:-32}, {x:-24, y:-32}, {x:-24, y:-33}, {x:-25, y:-33}, {x:-26, y:-33}, {x:-27, y:-33}, {x:-28, y:-33}, {x:-29, y:-33}, {x:-29, y:-32}, {x:-30, y:-32}, {x:-30, y:-31}, {x:-31, y:-31}, {x:-31, y:-30}, {x:-32, y:-30}, {x:-33, y:-30}, {x:-33, y:-29}, {x:-34, y:-29}, {x:-34, y:-28}, {x:-35, y:-28}, {x:-36, y:-28}, {x:-37, y:-28}, {x:-38, y:-28}, {x:-39, y:-28}, {x:-40, y:-28}, {x:-41, y:-28}
];

let blockedCoordsTerr23 = [
  {x:-86, y:-28}, {x:-87, y:-27}, {x:-87, y:-26}, {x:-87, y:-25}, {x:-86, y:-25}, {x:-86, y:-26}, {x:-86, y:-27}, {x:-85, y:-27}, {x:-85, y:-26}, {x:-85, y:-25}, {x:-84, y:-24}, {x:-84, y:-25}, {x:-83, y:-25}, {x:-83, y:-26}, {x:-82, y:-26}, {x:-39, y:-28}, {x:-40, y:-28}, {x:-41, y:-28}, {x:-41, y:-30}, {x:-41, y:-31}, {x:-42, y:-31}, {x:-42, y:-32}, {x:-43, y:-32}, {x:-43, y:-33}, {x:-44, y:-33}, {x:-45, y:-33}, {x:-46, y:-33}, {x:-45, y:-34}, {x:-44, y:-34}, {x:-44, y:-35}, {x:-44, y:-36}, {x:-44, y:-37}, {x:-45, y:-37}, {x:-46, y:-37}, {x:-46, y:-36}, {x:-47, y:-36}, {x:-48, y:-36}, {x:-48, y:-35}, {x:-49, y:-36}, {x:-50, y:-36}, {x:-50, y:-37}, {x:-51, y:-37}, {x:-50, y:-38}, {x:-50, y:-39}, {x:-51, y:-39}, {x:-52, y:-39}, {x:-53, y:-39}, {x:-53, y:-38}, {x:-54, y:-38}, {x:-54, y:-37}, {x:-55, y:-37}, {x:-56, y:-37}, {x:-57, y:-37}, {x:-58, y:-37}, {x:-59, y:-37}, {x:-60, y:-37}, {x:-61, y:-37}, {x:-61, y:-36}, {x:-62, y:-36}, {x:-63, y:-36}, {x:-63, y:-37}, {x:-64, y:-37}, {x:-65, y:-37}, {x:-63, y:-38}, {x:-62, y:-38}, {x:-62, y:-39}, {x:-62, y:-40}, {x:-62, y:-41}, {x:-63, y:-41}, {x:-61, y:-41}, {x:-60, y:-41}, {x:-60, y:-42}, {x:-59, y:-42}, {x:-59, y:-43}, {x:-59, y:-44}, {x:-60, y:-44}, {x:-60, y:-45}, {x:-61, y:-45}, {x:-61, y:-46}, {x:-62, y:-46}, {x:-63, y:-46}, {x:-63, y:-47}, {x:-64, y:-47}, {x:-64, y:-48}, {x:-65, y:-48}, {x:-66, y:-48}, {x:-66, y:-47}, {x:-67, y:-47}, {x:-67, y:-46}, {x:-68, y:-46}, {x:-68, y:-47}, {x:-69, y:-47}, {x:-70, y:-47}, {x:-71, y:-47}, {x:-71, y:-46}, {x:-72, y:-46}, {x:-73, y:-46}, {x:-73, y:-45}, {x:-74, y:-45}, {x:-74, y:-44}, {x:-74, y:-43}, {x:-75, y:-43}, {x:-76, y:-43}, {x:-77, y:-43}, {x:-77, y:-42}, {x:-78, y:-42}, {x:-78, y:-43}, {x:-79, y:-43}, {x:-80, y:-43}, {x:-81, y:-43}, {x:-81, y:-44}, {x:-82, y:-44}, {x:-82, y:-45}, {x:-82, y:-46}, {x:-83, y:-46}, {x:-84, y:-46}, {x:-84, y:-45}, {x:-85, y:-45}, {x:-85, y:-44}, {x:-86, y:-44}, {x:-86, y:-45}, {x:-87, y:-45}, {x:-88, y:-45}, {x:-88, y:-46}, {x:-89, y:-46}, {x:-90, y:-46}, {x:-90, y:-47}, {x:-91, y:-47}, {x:-92, y:-47}, {x:-92, y:-46}, {x:-93, y:-46}, {x:-93, y:-45}, {x:-94, y:-45}, {x:-94, y:-44}, {x:-95, y:-44}, {x:-95, y:-43}, {x:-95, y:-42}, {x:-96, y:-42}, {x:-97, y:-42}, {x:-98, y:-42}, {x:-99, y:-42}, {x:-99, y:-41}, {x:-100, y:-41}, {x:-100, y:-40}, {x:-101, y:-40}, {x:-101, y:-39}, {x:-101, y:-38}, {x:-102, y:-40}, {x:-102, y:-41}, {x:-103, y:-41}, {x:-104, y:-41}, {x:-104, y:-40}, {x:-105, y:-40}, {x:-106, y:-40}, {x:-106, y:-39}, {x:-107, y:-39}, {x:-107, y:-40}, {x:-108, y:-40}, {x:-109, y:-40}, {x:-109, y:-39}, {x:-110, y:-39}, {x:-111, y:-39}, {x:-111, y:-40}, {x:-112, y:-40}, {x:-113, y:-40}, {x:-114, y:-40}, {x:-114, y:-39}, {x:-115, y:-39}, {x:-115, y:-38}, {x:-115, y:-37}, {x:-115, y:-36}, {x:-114, y:-36}, {x:-113, y:-36}, {x:-112, y:-36}, {x:-116, y:-36}, {x:-116, y:-35}, {x:-117, y:-35}, {x:-117, y:-34}, {x:-118, y:-34}, {x:-119, y:-34}, {x:-119, y:-33}, {x:-119, y:-32}, {x:-118, y:-32}, {x:-117, y:-32}, {x:-116, y:-32}, {x:-117, y:-31}, {x:-117, y:-30}, {x:-116, y:-30}, {x:-116, y:-29}, {x:-116, y:-28}, {x:-116, y:-27}, {x:-115, y:-27}, {x:-114, y:-27}, {x:-114, y:-28}, {x:-113, y:-27}, {x:-112, y:-27}, {x:-113, y:-26}, {x:-114, y:-25}, {x:-115, y:-25}, {x:-114, y:-23}, {x:-113, y:-23}, {x:-112, y:-23}, {x:-111, y:-23}, {x:-112, y:-22}, {x:-112, y:-21}, {x:-111, y:-21}, {x:-110, y:-21}, {x:-110, y:-20}, {x:-110, y:-19}, {x:-109, y:-19}, {x:-109, y:-18}, {x:-108, y:-18}, {x:-107, y:-18}, {x:-107, y:-17}, {x:-106, y:-17}, {x:-105, y:-17}, {x:-105, y:-18}, {x:-104, y:-17}, {x:-104, y:-16}, {x:-103, y:-16}, {x:-102, y:-16}, {x:-101, y:-16}, {x:-101, y:-17}, {x:-101, y:-18}, {x:-100, y:-18}, {x:-100, y:-17}, {x:-99, y:-17}, {x:-98, y:-17}, {x:-98, y:-16}, {x:-97, y:-16}, {x:-97, y:-15}, {x:-96, y:-15}, {x:-96, y:-14}, {x:-95, y:-14}, {x:-95, y:-13}, {x:-94, y:-13}, {x:-94, y:-12}, {x:-93, y:-12}, {x:-92, y:-12}, {x:-92, y:-11}, {x:-91, y:-11}, {x:-90, y:-11}, {x:-90, y:-10}, {x:-89, y:-10}, {x:-88, y:-10}, {x:-88, y:-9}, {x:-87, y:-9}, {x:-86, y:-9}, {x:-85, y:-9}, {x:-85, y:-10}, {x:-84, y:-10}, {x:-83, y:-10}, {x:-83, y:-11}, {x:-82, y:-11}, {x:-82, y:-12}, {x:-82, y:-13}, {x:-82, y:-14}, {x:-81, y:-13}, {x:-81, y:-12}, {x:-80, y:-12}, {x:-79, y:-12}, {x:-79, y:-11}, {x:-78, y:-11}, {x:-78, y:-10}, {x:-77, y:-10}, {x:-77, y:-9}, {x:-76, y:-9}, {x:-75, y:-9}, {x:-74, y:-9}, {x:-73, y:-9}, {x:-73, y:-10}, {x:-72, y:-10}, {x:-71, y:-10}, {x:-71, y:-11}, {x:-70, y:-11}, {x:-69, y:-11}, {x:-69, y:-12}, {x:-69, y:-13}, {x:-68, y:-13}, {x:-68, y:-12}, {x:-67, y:-12}, {x:-66, y:-12}, {x:-49, y:-38}, {x:-48, y:-38}, {x:-47, y:-38}, {x:-46, y:-38}, {x:-46, y:-39}, {x:-46, y:-40}, {x:-47, y:-40}, {x:-48, y:-40}, {x:-49, y:-40}, {x:-49, y:-39}, {x:-66, y:-14}, {x:-64, y:-18}, {x:-33, y:-24}, {x:-33, y:-25}, {x:-34, y:-25}, {x:-34, y:-26}, {x:-35, y:-26}, {x:-35, y:-27}, {x:-36, y:-27}, {x:-37, y:-27}, {x:-38, y:-27}, {x:-39, y:-27}, {x:-34, y:-21}, {x:-35, y:-21}, {x:-36, y:-21}, {x:-37, y:-21}, {x:-38, y:-21}, {x:-38, y:-22}, {x:-38, y:-23}, {x:-39, y:-23}, {x:-40, y:-23}, {x:-41, y:-23}, {x:-42, y:-23}, {x:-42, y:-24}, {x:-43, y:-24}, {x:-43, y:-23}, {x:-44, y:-23}, {x:-45, y:-23}, {x:-46, y:-23}, {x:-44, y:-22}, {x:-44, y:-21}, {x:-45, y:-21}, {x:-46, y:-21}, {x:-43, y:-21}, {x:-42, y:-21}, {x:-41, y:-21}, {x:-40, y:-21}, {x:-40, y:-20}, {x:-39, y:-20}, {x:-39, y:-19}, {x:-39, y:-18}, {x:-39, y:-17}, {x:-40, y:-17}, {x:-41, y:-17}, {x:-41, y:-18}, {x:-42, y:-18}, {x:-43, y:-18}, {x:-43, y:-19}, {x:-44, y:-19}, {x:-44, y:-18}, {x:-44, y:-17}, {x:-45, y:-17}, {x:-46, y:-17}, {x:-46, y:-16}, {x:-47, y:-16}, {x:-48, y:-16}, {x:-59, y:-35}, {x:-62, y:-17}, {x:-61, y:-17}, {x:-60, y:-17}, {x:-60, y:-16}, {x:-59, y:-16}, {x:-58, y:-16}, {x:-57, y:-16}, {x:-56, y:-16}, {x:-55, y:-16}, {x:-54, y:-16}, {x:-53, y:-16}, {x:-52, y:-16}, {x:-51, y:-16}, {x:-51, y:-15}, {x:-50, y:-15}, {x:-49, y:-15}, {x:-50, y:-16}, {x:-49, y:-16}
];

let blockedCoordsTerr4 = [
  {x:-62, y:-17}, {x:-61, y:-17}, {x:-60, y:-17}, {x:-60, y:-16}, {x:-59, y:-16}, {x:-58, y:-16}, {x:-57, y:-16}, {x:-56, y:-16}, {x:-55, y:-16}, {x:-54, y:-16}, {x:-53, y:-16}, {x:-52, y:-16}, {x:-51, y:-16}, {x:-51, y:-15}, {x:-50, y:-15}, {x:-49, y:-15}, {x:-50, y:-16}, {x:-49, y:-16}, {x:-48, y:-16}, {x:-47, y:-16}, {x:-46, y:-16}, {x:-46, y:-15}, {x:-45, y:-15}, {x:-44, y:-15}, {x:-43, y:-15}, {x:-42, y:-15}, {x:-41, y:-15}, {x:-40, y:-15}, {x:-39, y:-15}, {x:-38, y:-15}, {x:-38, y:-16}, {x:-37, y:-16}, {x:-36, y:-16}, {x:-35, y:-16}, {x:-35, y:-15}, {x:-34, y:-15}, {x:-34, y:-14}, {x:-33, y:-14}, {x:-33, y:-13}, {x:-32, y:-13}, {x:-31, y:-13}, {x:-31, y:-12}, {x:-30, y:-12}, {x:-29, y:-12}, {x:-28, y:-12}, {x:-28, y:-11}, {x:-28, y:-10}, {x:-28, y:-9}, {x:-29, y:-9}, {x:-29, y:-8}, {x:-29, y:-7}, {x:-30, y:-7}, {x:-31, y:-7}, {x:-31, y:-6}, {x:-32, y:-6}, {x:-32, y:-5}, {x:-33, y:-5}, {x:-33, y:-4}, {x:-34, y:-4}, {x:-34, y:-3}, {x:-35, y:-3}, {x:-35, y:-2}, {x:-36, y:-2}, {x:-37, y:-2}, {x:-38, y:-2}, {x:-38, y:-3}, {x:-38, y:-1}, {x:-39, y:-1}, {x:-40, y:-1}, {x:-41, y:-1}, {x:-42, y:-1}, {x:-42, y:0}, {x:-43, y:0}, {x:-44, y:0}, {x:-45, y:0}, {x:-46, y:0}, {x:-46, y:-1}, {x:-47, y:-1}, {x:-48, y:-1}, {x:-48, y:-2}, {x:-49, y:-2}, {x:-50, y:-2}, {x:-51, y:-2}, {x:-52, y:-2}, {x:-52, y:-3}, {x:-53, y:-3}, {x:-54, y:-3}, {x:-55, y:-3}, {x:-55, y:-2}, {x:-56, y:-2}, {x:-56, y:-1}, {x:-57, y:-1}, {x:-58, y:-1}, {x:-58, y:-2}, {x:-58, y:-3}, {x:-58, y:-4}, {x:-59, y:-4}, {x:-60, y:-4}, {x:-61, y:-4}, {x:-61, y:-5}, {x:-61, y:-6}, {x:-62, y:-6}, {x:-62, y:-7}, {x:-62, y:-8}, {x:-62, y:-9}, {x:-63, y:-9}, {x:-64, y:-9}, {x:-64, y:-8}, {x:-65, y:-8}, {x:-66, y:-8}, {x:-66, y:-9}, {x:-66, y:-10}, {x:-66, y:-11}, {x:-66, y:-12}, {x:-67, y:-12}, {x:-66, y:-14}
];

let blockedCoordsTerr5 = [
  {x:-34, y:-21}, {x:-35, y:-21}, {x:-36, y:-21}, {x:-36, y:-20}, {x:-36, y:-19}, {x:-35, y:-19}, {x:-35, y:-18}, {x:-34, y:-18}, {x:-34, y:-17}, {x:-33, y:-17}, {x:-32, y:-17}, {x:-33, y:-16}, {x:-33, y:-15}, {x:-32, y:-15}, {x:-32, y:-14}, {x:-32, y:-13}, {x:-31, y:-13}, {x:-30, y:-13}, {x:-29, y:-13}, {x:-28, y:-13}, {x:-27, y:-13}, {x:-26, y:-13}, {x:-26, y:-12}, {x:-25, y:-12}, {x:-24, y:-12}, {x:-24, y:-13}, {x:-23, y:-13}, {x:-22, y:-13}, {x:-21, y:-13}, {x:-21, y:-12}, {x:-20, y:-12}, {x:-20, y:-11}, {x:-19, y:-11}, {x:-18, y:-11}, {x:-18, y:-12}, {x:-18, y:-13}, {x:-17, y:-13}, {x:-16, y:-13}, {x:-16, y:-14}, {x:-15, y:-14}, {x:-15, y:-15}, {x:-14, y:-15}, {x:-13, y:-15}, {x:-12, y:-15}, {x:-11, y:-15}, {x:-10, y:-15}, {x:-10, y:-16}, {x:-10, y:-17}, {x:-9, y:-17}, {x:-9, y:-16}, {x:-8, y:-16}, {x:-8, y:-15}, {x:-7, y:-15}, {x:-6, y:-15}, {x:-5, y:-15}, {x:-4, y:-15}, {x:-3, y:-15}, {x:-3, y:-16}, {x:-2, y:-16}, {x:-2, y:-17}, {x:-2, y:-18}, {x:-3, y:-18}, {x:-4, y:-18}, {x:-5, y:-18}, {x:-5, y:-17}, {x:-6, y:-17}, {x:-6, y:-18}, {x:-7, y:-18}, {x:-7, y:-19}, {x:-8, y:-19}, {x:-9, y:-19}, {x:-8, y:-20}, {x:-7, y:-20}, {x:-7, y:-21}, {x:-7, y:-22}, {x:-8, y:-22}, {x:-8, y:-23}, {x:-9, y:-23}, {x:-10, y:-23}, {x:-10, y:-24}, {x:-11, y:-24}, {x:-11, y:-25}, {x:-12, y:-25}, {x:-13, y:-25}, {x:-13, y:-24}, {x:-13, y:-23}, {x:-14, y:-23}, {x:-14, y:-24}, {x:-15, y:-24}, {x:-15, y:-25}, {x:-16, y:-25}, {x:-17, y:-25}, {x:-18, y:-25}, {x:-17, y:-26}, {x:-17, y:-27}, {x:-18, y:-27}, {x:-19, y:-27}, {x:-20, y:-27}, {x:-20, y:-26}, {x:-21, y:-26}, {x:-21, y:-27}, {x:-22, y:-27}, {x:-23, y:-27}, {x:-22, y:-28}, {x:-22, y:-29}, {x:-23, y:-29}, {x:-23, y:-30}, {x:-24, y:-30}, {x:-24, y:-31}, {x:-25, y:-31}, {x:-26, y:-31}, {x:-26, y:-30}, {x:-27, y:-30}, {x:-28, y:-30}, {x:-28, y:-29}, {x:-28, y:-28}, {x:-27, y:-28}, {x:-26, y:-28}, {x:-25, y:-28}, {x:-26, y:-27}, {x:-27, y:-27}, {x:-28, y:-27}, {x:-28, y:-26}, {x:-29, y:-26}, {x:-30, y:-26}, {x:-31, y:-26}, {x:-32, y:-26}, {x:-32, y:-25}, {x:-33, y:-25}, {x:-33, y:-24}, {x:-34, y:-25}, {x:-32, y:-20}, {x:-31, y:-20}, {x:-23, y:-22}, {x:-22, y:-22}, {x:-22, y:-23}, {x:-21, y:-23}, {x:-19, y:-20}, {x:-19, y:-19}, {x:-19, y:-18}, {x:-18, y:-18}, {x:-18, y:-19}, {x:-18, y:-20}, {x:-16, y:-19}, {x:-16, y:-18}, {x:-15, y:-17}, {x:-14, y:-17}, {x:-13, y:-18}, {x:-14, y:-18}, {x:-15, y:-18}, {x:-15, y:-19}, {x:-14, y:-19}, {x:-14, y:-20}
];

let blockedCoordsTerr6 = [
  {x:-113, y:-23}, {x:-114, y:-23}, {x:-114, y:-22}, {x:-115, y:-22}, {x:-115, y:-21}, {x:-114, y:-21}, {x:-114, y:-20}, {x:-113, y:-20}, {x:-113, y:-19}, {x:-113, y:-18}, {x:-112, y:-18}, {x:-111, y:-18}, {x:-110, y:-18}, {x:-110, y:-17}, {x:-109, y:-17}, {x:-108, y:-17}, {x:-107, y:-17}, {x:-107, y:-16}, {x:-106, y:-16}, {x:-106, y:-15}, {x:-106, y:-14}, {x:-106, y:-13}, {x:-105, y:-14}, {x:-104, y:-14}, {x:-104, y:-13}, {x:-103, y:-13}, {x:-103, y:-14}, {x:-102, y:-14}, {x:-101, y:-14}, {x:-101, y:-13}, {x:-100, y:-13}, {x:-100, y:-12}, {x:-100, y:-11}, {x:-101, y:-11}, {x:-102, y:-11}, {x:-103, y:-11}, {x:-104, y:-11}, {x:-105, y:-11}, {x:-106, y:-11}, {x:-107, y:-11}, {x:-107, y:-10}, {x:-108, y:-10}, {x:-109, y:-10}, {x:-110, y:-10}, {x:-111, y:-10}, {x:-112, y:-10}, {x:-108, y:-9}, {x:-107, y:-9}, {x:-107, y:-8}, {x:-107, y:-7}, {x:-108, y:-7}, {x:-108, y:-6}, {x:-109, y:-6}, {x:-110, y:-6}, {x:-110, y:-7}, {x:-111, y:-7}, {x:-112, y:-7}, {x:-113, y:-7}, {x:-113, y:-6}, {x:-114, y:-6}, {x:-115, y:-6}, {x:-116, y:-6}, {x:-116, y:-7}, {x:-117, y:-7}, {x:-118, y:-7}, {x:-115, y:-5}, {x:-115, y:-4}, {x:-116, y:-4}, {x:-116, y:-3}, {x:-117, y:-3}, {x:-117, y:-2}, {x:-118, y:-2}, {x:-119, y:-2}, {x:-120, y:-2}, {x:-121, y:-2}, {x:-122, y:-2}, {x:-123, y:-2}, {x:-124, y:-2}, {x:-125, y:-2}, {x:-126, y:-2}, {x:-124, y:-1}, {x:-124, y:0}, {x:-125, y:0}, {x:-125, y:1}, {x:-126, y:1}, {x:-127, y:1}, {x:-128, y:1}, {x:-129, y:1}, {x:-129, y:0}, {x:-130, y:0}, {x:-131, y:0}, {x:-132, y:0}, {x:-132, y:-1}, {x:-133, y:-1}, {x:-134, y:-1}, {x:-135, y:-1}, {x:-136, y:-1}, {x:-136, y:-2}, {x:-137, y:-1}, {x:-137, y:0}, {x:-138, y:0}, {x:-139, y:0}, {x:-139, y:-1}, {x:-140, y:-1}, {x:-140, y:-2}, {x:-140, y:-3}, {x:-139, y:-3}, {x:-138, y:-3}, {x:-139, y:-4}, {x:-140, y:-4}, {x:-140, y:-5}, {x:-141, y:-5}, {x:-142, y:-5}, {x:-142, y:-6}, {x:-143, y:-6}, {x:-144, y:-6}, {x:-145, y:-6}, {x:-145, y:-7}, {x:-145, y:-8}, {x:-145, y:-9}, {x:-144, y:-9}, {x:-143, y:-9}, {x:-143, y:-10}, {x:-142, y:-10}, {x:-141, y:-10}, {x:-141, y:-11}, {x:-140, y:-11}, {x:-140, y:-12}, {x:-139, y:-12}, {x:-138, y:-12}, {x:-137, y:-12}, {x:-137, y:-13}, {x:-136, y:-13}, {x:-135, y:-13}, {x:-135, y:-14}, {x:-134, y:-14}, {x:-133, y:-14}, {x:-134, y:-15}, {x:-135, y:-15}, {x:-136, y:-15}, {x:-136, y:-16}, {x:-137, y:-16}, {x:-138, y:-16}, {x:-139, y:-16}, {x:-140, y:-16}, {x:-140, y:-17}, {x:-141, y:-17}, {x:-141, y:-18}, {x:-142, y:-18}, {x:-142, y:-19}, {x:-143, y:-19}, {x:-143, y:-20}, {x:-143, y:-21}, {x:-144, y:-21}, {x:-144, y:-22}, {x:-144, y:-23}, {x:-143, y:-23}, {x:-143, y:-24}, {x:-142, y:-24}, {x:-141, y:-24}, {x:-141, y:-25}, {x:-140, y:-25}, {x:-139, y:-25}, {x:-139, y:-26}, {x:-138, y:-26}, {x:-137, y:-26}, {x:-136, y:-26}, {x:-136, y:-27}, {x:-135, y:-27}, {x:-135, y:-28}, {x:-135, y:-29}, {x:-134, y:-29}, {x:-133, y:-29}, {x:-133, y:-28}, {x:-132, y:-28}, {x:-132, y:-27}, {x:-131, y:-27}, {x:-131, y:-28}, {x:-130, y:-28}, {x:-129, y:-28}, {x:-129, y:-29}, {x:-128, y:-29}, {x:-127, y:-29}, {x:-127, y:-28}, {x:-126, y:-28}, {x:-126, y:-27}, {x:-125, y:-27}, {x:-124, y:-27}, {x:-123, y:-27}, {x:-123, y:-28}, {x:-122, y:-28}, {x:-121, y:-28}, {x:-120, y:-28}, {x:-120, y:-27}, {x:-119, y:-27}, {x:-118, y:-27}, {x:-117, y:-27}, {x:-117, y:-26}, {x:-116, y:-26}, {x:-115, y:-26}, {x:-115, y:-25}, {x:-114, y:-25}, {x:-124, y:-22}, {x:-120, y:-16}, {x:-119, y:-16}, {x:-119, y:-15}, {x:-118, y:-15}, {x:-118, y:-14}, {x:-117, y:-14}, {x:-116, y:-14}, {x:-116, y:-13}, {x:-115, y:-13}, {x:-128, y:-12}, {x:-129, y:-12}, {x:-127, y:-13}, {x:-128, y:-13}, {x:-129, y:-13}, {x:-130, y:-13}, {x:-131, y:-13}, {x:-131, y:-14}, {x:-130, y:-14}, {x:-129, y:-14}, {x:-128, y:-14}, {x:-129, y:-15}, {x:-129, y:-2}, {x:-131, y:-3}, {x:-132, y:-3},
];

let blockedCoordsTerr7 = [
  {x:-129, y:-39}, {x:-130, y:-39}, {x:-134, y:-38}, {x:-135, y:-38}, {x:-135, y:-39}, {x:-136, y:-39}, {x:-120, y:-40}, {x:-120, y:-39}, {x:-121, y:-39}, {x:-122, y:-39}, {x:-123, y:-39}, {x:-124, y:-39}, {x:-125, y:-39}, {x:-126, y:-39}, {x:-126, y:-38}, {x:-126, y:-37}, {x:-127, y:-37}, {x:-128, y:-37}, {x:-128, y:-36}, {x:-128, y:-35}, {x:-129, y:-35}, {x:-130, y:-35}, {x:-130, y:-36}, {x:-131, y:-36}, {x:-131, y:-35}, {x:-132, y:-35}, {x:-133, y:-35}, {x:-134, y:-35}, {x:-134, y:-34}, {x:-135, y:-34}, {x:-136, y:-34}, {x:-136, y:-35}, {x:-137, y:-35}, {x:-138, y:-35}, {x:-138, y:-36}, {x:-139, y:-36}, {x:-140, y:-36}, {x:-141, y:-36}, {x:-141, y:-37}, {x:-141, y:-38}, {x:-140, y:-38}, {x:-139, y:-38}, {x:-138, y:-38}, {x:-138, y:-39}, {x:-139, y:-39}, {x:-140, y:-39}, {x:-140, y:-40}, {x:-141, y:-40}, {x:-141, y:-41}, {x:-141, y:-42}, {x:-140, y:-42}, {x:-139, y:-42}, {x:-138, y:-42}, {x:-138, y:-43}, {x:-138, y:-44}, {x:-137, y:-44}, {x:-137, y:-45}, {x:-136, y:-45}, {x:-135, y:-45}, {x:-134, y:-45}, {x:-134, y:-46}, {x:-133, y:-46}, {x:-133, y:-47}, {x:-132, y:-47}, {x:-131, y:-47}, {x:-130, y:-47}, {x:-130, y:-48}, {x:-129, y:-48}, {x:-128, y:-48}, {x:-127, y:-48}, {x:-126, y:-48}, {x:-125, y:-48}, {x:-125, y:-47}, {x:-124, y:-47}, {x:-124, y:-46}, {x:-123, y:-46}, {x:-123, y:-47}, {x:-122, y:-47}, {x:-121, y:-47}, {x:-120, y:-47}, {x:-120, y:-46}, {x:-119, y:-46}, {x:-119, y:-45}, {x:-118, y:-45}, {x:-118, y:-44}, {x:-118, y:-43}, {x:-118, y:-42}, {x:-119, y:-42}, {x:-119, y:-41}, {x:-120, y:-41}, {x:-121, y:-41}
];
