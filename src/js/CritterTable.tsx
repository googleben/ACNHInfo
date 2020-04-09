import {Bug, Fish, bugsArr, fishArr, monthNames} from "./Types"
import React from 'react';

export enum Col {
    Index, Name, Price, Location, Times, Shadow, Months, Caught
}

interface CritterTableProps {
    cols: Col[];
    type: "Fish" | "Bug";
    month?: number;
    filter?: (f: Fish | Bug) => boolean
}


interface CritterTableState {
    sort: string;
    reverseSort: boolean;
}

export class CritterTable extends React.Component<CritterTableProps, CritterTableState> {

    constructor(props: CritterTableProps) {
        super(props);
        this.state = {sort: "index", reverseSort: false}
    }

    setSort(this: CritterTable, sort: string) {
        if (this.state.sort===sort) {
            this.setState({reverseSort: !this.state.reverseSort});
        } else {
            this.setState({sort: sort, reverseSort: false});
        }
    }

    render() {
        let t = this.props.type==="Fish";
        let arr: (Bug | Fish)[] = t ? fishArr : bugsArr;
        let ansArr = [];
        let sort = this.state.sort;
        let rev = this.state.reverseSort;
        arr.sort((aa, bb) => {
            let ans = ((a, b) => {
                if (sort === "index") return a.index-b.index;
                if (sort === "name") return a.name.localeCompare(b.name);
                if (sort === "price") return a.price - b.price;
                if (sort === "location") return a.location.localeCompare(b.location);
                if (sort === "times") return a.times[0].localeCompare(b.times[0]);
                if (sort === "shadow" && "shadow" in a && "shadow" in b) return a.shadow.localeCompare(b.shadow);
                return 0;
            })(aa,bb) * (rev ? -1 : 1);
            if (ans === 0) return aa.index-bb.index;
            return ans;
        });
        for (let fish of arr) {
            let m = this.props.month;
            if (this.props.month !== undefined && !fish.seasons[this.props.month]) continue;

            let ans = <tr key={fish.index}>
                {this.props.cols.includes(Col.Index)?<td>{fish.index}</td>:<div />}
                {this.props.cols.includes(Col.Name)?<td>{fish.name+(m!==undefined&&!fish.seasons[(m + 1) % 12]?" [1]":"")+(m!==undefined&&!fish.seasons[(m + 11) % 12]?" [2]":"")}</td>:<div />}
                {this.props.cols.includes(Col.Price)?<td>{fish.price}</td>:<div />}
                {this.props.cols.includes(Col.Location)?<td>{fish.location}</td>:<div />}
                {this.props.cols.includes(Col.Times)?<td>{fish.times.join(", ")}</td>:<div />}
                {this.props.cols.includes(Col.Shadow) && "shadow" in fish?<td>{fish.shadow}</td>:null}
                {this.props.cols.includes(Col.Months)?fish.seasons.map((v, i) => <td key={i} className={"check "+(v?" yes":" no")}>{v?"🗹":"🗷"}</td>):<div />}
                {this.props.cols.includes(Col.Caught)?<td>{fish.caught.map(s => "'"+s+"'").join("\t|\t")}</td>:<div />}
            </tr>
            ansArr.push(ans);
        }
        return <table className="blue">
            <thead><tr>
                {this.props.cols.includes(Col.Index)?<th onClick={() => this.setSort("index")} className={"clickable "}>#</th>:<div />}
                {this.props.cols.includes(Col.Name)?<th onClick={() => this.setSort("name")} className={"clickable "}>Name</th>:<div />}
                {this.props.cols.includes(Col.Price)?<th onClick={() => this.setSort("price")} className={"clickable "}>Price</th>:<div />}
                {this.props.cols.includes(Col.Location)?<th onClick={() => this.setSort("location")} className={"clickable"}>Location</th>:<div />}
                {this.props.cols.includes(Col.Times)?<th onClick={() => this.setSort("times")} className={"clickable "}>Times</th>:<div />}
                {this.props.cols.includes(Col.Shadow) && t?<th onClick={() => this.setSort("shadow")} className={"clickable "}>Shadow</th>:null}
                {this.props.cols.includes(Col.Months)?monthNames.map(v => <th key={v}>{v.charAt(0)}</th>):<div />}
                {this.props.cols.includes(Col.Caught)?<th>Catch Messages</th>:<div />}
            </tr></thead>
            <tbody style={{overflowY: "auto"}}>
                {ansArr}
            </tbody>
        </table>;
    }
}