import NavigateUtils from '@/components/molecules/NavigateUtils';
import LeftUtils from '@/components/molecules/LeftUtils';
import RowUtils from '@/components/molecules/RowUtils';
import React from 'react';

export default function Page() {
	return (
		<div className="flex items-center flex-row gap-[10px] p-4">
			<NavigateUtils />
			<LeftUtils />
			<RowUtils />
		</div>
	);
}
