export type OrderStatus =
  | "pending"
  | "paid"
  | "failed"
  | "cancelled";

export type FulfilmentStatus =
  | "unfulfilled"
  | "processing"
  | "shipped"
  | "delivered";

export interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal: string;
  country: string;
  phone?: string;
  tracking_number?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_name: string;
  unit_price_minor: number;
  quantity: number;
  line_total_minor: number;
}

export interface Order {
  id: string;
  access_token_hash: string;
  order_number: string;
  customer_name: string;
  email: string;
  phone?: string;
  shipping_address: ShippingAddress;
  subtotal_minor: number;
  total_minor: number;
  currency: string;
  payment_status: OrderStatus;
  fulfilment_status: FulfilmentStatus;
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  created_at: string;
  updated_at: string;
}
