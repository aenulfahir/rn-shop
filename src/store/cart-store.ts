// cart-store.ts  
import { create } from "zustand";  
import { PRODUCTS } from "../../assets/products";  

type CartItemType = {  
  id: number;  
  title: string;  
  price: number;  
  image: any; // Here it holds the image source  
  quantity: number;  
  maxQuantity: number;  
};  

type CartState = {  
  items: CartItemType[];  
  addItem: (item: CartItemType) => void;  
  removeItem: (id: number) => void;  
  incrementItem: (id: number) => void;  
  decrementItem: (id: number) => void;  
  getTotalPrice: () => string;  
  getItemCount: () => number;  
  resetCart: () => void;  
};  

const initialCartItems: CartItemType[] = [];  

export const useCartStore = create<CartState>((set, get) => ({  
  items: initialCartItems,  
  addItem: (item: CartItemType) => {  
    const product = PRODUCTS.find(p => p.id === item.id);  
    if (product) {  
      const itemToAdd = { ...item, image: product.heroImage }; // Ensure heroImage is used  
      const existingItem = get().items.find(i => i.id === itemToAdd.id);  
      if (existingItem) {  
        set(state => ({  
          items: state.items.map(i =>  
            i.id === itemToAdd.id  
              ? {  
                ...i,  
                quantity: Math.min(i.quantity + itemToAdd.quantity, product.maxQuantity),  
              }  
              : i  
          ),  
        }));  
      } else {  
        set(state => ({  
          items: [...state.items, itemToAdd],  
        }));  
      }  
    }  
  },  
  removeItem: (id: number) => set(state => ({  
    items: state.items.filter((item) => item.id !== id),  
  })),  
  incrementItem: (id: number) =>  
    set(state => {  
      const product = PRODUCTS.find(p => p.id === id);  
      if (!product) {  
        return state;  
      }  
      return {  
        items: state.items.map(item =>  
          item.id === id && item.quantity < product.maxQuantity  
            ? { ...item, quantity: item.quantity + 1 }  
            : item  
        ),  
      };  
    }),  
  decrementItem: (id: number) =>  
    set(state => ({  
      items: state.items.map(item =>  
        item.id === id && item.quantity > 1  
          ? { ...item, quantity: item.quantity - 1 }  
          : item  
      ),  
    })),  
  getTotalPrice: () => {  
    const { items } = get();  
    return items  
      .reduce((total, item) => total + item.price * item.quantity, 0)  
      .toFixed(2);  
  },  
  getItemCount: () => {  
    const { items } = get();  
    return items.reduce((count, item) => count + item.quantity, 0);  
  },  
  resetCart: () => set({ items: initialCartItems }),  
}));