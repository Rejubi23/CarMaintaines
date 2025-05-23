// components/SensorTimeline.tsx
import { useState } from "react";
import * as echarts from "echarts";

interface SensorData {
  id: number;
  timestamp: string;
  component: string;
  status: "Critical" | "Warning" | "OK";
  value: number;
}

export default  function RecentSensor(){
  const [sensorData, setSensorData] = useState<SensorData[]>([]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200 mb-8">
      <div id="timeline-chart" style={{ height: "400px" }}></div>
    </div>
  );
};