import bugsRaw from "../assets/bugs.json";
import fishRaw from "../assets/fish.json";

export const bugsArr: Bug[] = bugsRaw.sort((a, b) => a.index - b.index);
export const fishArr: Fish[] = fishRaw.sort((a, b) => a.index - b.index);

export const monthNames = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
]

export const shortMonths = [
    "Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"
]

export class Bug {
    imageNum: number = 0;
    index: number = 0;
    id: number = 0;
    name: string = "";
    price: number = 0;
    location: string = "";
    times: string[] = [];
    seasons: boolean[] = [];
    caught: string[] = [];
}

export class Fish {
    imageNum: number = 0;
    index: number = 0;
    id: number = 0;
    name: string = "";
    price: number = 0;
    location: string = "";
    shadow: string = "";
    times: string[] = [];
    seasons: boolean[] = [];
    caught: string[] = [];
}