import React from "react";
import RowUtils from "./RowUtils";


export default function NotebookStyleTable() {
	return (
		<table className="w-full rounded-md overflow-hidden shadow-lg text-black">
			<thead className="bg-[#00BCFF] text-white font-semibold">
				<tr>
					<th className="py-3 px-4 text-left">JUDUL</th>
					<th className="py-3 px-4 text-left">GENRE</th>
					<th className="py-3 px-4 text-left">PENULIS</th>
					<th className="py-3 px-4 text-left">PENERBIT</th>
					<th className="py-3 px-4 text-left">AKSI</th>
				</tr>
			</thead>
			<tbody className="bg-[#0f172a] text-[#ffffff]">
					<tr className="border-t-2 border-[#334155] ">
						<td className="py-3 px-4">Data 1</td>
						<td className="py-3 px-4">Data 2</td>
						<td className="py-3 px-4">Data 3</td>
						<td className="py-3 px-4">Data 4</td>
						<td className="py-3 px-4 w-1.5"><RowUtils></RowUtils></td>
					</tr>
					<tr className="border-t-2 border-[#334155] ">
						<td className="py-3 px-4">Data 1</td>
						<td className="py-3 px-4">Data 2</td>
						<td className="py-3 px-4">Data 3</td>
						<td className="py-3 px-4">Data 4</td>
						<td className="py-3 px-4 w-1.5"><RowUtils></RowUtils></td>
					</tr>
					<tr className="border-t-2 border-[#334155] ">
						<td className="py-3 px-4">Data 1</td>
						<td className="py-3 px-4">Data 2</td>
						<td className="py-3 px-4">Data 3</td>
						<td className="py-3 px-4">Data 4</td>
						<td className="py-3 px-4 w-1.5"><RowUtils></RowUtils></td>
					</tr>
				</tbody>
		</table>

	);
}
