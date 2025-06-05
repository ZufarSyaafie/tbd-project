import Navbar from '@/components/organisms/Navbar';
import Hero from '@/components/organisms/Hero';
import Main from '@/components/organisms/Main';
import React from 'react';

export default function Page() {
	return (
		<div className="flex flex-col items-center overflow-hidden">
			<Navbar />
			<Hero />
			<Main>
				<div className="h-[100vh]"></div>
			</Main>
		</div>
	);
}
