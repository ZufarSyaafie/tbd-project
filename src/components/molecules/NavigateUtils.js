import ArrowButton from "../atoms/ArrowButton";
import React from "react";

export default function NavigateUtils() {
	return (
		<div className="flex items-center flex-row gap-2.5">
           <ArrowButton direction="left" />
			<div className="text-[#99A1AF] text-lg font-bold">
				<span>100</span>
            </div>
            <ArrowButton direction="right" />
		</div>
	);
}
