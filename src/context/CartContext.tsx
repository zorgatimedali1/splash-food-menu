import { createContext, useContext, useReducer, useEffect, useCallback, type ReactNode } from 'react';

const CART_STORAGE_KEY = 'splashfood_cart';

export interface CartSupplement {
  name: string;
  price: number;
}

export interface CartProduct {
  category: string;
  name: string;
  price: number;
  image: string;
  supplements?: CartSupplement[];
  instructions?: string;
}

interface CartItem {
  product: CartProduct;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; product: CartProduct }
  | { type: 'REMOVE_ITEM'; productKey: string }
  | { type: 'INCREMENT'; productKey: string }
  | { type: 'DECREMENT'; productKey: string }
  | { type: 'CLEAR' }
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'LOAD'; items: CartItem[] };

function productKey(product: CartProduct): string {
  const supps = product.supplements
    ? product.supplements.map((s) => s.name).sort().join(',')
    : '';
  const instr = product.instructions || '';
  return `${product.category}||${product.name}||${supps}||${instr}`;
}

function itemUnitPrice(product: CartProduct): number {
  const suppsTotal = product.supplements
    ? product.supplements.reduce((sum, s) => sum + s.price, 0)
    : 0;
  return product.price + suppsTotal;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const key = productKey(action.product);
      const existing = state.items.find((i) => productKey(i.product) === key);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            productKey(i.product) === key ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { product: action.product, quantity: 1 }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => productKey(i.product) !== action.productKey) };
    case 'INCREMENT':
      return {
        ...state,
        items: state.items.map((i) =>
          productKey(i.product) === action.productKey ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };
    case 'DECREMENT': {
      const item = state.items.find((i) => productKey(i.product) === action.productKey);
      if (item && item.quantity <= 1) {
        return { ...state, items: state.items.filter((i) => productKey(i.product) !== action.productKey) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          productKey(i.product) === action.productKey ? { ...i, quantity: i.quantity - 1 } : i
        ),
      };
    }
    case 'CLEAR':
      return { ...state, items: [] };
    case 'OPEN':
      return { ...state, isOpen: true };
    case 'CLOSE':
      return { ...state, isOpen: false };
    case 'LOAD':
      return { ...state, items: action.items };
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  subtotal: number;
  addToCart: (product: CartProduct) => void;
  removeFromCart: (productKey: string) => void;
  increment: (productKey: string) => void;
  decrement: (productKey: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (i: any) => i.product && typeof i.product.category === 'string' && typeof i.product.name === 'string'
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  useEffect(() => {
    const saved = loadCart();
    if (saved.length > 0) {
      dispatch({ type: 'LOAD', items: saved });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce((sum, i) => sum + itemUnitPrice(i.product) * i.quantity, 0);

  const addToCart = useCallback((product: CartProduct) => dispatch({ type: 'ADD_ITEM', product }), []);
  const removeFromCart = useCallback((productKey: string) => dispatch({ type: 'REMOVE_ITEM', productKey }), []);
  const increment = useCallback((productKey: string) => dispatch({ type: 'INCREMENT', productKey }), []);
  const decrement = useCallback((productKey: string) => dispatch({ type: 'DECREMENT', productKey }), []);
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR' }), []);
  const openCart = useCallback(() => dispatch({ type: 'OPEN' }), []);
  const closeCart = useCallback(() => dispatch({ type: 'CLOSE' }), []);
  const toggleCart = useCallback(() => dispatch({ type: state.isOpen ? 'CLOSE' : 'OPEN' }), [state.isOpen]);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        totalItems,
        subtotal,
        addToCart,
        removeFromCart,
        increment,
        decrement,
        clearCart,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

export { productKey as getCartProductKey, itemUnitPrice as getCartItemUnitPrice };
