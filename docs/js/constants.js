// ROM Pointer
var WORLD_MAPS = 0x118050;

var LEVEL_OFFSETS = [
    //   1   2   3   4   5   6   7   8   E   B
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, // World 1
    13, 14, 15, 16, 17, 18, 19, 20, 21, 22, // World 2
    25, 26, 27, 28, 29, 30, 31, 32, 33, 34, // World 3
    37, 38, 39, 40, 41, 42, 43, 44, 45, 46, // World 4
    49, 50, 51, 52, 53, 54, 55, 56, 57, 58, // World 5
    61, 62, 63, 64, 65, 66, 67, 68, 69, 70  // World 6
];

// ROM Pointer
var LEVEL_SETTINGS = 0x118099;

var LEVEL_SETTINGS_ENDMARKER = [0x89, 0x80]; // this is reversed because of its endianness

var DMG_TICKS_FRAMES = 0x0008;

var HEALTH_MOD_RATE = {
    healVeryFast: 0xFFF0,
    healFast: 0xFFF6,
    healMedium: 0xFFFA,
    healSlow: 0xFFFE,
    damageSlow: 0x0002,
    damageMedium: 0x0006,
    damageFast: 0x000A,
    damageVeryFast: 0x0010,
}
var HEALTH_MOD_AMOUNT = {
    healTen: 0x0064,
    healFive: 0x0032,
    healTwo: 0x0014,
    healOne: 0x000A,
    damageOne: 0xFFF6,
    damageTwo: 0xFFEC,
    damageFive: 0xFFCE,
    damageTen: 0xFF9C,
    damageTwenty: 0xFF38,
    damageAll: 0xFED4
};

var MOUTH_MODIFIERS = {
    bubbles: 0x02,
    seeds: 0x03
};

var BOOST_MODIFIERS = {
    accelerateSlow: 0x008,
    accelerateMedium: 0x010,
    accelerateFast: 0x020,
    accelerateVeryFast: 0x040,

    maximumSpeedSlow: 0x400,
    maximumSpeedMedium: 0x600,
    maximumSpeedFast: 0x800,
    maximumSpeedVeryFast: 0xA00,
    maximumSpeedTooFast: 0xC00
};

levelNames = {
    "0x00":	{
        name: "1-1 Make Eggs, Throw Eggs",

     // modes that are impossible
        // blacklist: ["stickyGround"],
    // if level requires specific settings
        // easyModes:
        // normalModes:
        // hardModes:

    // mode whitelist PARAMETERS, if none choose random
        // floorDmgRateEasy: []
        // floorDmgRateNormal: []
        // floorDmgRateHard: []

        // airDmgRateEasy: []
        // airDmgRateNormal: []
        // airDmgRateHard: []

        // dmgAmountEasy: []
        // dmgAmountNormal: []
        // dmgAmountHard: []

        // mouthEasy: []
        // mouthNormal: []
        // mouthHard: []

        // boostEasy: []
        // boostNormal: []
        // boostHard: []

        // Min / Max
        // scoreRangeEasy:
        // scoreRangeNormal:
        // scoreRangeHard:


    },
    "0x01":	"1-2 Watch Out Below!",
    "0x02":	"1-3 The Cave Of Chomp Rock",
    "0x03":	"1-4 Burt The Bashful's Fort",
    "0x04":	"1-5 Hop! Hop! Donut Lifts!",
    "0x05":	"1-6 Shy-Guys On Stilts",
    "0x06":	"1-7 Touch Fuzzy, Get Dizzy",
    "0x07":	"1-8 Salvo The Slime's Castle",
    "0x08":	"1-E Poochy Ain't Stupid",
    "0x09":	"Bonus - FLIP CARDS",
    "0x0A":	"W1 - Score Tile",
    "0x0B":	"W1 - Controller Settings",
    "0x0C":	"2-1 Visit Koopa And Para-Koopa",
    "0x0D":	"2-2 The Baseball Boys",
    "0x0E":	"2-3 What's Gusty Taste Like?",
    "0x0F":	"2-4 Bigger Boo's Fort",
    "0x10":	"2-5 Watch Out For Lakitu",
    "0x11":	"2-6 The Cave Of The Mystery Maze",
    "0x12":	"2-7 Lakitu's Wall",
    "0x13":	"2-8 The Potted Ghost's Castle",
    "0x14":	"2-E Hit That Switch!!",
    "0x15": "Bonus - SCRATCH & MATCH",
    "0x16": "W2 - Score Tile",
    "0x17": "W2 - Controller Settings",
    "0x18":	"3-1 Welcome To Monkey World!",
    "0x19":	"3-2 Jungle Rhythm...",
    "0x1A":	"3-3 Nep-Enuts' Domain",
    "0x1B":	"3-4 Prince Froggy's Fort",
    "0x1C":	"3-5 Jammin' Through The Trees",
    "0x1D":	"3-6 The Cave Of Harry Hedgehog",
    "0x1E":	"3-7 Monkeys' Favorite Lake",
    "0x1F":	"3-8 Naval Piranha's Castle",
    "0x20":	"3-E More Monkey Madness",
    "0x21": "Bonus - DRAWING LOTS",
    "0x22": "W3 - Score Tile",
    "0x23": "W3 - Controller Settings",
    "0x24":	"4-1 GO! GO! MARIO!!",
    "0x25":	"4-2 The Cave Of The Lakitus",
    "0x26":	"4-3 Don't Look Back!",
    "0x27":	"4-4 Marching Milde's Fort",
    "0x28":	"4-5 Chomp Rock Zone",
    "0x29":	"4-6 Lake Shore Paradise",
    "0x2A":	"4-7 Ride Like The Wind",
    "0x2B":	"4-8 Hookbill The Koopa's Castle",
    "0x2C":	"4-E The Impossible? Maze",
    "0x2D": "Bonus - MATCH CARDS",
    "0x2E": "W4 - Score Tile",
    "0x2F": "W4 - Controller Settings",
    "0x30":	"5-1 BLIZZARD!!!",
    "0x31":	"5-2 Ride The Ski Lifts",
    "0x32":	"5-3 Danger - Icy Conditions Ahead",
    "0x33":	"5-4 Sluggy The Unshaven's Fort",
    "0x34":	"5-5 Goonie Rides!",
    "0x35":	"5-6 Welcome To Cloud World",
    "0x36":	"5-7 Shifting Platforms Ahead",
    "0x37":	"5-8 Raphael The Raven's Castle",
    "0x38":	"5-E Kamek's Revenge",
    "0x39": "Bonus - ROULETTE",
    "0x3A": "W5 - Score Tile",
    "0x3B": "W5 - Controller Settings",
    "0x3C":	"6-1 Scary Skeleton Goonies!",
    "0x3D":	"6-2 The Cave Of The Bandits",
    "0x3E":	"6-3 Beware The Spinning Logs",
    "0x3F":	"6-4 Tap-Tap The Red Nose's Fort",
    "0x40":	"6-5 The Very Loooooong Cave",
    "0x41":	"6-6 The Deep, Underground Maze",
    "0x42":	"6-7 KEEP MOVING!!!!",
    "0x43":	"6-8 King Bowser's Castle",
    "0x44":	"6-E Castles - Masterpiece Set",
    "0x45": "Bonus - SLOT MACHINE",
    "0x46": "W6 - Score Tile",
    "0x47": "W6 - Controller Settings"
}

mapTileSettingObject = {
    level: 0x02,
    name: 0x02,
    modes: 0x02
}