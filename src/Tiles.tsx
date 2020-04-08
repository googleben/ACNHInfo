import React from 'react';
import './App.css';
import "./glyph.css";
import {Bug, Fish, bugsArr, fishArr, shortMonths} from "./Types"

import * as cookies from "browser-cookies";

interface CritterpediaTilesProps {
    type: "bug" | "fish";
}

interface CritterpediaTilesState {
    noTimeBar: boolean;
    noCompleted: boolean;
    onlyMonth: boolean;
    onlyTime: boolean;
    showMore: boolean;
}

export class CritterpediaTiles extends React.Component<CritterpediaTilesProps, CritterpediaTilesState> {

    constructor(props: CritterpediaTilesProps) {
        super(props);
        this.state = {
            noTimeBar: cookies.get(this.props.type+"NoTimeBar")==="1",
            noCompleted: cookies.get(this.props.type+"NoCompleted")==="1",
            onlyMonth: cookies.get(this.props.type+"OnlyMonth")==="1",
            onlyTime: cookies.get(this.props.type+"OnlyTime")==="1",
            showMore: cookies.get(this.props.type+"ShowMore")==="1"
        }
    }

    setOption(name: keyof CritterpediaTilesState, value: boolean) {
        let ns: any = {};
        ns[name] = value;
        cookies.set(this.props.type+name.charAt(0).toUpperCase()+name.substring(1), value?"1":"0");
        this.setState(ns);
    }

    render() {
        let tiles = (this.props.type === "bug" ? bugsArr : fishArr).map(b => <CritterpediaTile data={b} key={b.index} parState={this.state}/>);
        return <div>
            <div className="critterTilesOptionsContainer">
                <div className="critterTilesOptions">
                    <h1>{this.props.type==="bug"?"Insectopedia":"Fishopedia"}</h1>
                    <div className="main">
                        Double click an entry to mark it as complete.
                        <br/><br/>
                        <input id="noTimeBar" type="checkbox" checked={this.state.noTimeBar} onChange={() => this.setOption("noTimeBar", !this.state.noTimeBar)}/>
                        <label htmlFor="noTimeBar">Hide Time Bar</label>
                        <br/>
                        <input id="noCompleted" type="checkbox" checked={this.state.noCompleted} onChange={() => this.setOption("noCompleted", !this.state.noCompleted)}/>
                        <label htmlFor="noCompleted">Hide Completed</label>
                        <br/>
                        <input id="onlyMonth" type="checkbox" checked={this.state.onlyMonth} onChange={() => this.setOption("onlyMonth", !this.state.onlyMonth)}/>
                        <label htmlFor="onlyMonth">Filter to Current Month</label>
                        <br/>
                        <input id="onlyTime" type="checkbox" checked={this.state.onlyTime} onChange={() => this.setOption("onlyTime", !this.state.onlyTime)}/>
                        <label htmlFor="onlyTime">Filter to Current Time</label>
                        <br/>
                        <input id="showMore" type="checkbox" checked={this.state.showMore} onChange={() => this.setOption("showMore", !this.state.showMore)}/>
                        <label htmlFor="showMore">Show More Info</label>
                    </div>
                </div>
            </div>
            
            <div className="critterTiles">
                {tiles}
            </div>
            
        </div>
    }
}

interface CritterpediaTileProps {
    data: Bug | Fish;
    parState: CritterpediaTilesState;
}

interface CritterpediaTileState {
    done: boolean;
}

export class CritterpediaTile extends React.Component<CritterpediaTileProps, CritterpediaTileState> {

    constructor(props: CritterpediaTileProps) {
        super(props);
        let f = "shadow" in this.props.data;
        this.state = {done: cookies.get((f?"fish":"bug")+this.props.data.index)==="1"};
    }

    setDone() {
        let f = "shadow" in this.props.data;
        cookies.set((f?"fish":"bug")+this.props.data.index, this.state.done?"0":"1");
        this.setState({done: !this.state.done});
    }

    func(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (e.detail > 1) e.preventDefault();
    }

    render() {
        let fs = this.props.parState;
        if (fs.noCompleted && this.state.done) return null;
        let now = new Date(Date.now());
        let d = this.props.data;
        if (fs.onlyMonth && !d.seasons[now.getMonth()]) return null;
        let f = "shadow" in this.props.data;
        let active = [];
        for (let t of d.times) {
            if (t==="All Day") {
                active = [...Array(24)].map((_, n) => n);
                break;
            }
            let sp = t.split(" ");
            let hr1S = t.split(":")[0];
            let hr2S = sp[3].split(":")[0];
            let hr1 = Number.parseInt(hr1S);
            let hr2 = Number.parseInt(hr2S);
            if (sp[1]==="AM") {
                if (hr1===12)  hr1 = 0;
            } else hr1 += 12;
            if (sp[4]==="AM") {
                if (hr2===12) hr2 = 0;
            } else hr2 += 12;
            for (let i = hr1; i < hr2 || i < 24; i++) {
                active.push(i);
            }
            if (hr1 > hr2) {
                for (let i = 0; i < hr2; i++) active.push(i);
            }
        }
        if (fs.onlyTime && !active.includes(now.getHours())) return null;
        
        return <div className={"critterTile "+(this.state.done?"done":"")} onMouseDown={this.func} onDoubleClick={() => this.setDone()}>
            <h1>#{d.index} {d.name} <span className="icon-owl"></span></h1>
            <div className="main">
                <div className="img"  style={{backgroundImage:"url(\""+process.env.PUBLIC_URL+"/img/"+(f?"Fish":"Ins")+d.imageNum+".png\")"}}>
                    <span className="icon-owl" />
                </div>
                <ul>
                    <li><div className="header">Price</div><div>{d.price}</div></li>
                    <li><div className="header">Location</div><div>{d.location}</div></li>
                    <li><div className="header">Time</div><div>{d.times.join("\n")}</div></li>
                    {f?<li><div className="header">Shadow</div><div>{(d as Fish).shadow}</div></li>:<div />}
                </ul>
            </div>
            {fs.noTimeBar ? null : <HourBar active={active} />}

            <div className="months">
                {[0,1,2,3,4,5,6,7,8,9,10,11].map(n => <div key={n} className={"month "+(d.seasons[n]?"active":"")}>{shortMonths[n]}</div>)}
            </div>
            {fs.showMore?<div className="caughtMessages" style={{whiteSpace: "inherit"}}>
                {d.caught.map((s, i) => <blockquote key={i}>{s}</blockquote>)}
            </div>:null}
        </div>
    }

}

interface HourBarProps {
    active: number[];
}

export class HourBar extends React.Component<HourBarProps, {now: Date}> {

    private interval?: NodeJS.Timeout;

    constructor(props: HourBarProps) {
        super(props);
        this.state = {now: new Date(Date.now())}
    }

    componentDidMount() {
        this.interval = setTimeout(() => this.setupInterval(), (60-(new Date(Date.now()).getSeconds()))*1000);
        
    }

    setupInterval() {
        this.interval = setInterval(() => this.setState({now: new Date(Date.now())}), 60*1000);
    }

    componentWillUnmount() {
        if (this.interval !== undefined) clearInterval(this.interval);
    }

    render() {
        let hrs = this.props.active;
        let now = new Date(Date.now());
        let nowM = now.getMinutes() + now.getHours()*60;
        return <div className="hourBar">
        <div className="ticks">
            {[...Array(25)].map((_, n) => <div key={n} className="tick"></div>)}
        </div>
        <div className="hoursShow">
            {[...Array(24)].map((_, n) => <div key={n} className={(hrs.includes(n)?"active":"")+(hrs.includes(n+1)?"":" last")+(hrs.includes(n-1)?"":" first")}></div>)}
        </div>
        <div className="secondBorder"></div>
        <div className="now" style={{left: (nowM/(24*60)*100)+"%"}} />
        <div className="hourLabels">
            <div><div>12 AM</div></div>
            <div><div>6 AM</div></div>
            <div><div>12 PM</div></div>
            <div><div>6 PM</div></div>
            <div><div>12 AM</div></div>
        </div>
        </div>
    }
}