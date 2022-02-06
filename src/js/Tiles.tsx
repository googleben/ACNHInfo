import React from 'react';
import '../css/CritterTiles.scss';
import "../css/glyph.scss";
import {Bug, Fish, bugsArr, fishArr, shortMonths, seaCreaturesArr, SeaCreature, crittersArr} from "./Types"
import * as cookies from "browser-cookies";
import { AppState } from './App';

// function importImages(r: __WebpackModuleApi.RequireContext) {
//     return r.keys().reduce((prev, curr) => {
//         prev[curr.includes("Fish") ? "fish" : "insects"][curr.replace(/(fish|ins|\.\/|\.png)/gi, "")] = r(curr);
//         return prev;
//     }, {fish: {}, insects: {}});
// }
// const images = importImages(require.context("../images", false, /.png$/))


interface CritterpediaTilesProps {
    type: "bug" | "fish" | "seaCreatures" | "all";
    parState: AppState;
}

export class CritterpediaTiles extends React.Component<CritterpediaTilesProps> {

    constructor(props: CritterpediaTilesProps) {
        super(props);
    }

    render() {
        let arr = [];
        if (this.props.type === "bug") arr = bugsArr;
        else if (this.props.type === "fish") arr = fishArr;
        else if (this.props.type === "seaCreatures") arr = seaCreaturesArr;
        else arr = crittersArr;
        const tiles = arr.map(b => <CritterpediaTile data={b} key={b.index} parState={this.props.parState}/>);
        return <div>
            <div className="tiles">
                {tiles}
            </div>
        </div>
    }
}

interface CritterpediaTileProps {
    data: Bug | Fish | SeaCreature;
    parState: AppState;
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
        let active: number[] = [];
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
        
        return <div className={"tile"} onMouseDown={this.func} onDoubleClick={() => {this.setDone(); return false;}}>
            <h1 className={"tile-h1"+(this.state.done?"":"--not-done")}><span className={"icon-"+(sc?"sea-creature":f?"fish":"insect")}>#{d.index} {d.name}</span><span className={"tile-h1-icon-owl"+(this.state.done?"--done":"")}></span></h1>
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
                {[...Array(24)].map((_, n) => <div key={n} style={n===0?{marginLeft: "1px"}:n===23?{marginRight: "1px"}:{}} className={"hours-show-hour"+(hrs.includes(n)?"--active":"")+(hrs.includes(n)&&!hrs.includes(n+1)?"--last":"")+(hrs.includes(n)&&!hrs.includes(n-1)?"--first":"")}></div>)}
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