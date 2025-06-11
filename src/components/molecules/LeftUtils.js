'use client';
import CircleButton from '../atoms/CircleButton';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
import { RotateCcw, Filter, X, Search } from 'lucide-react';

export default function LeftUtils({ 
	onAddClick, 
	onRefresh, 
	isRefreshing, 
	itemsPerPage, 
	onItemsPerPageChange,
	onFilterChange,
	currentFilters = {},
	// Configuration props untuk fleksibilitas
	config = {
		showAddButton: true,
		showItemsPerPage: true,
		showFilter: true,
		showRefresh: true,
		filterLabel: "Filter Buku",
		filterOptions: [
			{ value: "penulis", label: "Penulis", placeholder: "Ketik nama penulis..." },
			{ value: "penerbit", label: "Penerbit", placeholder: "Ketik nama penerbit..." },
			{ value: "tahun", label: "Tahun Terbit", placeholder: "Ketik tahun...", type: "number" }
		]
	}
}) {
	const [isChanging, setIsChanging] = useState(false);
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [filterType, setFilterType] = useState('');
	const [filterValue, setFilterValue] = useState('');
	const [suggestions, setSuggestions] = useState([]);
	const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
	
	const debounceTimeoutRef = useRef(null);
	const suggestionTimeoutRef = useRef(null);
	const filterRef = useRef(null);

	// Close filter menu when clicking outside
	useEffect(() => {
		function handleClickOutside(event) {
			if (filterRef.current && !filterRef.current.contains(event.target)) {
				setIsFilterOpen(false);
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	// Debounced handler untuk perubahan items per page
	const handleItemsPerPageChange = useCallback((newValue) => {
		setIsChanging(true);
		
		if (debounceTimeoutRef.current) {
			clearTimeout(debounceTimeoutRef.current);
		}
		
		debounceTimeoutRef.current = setTimeout(() => {
			onItemsPerPageChange(newValue);
			setIsChanging(false);
		}, 300);
	}, [onItemsPerPageChange]);

	// Get suggestions from parent component
	const getSuggestions = useCallback(async (type, query) => {
		if (!query || query.length < 2) {
			setSuggestions([]);
			return;
		}

		setIsLoadingSuggestions(true);
		
		if (suggestionTimeoutRef.current) {
			clearTimeout(suggestionTimeoutRef.current);
		}

		suggestionTimeoutRef.current = setTimeout(async () => {
			try {
				if (onFilterChange && onFilterChange.getSuggestions) {
					const results = await onFilterChange.getSuggestions(type, query);
					setSuggestions(results || []);
				}
			} catch (error) {
				console.error('Error getting suggestions:', error);
				setSuggestions([]);
			} finally {
				setIsLoadingSuggestions(false);
			}
		}, 300);
	}, [onFilterChange]);

	const handleFilterValueChange = useCallback((value) => {
		setFilterValue(value);
		if (filterType) {
			getSuggestions(filterType, value);
		}
	}, [filterType, getSuggestions]);

	const handleFilterTypeChange = useCallback((type) => {
		setFilterType(type);
		setFilterValue('');
		setSuggestions([]);
	}, []);

	const handleApplyFilter = useCallback(() => {
		if (filterType && filterValue && onFilterChange) {
			onFilterChange.apply(filterType, filterValue);
			setIsFilterOpen(false);
		}
	}, [filterType, filterValue, onFilterChange]);

	const handleClearFilter = useCallback(() => {
		setFilterType('');
		setFilterValue('');
		setSuggestions([]);
		if (onFilterChange) {
			onFilterChange.clear();
		}
	}, [onFilterChange]);

	const handleSelectSuggestion = useCallback((suggestion) => {
		setFilterValue(suggestion);
		setSuggestions([]);
	}, []);

	const toggleFilter = useCallback(() => {
		setIsFilterOpen(!isFilterOpen);
	}, [isFilterOpen]);

	React.useEffect(() => {
		return () => {
			if (debounceTimeoutRef.current) {
				clearTimeout(debounceTimeoutRef.current);
			}
			if (suggestionTimeoutRef.current) {
				clearTimeout(suggestionTimeoutRef.current);
			}
		};
	}, []);

	const hasActiveFilters = Object.keys(currentFilters).length > 0;

	return (
		<div className="flex flex-row justify-center gap-6 relative">
			{/* Add Button */}
			{config.showAddButton && (
				<CircleButton
					className={
						'flex cursor-pointer items-center justify-center text-3xl font-bold transition-colors duration-300 ease-in-out bg-[#C27AFF] hover:bg-purple-600'
					}
					onClick={onAddClick}
				>
					<Image src="/image/file.svg" alt="add" width={24} height={24} />
				</CircleButton>
			)}

			{/* Items Per Page Selector */}
			{config.showItemsPerPage && (
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
							<option value={25} className={'text-xl text-gray-200 bg-gray-800 hover:cursor-pointer'}>25</option>
							<option value={50} className={'text-xl text-gray-200 bg-gray-800 hover:cursor-pointer'}>50</option>
							<option value={100} className={'text-xl text-gray-200 bg-gray-800 hover:cursor-pointer'}>100</option>
						</select>
					)}
				</CircleButton>
			)}

			{/* Filter Button */}
			{config.showFilter && (
				<div className="relative" ref={filterRef}>
					<CircleButton
						className={`flex items-center justify-center text-3xl font-bold transition-colors duration-300 ease-in-out bg-[#FB64B6] cursor-pointer hover:bg-[#FF008A]`}
						onClick={toggleFilter}
					>
						<Filter size={24} className="text-white" />
						{hasActiveFilters && (
							<div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full"></div>
						)}
					</CircleButton>

					{/* Filter Menu */}
					{isFilterOpen && (
						<div className="absolute top-full left-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-lg border border-gray-600 z-50">
							<div className="p-4">
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-lg font-semibold text-gray-100">{config.filterLabel}</h3>
									<button
										onClick={() => setIsFilterOpen(false)}
										className="text-gray-400 hover:text-gray-200"
									>
										<X size={20} />
									</button>
								</div>

								{/* Filter Type Selection */}
								<div className="mb-4">
									<label className="block text-sm font-medium text-gray-300 mb-2">
										Filter berdasarkan:
									</label>
									<select
										value={filterType}
										onChange={(e) => handleFilterTypeChange(e.target.value)}
										className="w-full p-2 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-100 bg-gray-700"
									>
										<option value="">Pilih jenis filter</option>
										{config.filterOptions.map((option) => (
											<option key={option.value} value={option.value}>
												{option.label}
											</option>
										))}
									</select>
								</div>

								{/* Filter Value Input */}
								{filterType && (
									<div className="mb-4 relative">
										{(() => {
											const selectedOption = config.filterOptions.find(opt => opt.value === filterType);
											return (
												<>
													<label className="block text-sm font-medium text-gray-300 mb-2">
														{selectedOption?.label}:
													</label>
													<div className="relative">
														<input
															type={selectedOption?.type || 'text'}
															value={filterValue}
															onChange={(e) => handleFilterValueChange(e.target.value)}
															placeholder={selectedOption?.placeholder}
															className="w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 bg-gray-700 placeholder-gray-400 pr-8"
														/>
														<Search size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
													</div>
												</>
											);
										})()}

										{/* Suggestions Dropdown */}
										{suggestions.length > 0 && (
											<div className="absolute top-full left-0 right-0 mt-1 bg-gray-700 rounded-md shadow-lg max-h-40 overflow-y-auto z-10">
												{suggestions.map((suggestion, index) => (
													<button
														key={index}
														onClick={() => handleSelectSuggestion(suggestion)}
														className="w-full text-left p-2 hover:bg-gray-600 text-gray-100 text-sm"
													>
														{suggestion}
													</button>
												))}
											</div>
										)}

										{/* Loading indicator */}
										{isLoadingSuggestions && (
											<div className="absolute top-full left-0 right-0 mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg p-2">
												<div className="flex items-center justify-center text-gray-300 text-sm">
													<div className="inline-block w-4 h-4 border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin mr-2"></div>
													Mencari...
												</div>
											</div>
										)}
									</div>
								)}

								{/* Action Buttons */}
								<div className="flex gap-2">
									<button
										onClick={handleApplyFilter}
										disabled={!filterType || !filterValue}
										className="flex-1 bg-[#00BCFF] text-white py-2 px-4 font-semibold rounded-md hover:bg-[#0099cc] disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
									>
										Terapkan
									</button>
									{hasActiveFilters && (
										<button
											onClick={handleClearFilter}
											className="flex-1 bg-[#FB64B6] text-white py-2 px-4 font-semibold rounded-md hover:bg-[#FF008A] transition-colors duration-200"
										>
											Hapus
										</button>
									)}
								</div>

								{/* Active Filters Display */}
								{hasActiveFilters && (
									<div className="mt-4 p-2">
										<p className="text-sm font-medium text-gray-200 mb-1">Filter aktif:</p>
										{Object.entries(currentFilters).map(([key, value]) => (
											<span
												key={key}
												className="inline-block bg-slate-700 text-white text-xs px-2 py-1 rounded-full mr-1"
											>
												{key}: {value}
											</span>
										))}
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			)}

			{/* Refresh Button */}
			{config.showRefresh && (
				<CircleButton
					className={`flex items-center justify-center text-3xl font-bold transition-colors duration-300 ease-in-out ${
						(isRefreshing || isChanging)
							? 'bg-[#0099CC] cursor-not-allowed opacity-75'
							: 'bg-[#00BCFF] cursor-pointer hover:bg-[#007BFF]'
					}`}
					onClick={!isRefreshing && !isChanging ? onRefresh : undefined}
				>
					<RotateCcw 
						size={24} 
						className={`text-white ${isRefreshing ? 'animate-spin' : ''}`} 
					/>
				</CircleButton>
			)}
		</div>
	);
}
