import CircleButton from '../atoms/CircleButton';
import React from 'react';
import Image from 'next/image';

export default function LeftUtils() {
	return (
		<div className="flex space-x-[17px]">
			<CircleButton
				className={
					'flex items-center justify-center bg-[#34A853] text-3xl font-bold'
				}
			>
				<Image src="/image/file.svg" alt="plus" width={24} height={24} />
			</CircleButton>

			<CircleButton
				className={
					'flex items-center justify-center bg-[#Ffa600] text-[24px] font-bold'
				}
			>
				<select
					defaultValue="25"
					style={{
						appearance: 'none',
						WebkitAppearance: 'none',
						MozAppearance: 'none',
						background: 'none',
						textAlign: 'center',
					}}
					className={'focus:outline-none'}
				>
					<option value="25" className={'text-[18px] text-slate-800'}>
						25
					</option>
					<option value="50" className={'text-[18px] text-slate-800'}>
						50
					</option>
					<option value="100" className={'text-[18px] text-slate-800'}>
						100
					</option>
				</select>
			</CircleButton>
		</div>
	);
}
