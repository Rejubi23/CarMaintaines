"use client"
import { useState, useEffect } from "react";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import RecentSensor from "@/components/recentSensor";
import SensorReading from "@/components/sensorReading";
import SensorReports from "@/components/sensorReport";
import SystemAlerts from "@/components/systemAlerts";
import Topbar from "@/components/topbar";

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
export default function Home() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "reports">("dashboard");
  const [error, setError] = useState<string | null>(null);
  const [data2, setData] = useState<DataType[]>([]);
  const [onClick, setOnClick] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);


  const checkClicked =()=>{
    if(onClick){
      setOnClick(!onClick)
    }
    else{
      setOnClick(!onClick)
    }
  }

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('https://adaptable-neighborly-mapusaurus.glitch.me/');
        if (!res.ok) throw new Error('Network response was not ok');
  
        const json = await res.json();
        const newItem = json.data;
        
  
        // Add only if data is different from the last item
        
        setData((prev) => {
          const lastItem = prev[prev.length - 1];
          const isDifferent = JSON.stringify(lastItem) !== JSON.stringify(newItem);
          return isDifferent ? [...prev, newItem] : prev;
        });
        setLoading(false)
  
      } catch (err: any) {
        setError(err.message || "Unknown error");
        console.error("Fetch error:", err);
      }
    }, 5000); // run every 5 seconds
  
    return () => clearInterval(interval); // clear interval on unmount
  }, []);



  return (
    <>
    {/* Loading Overlay */}
    {loading && (
      <div className="fixed inset-0 bg-white z-[9999] flex items-center justify-center">
        <div className="loader"></div>
      </div>
    )}

    {/* Main Layout */}
    <div className="bg-[#fff]">
      <Topbar data={data2} clicked={checkClicked} />
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "reports" && <SensorReports data={data2} />}

      {activeTab === "dashboard" && (
        <div>
          <SensorReading data={data2} />
          {onClick && <SystemAlerts data={data2} />}
          <RecentSensor data={data2} />
        </div>
      )}

      <Footer />
    </div>
  </>
  );
};

