 import { useState, useEffect } from "react";
 export default function Footer() {
  const [lastCheck, setLastCheck] = useState<string | null>(null);
  useEffect(() => {
    const now = new Date().toLocaleString();
    setLastCheck(now);
  }, []);
    return(
 <footer className="bg-gray-100 py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2025 CarMaintaines. All rights reserved.</p>
          <p className="text-sm mt-1">
            Last system check: {lastCheck}
          </p>
        </div>
      </footer>
    )
 }
