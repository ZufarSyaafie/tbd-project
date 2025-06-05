import React from "react";
import LeftUtils from "../molecules/LeftUtils";
import NavigateUtils from "../molecules/NavigateUtils";
import Table from "../molecules/Table";


// use container to create recctangle
export default function Main({ children }) {
    return (
        <div className="container my-14 rounded-2xl bg-[#1E2939] flex-col pt-9 pb-6 px-9 justify-between space-y-8">
            <div className="flex flex-row justify-between items-ends">
                <div>
                    <LeftUtils />
                </div>
                <div className="text-[#99a1af] font-semibold text-5xl">
                    Daftar Buku
                </div>
            </div>
            <div className="flex flex-col items-center justify-center w-full">
                <Table />
            </div>
            <div className="flex justify-center"><NavigateUtils /></div>
        </div>

    );
}