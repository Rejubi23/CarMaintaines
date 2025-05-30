import { useState, useEffect } from "react";
import * as echarts from "echarts";
import { BiExport } from "react-icons/bi";
import { BiFilter } from "react-icons/bi";

interface DataType {
  brake: boolean,
  brakeStatus: string,
  fuel: number,
  fuelStatus: string,
  seatbelt: boolean,
  seatbeltStatus: string,
  tire: number,
  tireStatus: string,
}



interface DataPropType {
  data: Array<DataType>
}
interface SensorChartData {
  component: string;
  status: string;
  value: number;
  timestamp: string;
}
interface DetailedReadings{
  component: string;
  status: string;
  value: number | boolean;
  timestamp: string;
}
export default function SensorReports({ data }: DataPropType) {
  const [sensorData, setSensorData] = useState<SensorChartData[]>([]);
  const [detailedReadings, setDetailedReadings] = useState<DetailedReadings[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  
  useEffect(() => {
    const transformed: DetailedReadings[] = [];
    
    data.forEach((entry) => {
      transformed.push(
        { component: 'Brake', value: entry.brake, status: entry.brakeStatus, timestamp: '' },
        { component: 'Fuel', value: entry.fuel, status: entry.fuelStatus, timestamp: '' },
        { component: 'Seatbelt', value: entry.seatbelt, status: entry.seatbeltStatus, timestamp: '' },
        { component: 'Tire', value: entry.tire, status: entry.tireStatus, timestamp: '' }
      );
    });

    setDetailedReadings(transformed);
  }, [data]);

  const entriesPerPage = 4;
  const startIndex = currentIndex * entriesPerPage;
  const currentEntry = sensorData.slice(startIndex, startIndex + entriesPerPage);
  const totalPages = Math.ceil(sensorData.length / entriesPerPage);

   // Helper to render value display
   const renderValue = (component: string, value: number | boolean) => {
    const comp = component.toLowerCase();
    
    if (comp === 'seatbelt') {
      return value ? 'Fastened' : 'Unfastened';
    }
    if (comp === 'brake') {
      return value ? 'All good' : 'Check';
    }
    return typeof value === 'number' ? value : value ? 'All good' : 'Check';
  };

  // const displayAlert = lastData
  //   ? ["fuel", "tire", "seatbelt", "brake"].map((key) => ({
  //     name: key,
  //     value: lastData[key as keyof DataType],
  //     status: lastData[`${key}Status` as keyof DataType],
  //   }))
  //   : [];


  useEffect(() => {
    if (!data || data.length === 0) return;

    // Transform API data to unified sensorData array
    const transformed: SensorChartData[] = data.map((entry, idx) => {
      const timestamp = new Date(Date.now() - (data.length - idx) * 1000).toISOString(); // Simulated timestamp

      return [
        {
          component: "Fuel",
          status: entry.fuelStatus,
          value: entry.fuel,
          timestamp,
        },
        {
          component: "Tire",
          status: entry.tireStatus,
          value: entry.tire,
          timestamp,
        },
        {
          component: "Brake",
          status: entry.brakeStatus,
          value: entry.brake ? 1 : 0,
          timestamp,
        },
        {
          component: "Seatbelt",
          status: entry.seatbeltStatus,
          value: entry.seatbelt ? 1 : 0,
          timestamp,
        },
      ];
    }).flat();

    setSensorData(transformed);
  }, [data]);

  useEffect(() => {
    if (sensorData.length === 0) return;

    // --- Component Distribution Chart ---
    const componentChart = echarts.init(document.getElementById("component-chart")!);
    const componentCounts: Record<string, number> = {};

    sensorData.forEach((data) => {
      componentCounts[data.component] = (componentCounts[data.component] || 0) + 1;
    });

    componentChart.setOption({
      animation: false,
      backgroundColor: "#ffffff",
      title: {
        text: "Component Distribution",
        left: "center",
        textStyle: { color: "#333333" },
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
      },
      legend: {
        orient: "vertical",
        left: "left",
        textStyle: { color: "#333333" },
      },
      series: [{
        name: "Components",
        type: "pie",
        radius: "60%",
        data: Object.entries(componentCounts).map(([name, value]) => ({ name, value })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        itemStyle: {
          normal: {
            color: (params: any) => {
              const colorList = ["#4CAF50", "#2196F3", "#FF9800", "#E91E63"];
              return colorList[params.dataIndex % colorList.length];
            },
          },
        },
        label: { color: "#333333" },
      }],
    });

    // --- Status Distribution Chart ---
    const statusChart = echarts.init(document.getElementById("status-chart")!);
    const statusCounts: Record<string, number> = {};

    sensorData.forEach((data) => {
      statusCounts[data.status] = (statusCounts[data.status] || 0) + 1;
    });

    statusChart.setOption({
      animation: false,
      backgroundColor: "#ffffff",
      title: {
        text: "Alert Status Distribution",
        left: "center",
        textStyle: { color: "#333333" },
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
      },
      legend: {
        orient: "vertical",
        left: "left",
        textStyle: { color: "#333333" },
      },
      series: [{
        name: "Status",
        type: "pie",
        radius: "60%",
        data: Object.entries(statusCounts).map(([name, value]) => ({ name, value })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        itemStyle: {
          normal: {
            color: (params: any) => {
              const colorMap: Record<string, string> = {
                CRITICAL: "#ff4444",
                WARNING: "#ffbb33",
                OK: "#00C851",
              };
              return colorMap[params.name] || "#2196F3";
            },
          },
        },
        label: { color: "#333333" },
      }],
    });

    // --- Timeline Chart ---
    const dom = document.getElementById("timeline-chart");
if (dom) {
  echarts.dispose(dom); // dispose before re-init
 // your full option


    const timelineChart = echarts.init(dom);
    const grouped: Record<string, { time: string[]; values: number[] }> = {};

    sensorData.forEach(({ component, timestamp, value }) => {
      if (!grouped[component]) {
        grouped[component] = { time: [], values: [] };
      }
      grouped[component].time.push(timestamp);
      grouped[component].values.push(value);
    });

    const series = Object.keys(grouped).map((component) => {
      const times = grouped[component].time;
      const values = grouped[component].values;
    
      // Combine and sort by time
      const combined = times
        .map((time, i) => ({
          time: new Date(time).toISOString(), // force ISO format
          value: values[i],
        }))
        .filter((item) => typeof item.value === "number") // filter out invalids
        .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
    
      return {
        name: component,
        type: "line",
        data: combined.map((entry) => [entry.time, entry.value]),
        symbol: "circle",
        symbolSize: 8,
        lineStyle: { width: 3 },
      };
    });
    timelineChart.setOption({
      animation: false,
      backgroundColor: "#ffffff",
      title: {
        text: "Sensor Readings Timeline",
        left: "center",
        textStyle: { color: "#333333" },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross" },
      },
      legend: {
        data: Object.keys(grouped),
        bottom: 10,
        textStyle: { color: "#333333" },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "15%",
        top: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "time",
        axisLabel: { color: "#333" },
        axisLine: { lineStyle: { color: "#333" } },
      },
      yAxis: {
        type: "value",
        name: "Value",
        nameTextStyle: { color: "#333333" },
        axisLabel: { color: "#333333" },
        axisLine: { lineStyle: { color: "#333333" } },
        splitLine: { lineStyle: { color: "rgba(0, 0, 0, 0.1)" } },
      },
      series,
    });}
  }, [sensorData]);



  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Sensor Reports
      </h2>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
          <div id="component-chart" style={{ height: "300px" }}></div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
          <div id="status-chart" style={{ height: "300px" }}></div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200 mb-8">
        <div id="timeline-chart" style={{ height: "400px" }}></div>
      </div>

      {/* Detailed Sensor Data */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            Detailed Sensor Data
          </h3>
        </div>

        <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 px-4 text-left text-gray-700">Component</th>
              <th className="py-2 px-4 text-left text-gray-700">Value</th>
              <th className="py-2 px-4 text-left text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentEntry.map((data, index) => (
              <tr
                key={startIndex + index}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="py-3 px-4 text-gray-800">{data.component}</td>
                <td className="py-3 px-4 text-gray-800">
                {renderValue(data.component, data.value)}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold text-white ${
                      data.status === "CRITICAL"
                        ? "bg-red-500"
                        : data.status === "WARNING"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                  >
                    {data.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-between items-center">
        <div className="text-gray-600">
          Page {currentIndex + 1} of {totalPages}
        </div>
        <div className="space-x-2">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => prev - 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 text-[#000]"
          >
            Previous
          </button>
          <button
            disabled={currentIndex === totalPages - 1 || totalPages === 0}
            onClick={() => setCurrentIndex((prev) => prev + 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 text-[#000]"
          >
            Next
          </button>
        </div>
      </div>
    </div>

      </div>
    </div>
  );
};