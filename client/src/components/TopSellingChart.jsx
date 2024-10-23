import { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const TopSellingChart = ({ topProds }) => {
  let prodName = topProds?.map((item) => item?.name);
  let prodSale = topProds?.map((item) => item?.totalSale);

  const [state, setstate] = useState("");

  useEffect(() => {
    setstate({
      options: {
        colors: ["#00AA55"],
        //   color: ["#2E93fA", "#66DA26", "#546E7A", "#E91E63", "#FF9800"],
        chart: {
          id: "apexchart-example",
        },
        xaxis: {
          categories: prodName,
        },
      },
      series: [
        {
          name: "Total Sale",
          data: prodSale,
        },
      ],
    });
  }, [topProds]);

  return (
    <div>
      {state && state?.series && (
        <Chart
          options={state?.options}
          series={state?.series}
          type="bar" //line, area, bar, pie, donut, scatter, bubble, heatmap, radialBar
          width={"100%"}
          height={320}
        />
      )}
    </div>
  );
};

export default TopSellingChart;
