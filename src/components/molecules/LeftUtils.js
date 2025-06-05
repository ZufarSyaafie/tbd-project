import CircleButton from '../atoms/CircleButton';
import React from 'react';
import Image from 'next/image';

export default function LeftUtils() {
	return (
		<div className="flex flex-row justify-center gap-6">
			<CircleButton
				className={
					'flex cursor-pointer items-center justify-center bg-[#C27AFF] text-3xl font-bold transition-colors duration-300 ease-in-out hover:bg-purple-600'
				}
			>
				<Image src="/image/file.svg" alt="plus" width={24} height={24} />
			</CircleButton>

			<CircleButton
				className={
					'flex cursor-pointer items-center justify-center bg-[#7C86FF] text-[24px] font-bold transition-colors duration-300 ease-in-out hover:bg-[#4D5BFF]'
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
					className={'hover:cursor-pointer focus:outline-none'}
				>
					<option
						value="25"
						className={'text-xl text-slate-800 hover:cursor-pointer'}
					>
						25
					</option>
					<option
						value="50"
						className={'text-xl text-slate-800 hover:cursor-pointer'}
					>
						50
					</option>
					<option
						value="100"
						className={'text-xl text-slate-800 hover:cursor-pointer'}
					>
						100
					</option>
				</select>
			</CircleButton>
		</div>
	);
}
