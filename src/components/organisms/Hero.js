import React from 'react';
import { PT_Serif } from 'next/font/google';

const ptSerif = PT_Serif({
	// variable: "--font-pt-serif",
	subsets: ['latin'],
	weight: '700',
	style: 'italic',
});

export default function Hero({ heroImage, heroText1 }) {
	return (
		<div className="flex h-[50vh] w-screen flex-col items-center justify-center bg-[url('/image/hero.webp')] bg-cover bg-bottom bg-no-repeat text-center md:h-[75vh]">
			<h1
				className={`text-[#ffffff] ${ptSerif.className} text-5xl leading-normal md:text-7xl`}
			>
				"Membaca Buku,
				<br />
				Menjelajahi Dunia"
			</h1>
		</div>
	);
}
