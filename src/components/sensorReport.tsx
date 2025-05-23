import { useState, useEffect } from "react";
import * as echarts from "echarts";
import { BiExport } from "react-icons/bi";
import { BiFilter } from "react-icons/bi";

interface SensorData {
  id: number;
  timestamp: string;
  component: string;
  status: "Critical" | "Warning" | "OK";
  value: number;
}
interface Data{
  generateData: Function
}
export default function SensorReports({generateData}:Data){
   const [sensorData, setSensorData] = useState<SensorData[]>([]);
    useEffect(()=>{
       setSensorData(generateData())
     }, [])

   // Initialize charts
   useEffect(() => {
     if (sensorData.length > 0) {
       // Component distribution chart
       const componentChart = echarts.init(
         document.getElementById("component-chart"),
       );
       const componentCounts: Record<string, number> = {};
 
       sensorData.forEach((data) => {
         componentCounts[data.component] =
           (componentCounts[data.component] || 0) + 1;
       });
 
       const componentOption = {
         animation: false,
         backgroundColor: "#ffffff",
         title: {
           text: "Component Distribution",
           left: "center",
           textStyle: {
             color: "#333333",
           },
         },
         tooltip: {
           trigger: "item",
           formatter: "{a} <br/>{b}: {c} ({d}%)",
         },
         legend: {
           orient: "vertical",
           left: "left",
           textStyle: {
             color: "#333333",
           },
         },
         series: [
           {
             name: "Components",
             type: "pie",
             radius: "60%",
             data: Object.keys(componentCounts).map((key) => ({
               name: key,
               value: componentCounts[key],
             })),
             emphasis: {
               itemStyle: {
                 shadowBlur: 10,
                 shadowOffsetX: 0,
                 shadowColor: "rgba(0, 0, 0, 0.5)",
               },
             },
             itemStyle: {
               normal: {
                 color: function (params: any) {
                   const colorList = [
                     "#4CAF50",
                     "#2196F3",
                     "#FF9800",
                     "#E91E63",
                   ];
                   return colorList[params.dataIndex % colorList.length];
                 },
               },
             },
             label: {
               color: "#333333",
             },
           },
         ],
       };
 
       componentChart.setOption(componentOption);
 
       // Status distribution chart
       const statusChart = echarts.init(document.getElementById("status-chart"));
       const statusCounts: Record<string, number> = {};
 
       sensorData.forEach((data) => {
         statusCounts[data.status] = (statusCounts[data.status] || 0) + 1;
       });
 
       const statusOption = {
         animation: false,
         backgroundColor: "#ffffff",
         title: {
           text: "Alert Status Distribution",
           left: "center",
           textStyle: {
             color: "#333333",
           },
         },
         tooltip: {
           trigger: "item",
           formatter: "{a} <br/>{b}: {c} ({d}%)",
         },
         legend: {
           orient: "vertical",
           left: "left",
           textStyle: {
             color: "#333333",
           },
         },
         series: [
           {
             name: "Status",
             type: "pie",
             radius: "60%",
             data: Object.keys(statusCounts).map((key) => ({
               name: key,
               value: statusCounts[key],
             })),
             emphasis: {
               itemStyle: {
                 shadowBlur: 10,
                 shadowOffsetX: 0,
                 shadowColor: "rgba(0, 0, 0, 0.5)",
               },
             },
             itemStyle: {
               normal: {
                 color: function (params: any) {
                   const colorMap: Record<string, string> = {
                     Critical: "#ff4444",
                     Warning: "#ffbb33",
                     OK: "#00C851",
                   };
                   return colorMap[params.name] || "#2196F3";
                 },
               },
             },
             label: {
               color: "#333333",
             },
           },
         ],
       };
 
       statusChart.setOption(statusOption);
 
       // Timeline chart
       const timelineChart = echarts.init(
         document.getElementById("timeline-chart"),
       );
 
       // Group data by component and prepare for timeline
       const componentData: Record<
         string,
         { time: string[]; values: number[] }
       > = {};
 
       // Get unique components
       const uniqueComponents = Array.from(
         new Set(sensorData.map((item) => item.component)),
       );
 
       // Initialize data structure
       uniqueComponents.forEach((component) => {
         componentData[component] = {
           time: [],
           values: [],
         };
       });
 
       // Fill data
       sensorData.forEach((data) => {
         componentData[data.component].time.push(data.timestamp);
         componentData[data.component].values.push(data.value);
       });
 
       // Prepare series data
       const series = uniqueComponents.map((component) => ({
         name: component,
         type: "line",
         data: componentData[component].values
           .map((value, index) => [componentData[component].time[index], value])
           .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()),
         symbol: "circle",
         symbolSize: 8,
         lineStyle: {
           width: 3,
         },
       }));
 
       const timelineOption = {
         animation: false,
         backgroundColor: "#ffffff",
         title: {
           text: "Sensor Readings Timeline",
           left: "center",
           textStyle: {
             color: "#333333",
           },
         },
         tooltip: {
           trigger: "axis",
           axisPointer: {
             type: "cross",
           },
         },
         legend: {
           data: uniqueComponents,
           bottom: 10,
           textStyle: {
             color: "#333333",
           },
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
           axisLabel: {
             color: "#333333",
           },
           axisLine: {
             lineStyle: {
               color: "#333333",
             },
           },
         },
         yAxis: {
           type: "value",
           name: "Value",
           nameTextStyle: {
             color: "#333333",
           },
           axisLabel: {
             color: "#333333",
           },
           axisLine: {
             lineStyle: {
               color: "#333333",
             },
           },
           splitLine: {
             lineStyle: {
               color: "rgba(0, 0, 0, 0.1)",
             },
           },
         },
         series: series,
       };
 
       timelineChart.setOption(timelineOption);
 
       // Handle resize
       const handleResize = () => {
         componentChart.resize();
         statusChart.resize();
         timelineChart.resize();
       };
 
       window.addEventListener("resize", handleResize);
 
       return () => {
         window.removeEventListener("resize", handleResize);
         componentChart.dispose();
         statusChart.dispose();
         timelineChart.dispose();
       };
     }
   }, [sensorData]);
   const getStatusColor = (status: string) => {
    switch (status) {
      case "Critical":
        return "bg-[#ff4444]";
      case "Warning":
        return "bg-[#ffbb33]";
      case "OK":
        return "bg-[#00C851]";
      default:
        return "bg-gray-500";
    }
  };


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
                <div className="flex space-x-2">
                  <button className="flex flex-row items-center bg-blue-600 text-white px-4 py-2 rounded !rounded-button cursor-pointer whitespace-nowrap">
                    <BiExport className="mr-2"/>Export
                  </button>
                  <button className="flex flex-row items-center bg-transparent border border-gray-400 text-gray-700 px-4 py-2 rounded !rounded-button cursor-pointer whitespace-nowrap">
                    <BiFilter className="mr-2"/>Filter
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-2 px-4 text-left text-gray-700">ID</th>
                      <th className="py-2 px-4 text-left text-gray-700">
                        Timestamp
                      </th>
                      <th className="py-2 px-4 text-left text-gray-700">
                        Component
                      </th>
                      <th className="py-2 px-4 text-left text-gray-700">
                        Value
                      </th>
                      <th className="py-2 px-4 text-left text-gray-700">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sensorData.map((data, index) => (
                      <tr
                        key={data.id}
                        className={`border-b border-gray-200 hover:bg-gray-50 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                      >
                        <td className="py-3 px-4 text-gray-800">{data.id}</td>
                        <td className="py-3 px-4 text-gray-800">
                          {data.timestamp}
                        </td>
                        <td className="py-3 px-4 text-gray-800">
                          {data.component}
                        </td>
                        <td className="py-3 px-4 text-gray-800">
                          {data.component === "Tire Pressure"
                            ? `${data.value} PSI`
                            : `${data.value}%`}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(data.status)}`}
                          >
                            {data.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div className="text-gray-600">
                  Showing 1 to {sensorData.length} of {sensorData.length}{" "}
                  entries
                </div>
                <div className="flex space-x-2">
                  <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded !rounded-button cursor-pointer whitespace-nowrap">
                    Previous
                  </button>
                  <button className="bg-blue-600 text-white px-3 py-1 rounded !rounded-button cursor-pointer whitespace-nowrap">
                    1
                  </button>
                  <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded !rounded-button cursor-pointer whitespace-nowrap">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
  );
};