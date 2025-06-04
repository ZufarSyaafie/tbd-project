import React from "react";

export default function Hero() {
    return (
        <div className="flex flex-col items-center justify-center text-center bg-[url('/image/hero.png')] bg-cover bg-top w-screen h-[75vh] bg-no-repeat">
            <h1 className="text-4xl  text-[#2C2D3E] mb-4 font-[var(--font-pt-serif)]">
                WELCOME TO OUR WEBSITE
            </h1>
        </div>
    );
}
