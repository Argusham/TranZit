/* eslint-disable @next/next/no-img-element */
// src/components/LandingPage.tsx
import { useRouter } from 'next/router';

export default function LandingPage() {
  const router = useRouter();

  const handleNavigation = (role: 'driver' | 'commuter') => {
    if (role === 'driver') {
      router.push('/driver');
    } else {
      router.push('/commuter');
    }
  };

  return (
    <div className='flex flex-col items-center justify-between min-h-screen bg-green-600'>

    {/* Illustration */}
    <div className='flex-grow flex justify-center items-center'>
      {/* Add your SVG or image for the QR illustration */}
      <img src='https://images.unsplash.com/photo-1605098293544-25f4c32344c8?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt='QR Illustration' className='w-64 h-64' />
    </div>

    {/* Info Section */}
    <div className='text-center text-white p-6'>
      <h1 className='text-2xl font-bold mb-4'>Fastest Payment</h1>
      <p className='text-lg mb-6'>QR code scanning technology makes your payment process faster and easier.</p>
    </div>

    {/* Buttons for Navigation */}
    <div className='w-full max-w-md p-6'>
      <button
        className='w-full bg-yellow-500 text-white py-3 rounded-full mb-4'
        onClick={() => handleNavigation('driver')}
      >
        Driver
      </button>
      <button
        className='w-full bg-yellow-500 text-white py-3 rounded-full'
        onClick={() => handleNavigation('commuter')}
      >
        Commuter
      </button>
    </div>
  </div>
  );
}
