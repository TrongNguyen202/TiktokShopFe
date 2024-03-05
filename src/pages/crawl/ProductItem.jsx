import { CreditCardOutlined, DeleteOutlined, EyeOutlined, HourglassOutlined, StarOutlined } from "@ant-design/icons";
import { Skeleton, Tag, Tooltip } from "antd";
import React, { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ModalProductDetail from "./ModalProductDetail";

export default function ProductItem({
	product,
	index,
	handleDeleteProduct,
	checkedItems,
	handleCheckChange,
	handleChangeProduct,
	showSkeleton,
}) {
	const [isOpenModal, setIsOpenModal] = useState(false);
	const {
		listing_id,
		last_modified,
		shop_sold,
		sold,
		total_sold,
		views,
		views_24h,
		original_creation,
		original_creation_days,
		last_modified_minutes,
		estimated_revenue,
		daily_views,
		num_favorers,
		hey,
	} = product ?? {};

	return (
		<div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-md hover:shadow-blue-300 duration-300 hover:translate-y-[-5px]">
			<div className="w-[100%] h-[13vw] relative">
        <LazyLoadImage
					src={product.images[0].url}
					alt={product.title}
					className="w-full h-full object-cover cursor-pointer"
					onClick={() => setIsOpenModal(true)}
          loading="lazy"
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
				<a
					className="h-[76px] line-clamp-4 block text-black"
					href={product.url}
					target="blank"
				>
					{product.title}
				</a>
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
			{listing_id ? (
				<div className="rounded-md flex flex-col gap-1 p-2 px-3 text-[14px] font-semibold">
					<div className="flex justify-between gap-1">
						<Tooltip title="Show in the Last 24 Hours" placement="top">
							<Tag
								color="#22C55E"
								className="w-full py-[3px] text-[14px] flex-1 mr-0"
								icon={<StarOutlined />}
							>
								{sold}+ Sold
							</Tag>
						</Tooltip>
						<Tooltip title="Views in the Last 24 Hours" placement="top">
							<Tag
								color="#F97316"
								className="w-full py-[3px] text-[14px] flex-1 mr-0"
								icon={<EyeOutlined />}
							>
								{views_24h}+ Views
							</Tag>
						</Tooltip>
					</div>
					<div className="flex justify-between gap-1">
						<Tooltip title="Estimated Total Sales" placement="top">
							<Tag
								color="#3B82F6"
								className="w-full py-[3px] text-[14px] flex-1 mr-0"
								icon={<HourglassOutlined />}
							>
								{total_sold}+ Sold
							</Tag>
						</Tooltip>
						<Tooltip title="Estimated Revenue" placement="top">
							<Tag
								color="#A855F7"
								className="w-full py-[3px] text-[14px] flex-1 mr-0"
								icon={<CreditCardOutlined />}
							>
								{estimated_revenue}
							</Tag>
						</Tooltip>
					</div>
					<div className="mt-3 flex-1">
						{/* views */}
						<div className="flex justify-between border-b-[1px] border-solid border-gray-300 border-l-0 border-r-0 border-t-0 py-2">
							<p className="w-[60px]">Views</p>
							<Tooltip
								title="This is the estimate average daily view"
								placement="top"
							>
								<p className="text-[#e11d48] text-center">{daily_views}(Avg)</p>
							</Tooltip>
							<Tooltip
								title="This is the estimate average daily view"
								placement="top"
							>
								<p className="text-[#e11d48]">{views}</p>
							</Tooltip>
						</div>
						{/* Favorites */}
						<div className="flex justify-between border-b-[1px] border-solid border-gray-300 border-l-0 border-r-0 border-t-0 py-2">
							<p>Favorites</p>
							<Tooltip
								title="This is the estimate average daily view"
								placement="top"
							>
								<p className="text-[#2563eb] text-center">{hey}%</p>
							</Tooltip>
							<Tooltip
								title="Total number of favorites for this listing"
								placement="top"
							>
								<p className="text-[#2563eb]">{num_favorers}</p>
							</Tooltip>
						</div>
						{/* Created */}
						<div className="flex justify-between border-b-[1px] border-solid border-gray-300 border-l-0 border-r-0 border-t-0 py-2">
							<p>Created</p>
							<Tooltip title="This listing was create" placement="top">
								<p className="text-[#0d9488] text-center">
									{original_creation}
								</p>
							</Tooltip>
						</div>
						{/* Updated */}
						<div className="flex justify-between  py-2">
							<p>Updated</p>
							<Tooltip
								title="When it is sold, reviewed, or updateed"
								placement="top"
							>
								<p className="text-[#0d9488] text-center">{last_modified}</p>
							</Tooltip>
						</div>
					</div>
				</div>
			) : null}
			{showSkeleton && <Skeleton className="px-3 py-2" active />}

			{isOpenModal && (
				<ModalProductDetail
					product={product}
					setIsOpenModal={setIsOpenModal}
					isOpenModal={isOpenModal}
					handleChangeProduct={handleChangeProduct}
				/>
			)}
		</div>
	);
}
