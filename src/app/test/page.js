import RowUtils from '@/components/molecules/RowUtils';
import LeftUtils from '@/components/molecules/LeftUtils';
import NavigateUtils from '@/components/molecules/NavigateUtils';
import React from 'react';

export default function Page() {
	return (
		<div className="flex items-center flex-row gap-[10px] p-4">
			
			<RowUtils />
			<LeftUtils />
			<NavigateUtils />

		</div>
	);
}
