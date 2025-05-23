
import { useState } from "react";
import * as echarts from "echarts";

interface SensorData {
  id: number;
  timestamp: string;
  component: string;
  status: "Critical" | "Warning" | "OK";
  value: number;
}

export default function SensorReports(){
   const [sensorData, setSensorData] = useState<SensorData[]>([]);
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

    const componentChart = echarts.init(
           document.getElementById("component-chart"),
         );
         const componentCounts: Record<string, number> = {};
   
         sensorData.forEach((data) => {
           componentCounts[data.component] =
             (componentCounts[data.component] || 0) + 1;
         });
   
    const statusOption = {
      // ... (same as your existing status chart options)
    };

   const statusChart = echarts.init(document.getElementById("status-chart"));
         const statusCounts: Record<string, number> = {};
   
         sensorData.forEach((data) => {
           statusCounts[data.status] = (statusCounts[data.status] || 0) + 1;
         });

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
          <div id="component-chart" style={{ height: "300px" }}></div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
          <div id="status-chart" style={{ height: "300px" }}></div>
        </div>
      </div>
    </>
  );
};