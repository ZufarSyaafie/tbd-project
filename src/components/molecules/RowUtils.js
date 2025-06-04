import RectButton from '../atoms/RectButton';
import React from 'react';

export default function RowUtils() {
	return (
		<div className="flex space-x-[10px]">
			<RectButton className={'bg-[#4285F4] text-xl font-bold text-white'}>+</RectButton>
			<RectButton className={'bg-[#FFA600] text-xl font-bold text-white'}>+</RectButton>
			<RectButton className={'bg-[#EA4335] text-xl font-bold text-white'}>+</RectButton>
		</div>
	);
}
