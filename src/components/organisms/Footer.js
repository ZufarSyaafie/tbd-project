import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#10141E] text-[#99A1AF] w-full">
      <div className="grid grid-cols-4 grid-rows-2 gap-8 py-9 px-20">
        {/* Logo */}
        <div className="row-span-2">
          <img src="/image/logo.png" alt="Logo" />
        </div>

        {/* Our Teams */}
        <div className="font-extrabold">
          OUR TEAMS
          <ul className="list-none font-light mt-4 space-y-1">
            <li>Fahmi Irfan Faiz</li>
            <li>Muhammad Haidar Syaafi'</li>
            <li>Muhammad Zufar Syaafi'</li>
          </ul>
        </div>

        {/* Student Number */}
        <div className="font-extrabold row-span-2">
          STUDENT NUMBER
          <ul className="list-none font-light mt-4 space-y-1">
            <li>23/520563/TK/57396</li>
            <li>23/521614/TK/57545</li>
            <li>23/517479/TK/56923</li>
          </ul>
        </div>

        {/* About/Contact/Support */}
        <div className="font-extrabold row-span-2">
          <ul className="list-none space-y-2">
            <li>ABOUT US</li>
            <li>CONTACT US</li>
            <li>SUPPORT</li>
          </ul>
        </div>

        {/* Connect With Us - positioned below Our Teams */}
        <div className="font-extrabold">
          CONNECT WITH US
          <ul className="flex flex-wrap gap-3 list-none mt-4">
            <li>
              <a href="#">
                <img src="/image/wa.svg" alt="WhatsApp" className="w-8 h-8" />
              </a>
            </li>
            <li>
              <a href="#">
                <img src="/image/ig.svg" alt="Instagram" className="w-8 h-8" />
              </a>
            </li>
            <li>
              <a href="#">
                <img src="/image/x.svg" alt="X" className="w-8 h-8" />
              </a>
            </li>
            <li>
              <a href="#">
                <img src="/image/fb.svg" alt="Facebook" className="w-8 h-8" />
              </a>
            </li>
            <li>
              <a href="#">
                <img src="/image/linkedin.svg" alt="LinkedIn" className="w-8 h-8" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};