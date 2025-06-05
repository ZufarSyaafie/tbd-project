import CircleButton from '../atoms/CircleButton';
import React from 'react';
import Image from 'next/image';

export default function LeftUtils() {
	return (
		<div className="flex flex-row justify-center gap-6">
			<CircleButton
				className={
					'flex items-center justify-center bg-[#C27AFF] text-3xl font-bold hover:bg-[#b16ce6] transition-colors duration-300 ease-in-out cursor-grab'
				}
			>
				<Image src="/image/file.svg" alt="plus" width={24} height={24} />
			</CircleButton>

			<CircleButton
				className={
					'flex items-center justify-center bg-[#7C86FF] text-[24px] font-bold hover:bg-[#6b7aff] transition-colors duration-300 ease-in-out cursor-grab'
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
					className={'focus:outline-none hover:cursor-grab'}
				>
					<option value="25" className={'text-xl text-slate-800 hover:cursor-grab'}>
						25
					</option>
					<option value="50" className={'text-xl text-slate-800 hover:cursor-grab'}>
						50
					</option>
					<option value="100" className={'text-xl text-slate-800 hover:cursor-grab'}>
						100
					</option>
				</select>
			</CircleButton>
		</div>
	);
}
