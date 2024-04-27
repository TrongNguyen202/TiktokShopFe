export type OrderDistrictInfo = {
    address_level_name: string;
    address_name: string;
}

export type itemList = {
    product_id: string;
    product_name: string;
    quantity: number;
    seller_sku: string;
    sku_display_status: number;
    sku_ext_status: number;
    sku_id: string;
    sku_image: string;
    sku_name: string;
    sku_original_price: number;
    sku_platform_discount: number;
    sku_platform_discount_total: number;
    sku_sale_price: number;
    sku_seller_discount: number;
    sku_type: number;
}

export type orderLineList = {
    [key: string]: string | number;
}

export type packageList = {
    package_id: string;
}

export type PaymentInfo = {
    currency: string;
    original_shipping_fee: number;
    original_total_product_price: number;
    platform_discount: number;
    seller_discount: number;
    shipping_fee: number;
    shipping_fee_platform_discount: number;
    shipping_fee_seller_discount: number;
    sub_total: number;
    taxes: number;
    total_amount: number;
}

export type recipientAddress = {
    address_detail: string,
    address_line_list: string[],
    city: string;
    district: string;
    full_address: string;
    name: string;
    phone: string;
    region: string;
    region_code: string;
    state: string;
    town: string;
    zipcode: string;
}

export type shippingService = {
    [key: string]: string;
}

export type orderDetail = {
    key?: number;
    package_id: any;
    buyer_email: string;
    buyer_message?: string;
    buyer_uid: string;
    cancel_order_sla: number;
    create_time: string;
    delivery_option: string;
    delivery_option_description: string;
    delivery_option_id: string;
    delivery_option_type: number;
    delivery_sla: number;
    district_info_list: OrderDistrictInfo[];
    ext_status: number;
    fulfillment_type: number;
    is_cod: boolean;
    is_sample_order: boolean;
    item_list: itemList[];
    sku_list?: itemList[];
    order_id: string;
    order_line_list: orderLineList[],
    order_status: number,
    package_list: packageList[];
    paid_time: number;
    payment_info: PaymentInfo,
    payment_method: string;
    payment_method_name: string;
    payment_method_type: number;
    receiver_address_updated: number;
    recipient_address: recipientAddress,
    rts_sla: number;
    shipping_provider: string;
    shipping_provider_id: string;
    tracking_number: string;
    tts_sla: string;
    update_time: string;
    warehouse_id: string;
}

export type CreateLabelData = {
    create_time: number;
    delivery_option: number;
    note_tag: number;
    order_info_list: orderDetail[];
    order_line_id_list: string[];
    package_freeze_status: number;
    package_id: string;
    package_status: number;
    print_tag: number;
    sc_tag: number;
    shipping_provider: string;
    shipping_provider_id: string;
    sku_tag: number;
    tracking_number: string;
    update_time: number;
};

export type CreateLabelType = {
    data: CreateLabelData;
    key?: number;
}