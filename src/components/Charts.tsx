import { Chart, GoogleChartOptions } from "react-google-charts";

import Link from "./ui/Link";
import useCharts from "../hooks/chart-hooks";

const Charts = () => {
    const [chartData, loadingChartData] = useCharts();
    const pieChartOptions: GoogleChartOptions = {
        is3D: true,
        sliceVisibilityThreshold: 0,
        backgroundColor: ""
    };
    const calendarOptions: GoogleChartOptions = {
        title: "Applications Sent",
        backgroundColor: "",
        width: 1000
    };
    return (
        <div className="flex h-full flex-col overflow-x-hidden">
            {!loadingChartData && (
                <div className="flex flex-col">
                    <div className="mb-6 flex h-[260px]">
                        <div className="flex-shrink-0">
                            <p>Total Applications: {chartData.meta.total}</p>
                            <p>Company List</p>
                            <ul className="h-[200px] w-[300px] overflow-y-auto">
                                {chartData.meta.companyList.map((item) => (
                                    <li className="even:bg-slate-100">
                                        <Link text={item.name} link={item.link} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="h-full">
                            <Chart
                                chartType="PieChart"
                                data={chartData.pie}
                                options={pieChartOptions}
                                loader={<div>Loading Chart</div>}
                            />
                        </div>
                    </div>
                    <div className="h-full overflow-y-auto overflow-x-hidden">
                        <div className="">
                            <Chart chartType="Calendar" data={chartData.calendar} options={calendarOptions} />
                        </div>
                    </div>
                </div>
            )}
            {loadingChartData && (
                <div className="flex h-full w-full items-center justify-center">
                    <p>Loading...</p>
                </div>
            )}
        </div>
    );
};

export default Charts;
