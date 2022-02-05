import React from 'react';
import '../css/App.scss';
import {CritterpediaTiles} from "./Tiles"
import {Col, CritterTable} from "./CritterTable"

enum AppTab {
    January=0, February, March, April, May, June, July, August, September, October, November, December,
    Insectopedia, Fishopedia, Seapedia, Insects, Fish
}

interface AppState {
    tab: AppTab
}

const allCritterCols = [Col.Index, Col.Name, Col.Price, Col.Location, Col.Times, Col.Shadow, Col.Months, Col.Caught];
const condensedCritterCols = [Col.Name, Col.Price, Col.Location, Col.Times, Col.Shadow]

class App extends React.Component<{}, AppState> {

    constructor(props: {}) {
        super(props);
        this.state = {tab: AppTab.Insectopedia}
    }

    switchView(this: App, view: AppTab) {
        this.setState({tab: view});
    }

    render() {
        let t = this.state.tab;
        let navInner = <ul>
            <li className={t===AppTab.Insectopedia?"active":""} onClick={() => this.switchView(AppTab.Insectopedia)}>Insectopedia</li>
            <li className={t===AppTab.Fishopedia?"active":""} onClick={() => this.switchView(AppTab.Fishopedia)}>Fishopedia</li>
            <li className={t===AppTab.Seapedia?"active":""} onClick={() => this.switchView(AppTab.Seapedia)}>Seapedia</li>
            <li className={t===AppTab.Insects?"active":""} onClick={() => this.switchView(AppTab.Insects)}>Insects</li>
            <li className={t===AppTab.Fish?"active":""} onClick={() => this.switchView(AppTab.Fish)}>Fish</li>
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
        </ul>
        
        return <div className="app">
            <div className="nav" style={{position: "fixed", zIndex: "1"}}>
                {navInner}
            </div>
            <div className="nav" style={{visibility: "hidden"}}>
                {navInner}
            </div>
            <div>
                {t===AppTab.Insectopedia ? <CritterpediaTiles type="bug" key="bug" /> : t===AppTab.Fishopedia ? <CritterpediaTiles type="fish" key="fish" /> : t===AppTab.Seapedia ? <CritterpediaTiles type="seaCreatures" key="seaCreatures" /> : t===AppTab.Insects ? <CritterTable type="Bug" cols={allCritterCols} /> : t===AppTab.Fish ? <CritterTable type="Fish" cols={allCritterCols} /> : <Month month={(t as number)} />}
            </div>
            <div className="footer">
                All data sourced from the <a href="https://docs.google.com/spreadsheets/d/13d_LAJPlxMa_DubPTuirkIV4DERBMXbrWQsmSh8ReK4/edit#gid=926889329">ACNH Spreadsheet</a>. Images hosted by <a href="https://acnhcdn.com/">ACNH CDN</a>.
            </div>
        </div>;
    }

}

interface MonthProps {
    month: number;
}

class Month extends React.Component<MonthProps> {
    render() {
        return <div style={{display:"flex"}}>
            <div style={{borderRight:"2px solid white"}}>
                <h1 style={{width:"100%", textAlign: "center", background: "black", margin: "0", color: "white"}}>Fish</h1>
                <CritterTable type="Fish" cols={condensedCritterCols} month={this.props.month} />
            </div>
            <div>
                <h1 style={{width:"100%", textAlign: "center", background: "black", margin: "0", color: "white"}}>Insects</h1>
                <CritterTable type="Bug" cols={condensedCritterCols} month={this.props.month} />
            </div>
        </div>;
    }
}



export default App;
