import React from "react";
// import BarChart from "../components/BarChart";
import ScatterPlot from "../components/Scatterplot";

import { csv } from "d3";

import * as d3 from "d3";

// markup
const ChildhoodDiary = () => {
  let path = "/data/rye4_word_analysis.csv";
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
console.log('PAGE')

  React.useEffect(() => {
    csv(path).then((d) => {

      d.forEach((i) => {

        let quarter = Math.ceil(new Date(i.formatted_date).getMonth() / 3);
        let year = new Date(i.formatted_date).getMonth();


        i.date =  i.date ;
        i.formatted_date =  i.formatted_date;

    });

      // let newData=[]s
      // for(const value of d) {
      //   newData.push({
      //     label: value.label,
      //     value: value.value,
      //     tooltipContent: `<b>x: </b>${value.label}<br><b>y: </b>${value.value}`,
      //   })
      // }
      // setData(newData);
      setData(d)
      setLoading(false);
    });
    return () => undefined;
  }, []);

  return (
    <> {!loading &&




<div><ScatterPlot data={data}></ScatterPlot>
{JSON.stringify(data)}</div>}

    {/* // <BarChart
    //   svgProps={{
    //     margin: { top: 80, bottom: 80, left: 80, right: 80 },
    //     width: 600,
    //     height: 400,
    //   }}
    //   axisProps={{
    //     xLabel: 'X Axis',
    //   }}
    //   data={data}
    //   strokeWidth={4}
    // />s */}



    </>
  );
};

export default ChildhoodDiary;
