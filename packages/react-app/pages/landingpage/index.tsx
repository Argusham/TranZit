
/* eslint-disable @next/next/no-img-element */
// src/components/LandingPage.tsx
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCar, faCircleDollarToSlot } from '@fortawesome/free-solid-svg-icons';
import { useUserRole } from '@/context/UserRoleContext';

export default function LandingPage() {
  const router = useRouter();
  const { setRole } = useUserRole(); // Access setRole from context

  const handleNavigation = (role: 'driver' | 'commuter') => {
    setRole(role); // Set the role in context
    router.push(`/${role}`); // Navigate to the respective page
  };

  return (
    <div className="relative flex flex-col items-center justify-between min-h-screen">
    {/* Background image with gradient overlay */}
    <div className="absolute inset-0 z-0">
      <img
        src="https://cdn.24.co.za/files/Cms/General/d/8872/84ce083d7f474f26ad80e3431643aed2.jpg"
        alt="Background"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-80"></div>
    </div>

    {/* Content */}
    <div className="relative z-10 flex flex-col items-center text-center text-yellow-300 mt-10">
    <h1 className="text-3xl text-white font-bold">
      Siyaya
      </h1>
      <h1 className="text-3xl font-bold">
        Making Your <br /> Ride Enjoyable
      </h1>
    </div>

    {/* Info and Buttons Section */}
    <div className="relative z-10 w-full max-w-md p-6 space-y-6 mt-auto mb-8 text-center">
      {/* Info Section */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-yellow-400 tracking-wide">
          Fast & Secure Payments
          <span>
            <FontAwesomeIcon icon={faCircleDollarToSlot} className="ml-2 w-6 h-6" />
          </span>
        </h1>
        <p className="text-sm text-white leading-relaxed">
          Experience the fastest way to pay using QR code scanning technology.
        </p>
      </div>

      {/* Buttons for Navigation */}
      <div className="flex justify-around">
        <button
          className="w-32 py-3 rounded-full bg-gradient-to-l from-yellow-400 via-yellow-500 to-yellow-600 text-black text-base font-medium shadow-lg hover:scale-105 transition-transform duration-300"
          onClick={() => handleNavigation('driver')}
        >
          <FontAwesomeIcon icon={faCar} className="mr-2 w-4 h-4" />
          Driver
        </button>
        <button
          className="w-32 py-3 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black text-base font-medium shadow-lg hover:scale-105 transition-transform duration-300"
          onClick={() => handleNavigation('commuter')}
        >
          <FontAwesomeIcon icon={faUser} className="mr-2 w-4 h-4" />
          Commuter
        </button>
      </div>
    </div>
  </div>
  );
}
