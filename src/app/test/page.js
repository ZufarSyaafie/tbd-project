import Navbar from '@/components/organisms/Navbar';
import Hero from '@/components/organisms/Hero';
import Main from '@/components/organisms/Main';
import Footer from '@/components/organisms/Footer';
import React from 'react';

export default function TambahBukuPage() {
	return (
		<div className="flex flex-col items-center">
			<Navbar />
			<Hero />
			<Main />
			<Footer />
		</div>
	);
}
