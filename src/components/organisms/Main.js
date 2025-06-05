'use client';
import React, { useState } from "react";
import LeftUtils from "../molecules/LeftUtils";
import NavigateUtils from "../molecules/NavigateUtils";
import Table from "../molecules/Table";
import CompleteBookForm from "./BookForm";


// use container to create recctangle
export default function Main({ children }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="container my-14 rounded-2xl bg-[#1E2939] flex-col pt-9 pb-6 px-9 justify-between space-y-8">
                <div className="flex flex-row justify-between items-ends">
                    <div>
                        <LeftUtils onAddClick={openModal} />
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

            {isModalOpen && (
                <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="relative">
                        <CompleteBookForm onClose={closeModal} />
                    </div>
                </div>
            )}
        </>
    );
}