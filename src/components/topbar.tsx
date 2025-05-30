"use client"
import { BiCar } from "react-icons/bi";
import { useState, useEffect } from "react";
import { timeStamp } from "console";
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
  data: Array<DataType>,
  clicked: Function
}
export default function Topbar({ data, clicked}: DataPropType) { 
  const [alertsVisible, setAlertsVisible] = useState(true);
   const [lastData, setLastData] = useState<DataType | undefined>(undefined);
   const [lastCheck, setLastCheck] = useState<string | null>(null);
   useEffect(() => {
    setLastData(data[data.length - 1])
    const timestamp = new Date().toLocaleDateString() // current ISO timestamp
    setLastCheck(timestamp); // Simulated timestamp
  }, [data])
  const criticalAlerts = lastData
 ? Object.entries(lastData).filter(([key, value]) => {
     return (
       (key === "fuel" && typeof value === "number" && value <= 30) ||
       (key === "tire" && typeof value === "number" && value <= 30) ||
       (key === "brake" && value === false) ||
       (key === "seatbelt" && value === false)
     );
   })
 : [];
 const warningAlerts = lastData
 ? Object.entries(lastData).filter(([key, value]) => {
     return (
       (key === "fuel" && typeof value === "number" && value > 30 && value <= 60 ) ||
       (key === "tire" && typeof value === "number" && value > 30 && value <= 60 )
     );
   })
 : [];
  return(
    <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <i className="fas fa-car-alt text-3xl text-blue-600"></i>
            <h1 className="text-base font-bold text-gray-800 flex flex-row items-center gap-[10px] sm:text-2xl ">
              <BiCar/>Car Maintaines
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg !rounded-button cursor-pointer whitespace-nowrap text-gray-700"
                onClick={() => {clicked()}}
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
