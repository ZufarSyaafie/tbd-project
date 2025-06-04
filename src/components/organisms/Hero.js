import React from "react";


export default function Hero() {
    return (
        <div className="flex flex-col items-center justify-center text-center bg-[url('/image/hero.png')] bg-cover bg-bottom w-screen h-[75vh] bg-no-repeat">
            <h1 className={`text-4xl  text-[#ffffff] mb-4  font-extrabold`}>
                WELCOME TO OUR WEBSITE
            </h1>
        </div>
    );
}
