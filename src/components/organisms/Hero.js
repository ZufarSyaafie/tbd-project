import React from "react";
import { PT_Serif } from "next/font/google";

const ptSerif = PT_Serif({
    // variable: "--font-pt-serif",
    subsets: ["latin"],
    weight: "700",
    style: "italic"
});

export default function Hero() {
    return (
        <div className="flex flex-col items-center justify-center text-center bg-[url('/image/hero.png')] bg-cover bg-bottom w-screen h-[75vh] bg-no-repeat">
            <h1 className={`text-[#ffffff]  ${ptSerif.className} leading-normal text-7xl`}>
                "Membaca Buku,<br/>Menjalajahi Dunia"
            </h1>
        </div>
    );
}
