import { useState } from "react";

interface SensorData {
  id: number;
  timestamp: string;
  component: string;
  status: "Critical" | "Warning" | "OK";
  value: number;
}

export default  function RecentSensor(){
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
  <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Recent Sensor Readings
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
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
                    {sensorData.slice(0, 10).map((data) => (
                      <tr
                        key={data.id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
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
            </div>
    
                )
            }