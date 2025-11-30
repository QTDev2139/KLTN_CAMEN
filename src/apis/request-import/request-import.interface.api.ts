import { Product } from '../product/product.interface.api';
import { User } from '../user/user.interfaces.api';

export interface RequestItem {
  product_id: number;
  quantity: number;
}

export interface QuantityImport {
  id: number;
  product_id: number;
  quantity: number;
  product?: Product;
}

export interface RequestImportPayload {
  id?: number;
  created_at?: string;
  updated_at?: string;
  user?: User;
  user_id?: number;
  quantity_imports?: QuantityImport[];
  status?: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled' | 'partially' | 'supplemented';
  note?: string | null;
  request_import_id?: number;
  items: RequestItem[];
}

export interface QuantityImportDelivery {
  delivery_id?: number;
  id?: number;
  quantity?: number;
  sent_qty?: number;
  received_qty?: number;
  product_id?: number; 
  product?: Product;
}

export interface DeliveryDetail {
  id?: number;
  quantity_deliveries: QuantityImportDelivery[];
  product_id?: number;

  created_at?: string;
  updated_at?: string;

  request_import_id?: number;
  request_import?: RequestImportPayload;
  note?: string | null;
}

export interface MissingItem {
    product_id: number;
    product: {
      id: number;
      name: string;
    }; 
    requested_qty: number; 
    received_qty: number; 
    missing_qty: number; 
}

export interface ShortageResponse {
    missing_items: MissingItem[];
    request_import: RequestImportPayload;
    user: User;
}