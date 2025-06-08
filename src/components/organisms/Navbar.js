import React from 'react';
import Image from 'next/image';

export default function Navbar() {
	return (
		<nav className="sticky top-0 z-50 w-full min-w-0 bg-[#10141E] px-4 py-2 shadow-md md:px-10 md:py-3">
			<div className="flex max-w-full items-center justify-between">
				<div className="flex flex-shrink-0 items-center">
					<a href="/">
						<Image src="/image/logo.png" alt="Logo" width={80} height={80} />
					</a>
				</div>
				<div className="flex flex-shrink-0 items-center space-x-4 font-extrabold md:space-x-10">
					<a
						href="/"
						className="whitespace-nowrap text-[14px] text-[#99A1AF] transition-colors duration-300 hover:text-[#00BCFF] md:text-[15px]"
					>
						DASHBOARD
					</a>
					<a
						href="/writer"
						className="whitespace-nowrap text-[14px] text-[#99A1AF] transition-colors duration-300 hover:text-[#00BCFF] md:text-[15px]"
					>
						WRITER
					</a>
					<a
						href="/publisher"
						className="whitespace-nowrap text-[14px] text-[#99A1AF] transition-colors duration-300 hover:text-[#00BCFF] md:text-[15px]"
					>
						PUBLISHER
					</a>
				</div>
			</div>
		</nav>
	);
}
