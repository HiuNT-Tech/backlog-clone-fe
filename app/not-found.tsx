'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import '@/i18n';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div
      className="w-screen h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        backgroundColor: '#25344C',
        color: 'white',
      }}
    >
      {/* Particles/Stars animation background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url("/404/particles.png")',
          backgroundRepeat: 'repeat',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          animation: 'stars 12s linear infinite alternate',
        }}
      />

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes stars {
          0% {
            background-position: -100% 100%;
          }
          100% {
            background-position: 0 0;
          }
        }
        @keyframes spinAround {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
        {/* 404 Title */}
        <h1 className="text-8xl md:text-9xl font-extrabold mb-4">
          {t('notFound.title')}
        </h1>

        {/* Message */}
        <p className="text-lg md:text-xl max-w-md mb-8 leading-relaxed">
          <span>LOST IN </span>
          <span className="relative inline-block">
            <span className="relative z-10"> SPACE </span>
            <span
              className="absolute left-0 top-1/2 w-full h-[3px] bg-yellow-400"
              style={{ transform: 'translateY(-50%)' }}
            />
          </span>
          <span className="text-yellow-400 font-medium"> TrungHieuDev</span>?
          <br />
          Hmm, looks like that page doesn&apos;t exist.
        </p>

        {/* Planet and Astronaut illustration */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 mb-8">
          {/* Planet SVG */}
          <Image
            src="/404/planet.svg"
            alt="Planet"
            fill
            className="object-contain"
          />
          {/* Astronaut SVG - animated */}
          <div
            className="absolute -top-4 -right-4 w-12 h-12"
            style={{
              animation: 'spinAround 5s linear infinite',
            }}
          >
            <Image
              src="/404/astronaut.svg"
              alt="Astronaut"
              width={50}
              height={50}
            />
          </div>
        </div>

        {/* Go Home Button */}
        <Link href="/">
          <Button
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-gray-800 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            {t('notFound.goHome')}
          </Button>
        </Link>
      </div>
    </div>
  );
}
