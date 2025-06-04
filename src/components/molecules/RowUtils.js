import RectButton from '../atoms/RectButton';
import React from 'react';

export default function RowUtils() {
	return (
		<div className="flex space-x-[10px]">
			<RectButton className={'bg-[#4285F4] text-xl font-bold text-white'}>
				<img src="/image/Group 5877.svg" alt="Left Arrow" width={12} height={12} />
			</RectButton>
			<RectButton className={'bg-[#FFA600] text-xl font-bold text-white'}>
				<img src="/image/Vector-1.svg" alt="Right Arrow" width={12} height={12} />
			</RectButton>
			<RectButton className={'bg-[#EA4335] text-xl font-bold text-white'}>
				<img src="/image/Vector.svg" alt="Up Arrow" width={12} height={12} />
			</RectButton>
		</div>
	);
}
