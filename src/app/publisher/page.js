import Navbar from '@/components/organisms/Navbar';
import Hero from '@/components/organisms/Hero';
import Footer from '@/components/organisms/Footer';
import React from 'react';
import MainPenerbit from '@/components/organisms/MainPenerbit';

export default function TambahPenerbitPage() {
	return (
		<div className="flex flex-col items-center">
			<Navbar />
			<Hero />
			<MainPenerbit />
			<Footer />
		</div>
	);
}
