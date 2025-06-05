import RectButton from '../atoms/RectButton';
import React from 'react';
import Image from 'next/image';

export default function RowUtils() {
	return (
		<div className="flex gap-2.5">
			<RectButton
				className={
					'bg-[#00BCFF] text-xl font-bold text-white transition-colors duration-300 ease-in-out hover:cursor-pointer hover:bg-[#0099cc]'
				}
			>
				<Image src="/image/view.svg" alt="View" width={12} height={12} />
			</RectButton>
			<RectButton
				className={
					'bg-[#C27AFF] text-xl font-bold text-white transition-colors duration-300 ease-in-out hover:cursor-pointer hover:bg-[#b16ce6]'
				}
			>
				<Image src="/image/edit.svg" alt="Edit" width={12} height={12} />
			</RectButton>
			<RectButton
				className={
					'bg-[#FB64B6] text-xl font-bold text-white transition-colors duration-300 ease-in-out hover:cursor-pointer hover:bg-[#f05a8c]'
				}
			>
				<Image src="/image/trash.svg" alt="Trash" width={12} height={12} />
			</RectButton>
		</div>
	);
}
