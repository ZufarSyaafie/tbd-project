import React from "react";

export default function PageInfo ({ currentPage, totalPages }) {
    return (
        <div className="flex items-center justify-center text-sm text-black bg-white rounded-[5px] w-[80px] h-[30px]">
            <span>{currentPage}</span>
        </div>
    );
}
