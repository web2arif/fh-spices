// src/types/database.ts
// TypeScript types matching the FH Spices Supabase schema.
// Keep this file as the single source of truth — when schema changes, update here first.

export type ProductCategory =
  | 'veg_pickle'
  | 'non_veg_pickle'
  | 'protein_snack'
  | 'spice_powder'
  | 'ghee'
  | 'other';

export type SpiceLevel = 'mild' | 'medium' | 'hot' | 'extra_hot';

export type OrderStatus =
  | 'new'
  | 'confirmed'
  | 'preparing'
  | 'packed'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type OrderChannel = 'whatsapp' | 'website' | 'phone' | 'direct';
export type PaymentMethod = 'upi' | 'razorpay' | 'cod';
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';
export type MessageDirection = 'inbound' | 'outbound';

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  description: string | null;
  ingredients: string | null;
  shelf_life_days: number | null;
  is_seasonal: boolean;
  available_months: number[] | null;
  hero_image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  pack_size_grams: number;
  price_inr: number;
  spice_level: SpiceLevel | null;
  sku: string | null;
  in_stock: boolean;
}

export interface Batch {
  id: string;
  product_id: string;
  made_on: string | null;
  available_from: string | null;
  available_until: string | null;
  quantity_kg: number | null;
  quantity_remaining_kg: number | null;
  notes: string | null;
}

export interface Customer {
  id: string;
  whatsapp_number: string;
  name: string | null;
  email: string | null;
  default_address: Address | null;
  first_seen_at: string;
  total_orders: number;
  total_spent_inr: number;
  last_order_at: string | null;
  tags: string[] | null;
}

export interface OrderItemCustomisations {
  spice_level?: SpiceLevel;
  oil?: 'mustard' | 'sesame' | 'groundnut';
  notes?: string;
  [key: string]: unknown;
}

export interface OrderItem {
  id: string;
  order_id: string;
  variant_id: string | null;
  product_name: string;
  pack_size_grams: number;
  quantity: number;
  unit_price_inr: number;
  line_total_inr: number;
  customisations: OrderItemCustomisations;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string | null;
  status: OrderStatus;
  channel: OrderChannel;
  subtotal_inr: number;
  shipping_inr: number;
  total_inr: number;
  payment_method: PaymentMethod | null;
  payment_status: PaymentStatus;
  shipping_address: Address | null;
  shiprocket_awb: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  customer_id: string | null;
  whatsapp_number: string;
  current_flow: string | null;
  flow_state: Record<string, unknown>;
  last_message_at: string;
  agent_takeover: boolean;
}

export interface Message {
  id: string;
  conversation_id: string;
  direction: MessageDirection;
  content: string | null;
  message_type: string | null;
  whatsapp_message_id: string | null;
  template_name: string | null;
  is_billable: boolean;
  created_at: string;
}

export interface Campaign {
  id: string;
  name: string;
  template_name: string;
  segment_query: Record<string, unknown> | null;
  sent_count: number;
  delivered_count: number;
  reply_count: number;
  conversion_count: number;
  cost_inr: number;
  sent_at: string | null;
}

export interface Event {
  id: string;
  event_type: string;
  customer_id: string | null;
  product_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

// Composite types — useful for the public site and dashboard views

export interface ProductWithVariants extends Product {
  variants: ProductVariant[];
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
  customer: Customer | null;
}
