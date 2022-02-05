import bugsRaw from "../assets/insects.json";
import fishRaw from "../assets/fish.json";
import seaCreaturesRaw from "../assets/seaCreatures.json";

export const bugsArr: Bug[] = bugsRaw.sort((a, b) => a.index - b.index);
export const fishArr: Fish[] = fishRaw.sort((a, b) => a.index - b.index);
export const seaCreaturesArr: SeaCreature[] = seaCreaturesRaw.sort((a, b) => a.index - b.index);

export const monthNames = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
]

export const shortMonths = [
    "Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"
]

export interface Bug {
    index: number;
    name: string;
    iconImage: string;
    critterpediaImage: string;
    furnitureImage: string;
    sell: number;
    location: string;
    weather: string;
    catchesToUnlock: number;
    spawnRate: string;
    nhTimes: string[][];
    shTimes: string[][];
    size: string;
    surface: boolean;
    description: string;
    catchMessages: string[];
    hhaPoints: number;
    hhaCategory: string;
    color1: string;
    color2: string;
    iconFilename: string;
    critterpediaFilename: string;
    furnitureFilename: string;
    internalID: number;
    spreadsheetID: string;
}

export interface Fish {
    index: number;
    name: string;
    iconImage: string;
    critterpediaImage: string;
    furnitureImage: string;
    sell: number;
    location: string;
    shadow: string;
    difficulty: string;
    vision: string;
    catchesToUnlock: number;
    spawnRate: string;
    nhTimes: string[][];
    shTimes: string[][];
    size: string;
    surface: boolean;
    description: string;
    catchMessages: string[];
    hhaPoints: number;
    hhaCategory: string;
    color1: string;
    color2: string;
    lightingType: string;
    iconFilename: string;
    critterpediaFilename: string;
    furnitureFilename: string;
    internalID: number;
    spreadsheetID: string;
}

export interface SeaCreature {
    index: number;
    name: string;
    iconImage: string;
    critterpediaImage: string;
    furnitureImage: string;
    sell: number;
    shadow: string;
    movementSpeed: string;
    catchesToUnlock: number;
    spawnRate: string;
    nhTimes: string[][];
    shTimes: string[][];
    size: string;
    surface: boolean;
    description: string;
    catchMessages: string[];
    hhaPoints: number;
    hhaCategory: string;
    color1: string;
    color2: string;
    lightingType: string;
    iconFilename: string;
    critterpediaFilename: string;
    furnitureFilename: string;
    versionAdded: string;
    unlocked: boolean;
    internalID: number;
    spreadsheetID: string;
}