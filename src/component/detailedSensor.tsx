import { useState } from "react";

interface SensorData {
  id: number;
  timestamp: string;
  component: string;
  status: "Critical" | "Warning" | "OK";
  value: number;
}

interface SystemAlertsProps {
  sensorData: SensorData[];
}

export default function DetailedSensor() {
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
    return(
<div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Detailed Sensor Data
                </h3>
                <div className="flex space-x-2">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded !rounded-button cursor-pointer whitespace-nowrap">
                    <i className="fas fa-download mr-2"></i>Export
                  </button>
                  <button className="bg-transparent border border-gray-400 text-gray-700 px-4 py-2 rounded !rounded-button cursor-pointer whitespace-nowrap">
                    <i className="fas fa-filter mr-2"></i>Filter
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
            )
        }