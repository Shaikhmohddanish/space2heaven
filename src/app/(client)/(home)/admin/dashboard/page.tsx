"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { dashboardData } from "@/constants";
import SelectLocations from "@/components/layouts/SelectLocations";

const Dashboard = () => {
  const router = useRouter();
  const [adminDetails, setAdminDetails] = useState<string | null>(null);


  useEffect(() => {
    const storedAdminDetails = localStorage.getItem("adminDetails");
    setAdminDetails(storedAdminDetails);
    if (!storedAdminDetails) {
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }
  }, [router]);

  return (
    <section className="min-h-screen py-24 px-4 bg-sand-soft flex-center flex-col bg-[url(/images/pattern.png)]">
      {adminDetails ? (
        <>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-home text-center">
            Admin Dashboard
          </h1>
          <hr className="max-w-xl w-full h-1 bg-home my-4" />
          <div className="flex flex-col lg:flex-row lg:items-start gap-8 w-full max-w-7xl">
            {/* Left Section: Dashboard Links */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {dashboardData.map(({ link, title, color, hover }, index) => (
                <Link
                  href={link}
                  key={index}
                  className={`${color} hover:${hover} transition duration-200 dashboard-card flex-center text-center p-4 rounded-lg text-sand-soft font-bold bg-[url(/images/pattern.png)]`}
                >
                  {title}
                </Link>
              ))}
            </div>

            {/* Right Section: Select Locations */}
            <div className="flex-[.5]">
              <SelectLocations />
            </div>
          </div>
        </>
      ) : (
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-home">
          Access Denied..!
        </h1>
      )}
    </section>
  );
};

export default Dashboard;
