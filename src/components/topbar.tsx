"use client"
import { useState, useEffect } from "react";
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
export default function Topbar({generateData}:Data) { 
  const [alertsVisible, setAlertsVisible] = useState(true);
   const [sensorData, setSensorData] = useState<SensorData[]>([]);
   const [lastCheck, setLastCheck] = useState<string | null>(null);
   const criticalAlerts = sensorData.filter(
    (data) => data.status === "Critical",
  );
  const warningAlerts = sensorData.filter((data) => data.status === "Warning");
  useEffect(()=>{
    setSensorData(generateData())
    const now = new Date().toLocaleString();
    setLastCheck(now);
  }, [])
  return(
    <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <i className="fas fa-car-alt text-3xl text-blue-600"></i>
            <h1 className="text-2xl font-bold text-gray-800">
              Sensor Readings
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg !rounded-button cursor-pointer whitespace-nowrap text-gray-700"
                onClick={() => setAlertsVisible(!alertsVisible)}
              >
                <i className="fas fa-bell"></i>
                <span>Alerts</span>
                {(criticalAlerts.length > 0 || warningAlerts.length > 0) && (
                  <span className="absolute -top-1 -right-1 bg-[#ff4444] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {criticalAlerts.length + warningAlerts.length}
                  </span>
                )}
              </button>
            </div>
            <span className="text-gray-600">{lastCheck}</span>
          </div>
        </div>
      </header>
  )
        
}
