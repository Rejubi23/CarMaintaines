import { useState, useEffect } from "react";
import { CiWarning } from "react-icons/ci";
import { FaCheckCircle } from "react-icons/fa";
interface DataType{
  brake: boolean,
  brakeStatus: string,
  fuel: number,
  fuelStatus: string,
  seatbelt: boolean,
  seatbeltStatus: string,
  tire: number,
  tireStatus: string,
  }

  interface DataPropType{
    data: Array<DataType>
  }
export default function SensorReading({data}:DataPropType) { 
  const [lastData, setLastData] = useState<DataType | undefined>(undefined);
useEffect(()=>{
    setLastData(data[data.length - 1])
    console.log(lastData)
},[data])
console.log(lastData)
  const getStatusColor = (status: string) => {
    switch (status) {
      case "CRITICAL":
        return "bg-[#ff4444]";
      case "WARNING":
        return "bg-[#ffbb33]";
      case "OK":
        return "bg-[#00C851]";
      default:
        return "bg-gray-500";
    }
  };

  // Get status text color
  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "Critical":
        return "text-[#ff4444]";
      case "Warning":
        return "text-[#ffbb33]";
      case "OK":
        return "text-[#00C851]";
      default:
        return "text-gray-500";
    }
  };

        return(
<div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mx-auto">
              {/* Fuel Level */}
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800">
                    Fuel Level
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold text-white ${getStatusColor( lastData?.fuelStatus ?? "Unknown" )}`}
                  >
                    {lastData?.fuelStatus}
                  </span>
                </div>
                <div className="flex-1 flex flex-col justify-center items-center">
                  <div className="relative w-32 h-32 mb-4">
                    <div className="absolute inset-0 rounded-full border-4 border-gray-100 flex items-center justify-center">
                      <span className="text-4xl font-bold text-[#000]">
                        {lastData?.fuel}
                      </span>
                    </div>
                    <svg
                      className="absolute inset-0"
                      width="128"
                      height="128"
                      viewBox="0 0 128 128"
                    >
                      <circle
                        cx="64"
                        cy="64"
                        r="60"
                        fill="none"
                        stroke={
                          lastData?.fuelStatus === "Critical"
                            ? "#ff4444"
                            : lastData?.fuelStatus === "Warning"
                              ? "#ffbb33"
                              : "#00C851"
                        }
                        strokeWidth="8"
                        strokeDasharray={`${((lastData?.fuel ?? 0) / 100) * 377} 377`}
                        strokeDashoffset="0"
                        strokeLinecap="round"
                        transform="rotate(-90 64 64)"
                      />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      Last updated: 
                    </p>
                  </div>
                </div>
              </div>






              {/* Brake System */}
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800">
                   Brakes
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold text-white ${getStatusColor( lastData?.brakeStatus ?? "Unknown" )}`}
                  >
                    {lastData?.brake === true ?"OK":"CRITICAL"}
                  </span>
                </div>
                <div className="flex-1 flex flex-col justify-center items-center">
                  <div className="text-6xl mb-4">
                    {lastData?.brakeStatus === "OK" ? (
                      <FaCheckCircle  className="text-[#00C851] text-[80px]" />
                    ) : (
                      <CiWarning className="text-[#ff4444] text-[80px]"/>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold mb-2 text-gray-800">
                      {lastData?.brakeStatus === "OK"
                        ? "All Good"
                        : "Check Brakes"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Last updated: 
                    </p>
                  </div>
                </div>
              </div>




              {/* Seatbelt Connection */}
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800">
                    Seatbelt Connection
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold text-white ${getStatusColor( lastData?.seatbeltStatus ?? "Unknown" )}`}
                  >
                    {lastData?.seatbelt===true?"OK":"CRITICAL"}
                  </span>
                </div>
                <div className="flex-1 flex flex-col justify-center items-center">
                  <div className="text-6xl mb-4">
                    {lastData?.seatbeltStatus === "OK" ? (
                      <FaCheckCircle  className="text-[#00C851] text-[80px]" />
                    ) : (
                      <CiWarning className="text-[#ff4444] text-[80px]"/>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold mb-2 text-gray-800">
                      {lastData?.seatbeltStatus === "OK"
                        ? "Fastened"
                        : "Unfastened"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Last updated: 
                    </p>
                  </div>
                </div>
              </div>

              {/* Tire Pressure */}
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800">
                    Tire Pressure
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold text-white ${getStatusColor( lastData?.tireStatus ?? "Unknown" )}`}
                  >
                    {lastData?.tireStatus}
                  </span>
                </div>
                <div className="flex-1 flex flex-col justify-center items-center">
                  <div className="relative w-32 h-32 mb-4">
                    <div className="absolute inset-0 rounded-full border-4 border-gray-100 flex items-center justify-center">
                      <span className="text-4xl font-bold text-[#000]">
                        {lastData?.tire}
                      </span>
                      <span className="text-sm ml-1 text-[#000]">PSI</span>
                    </div>
                    <svg
                      className="absolute inset-0"
                      width="128"
                      height="128"
                      viewBox="0 0 128 128"
                    >
                      <circle
                        cx="64"
                        cy="64"
                        r="60"
                        fill="none"
                        stroke={
                          lastData?.tireStatus === "Critical"
                            ? "#ff4444"
                            :lastData?.tireStatus === "Warning"
                              ? "#ffbb33"
                              : "#00C851"
                        }
                        strokeWidth="8"
                        strokeDasharray={`${((lastData?.tire ?? 0) / 100) * 377} 377`}
                        strokeDashoffset="0"
                        strokeLinecap="round"
                        transform="rotate(-90 64 64)"
                      />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      Last updated: 
                    </p>
                  </div>
                </div>
              </div>
            </div>
            )
    }