import React from 'react';
import '../css/App.scss';
import {CritterpediaTiles} from "./Tiles"
import {Col, CritterTable} from "./CritterTable"
import * as cookies from "browser-cookies";

enum AppTab {
    January=0, February, March, April, May, June, July, August, September, October, November, December,
    Insectopedia, Fishopedia, Seapedia, Critterpedia, Insects, Fish, SeaCreatures
}

export interface AppState {
    tab: AppTab;
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

const allCritterCols = [Col.Index, Col.Name, Col.Price, Col.Location, Col.Times, Col.Shadow, Col.Months, Col.Caught];
const condensedCritterCols = [Col.Name, Col.Price, Col.Location, Col.Times, Col.Shadow]

class App extends React.Component<{}, AppState> {
    timeout: number | null;

    constructor(props: {}) {
        super(props);
        let tab = AppTab.Insectopedia;
        if (window.location.hash.length > 0) {
            switch (window.location.hash.substring(1)) {
                case "January": tab=AppTab.January; break;
                case "February": tab=AppTab.February; break;
                case "March": tab=AppTab.March; break;
                case "April": tab=AppTab.April; break;
                case "May": tab=AppTab.May; break;
                case "June": tab=AppTab.June; break;
                case "July": tab=AppTab.July; break;
                case "August": tab=AppTab.August; break;
                case "September": tab=AppTab.September; break;
                case "October": tab=AppTab.October; break;
                case "November": tab=AppTab.November; break;
                case "December": tab=AppTab.December; break;
                case "Insectopedia": tab=AppTab.Insectopedia; break;
                case "Fishopedia": tab=AppTab.Fishopedia; break;
                case "Seapedia": tab=AppTab.Seapedia; break;
                case "Critterpedia": tab=AppTab.Critterpedia; break;
                case "Insects": tab=AppTab.Insects; break;
                case "Fish": tab=AppTab.Fish; break;
                case "SeaCreatures": tab=AppTab.SeaCreatures; break;
            }
        }
        this.timeout = null;
        cookies.defaults.expires = 100000;
        const timeOffsetMinutes = Number.parseInt(cookies.get("timeOffsetMinutes")?.replaceAll(/[^-1234567890]/g, "")?.padStart(1, "0") ?? "0");
        const timeOffsetHours = Number.parseInt(cookies.get("timeOffsetHours")?.replaceAll(/[^-1234567890]/g, "")?.padStart(1, "0") ?? "0");
        const timeOffsetDays = Number.parseInt(cookies.get("timeOffsetDays")?.replaceAll(/[^-1234567890]/g, "")?.padStart(1, "0") ?? "0");
        const timeOffsetMonths = Number.parseInt(cookies.get("timeOffsetMonths")?.replaceAll(/[^-1234567890]/g, "")?.padStart(1, "0") ?? "0");
        const timeOffsetYears = Number.parseInt(cookies.get("timeOffsetYears")?.replaceAll(/[^-1234567890]/g, "")?.padStart(1, "0") ?? "0");
        const date = new Date(Date.now() + (((timeOffsetYears * 365 + timeOffsetMonths * 31 + timeOffsetDays) * 24 + timeOffsetHours) * 60 + timeOffsetMinutes) * 60 * 1000);
        this.state = {
            tab,
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

    switchView(this: App, view: AppTab) {
        switch (view) {
            case AppTab.January: window.location.hash = "January"; break;
            case AppTab.February: window.location.hash = "February"; break;
            case AppTab.March: window.location.hash = "March"; break;
            case AppTab.April: window.location.hash = "April"; break;
            case AppTab.May: window.location.hash = "May"; break;
            case AppTab.June: window.location.hash = "June"; break;
            case AppTab.July: window.location.hash = "July"; break;
            case AppTab.August: window.location.hash = "August"; break;
            case AppTab.September: window.location.hash = "September"; break;
            case AppTab.October: window.location.hash = "October"; break;
            case AppTab.November: window.location.hash = "November"; break;
            case AppTab.December: window.location.hash = "December"; break;
            case AppTab.Insectopedia: window.location.hash = "Insectopedia"; break;
            case AppTab.Fishopedia: window.location.hash = "Fishopedia"; break;
            case AppTab.Seapedia: window.location.hash = "Seapedia"; break;
            case AppTab.Critterpedia: window.location.hash = "Critterpedia"; break;
            case AppTab.Insects: window.location.hash = "Insects"; break;
            case AppTab.Fish: window.location.hash = "Fish"; break;
            case AppTab.SeaCreatures: window.location.hash = "SeaCreatures"; break;
        }
        this.setState({tab: view});
    }
    setOption<Prop extends keyof AppState>(name: Prop, value: AppState[Prop]) {
        let ns: Partial<AppState> = {};
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
        let t = this.state.tab;
        let navInner = <ul>
            <li className={t===AppTab.Insectopedia?"active":""} onClick={() => this.switchView(AppTab.Insectopedia)}>Insectopedia</li>
            <li className={t===AppTab.Fishopedia?"active":""} onClick={() => this.switchView(AppTab.Fishopedia)}>Fishopedia</li>
            <li className={t===AppTab.Seapedia?"active":""} onClick={() => this.switchView(AppTab.Seapedia)}>Seapedia</li>
            <li className={t===AppTab.Critterpedia?"active":""} onClick={() => this.switchView(AppTab.Critterpedia)}>Critterpedia</li>
            <li className={t===AppTab.Insects?"active":""} onClick={() => this.switchView(AppTab.Insects)}>Insects</li>
            <li className={t===AppTab.Fish?"active":""} onClick={() => this.switchView(AppTab.Fish)}>Fish</li>
            <li className={t===AppTab.SeaCreatures?"active":""} onClick={() => this.switchView(AppTab.SeaCreatures)}>Sea Creatures</li>
            <li className="spacer">-</li>
            <li className={t===AppTab.January?"active":""}  onClick={() => this.switchView(AppTab.January)}>January</li>
            <li className={t===AppTab.February?"active":""}  onClick={() => this.switchView(AppTab.February)}>February</li>
            <li className={t===AppTab.March?"active":""}  onClick={() => this.switchView(AppTab.March)}>March</li>
            <li className={t===AppTab.April?"active":""}  onClick={() => this.switchView(AppTab.April)}>April</li>
            <li className={t===AppTab.May?"active":""}  onClick={() => this.switchView(AppTab.May)}>May</li>
            <li className={t===AppTab.June?"active":""}  onClick={() => this.switchView(AppTab.June)}>June</li>
            <li className={t===AppTab.July?"active":""}  onClick={() => this.switchView(AppTab.July)}>July</li>
            <li className={t===AppTab.August?"active":""}  onClick={() => this.switchView(AppTab.August)}>August</li>
            <li className={t===AppTab.September?"active":""}  onClick={() => this.switchView(AppTab.September)}>September</li>
            <li className={t===AppTab.October?"active":""}  onClick={() => this.switchView(AppTab.October)}>October</li>
            <li className={t===AppTab.November?"active":""}  onClick={() => this.switchView(AppTab.November)}>November</li>
            <li className={t===AppTab.December?"active":""}  onClick={() => this.switchView(AppTab.December)}>December</li>
        </ul>;
        let opts = this.state;
        const now = opts.now;
        
        return <div className="app">
            <div className="nav" style={{position: "fixed", zIndex: "1"}}>
                {navInner}
            </div>
            <div className="nav" style={{visibility: "hidden"}}>
                {navInner}
            </div>
            <div className="content">
                <div className="tiles">
                    <div className="critterTilesOptions tile">
                        <h1 className={"tile-h1"}>{t===AppTab.Insectopedia?"Insectopedia":t===AppTab.Fishopedia?"Fishopedia":t===AppTab.Seapedia?"Seapedia":"Table"}</h1>
                        <div className="main">
                            Double click an entry to mark it as complete.
                            <br/><br/>
                            {t===AppTab.Insectopedia || t===AppTab.Fishopedia || t===AppTab.Seapedia ? <>
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
                                <br/></> : <></>
                            }
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
                {t===AppTab.Insectopedia ? <CritterpediaTiles type="bug" key="bug" parState={opts} /> : t===AppTab.Fishopedia ? <CritterpediaTiles type="fish" key="fish" parState={opts} /> : t===AppTab.Seapedia ? <CritterpediaTiles type="seaCreatures" key="seaCreatures" parState={opts} /> : t===AppTab.Critterpedia ? <CritterpediaTiles type="all" key="all" parState={opts}/> : t===AppTab.Insects ? <CritterTable type="Bug" cols={allCritterCols} parState={opts}/> : t===AppTab.Fish ? <CritterTable type="Fish" cols={allCritterCols}parState={opts} /> : t===AppTab.SeaCreatures ? <CritterTable type="SeaCreatures" cols={allCritterCols} parState={opts}/> : <Month month={(t as number)} parState={opts}/>}
                {opts.hideClock ? <></> : <Clock now={now}/>}
            </div>
            <div className="footer">
                All data sourced from the <a href="https://docs.google.com/spreadsheets/d/13d_LAJPlxMa_DubPTuirkIV4DERBMXbrWQsmSh8ReK4/edit#gid=926889329">ACNH Spreadsheet</a>. Images hosted by <a href="https://acnhcdn.com/">ACNH CDN</a>.
            </div>
        </div>;
    }

}

interface ClockProps {
    now: Date;
}

interface ClockState {
    hidden: boolean;
}

class Clock extends React.Component<ClockProps, ClockState> {
    constructor(props: ClockProps) {
        super(props);
        this.state = {
            hidden: cookies.get("clockHiddenLeft")==="1"
        };
    }
    hide() {
        let h = !this.state.hidden;
        cookies.set("clockHiddenLeft", h?"1":"0");
        this.setState({hidden: h});
    }
    render() {
        const now = this.props.now;
        return <div className={"clock"+(this.state.hidden?" clock-hidden":"")}>
            <div className="clock-bg"></div>
            <div className="clock-arrow">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22.5 35" style={{height: "25px"}} className={"clock-arrow"+(this.state.hidden?" clock-arrow-reverse":"")} onClick={() => {this.hide(); return false;}}>
                    <path fill="none" className="clock-arrow-outline" strokeWidth="10px" strokeLinecap="round" strokeLinejoin="round"
                        d="M 5, 30 L 13.5, 17.5 L 5, 5" />
                    <path fill="none" className="clock-arrow-inner" strokeWidth="4px" strokeLinecap="round" strokeLinejoin="round"
                        d="M 5, 30 L 13.5, 17.5 L 5, 5" />
                </svg>
            </div>
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
                        <path mask="url(#text-cutout)" className="clock-dayofweek-bg" 
                            d="M76.676,17.729
                               c0,15.245-15.454,17.73-23.3,17.73
                               H23.3
                               c-7.849,0-23.3-2.485-23.3-17.73
                               S15.449,0,23.3,0
                               h30.08
                               C61.222,0,76.676,2.485,76.676,17.729
                               Z" transform="translate(0.5 0.5)"/>
                    </svg>
                </span>
            </div>
        </div>;
    }
}

interface MonthProps {
    month: number;
    parState: AppState;
}

class Month extends React.Component<MonthProps> {
    render() {
        return <div style={{display:"flex"}}>
            <div style={{borderRight:"2px solid white", flexGrow: "1"}}>
                <h1 style={{width:"100%", textAlign: "center", background: "black", margin: "0", color: "white"}}>Fish</h1>
                <CritterTable type="Fish" cols={condensedCritterCols} month={this.props.month} parState={this.props.parState}/>
            </div>
            <div style={{borderRight:"2px solid white", flexGrow: "1"}}>
                <h1 style={{width:"100%", textAlign: "center", background: "black", margin: "0", color: "white"}}>Insects</h1>
                <CritterTable type="Bug" cols={condensedCritterCols} month={this.props.month} parState={this.props.parState} />
            </div>
            <div style={{flexGrow: "1"}}>
                <h1 style={{width:"100%", textAlign: "center", background: "black", margin: "0", color: "white"}}>Sea Creatures</h1>
                <CritterTable type="SeaCreatures" cols={condensedCritterCols} month={this.props.month} parState={this.props.parState} />
            </div>
        </div>;
    }
}



export default App;
