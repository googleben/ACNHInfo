import React from 'react';
import '../css/CritterTiles.scss';
import "../css/glyph.scss";
import {Bug, Fish, bugsArr, fishArr, shortMonths, seaCreaturesArr, SeaCreature} from "./Types"

// function importImages(r: __WebpackModuleApi.RequireContext) {
//     return r.keys().reduce((prev, curr) => {
//         prev[curr.includes("Fish") ? "fish" : "insects"][curr.replace(/(fish|ins|\.\/|\.png)/gi, "")] = r(curr);
//         return prev;
//     }, {fish: {}, insects: {}});
// }
// const images = importImages(require.context("../images", false, /.png$/))

import * as cookies from "browser-cookies";

interface CritterpediaTilesProps {
    type: "bug" | "fish" | "seaCreatures";
}

interface CritterpediaTilesState {
    noTimeBar: boolean;
    noCompleted: boolean;
    onlyMonth: boolean;
    onlyTime: boolean;
    showMore: boolean;
    southernHemisphere: boolean;
    hideClock: boolean;
    timeOffsetMinutes: number;
    timeOffsetHours: number;
    timeOffsetDays: number;
    timeOffsetMonths: number;
    timeOffsetYears: number;
    now: Date;
}

const Days = ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."];
const Months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

export class CritterpediaTiles extends React.Component<CritterpediaTilesProps, CritterpediaTilesState> {

    onMinuteChange: Record<string, () => void>;
    timeout: number | null;

    constructor(props: CritterpediaTilesProps) {
        super(props);
        this.onMinuteChange = {};
        this.timeout = null;
        cookies.defaults.expires = 100000;
        const timeOffsetMinutes = Number.parseInt(cookies.get("timeOffsetMinutes")?.replaceAll(/[^-1234567890]/g, "")?.padStart(1, "0") ?? "0");
        const timeOffsetHours = Number.parseInt(cookies.get("timeOffsetHours")?.replaceAll(/[^-1234567890]/g, "")?.padStart(1, "0") ?? "0");
        const timeOffsetDays = Number.parseInt(cookies.get("timeOffsetDays")?.replaceAll(/[^-1234567890]/g, "")?.padStart(1, "0") ?? "0");
        const timeOffsetMonths = Number.parseInt(cookies.get("timeOffsetMonths")?.replaceAll(/[^-1234567890]/g, "")?.padStart(1, "0") ?? "0");
        const timeOffsetYears = Number.parseInt(cookies.get("timeOffsetYears")?.replaceAll(/[^-1234567890]/g, "")?.padStart(1, "0") ?? "0");
        const date = new Date(Date.now() + (((timeOffsetYears * 365 + timeOffsetMonths * 31 + timeOffsetDays) * 24 + timeOffsetHours) * 60 + timeOffsetMinutes) * 60 * 1000);
        this.state = {
            noTimeBar: cookies.get("noTimeBar")==="1",
            noCompleted: cookies.get("noCompleted")==="1",
            onlyMonth: cookies.get("onlyMonth")==="1",
            onlyTime: cookies.get("onlyTime")==="1",
            showMore: cookies.get("showMore")==="1",
            southernHemisphere: cookies.get("southernHemisphere")==="1",
            hideClock: cookies.get("hideClock")==="1",
            timeOffsetMinutes,
            timeOffsetHours,
            timeOffsetDays,
            timeOffsetMonths,
            timeOffsetYears,
            now: date
        }
    }

    addOnMinuteChange(key: string, handler: () => void) {
        this.onMinuteChange[key] = handler;
    }

    removeOnMinuteChange(key: string) {
        delete this.onMinuteChange[key];
    }

    setOption<Prop extends keyof CritterpediaTilesState>(name: Prop, value: CritterpediaTilesState[Prop]) {
        let ns: Partial<CritterpediaTilesState> = {};
        ns[name] = value;
        if (name.startsWith("timeOffset")) {
            let o = {...this.state};
            if (typeof value !== "number" || Number.isNaN(value)) {
                value = 0 as any;
                ns[name] = value;
            }
            o[name] = value;
            const date = new Date(Date.now() + (((o.timeOffsetYears * 365 + o.timeOffsetMonths * 31 + o.timeOffsetDays) * 24 + o.timeOffsetHours) * 60 + o.timeOffsetMinutes) * 60 * 1000);
            ns.now = date;
        }
        let v: any = value;
        if (typeof v === "boolean") v = value ? "1" : "0";
        cookies.set(name, typeof v === "string" ? v : v.toString());
        this.setState(ns as any);
    }

    minuteChangeHandler() {
        this.timeout = null;
        let o = this.state;
        const date = new Date(Date.now() + (((o.timeOffsetYears * 365 + o.timeOffsetMonths * 31 + o.timeOffsetDays) * 24 + o.timeOffsetHours) * 60 + o.timeOffsetMinutes) * 60 * 1000);
        this.setState({now: date});
        this.setupTimeout();
    }
    setupTimeout() {
        let now = new Date();
        let dms = 60*1000 - now.getSeconds() * 1000 - now.getMilliseconds();
        //double cast here because TS thinks we're talking about node setTimeout instead of browser setTimeout
        this.timeout = setTimeout(() => this.minuteChangeHandler(), dms) as unknown as number;
    }

    componentDidMount() {
        this.setupTimeout();
    }
    componentWillUnmount() {
        if (this.timeout !== null) clearTimeout(this.timeout);
    }

    render() {
        const tiles = (this.props.type === "bug" ? bugsArr : this.props.type === "fish" ? fishArr : seaCreaturesArr).map(b => <CritterpediaTile data={b} key={b.index} parState={this.state}/>);
        const opts = this.state;
        const now = opts.now;
        const clock = <div className="clock">
            <div className="clock-bg"></div>
            <div className="clock-time">
                {now.getHours() > 12 ? now.getHours() - 12 : now.getHours()}:{now.getMinutes().toString().padStart(2, "0")}
                <span className="clock-time-ampm">{now.getHours() > 11 ? "PM" : "AM"}</span>
            </div>
            <div className="clock-line"></div>
            <div className="clock-date">
                <span className="clock-date-monthday">{Months[now.getMonth()]} {now.getDate()}</span>
                <span className="clock-date-dayofweek">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 77.676 36.459" style={{height: "28.18px", marginBottom: "-5px"}}>
                        <defs>
                            <style>
                                .clock-dayofweek-bg{"{fill:white;}"}
                            </style>
                            <mask id="text-cutout">
                                <rect x="-5" y="-5" width="160" height="80" fill="white"></rect>
                                <text x="40" y="19.5" fill="black" style={{fontFamily: "Seurat Pro", fontWeight: 700, alignmentBaseline: "middle", textAnchor: "middle"}}>
                                    {Days[now.getDay()]}
                                </text>
                            </mask>
                        </defs>
                        <path mask="url(#text-cutout)" className="clock-dayofweek-bg" d="M76.676,17.729c0,15.245-15.454,17.73-23.3,17.73H23.3c-7.849,0-23.3-2.485-23.3-17.73S15.449,0,23.3,0h30.08C61.222,0,76.676,2.485,76.676,17.729Z" transform="translate(0.5 0.5)"/>
                    </svg>
                </span>
            </div>
        </div>;
        return <div>
            <div className="tiles">
                <div className="critterTilesOptions tile">
                    <h1 className={"tile-h1"}>{this.props.type==="bug"?"Insectopedia":this.props.type==="fish"?"Fishopedia":"Seapedia"}</h1>
                    <div className="main">
                        Double click an entry to mark it as complete.
                        <br/><br/>
                        <input id="noTimeBar" type="checkbox" checked={opts.noTimeBar} onChange={(e) => this.setOption("noTimeBar", e.target.checked)}/>
                        <label htmlFor="noTimeBar">Hide Time Bar</label>
                        <br/>
                        <input id="noCompleted" type="checkbox" checked={opts.noCompleted} onChange={(e) => this.setOption("noCompleted", e.target.checked)}/>
                        <label htmlFor="noCompleted">Hide Completed</label>
                        <br/>
                        <input id="onlyMonth" type="checkbox" checked={opts.onlyMonth} onChange={(e) => this.setOption("onlyMonth", e.target.checked)}/>
                        <label htmlFor="onlyMonth">Filter to Current Month</label>
                        <br/>
                        <input id="onlyTime" type="checkbox" checked={opts.onlyTime} onChange={(e) => this.setOption("onlyTime", e.target.checked)}/>
                        <label htmlFor="onlyTime">Filter to Current Time</label>
                        <br/>
                        <input id="showMore" type="checkbox" checked={opts.showMore} onChange={(e) => this.setOption("showMore", e.target.checked)}/>
                        <label htmlFor="showMore">Show More Info</label>
                        <br/>
                        <input id="southernHemisphere" type="checkbox" checked={opts.southernHemisphere} onChange={(e) => this.setOption("southernHemisphere", e.target.checked)}/>
                        <label htmlFor="southernHemisphere">Southern Hemisphere</label>
                        <br/>
                        <input id="hideClock" type="checkbox" checked={opts.hideClock} onChange={(e) => this.setOption("hideClock", e.target.checked)}/>
                        <label htmlFor="hideClock">Hide Clock</label>
                        <div style={{marginTop: "3px", marginBottom: "5px"}}><abbr title="1 Year = 365 Days, 1 Month = 31 Days">Time offset:</abbr></div>
                        <div style={{display: "grid", gridTemplateColumns: "max-content max-content max-content", columnGap: "4px"}}>
                            <div>
                                <input id="timeOffsetYears" type="number" value={opts.timeOffsetYears} onChange={(e) => this.setOption("timeOffsetYears", e.target.valueAsNumber)} style={{width:"3em"}} max={99} min={-99}/>
                                <label htmlFor="timeOffsetYears"> Years </label>
                            </div>
                            <div>
                                <input id="timeOffsetMonths" type="number" value={opts.timeOffsetMonths} onChange={(e) => this.setOption("timeOffsetMonths", e.target.valueAsNumber)} style={{width:"3em"}} max={11} min={-11}/>
                                <label htmlFor="timeOffsetMonths"> Months </label>
                            </div>
                            <div>
                                <input id="timeOffsetDays" type="number" value={opts.timeOffsetDays} onChange={(e) => this.setOption("timeOffsetDays", e.target.valueAsNumber)} style={{width:"3em"}} max={31} min={-31}/>
                                <label htmlFor="timeOffsetDays"> Days </label>
                            </div>
                            <div>
                                <input id="timeOffsetHours" type="number" value={opts.timeOffsetHours} onChange={(e) => this.setOption("timeOffsetHours", e.target.valueAsNumber)} style={{width:"3em"}} max={23} min={-23}/>
                                <label htmlFor="timeOffsetHours"> Hours </label>
                            </div>
                            <div>
                                <input id="timeOffsetMinutes" type="number" value={opts.timeOffsetMinutes} onChange={(e) => this.setOption("timeOffsetMinutes", e.target.valueAsNumber)} style={{width:"3em"}} max={59} min={-59}/>
                                <label htmlFor="timeOffsetMinutes"> Minutes </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="tiles">
                {tiles}
            </div>
            
            {opts.hideClock ? <></> : clock}
        </div>
    }
}

interface CritterpediaTileProps {
    data: Bug | Fish | SeaCreature;
    parState: CritterpediaTilesState;
}

interface CritterpediaTileState {
    done: boolean;
    newlyDone?: boolean;
}

export class CritterpediaTile extends React.Component<CritterpediaTileProps, CritterpediaTileState> {

    constructor(props: CritterpediaTileProps) {
        super(props);
        const f = "shadow" in this.props.data && !("movementSpeed" in this.props.data);
        const sc = "movementSpeed" in this.props.data;
        this.state = {done: cookies.get((f?"fish":sc?"seaCreature":"bug")+this.props.data.index)==="1"};
    }

    setDone() {
        const f = "shadow" in this.props.data && !("movementSpeed" in this.props.data);
        const sc = "movementSpeed" in this.props.data;
        cookies.set((f?"fish":sc?"seaCreature":"bug")+this.props.data.index, this.state.done?"0":"1");
        this.setState({done: !this.state.done, newlyDone: !this.state.done});
    }

    func(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (e.detail > 1) e.preventDefault();
    }

    render() {
        const fs = this.props.parState;
        if (fs.noCompleted && this.state.done) return null;
        const now = fs.now;
        const month = now.getMonth();
        const d = this.props.data;
        const times = this.props.parState.southernHemisphere ? d.shTimes : d.nhTimes;
        if (fs.onlyMonth && times[month][0] === "NA") return null;
        const f = "shadow" in this.props.data;
        const sc = "movementSpeed" in this.props.data;
        const hasLoc = "location" in this.props.data;
        let active = [];
        for (let t of times[month]) {
            if (t ==="All Day") {
                active = [...Array(24)].map((_, n) => n);
                break;
            }
            if (t === "NA") {
                break;
            }
            const sp = t.split(" ");
            const hr1S = sp[0];
            const hr2S = sp[3];
            let hr1 = Number.parseInt(hr1S);
            let hr2 = Number.parseInt(hr2S);
            if (sp[1]==="AM") {
                if (hr1===12)  hr1 = 0;
            } else hr1 += 12;
            if (sp[4]==="AM") {
                if (hr2===12) hr2 = 0;
            } else hr2 += 12;
            for (let i = hr1; hr1<hr2 ? i<hr2 : i<24; i++) {
                active.push(i);
            }
            if (hr1 > hr2) {
                for (let i = 0; i < hr2; i++) active.push(i);
            }
        }
        if (fs.onlyTime && !active.includes(now.getHours())) return null;
        
        return <div className={"tile"} onMouseDown={this.func} onDoubleClick={() => this.setDone()}>
            <h1 className={"tile-h1"+(this.state.done?"":"--not-done")}>#{d.index} {d.name} <span className={"tile-h1-icon-owl"+(this.state.done?"--done":"")}></span></h1>
            <div className="tile-main">
                <div className="tile-main-img"  style={{backgroundImage:`url(${d.iconImage})`}}>
                    <span className={"tile-main-img-icon-owl"+(this.state.done?"--done":"")+(this.state.newlyDone!==undefined?"--stamp":"")} />
                </div>
                <ul className="tile-main-ul">
                    <li className="tile-main-ul-li--no-top"><div className="tile-main-ul-li-header">Price</div><div className="tile-main-ul-li-elem"><div className="tile-main-ul-li-elem-text">{d.sell}</div></div></li>
                    {hasLoc?<li className="tile-main-ul-li"><div className="tile-main-ul-li-header">Location</div><div className="tile-main-ul-li-elem" title={(d as Fish).location.length > 20 ? (d as Fish).location : undefined}><div className="tile-main-ul-li-elem-text">{(d as Fish).location}</div></div></li>:<></>}
                    <li className="tile-main-ul-li"><div className="tile-main-ul-li-header">Time</div><div className="tile-main-ul-li-elem"><div className="tile-main-ul-li-elem-text">{times[month][0]==="NA"?"Not Active":times[month].join("\n")}</div></div></li>
                    {f?<li className="tile-main-ul-li"><div className="tile-main-ul-li-header">Shadow</div><div className="tile-main-ul-li-elem"><div className="tile-main-ul-li-elem-text">{(d as Fish).shadow}</div></div></li>:<></>}
                </ul>
            </div>
            {fs.noTimeBar ? null : <HourBar active={active} now={fs.now} />}

            <div className="tile-months">
                {[0,1,2,3,4,5,6,7,8,9,10,11].map(n => <div key={n} className={"tile-months-month"+(times[n][0]!=="NA"?"--active":"")}>{shortMonths[n]}</div>)}
            </div>
            {fs.showMore?<div style={{whiteSpace: "inherit"}}>
                {d.catchMessages.map((s, i) => <blockquote className="caughtMessage" key={i}>{s}</blockquote>)}
            </div>:<></>}
        </div>
    }

}

interface HourBarProps {
    active: number[];
    now: Date;
}

export class HourBar extends React.Component<HourBarProps> {

    private interval?: NodeJS.Timeout;

    constructor(props: HourBarProps) {
        super(props);
    }

    render() {
        const hrs = this.props.active;
        const now = this.props.now;
        const nowM = now.getMinutes() + now.getHours()*60;
        return <div className="hour-bar">
            <div className="ticks">
                {[...Array(25)].map((_, n) => <div key={n} className={"ticks-tick"+(n===0 || n===24 ? "--large" : n % 3 === 0 ? "--medium" : "")}></div>)}
            </div>
            <div className="hours-show">
                {[...Array(24)].map((_, n) => <div key={n} style={n===0?{marginLeft: "1px"}:n===23?{marginRight: "1px"}:{}} className={"hours-show-hour"+(hrs.includes(n)?"--active":"")+(hrs.includes(n+1)?"":"--last")+(hrs.includes(n-1)?"":"--first")}></div>)}
            </div>
            <div className="hour-bar-second-border"></div>
            <div className="hour-bar-now" style={{left: (nowM/(24*60)*100)+"%"}} />
            <div className="hour-bar-labels">
                <div className="hour-bar-labels-label"><div className="hour-bar-labels-label-inner">12 AM</div></div>
                <div className="hour-bar-labels-label"><div className="hour-bar-labels-label-inner">6 AM</div></div>
                <div className="hour-bar-labels-label"><div className="hour-bar-labels-label-inner">12 PM</div></div>
                <div className="hour-bar-labels-label"><div className="hour-bar-labels-label-inner">6 PM</div></div>
                <div className="hour-bar-labels-label"><div className="hour-bar-labels-label-inner">12 AM</div></div>
            </div>
        </div>
    }
}