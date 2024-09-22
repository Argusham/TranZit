/* eslint-disable @next/next/no-img-element */
// /* eslint-disable @next/next/no-img-element */
// // src/components/LandingPage.tsx
// import { useRouter } from 'next/router';
// import { useState, useEffect } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faUser, faCar, faCircleDollarToSlot } from '@fortawesome/free-solid-svg-icons';

// export default function LandingPage() {
//   const router = useRouter();
//   const [isMounted, setIsMounted] = useState(false);

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   const handleNavigation = (role: 'driver' | 'commuter') => {
//     router.push(`/${role}`);
//   };

//   return (
//     <div className="flex flex-col items-center justify-between min-h-screen bg-gray-900 p-8">
//        {/* Header Section */}
//        <div className="flex flex-col items-center text-center text-yellow-400 mt-10">
//         <h1 className="text-4xl font-bold">
//           Making Your <br /> Ride Enjoyable
//         </h1>
//         <p className="text-sm text-gray-300 mt-2">
//           Expert drivers at work. We will pick you
//         </p>
//       </div>

//       {/* Illustration */}
//       <div className="flex-grow flex justify-center items-center animate-float">
//         {isMounted && (
//           <img
//             src="https://images.unsplash.com/photo-1605098293544-25f4c32344c8?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
//             alt="QR Illustration"
//             className="w-64 h-64 rounded-lg shadow-xl hover:scale-110 transition-all duration-500 ease-in-out"
//           />
//         )}
//       </div>

//       {/* Info Section */}
//       <div className="text-center p-6 space-y-4">
//         <h1 className="text-4xl font-bold text-yellow-400 tracking-wider hover:text-neon-green transition-colors duration-300">
//           Fast & Secure Payments 
//           <span>
//             <FontAwesomeIcon icon={faCircleDollarToSlot} className="ml-2 w-6 h-9" />
//           </span>
//         </h1>
//         <p className="text-lg text-white">
//           Experience the fastest way to pay using QR code scanning technology.
//         </p>
//       </div>

//       {/* Buttons for Navigation */}
//       <div className="w-full max-w-md flex justify-around mb-6">
//         <button
//           className="w-40 py-3 rounded-full bg-yellow-400 text-black text-lg font-semibold hover:bg-yellow-500 transition-transform duration-300 ease-in-out shadow-lg hover:scale-105"
//           onClick={() => handleNavigation('driver')}
//         >
//           <FontAwesomeIcon icon={faCar} className="mr-2 w-4 h-4" />
//           Driver
//         </button>
//         <button
//           className="w-40 py-3 rounded-full bg-yellow-400 text-black text-lg font-semibold hover:bg-yellow-500 transition-transform duration-300 ease-in-out shadow-lg hover:scale-105"
//           onClick={() => handleNavigation('commuter')}
//         >
//           <FontAwesomeIcon icon={faUser} className="mr-2 w-4 h-4" />
//           Commuter
//         </button>
//       </div>

//       {/* Global Styles */}
//       <style jsx global>{`
//         @keyframes float {
//           0% {
//             transform: translateY(0);
//           }
//           50% {
//             transform: translateY(-10px);
//           }
//           100% {
//             transform: translateY(0);
//           }
//         }

//         .animate-float {
//           animation: float 3s ease-in-out infinite;
//         }

//         .bg-neon-green {
//           background-color: #28a745; /* Darker green */
//         }

//         .text-neon-green {
//           color: #28a745; /* Darker green */
//         }

//         /* Neon button hover */
//         button:hover {
//           box-shadow: 0 0 10px rgba(40, 167, 69, 0.6), 0 0 20px rgba(40, 167, 69, 0.4);
//         }
//       `}</style>
//     </div>
//   );
// }


// src/components/LandingPage.tsx
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCar, faCircleDollarToSlot } from '@fortawesome/free-solid-svg-icons';
import { useUserRole } from '@/context/UserRoleContext';

export default function LandingPage() {
  const router = useRouter();
  const { setRole } = useUserRole(); // Access setRole from context
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleNavigation = (role: 'driver' | 'commuter') => {
    setRole(role); // Set the role in context
    router.push(`/${role}`); // Navigate to the respective page
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gray-900 p-8">
       {/* Header Section */}
       <div className="flex flex-col items-center text-center text-yellow-400 mt-10">
        <h1 className="text-4xl font-bold">
          Making Your <br /> Ride Enjoyable
        </h1>
        <p className="text-sm text-gray-300 mt-2">
          Expert drivers at work. We will pick you
        </p>
      </div>

      {/* Illustration */}
      <div className="flex-grow flex justify-center items-center animate-float">
        {isMounted && (
          <img
            src="https://images.unsplash.com/photo-1605098293544-25f4c32344c8?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="QR Illustration"
            className="w-64 h-64 rounded-lg shadow-xl hover:scale-110 transition-all duration-500 ease-in-out"
          />
        )}
      </div>

      {/* Info Section */}
      <div className="text-center p-6 space-y-4">
        <h1 className="text-4xl font-bold text-yellow-400 tracking-wider hover:text-neon-green transition-colors duration-300">
          Fast & Secure Payments 
          <span>
            <FontAwesomeIcon icon={faCircleDollarToSlot} className="ml-2 w-6 h-9" />
          </span>
        </h1>
        <p className="text-lg text-white">
          Experience the fastest way to pay using QR code scanning technology.
        </p>
      </div>

      {/* Buttons for Navigation */}
      <div className="w-full max-w-md flex justify-around mb-6">
        <button
          className="w-40 py-3 rounded-full bg-yellow-400 text-black text-lg font-semibold hover:bg-yellow-500 transition-transform duration-300 ease-in-out shadow-lg hover:scale-105"
          onClick={() => handleNavigation('driver')}
        >
          <FontAwesomeIcon icon={faCar} className="mr-2 w-4 h-4" />
          Driver
        </button>
        <button
          className="w-40 py-3 rounded-full bg-yellow-400 text-black text-lg font-semibold hover:bg-yellow-500 transition-transform duration-300 ease-in-out shadow-lg hover:scale-105"
          onClick={() => handleNavigation('commuter')}
        >
          <FontAwesomeIcon icon={faUser} className="mr-2 w-4 h-4" />
          Commuter
        </button>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .bg-neon-green {
          background-color: #28a745; /* Darker green */
        }

        .text-neon-green {
          color: #28a745; /* Darker green */
        }

        /* Neon button hover */
        button:hover {
          box-shadow: 0 0 10px rgba(40, 167, 69, 0.6), 0 0 20px rgba(40, 167, 69, 0.4);
        }
      `}</style>
    </div>
  );
}
