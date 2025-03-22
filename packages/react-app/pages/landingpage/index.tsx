/* eslint-disable @next/next/no-img-element */
// src/components/LandingPage.tsx
import { useRouter } from "next/router";
import { useUserRole } from "@/context/UserRoleContext";
import InfoHub from "@/components/KuhleAi";
import Connect from "@/components/ConnectButton";


export default function LandingPage() {
  const router = useRouter();
  const { setRole } = useUserRole();

  const handleNavigation = (role: "driver" | "commuter") => {
    setRole(role);
    router.push(`/${role}`);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white">
      {/* Hero Section with Logo and Image */}
      <div className="relative w-full h-[60vh] bg-blue-600 rounded-b-[40px] overflow-hidden flex flex-col items-center justify-center">
        {/* Logo + App Name */}
        <h1 className="absolute top-12 text-3xl font-bold text-white z-10">
          Tranzit
        </h1>

        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1629128625414-374a9e16d56a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Ride Experience"
          className="absolute top-0 left-0 w-full h-full object-cover opacity-90"
        />
      </div>

      {/* Title & Description */}
      <div className="text-center mt-8 px-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Seamless Travel, Fast & Secure
        </h2>
        <p className="text-gray-600 text-base mt-2">
          Get around effortlessly with instant & secure payments.
        </p>
      </div>

      {/* Call-to-Action Buttons (Side-by-Side) */}
      <div className="w-full max-w-sm flex justify-between mt-6 px-4">
        <button
          className="w-40 py-3 rounded-lg bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition-all"
          onClick={() => handleNavigation("commuter")}
        >
          Commuter
        </button>
        <button
          className="w-40 py-3 rounded-lg border border-gray-400 text-gray-900 font-semibold text-lg hover:bg-gray-100 transition-all"
          onClick={() => handleNavigation("driver")}
        >
          Driver
        </button>
      </div>

      {/* Footer */}
      <div className="m-6 text-gray-500 text-sm">
        <Connect />
      </div>
      <InfoHub />
    </div>
  );
}