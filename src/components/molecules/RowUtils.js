import RectButton from '../atoms/RectButton';
import React from 'react';

export default function RowUtils() {
	return (
		<div className="flex space-x-[10px]">
			<RectButton className={'bg-[#00BCFF] text-xl font-bold text-white'}>
				<img src="/image/view.svg" alt="View" width={12} height={12} />
			</RectButton>
			<RectButton className={'bg-[#C27AFF] text-xl font-bold text-white'}>
				<img src="/image/edit.svg" alt="Edit" width={12} height={12} />
			</RectButton>
			<RectButton className={'bg-[#FB64B6] text-xl font-bold text-white'}>
				<img src="/image/trash.svg" alt="Trash" width={12} height={12} />
			</RectButton>
		</div>
	);
}
