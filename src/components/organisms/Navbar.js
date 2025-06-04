import React from "react";
import Image from "next/image";
export default function Navbar() {
    return (
        <nav className="px-10 py-3 bg-[#10141E] shadow-md w-full sticky top-0 z-50">
            <div  className="flex items-center justify-between"> 
                <div  className="flex items-center">
                    <a href="/">
                        <Image src="/image/logo.png" alt="Logo" width={100} height={100} />
                    </a>
                </div>
                <div className="flex items-center space-x-10 font-extrabold">
                    <a href="/" className="text-[15px] text-[#99A1AF] hover:text-[#00BCFF] transition-colors duration-300">DASHBOARD</a>
                    <a href="/writer" className="text-[15px] text-[#99A1AF] hover:text-[#00BCFF] transition-colors duration-300">WRITER</a>
                    <a href="/publisher" className="text-[15px] text-[#99A1AF] hover:text-[#00BCFF] transition-colors duration-300">PUBLISHER</a>
                </div>
            </div>
        </nav>
    );
}
