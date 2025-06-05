import Navbar from '@/components/organisms/Navbar';
import Hero from '@/components/organisms/Hero';
import React from 'react';

export default function Page() {
	return (
		<div className="flex items-center flex-col">
			<Navbar />
			<Hero />
			<div className='h-[1000px]'></div>
		</div>
	);
}
