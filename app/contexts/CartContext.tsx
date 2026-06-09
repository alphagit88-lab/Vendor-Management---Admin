"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  HardwareProduct,
  CartLineItem,
  fetchPublicProducts,
} from "@/lib/shop";

const CART_STORAGE_KEY = "hardware_shop_cart_v1";

type StoredCartItem = CartLineItem;
type CartItem = HardwareProduct & { quantity: number };

type CartContextType = {
  cart: CartItem[];
  isReady: boolean;
  addToCart: (product: HardwareProduct) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  cartLineItems: CartLineItem[];
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function loadStoredCart(): StoredCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) =>
        Number.isInteger(item.productId) &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0
    );
  } catch {
    return [];
  }
}

function saveStoredCart(items: StoredCartItem[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [storedItems, setStoredItems] = useState<StoredCartItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  const syncCartWithCatalog = useCallback(async (items: StoredCartItem[]) => {
    if (items.length === 0) {
      setCart([]);
      return;
    }

    try {
      const products = await fetchPublicProducts();
      const productMap = new Map(products.map((product) => [product.id, product]));
      const nextCart: CartItem[] = [];
      const nextStored: StoredCartItem[] = [];

      for (const item of items) {
        const product = productMap.get(item.productId);
        if (!product || product.stock <= 0) continue;

        const quantity = Math.min(item.quantity, product.stock);
        nextCart.push({ ...product, quantity });
        nextStored.push({ productId: product.id, quantity });
      }

      setCart(nextCart);
      setStoredItems(nextStored);
      saveStoredCart(nextStored);
    } catch (error) {
      console.error("Failed to hydrate cart:", error);
      setCart([]);
    }
  }, []);

  useEffect(() => {
    const saved = loadStoredCart();
    setStoredItems(saved);
    syncCartWithCatalog(saved).finally(() => setIsReady(true));
  }, [syncCartWithCatalog]);

  const persistItems = (items: StoredCartItem[]) => {
    setStoredItems(items);
    saveStoredCart(items);
    syncCartWithCatalog(items);
  };

  const addToCart = (product: HardwareProduct) => {
    const existing = storedItems.find((item) => item.productId === product.id);
    const currentQty = existing?.quantity || 0;
    if (currentQty >= product.stock) return;

    const nextItems = existing
      ? storedItems.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [...storedItems, { productId: product.id, quantity: 1 }];

    persistItems(nextItems);
  };

  const removeFromCart = (productId: number) => {
    persistItems(storedItems.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = cart.find((item) => item.id === productId);
    const maxQty = product?.stock ?? quantity;
    const safeQty = Math.min(quantity, maxQty);

    persistItems(
      storedItems.map((item) =>
        item.productId === productId ? { ...item, quantity: safeQty } : item
      )
    );
  };

  const clearCart = () => {
    setStoredItems([]);
    setCart([]);
    saveStoredCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        isReady,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        cartLineItems: storedItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
