import React from "react";

export default function PageInfo ({ currentPage, totalPages }) {
    return (
        <div className="flex items-center justify-center text-xl text-[#99A1AF] bg-white rounded-[5px] w-[75px] h-[30px] font-semibold">
            <span>{currentPage}</span>
        </div>
    );
}
