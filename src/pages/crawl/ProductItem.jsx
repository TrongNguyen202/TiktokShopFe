import { DeleteOutlined } from "@ant-design/icons";
import { Col, Modal, Tooltip } from "antd";
import React, { useState } from "react";

export default function ProductItem({
	product,
	index,
	handleDeleteProduct,
	checkedItems,
	handleCheckChange,
}) {
	const [isOpenModal, setIsOpenModal] = useState(false);

	return (
		<div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-md hover:shadow-blue-300 duration-300 hover:translate-y-[-5px]">
			<div className="w-[100%] h-[13vw] relative">
				<img
					src={product.images[0].url}
					alt={product.title}
					className="w-full h-full object-cover cursor-pointer"
					onClick={() => setIsOpenModal(true)}
				/>
				<input
					type="checkbox"
					name={product.id}
					checked={!!checkedItems[product.id]}
					onChange={handleCheckChange}
					className="absolute top-2 left-2 cursor-pointer w-6 h-6"
				/>
				<Tooltip title={`Có ${product.images.length} ảnh`} placement="top">
					<p className="absolute font-medium h-7 w-7 flex justify-center items-center rounded-md bg-gray-100 bottom-3 right-2 text-green-600 shadow-md border-gray-300 border-solid border-[1px]">
						{product.images.length}
					</p>
				</Tooltip>
				<p
					className="absolute top-2 right-2 cursor-pointer text-red-500 text-[16px] h-7 w-7 flex justify-center items-center bg-gray-100 rounded-md hover:bg-slate-200"
					onClick={() => handleDeleteProduct(product.id)}
				>
					<Tooltip title="Xóa" placement="top">
						<DeleteOutlined />
					</Tooltip>
				</p>
			</div>
			<div className="p-2">
				<p className="h-[76px] line-clamp-4">{product.title}</p>
				<div className="flex justify-between items-center mt-2">
					<p
						className="h-[30px] w-[30px] flex justify-center items-center border-[1px] border-solid rounded-lg text-yellow-600 cursor-pointer hover:bg-yellow-100 duration-300"
						onClick={() => setIsOpenModal(true)}
					>
						{index + 1}
					</p>
					<p className="font-semibold text-green-600">${product.price}</p>
				</div>
			</div>
			{isOpenModal && (
				<Modal
					title="Basic Modal"
					visible={isOpenModal}
					onOk={() => setIsOpenModal(false)}
					onCancel={() => setIsOpenModal(false)}
				>
					<p>Some contents...</p>
					<p>Some contents...</p>
					<p>Some contents...</p>
				</Modal>
			)}
		</div>
	);
}
