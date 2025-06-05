import React from 'react';
import { PT_Serif } from 'next/font/google';

const ptSerif = PT_Serif({
	// variable: "--font-pt-serif",
	subsets: ['latin'],
	weight: '700',
	style: 'italic',
});

export default function Hero() {
	return (
		<div className="flex h-[75vh] w-screen flex-col items-center justify-center bg-[url('/image/hero.png')] bg-cover bg-bottom bg-no-repeat text-center">
			<h1
				className={`text-[#ffffff]  ${ptSerif.className} text-7xl leading-normal`}
			>
				"Membaca Buku,
				<br />
				Menjalajahi Dunia"
			</h1>
		</div>
	);
}
