'use client';
import React, { useState, useRef, useCallback } from "react";
import LeftUtils from "../molecules/LeftUtils";
import NavigateUtils from "../molecules/NavigateUtils";
import Table from "../molecules/Table";
import CompleteBookForm from "./BookForm";


// use container to create recctangle
export default function Main({ children }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const refreshFunction = useRef(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(25);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [isChangingItemsPerPage, setIsChangingItemsPerPage] = useState(false);

    const openModal = useCallback(() => {
        setIsModalOpen(true);
    }, []);
    
    const closeModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    // Handler untuk refresh yang akan dipanggil dari LeftUtils
    const handleRefresh = useCallback(async () => {
        if (refreshFunction.current) {
            setIsRefreshing(true);
            try {
                await refreshFunction.current();
            } finally {
                setIsRefreshing(false);
            }
        }
    }, []);

    // Callback untuk menerima fungsi refresh dari Table component
    const setRefreshFunction = useCallback((fn) => {
        refreshFunction.current = fn;
    }, []);

    const handleItemsPerPageChange = useCallback((newItemsPerPage) => {
        setIsChangingItemsPerPage(true);
        
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
        
        setTimeout(() => {
            setIsChangingItemsPerPage(false);
        }, 500);
    }, []);
    
    const handlePageChange = useCallback((newPage) => {
        if (newPage >= 1 && newPage <= totalPages && !isChangingItemsPerPage) {
            setCurrentPage(newPage);
        }
    }, [totalPages, isChangingItemsPerPage]);
    
    // Hitung index untuk display
    const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <>
            <div className="container my-14 rounded-2xl bg-[#1E2939] flex-col pt-9 pb-6 px-9 justify-between space-y-8">
                <div className="flex flex-row justify-between items-ends">
                    <div>
                    <LeftUtils 
                        onAddClick={openModal}  
                        onRefresh={handleRefresh} 
                        isRefreshing={isRefreshing || isChangingItemsPerPage}
                        itemsPerPage={itemsPerPage}
                        onItemsPerPageChange={handleItemsPerPageChange}
                    />
                    </div>
                    <div className="text-[#99a1af] font-semibold text-5xl">
                        Daftar Buku
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center w-full">
                    <div className="relative w-full">
                        {isChangingItemsPerPage && (
                            <div className="absolute inset-0 bg-[#1E2939] bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                                <div className="flex items-center gap-3 text-[#99A1AF]">
                                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#99A1AF] border-t-transparent"></div>
                                    <span>Memuat {itemsPerPage} items...</span>
                                </div>
                            </div>
                        )}
                        
                        <Table 
                            onRefresh={setRefreshFunction} 
                            isRefreshing={isRefreshing}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                            onTotalPagesChange={setTotalPages}
                            onTotalItemsChange={setTotalItems}
                        />
                    </div>
                </div>
                <div className="flex justify-center">
                    <NavigateUtils
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        startIndex={startIndex}
                        endIndex={endIndex}
                        disabled={isChangingItemsPerPage}
                    />
                </div>
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