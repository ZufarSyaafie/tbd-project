'use client';
import CircleButton from '../atoms/CircleButton';
import React, { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { RotateCcw } from 'lucide-react';

export default function LeftUtils({ onAddClick, onRefresh, isRefreshing, itemsPerPage, onItemsPerPageChange }) {
	const [isChanging, setIsChanging] = useState(false);
	const debounceTimeoutRef = useRef(null);
	

	// Debounced handler untuk perubahan items per page
	const handleItemsPerPageChange = useCallback((newValue) => {
		setIsChanging(true);
		
		// Clear previous timeout
		if (debounceTimeoutRef.current) {
			clearTimeout(debounceTimeoutRef.current);
		}
		
		// Debounce the actual change
		debounceTimeoutRef.current = setTimeout(() => {
			onItemsPerPageChange(newValue);
			setIsChanging(false);
		}, 300); // 300ms delay
	}, [onItemsPerPageChange]);

	// Cleanup timeout on unmount
	React.useEffect(() => {
		return () => {
			if (debounceTimeoutRef.current) {
				clearTimeout(debounceTimeoutRef.current);
			}
		};
	}, []);

	return (
		<div className="flex flex-row justify-center gap-6">
			<CircleButton
				className={
					'flex cursor-pointer items-center justify-center bg-[#C27AFF] text-3xl font-bold transition-colors duration-300 ease-in-out hover:bg-purple-600'
				}
				onClick={onAddClick}
			>
				<Image src="/image/file.svg" alt="plus" width={24} height={24} />
			</CircleButton>

			<CircleButton
				className={`flex items-center justify-center text-[24px] font-bold transition-colors duration-300 ease-in-out ${
					isChanging 
						? 'bg-[#5A6B7F] cursor-not-allowed opacity-75' 
						: 'bg-[#7C86FF] cursor-pointer hover:bg-[#4D5BFF]'
				}`}
			>
				{isChanging ? (
					<div className="inline-block w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
				) : (
					<select
						value={itemsPerPage}
						onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
						disabled={isChanging}
						style={{
							appearance: 'none',
							WebkitAppearance: 'none',
							MozAppearance: 'none',
							background: 'none',
							textAlign: 'center',
						}}
						className={'hover:cursor-pointer focus:outline-none text-white disabled:cursor-not-allowed'}
					>
						<option value={25} className={'text-xl text-slate-800 hover:cursor-pointer'}>25</option>
						<option value={50} className={'text-xl text-slate-800 hover:cursor-pointer'}>50</option>
						<option value={100} className={'text-xl text-slate-800 hover:cursor-pointer'}>100</option>
					</select>
				)}
			</CircleButton>

			<CircleButton
				className={`flex items-center justify-center text-3xl font-bold transition-colors duration-300 ease-in-out ${
					(isRefreshing || isChanging)
						? 'bg-[#0099CC] cursor-not-allowed opacity-75'
						: 'bg-[#00BCFF] cursor-pointer hover:bg-blue-600'
				}`}
				onClick={!isRefreshing && !isChanging ? onRefresh : undefined}
			>
				<RotateCcw 
					size={24} 
					className={`text-white ${isRefreshing ? 'animate-spin' : ''}`} 
				/>
			</CircleButton>
		</div>
	);
}