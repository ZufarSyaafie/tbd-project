import RectButton from '../atoms/RectButton';
import React from 'react';
import { Eye, Edit, Trash2 } from "lucide-react";




export default function RowUtils({ bookId, onView, onEdit, onDelete }) {
	return (
		<div className="flex gap-2.5">
			<RectButton
				className={
					'bg-[#00BCFF] text-xl font-bold text-white transition-colors duration-300 ease-in-out hover:cursor-pointer hover:bg-[#0099cc]'
				}
				onClick={() => onView(bookId)}
			>
				<Eye size={16} className="text-white" />
			</RectButton>
			<RectButton
				className={
					'bg-[#C27AFF] text-xl font-bold text-white transition-colors duration-300 ease-in-out hover:cursor-pointer hover:bg-purple-600'
				}
				onClick={() => onEdit(bookId)}
			>
				<Edit size={16} className="text-white" />
			</RectButton>
			<RectButton
				className={
					'bg-[#FB64B6] text-xl font-bold text-white transition-colors duration-300 ease-in-out hover:cursor-pointer hover:bg-[#FF008A]'
				}
				onClick={() => onDelete(bookId)}
			>
				<Trash2 size={16} className="text-white" />
			</RectButton>
		</div>
	);
}
