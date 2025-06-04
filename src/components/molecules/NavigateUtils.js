import PageInfo from "../atoms/PageInfo";
import ArrowButton from "../atoms/ArrowButton";
import React from "react";

export default function NavigateUtils() {
	return (
		<div className="flex items-center flex-row gap-[5px]">
            <ArrowButton direction="left" />
            <PageInfo currentPage={1} totalPages={5} />
            <ArrowButton direction="right" />
		</div>
	);
}
