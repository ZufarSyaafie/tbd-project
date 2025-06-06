import React from "react";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="sticky top-0 px-10 py-3 bg-[#10141E] shadow-md w-full z-50 min-w-0">
      <div className="flex items-center justify-between max-w-full">
        <div className="flex items-center flex-shrink-0">
          <a href="/">
            <Image src="/image/logo.png" alt="Logo" width={100} height={100} />
          </a>
        </div>
        <div className="flex items-center space-x-10 font-extrabold flex-shrink-0">
          <a href="/" className="text-[15px] text-[#99A1AF] hover:text-[#00BCFF] transition-colors duration-300 whitespace-nowrap">
            DASHBOARD
          </a>
          <a href="/writer" className="text-[15px] text-[#99A1AF] hover:text-[#00BCFF] transition-colors duration-300 whitespace-nowrap">
            WRITER
          </a>
          <a href="/publisher" className="text-[15px] text-[#99A1AF] hover:text-[#00BCFF] transition-colors duration-300 whitespace-nowrap">
            PUBLISHER
          </a>
        </div>
      </div>
    </nav>
  );
}