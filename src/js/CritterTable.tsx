import {Bug, Fish, bugsArr, fishArr, monthNames, seaCreaturesArr, SeaCreature} from "./Types"
import React from 'react';
import "../css/CritterTable.scss"
import * as cookies from "browser-cookies";
import { AppState } from "./App";

export enum Col {
    Index, Name, Price, Location, Times, Shadow, Months, Caught
}

interface CritterTableProps {
    cols: Col[];
    type: "Fish" | "Bug" | "SeaCreatures";
    parState: AppState;
    month?: number;
    filter?: (f: Fish | Bug) => boolean
}


interface CritterTableState {
    sort: "index" | "name" | "price" | "location" | "shadow";
    reverseSort: boolean;
    done: Set<number>
}

export class CritterTable extends React.Component<CritterTableProps, CritterTableState> {

    constructor(props: CritterTableProps) {
        super(props);
        let done = new Set<number>();
        const t = this.props.type;
        const pre = t==="Fish"?"fish":t==="Bug"?"bug":"seaCreature";
        let arr: (Bug[] | Fish[] | SeaCreature[]) = t==="Fish" ? fishArr : t==="Bug" ? bugsArr : seaCreaturesArr;
        for (const c of arr) {
            if (cookies.get(pre+c.index)==="1") done.add(c.index);
        }
        this.state = {sort: "index", reverseSort: false, done}
    }

    setSort(this: CritterTable, sort: CritterTableState["sort"]) {
        if (this.state.sort===sort) {
            this.setState({reverseSort: !this.state.reverseSort});
        } else {
            this.setState({sort: sort, reverseSort: false});
        }
    }

    setDone(index: number) {
        const t = this.props.type;
        let done = this.state.done.has(index);
        cookies.set((t==="Fish"?"fish":t==="Bug"?"bug":"seaCreature")+index, done?"0":"1");
        let tmp = new Set(this.state.done);
        if (done) tmp.delete(index);
        else tmp.add(index);
        this.setState({done: tmp});
    }

    render() {
        let t = this.props.type;
        let parState = this.props.parState;
        let arr: (Bug[] | Fish[] | SeaCreature[]) = t==="Fish" ? fishArr : t==="Bug" ? bugsArr : seaCreaturesArr;
        let ansArr = [];
        let sort = this.state.sort;
        let rev = this.state.reverseSort;
        let cMonth = this.props.month ?? parState.now.getMonth();
        arr.sort((aa, bb) => {
            let ans = ((a, b) => {
                if (sort === "index") return a.index-b.index;
                if (sort === "name") return a.name.localeCompare(b.name);
                if (sort === "price") return a.sell - b.sell;
                if (sort === "location") return a.location.localeCompare(b.location);
                if (sort === "shadow" && "shadow" in a && "shadow" in b) return a.shadow.localeCompare(b.shadow);
                return 0;
            })(aa,bb) * (rev ? -1 : 1);
            if (ans === 0) return aa.index-bb.index;
            return ans;
        });
        for (let critter of arr) {
            const times = parState.southernHemisphere ? critter.shTimes : critter.nhTimes;
            let m = this.props.month;
            if (m !== undefined && times[cMonth][0] === "NA") continue;
            const done = this.state.done.has(critter.index);

            let ans = <tr className={done?"done":""} key={critter.index} onDoubleClick={() => {this.setDone(critter.index); return false;}}>
                {this.props.cols.includes(Col.Index)?<td>{critter.index}</td>:<></>}
                <td><span className={"critter-table-icon-owl"+(done?"-done":"")}></span></td>
                {this.props.cols.includes(Col.Name)?<td>{critter.name+(m!==undefined&&times[this.props.month][(m + 1) % 12] === "NA"?" [1]":"")+(m!==undefined&&times[this.props.month][(m + 11) % 12] === "NA"?" [2]":"")}</td>:<></>}
                {this.props.cols.includes(Col.Price)?<td>{critter.sell}</td>:<></>}
                {this.props.cols.includes(Col.Location)?<td>{(critter as Fish).location}</td>:<></>}
                {this.props.cols.includes(Col.Times)?<td>{times[cMonth].join(", ")}</td>:<></>}
                {this.props.cols.includes(Col.Shadow) && "shadow" in critter?<td>{critter.shadow}</td>:<></>}
                {this.props.cols.includes(Col.Months)?times.map(t => t[0]!=="NA").map((v, i) => <td key={i} className={"check "+(v?" yes":" no")}>{v?"🗹":"🗷"}</td>):<></>}
                {this.props.cols.includes(Col.Caught)?<td>{critter.catchMessages.map(s => "'"+s+"'").join("\t|\t")}</td>:<></>}
            </tr>
            ansArr.push(ans);
        }
        return <table className="critter-table blue">
            <thead><tr>
                {this.props.cols.includes(Col.Index)?<th onClick={() => this.setSort("index")} className={"clickable "}>#</th>:<></>}
                <th key="done"><span className="critter-table-icon-owl-done"></span></th>
                {this.props.cols.includes(Col.Name)?<th onClick={() => this.setSort("name")} className={"clickable "}>Name</th>:<></>}
                {this.props.cols.includes(Col.Price)?<th onClick={() => this.setSort("price")} className={"clickable "}>Price</th>:<></>}
                {this.props.cols.includes(Col.Location)?<th onClick={() => this.setSort("location")} className={"clickable"}>Location</th>:<></>}
                {this.props.cols.includes(Col.Times)?<th>Times</th>:<></>}
                {this.props.cols.includes(Col.Shadow) && t!=="Bug"?<th onClick={() => this.setSort("shadow")} className={"clickable "}>Shadow</th>:<></>}
                {this.props.cols.includes(Col.Months)?monthNames.map(v => <th key={v}>{v.charAt(0)}</th>):<></>}
                {this.props.cols.includes(Col.Caught)?<th>Catch Messages</th>:<></>}
            </tr></thead>
            <tbody style={{overflowY: "auto"}}>
                {ansArr}
            </tbody>
        </table>;
    }
}