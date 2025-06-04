import RectButton from '../atoms/RectButton';
import React from 'react';
import Image from 'next/image';

export default function RowUtils() {
	return (
		<div className="flex space-x-[10px]">
			<RectButton className={'bg-[#00BCFF] text-xl font-bold text-white hover:bg-[#0099cc] transition-colors duration-300 ease-in-out'}>
				<Image src="/image/view.svg" alt="View" width={12} height={12} />
			</RectButton>
			<RectButton className={'bg-[#C27AFF] text-xl font-bold text-white hover:bg-[#b16ce6] transition-colors duration-300 ease-in-out'}>
				<Image src="/image/edit.svg" alt="Edit" width={12} height={12} />
			</RectButton>
			<RectButton className={'bg-[#FB64B6] text-xl font-bold text-white hover:bg-[#f05a8c] transition-colors duration-300 ease-in-out'}>
				<Image src="/image/trash.svg" alt="Trash" width={12} height={12} />
			</RectButton>
		</div>
	);
}
