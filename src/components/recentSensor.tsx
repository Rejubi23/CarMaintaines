import { useState, useEffect } from "react";

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
export default function RecentSensor({ data }: DataPropType) {
  const [lastData, setLastData] = useState<DataType | undefined>(undefined);
  useEffect(() => {
    setLastData(data[data.length - 1])
  }, [data])

  const displayAlert = lastData
    ? ["fuel", "tire", "seatbelt", "brake"].map((key) => ({
      name: key,
      value: lastData[key as keyof DataType],
      status: lastData[`${key}Status` as keyof DataType],
    }))
    : [];


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


  return (
    <div className="container mx-auto bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <h3 className="text-xl font-bold mb-4 text-gray-800">
        Recent Sensor Readings
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              {/* <th className="py-2 px-4 text-left text-gray-700">
                   Timestamp
                 </th> */}
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
            {displayAlert.map((data, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="py-3 px-4 text-gray-800">
                  {data.name}
                </td>
                <td className="py-3 px-4 text-gray-800">
                  {String(data.value)}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold text-white ${data.status === "CRITICAL"
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

    </div>

  )
}

