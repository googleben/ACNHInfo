import React from 'react';
import './App.css';
import {Bug, Fish, bugsArr, fishArr, monthNames} from "./Types"
import {CritterpediaTiles} from "./Tiles"



enum Col {
    Index, Name, Price, Location, Times, Shadow, Months, Caught
}





enum AppTab {
    Insectopedia, Fishopedia, Insects, Fish, January, February, March, April, May, June, July, August, September, October, November, December
}

interface AppState {
    tab: AppTab
}

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
        
        return <div className="app">
            <div className="nav">
                <ul>
                    <li className={t===AppTab.Insectopedia?"active":""} onClick={() => this.switchView(AppTab.Insectopedia)}>Insectopedia</li>
                    <li className={t===AppTab.Fishopedia?"active":""} onClick={() => this.switchView(AppTab.Fishopedia)}>Fishopedia</li>
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
            </div>
            <div  style={{overflowX: "auto", height:"95vh"}}>
                
                {t===AppTab.Insectopedia? <CritterpediaTiles type="bug" key="bug" /> : t===AppTab.Fishopedia ? <CritterpediaTiles type="fish" key="fish" /> : t===AppTab.Insects ? <AllBugs cols={allFishCols} /> : t===AppTab.Fish ? <AllFish cols={allFishCols} /> : <Month month={(t as number) - 2} />}
                

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
                <AllFish cols={condensedFishCols} month={this.props.month} />
            </div>
            <div>
                <h1 style={{width:"100%", textAlign: "center", background: "black", margin: "0", color: "white"}}>Insects</h1>
                <AllBugs cols={condensedFishCols} month={this.props.month} />
            </div>
        </div>;
    }
}

interface AllBugsProps {
    cols: Col[];
    month?: number;
    filter?: (f: Bug) => boolean
}

interface AllBugsState {
    sort: string;
    reverseSort: boolean;
}

class AllBugs extends React.Component<AllBugsProps, AllBugsState> {

    constructor(props: AllBugsProps) {
        super(props);
        this.state = {sort: "index", reverseSort: false};
    }

    setSort(this: AllBugs, sort: string) {
        if (this.state.sort===sort) {
            this.setState({reverseSort: !this.state.reverseSort});
        } else {
            this.setState({sort: sort, reverseSort: false});
        }
    }

    render() {
        let bugsT = [];
        let evenL = true;
        let sort = this.state.sort;
        let rev = this.state.reverseSort;
        bugsArr.sort((aa, bb) => {
            let ans = ((a, b) => {
                if (sort === "index") return a.index-b.index;
                if (sort === "name") return a.name.localeCompare(b.name);
                if (sort === "price") return a.price - b.price;
                if (sort === "location") return a.location.localeCompare(b.location);
                if (sort === "times") return a.times[0].localeCompare(b.times[0]);
                return 0;
            })(aa,bb) * (rev ? -1 : 1);
            if (ans === 0) return aa.index-bb.index;
            return ans;
        });
        for (let bug of bugsArr) {
            let m = this.props.month;
            if (this.props.month !== undefined && !bug.seasons[this.props.month]) continue;
            const even = evenL;
            let ans = <tr key={bug.index}>
                {this.props.cols.includes(Col.Index)?<td className={(even?"even":"odd")}>{bug.index}</td>:<div />}
                {this.props.cols.includes(Col.Name)?<td className={(even?"even":"odd")}>{bug.name+(m!==undefined&&!bug.seasons[(m + 1) % 12]?" [1]":"")+(m!==undefined&&!bug.seasons[(m + 11) % 12]?" [2]":"")}</td>:<div />}
                {this.props.cols.includes(Col.Price)?<td className={(even?"even":"odd")}>{bug.price}</td>:<div />}
                {this.props.cols.includes(Col.Location)?<td className={(even?"even":"odd")}>{bug.location}</td>:<div />}
                {this.props.cols.includes(Col.Times)?<td className={(even?"even":"odd")}>{bug.times.join(", ")}</td>:<div />}
                {this.props.cols.includes(Col.Months)?bug.seasons.map((v, i) => <td key={i} className={"check "+(even?"even":"odd")+(v?" yes":" no")}>{v?"🗹":"🗷"}</td>):<div />}
                {this.props.cols.includes(Col.Caught)?<td className={even?"even":"odd"}>{bug.caught.map(s => "'"+s+"'").join("\t|\t")}</td>:<div />}
            </tr>
            bugsT.push(ans);
            evenL = !evenL;
        }
        return <table className="blue">
            <thead><tr>
            {this.props.cols.includes(Col.Index)?<th onClick={() => this.setSort("index")} className={"clickable "}>#</th>:<div />}
                {this.props.cols.includes(Col.Name)?<th onClick={() => this.setSort("name")} className={"clickable "}>Name</th>:<div />}
                {this.props.cols.includes(Col.Price)?<th onClick={() => this.setSort("price")} className={"clickable "}>Price</th>:<div />}
                {this.props.cols.includes(Col.Location)?<th onClick={() => this.setSort("location")} className={"clickable"}>Location</th>:<div />}
                {this.props.cols.includes(Col.Times)?<th onClick={() => this.setSort("times")} className={"clickable "}>Times</th>:<div />}
                {this.props.cols.includes(Col.Months)?monthNames.map(v => <th key={v}>{v.charAt(0)}</th>):<div />}
                {this.props.cols.includes(Col.Caught)?<th>Catch Messages</th>:<div />}
            </tr></thead>
            <tbody style={{overflowY: "auto"}}>
                {bugsT}
            </tbody>
        </table>;
    }
}



interface AllFishProps {
    cols: Col[];
    month?: number;
    filter?: (f: Fish) => boolean
}
const allFishCols = [Col.Index, Col.Name, Col.Price, Col.Location, Col.Times, Col.Shadow, Col.Months, Col.Caught];
const condensedFishCols = [Col.Name, Col.Price, Col.Location, Col.Times, Col.Shadow]

interface AllFishState {
    sort: string;
    reverseSort: boolean;
}

class AllFish extends React.Component<AllFishProps, AllFishState> {

    constructor(props: AllFishProps) {
        super(props);
        this.state = {sort: "index", reverseSort: false}
    }

    setSort(this: AllFish, sort: string) {
        if (this.state.sort===sort) {
            this.setState({reverseSort: !this.state.reverseSort});
        } else {
            this.setState({sort: sort, reverseSort: false});
        }
    }

    render() {
        let fishT = [];
        let evenL = true;
        let sort = this.state.sort;
        let rev = this.state.reverseSort;
        fishArr.sort((aa, bb) => {
            let ans = ((a, b) => {
                if (sort === "index") return a.index-b.index;
                if (sort === "name") return a.name.localeCompare(b.name);
                if (sort === "price") return a.price - b.price;
                if (sort === "location") return a.location.localeCompare(b.location);
                if (sort === "times") return a.times[0].localeCompare(b.times[0]);
                if (sort === "shadow") return a.shadow.localeCompare(b.shadow);
                return 0;
            })(aa,bb) * (rev ? -1 : 1);
            if (ans === 0) return aa.index-bb.index;
            return ans;
        });
        for (let fish of fishArr) {
            let m = this.props.month;
            if (this.props.month !== undefined && !fish.seasons[this.props.month]) continue;
            const even = evenL;

            let ans = <tr key={fish.index}>
                {this.props.cols.includes(Col.Index)?<td className={(even?"even":"odd")}>{fish.index}</td>:<div />}
                {this.props.cols.includes(Col.Name)?<td className={(even?"even":"odd")}>{fish.name+(m!==undefined&&!fish.seasons[(m + 1) % 12]?" [1]":"")+(m!==undefined&&!fish.seasons[(m + 11) % 12]?" [2]":"")}</td>:<div />}
                {this.props.cols.includes(Col.Price)?<td className={(even?"even":"odd")}>{fish.price}</td>:<div />}
                {this.props.cols.includes(Col.Location)?<td className={(even?"even":"odd")}>{fish.location}</td>:<div />}
                {this.props.cols.includes(Col.Times)?<td className={(even?"even":"odd")}>{fish.times.join(", ")}</td>:<div />}
                {this.props.cols.includes(Col.Shadow)?<td className={even?"even":"odd"}>{fish.shadow}</td>:<div />}
                {this.props.cols.includes(Col.Months)?fish.seasons.map((v, i) => <td key={i} className={"check "+(even?"even":"odd")+(v?" yes":" no")}>{v?"🗹":"🗷"}</td>):<div />}
                {this.props.cols.includes(Col.Caught)?<td className={even?"even":"odd"}>{fish.caught.map(s => "'"+s+"'").join("\t|\t")}</td>:<div />}
            </tr>
            fishT.push(ans);
            evenL = !evenL;
        }
        return <table className="blue">
            <thead><tr>
                {this.props.cols.includes(Col.Index)?<th onClick={() => this.setSort("index")} className={"clickable "}>#</th>:<div />}
                {this.props.cols.includes(Col.Name)?<th onClick={() => this.setSort("name")} className={"clickable "}>Name</th>:<div />}
                {this.props.cols.includes(Col.Price)?<th onClick={() => this.setSort("price")} className={"clickable "}>Price</th>:<div />}
                {this.props.cols.includes(Col.Location)?<th onClick={() => this.setSort("location")} className={"clickable"}>Location</th>:<div />}
                {this.props.cols.includes(Col.Times)?<th onClick={() => this.setSort("times")} className={"clickable "}>Times</th>:<div />}
                {this.props.cols.includes(Col.Shadow)?<th onClick={() => this.setSort("shadow")} className={"clickable "}>Shadow</th>:<div />}
                {this.props.cols.includes(Col.Months)?monthNames.map(v => <th key={v}>{v.charAt(0)}</th>):<div />}
                {this.props.cols.includes(Col.Caught)?<th>Catch Messages</th>:<div />}
            </tr></thead>
            <tbody style={{overflowY: "auto"}}>
                {fishT}
            </tbody>
        </table>;
    }
}

export default App;
