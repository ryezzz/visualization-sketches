import React from "react";
// import BarChart from "../components/BarChart";
import ScatterPlot from "../components/Scatterplot";

import { csv } from "d3";

import * as d3 from "d3";
import moment from "moment";
// markup
const ChildhoodDiary = () => {
  let path = "/data/rye4_word_analysis.csv";
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    csv(path).then((d) => {

      d.forEach((i, index) => {

        // let quarter = Math.ceil(new Date(i.formatted_date).getMonth() / 3);
        let quarter = moment(new Date(i.formatted_date)).quarter(moment().quarter()).startOf('quarter');

        let month = new Date(i.formatted_date).getMonth();
        let year = new Date(i.formatted_date).getFullYear()



        i.date =  i.date ;
        i.month = month
        i.year = year
        i.quarter = quarter
        i.index=index
        i.radius=20;

    });

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
