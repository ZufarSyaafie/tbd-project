import React from "react";
import LeftUtils from "../molecules/LeftUtils";
import NavigateUtils from "../molecules/NavigateUtils";


// use container to create recctangle
export default function Main({ children }) {
    return (
        <div className="container my-14 rounded-2xl bg-[#1E2939] flex-col">
            <div className="flex flex-row align-center justify-between p-9">
                <div className="">
                    <LeftUtils />
                </div>
                <div className="text-[#99a1af] font-semibold text-5xl">
                    Your Books
                </div>
            </div>
            <div className="flex justify-center p-6"><NavigateUtils /></div>
        </div>

    );
}