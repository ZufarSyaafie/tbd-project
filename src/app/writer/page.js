import Navbar from '@/components/organisms/Navbar';
import Hero from '@/components/organisms/Hero';
import Footer from '@/components/organisms/Footer';
import React from 'react';
import MainPenulis from '@/components/organisms/MainPenulis';

export default function TambahPenulisPage() {
	return (
		<div className="flex flex-col items-center">
			<Navbar />
			<Hero />
			<MainPenulis />
			<Footer />
		</div>
	);
}
