import RectButton from "../atoms/RectButton";
import ArrowButton from "../atoms/ArrowButton";
import React from "react";

export default function NavigateUtils() {
	return (
		<div className="flex items-center flex-row gap-[5px]">
            <ArrowButton direction="left" />
            <RectButton className={"bg-white text-[#99a1af] w-16"} content={"1"} />
            <ArrowButton direction="right" />
		</div>
	);
}
