import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface CartItem {
  name: string;
  image: string;
  description: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>(this.getItems());
  cartItemsChanged = this.cartItemsSubject.asObservable(); // Observable for cart item changes

  constructor() {}

  // Get cart items from local storage (only if running in the browser)
  getItems(): CartItem[] {
    if (typeof window !== 'undefined' && window.localStorage) {
      return JSON.parse(localStorage.getItem('cart') || '[]');
    }
    return []; // Return an empty array if not in the browser
  }

  // Update cart in local storage (only if running in the browser)
  updateCart(cartItems: CartItem[]): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
      this.cartItemsSubject.next(cartItems); // Emit cart update to subscribers
    }
  }

  // Add item to cart
  addItem(item: CartItem): void {
    const cartItems = this.getItems();
    cartItems.push(item);
    this.updateCart(cartItems);
  }

  // Remove item from cart
  removeItem(item: CartItem): void {
    const cartItems = this.getItems();
    const updatedCart = cartItems.filter((i: CartItem) => i.name !== item.name);
    this.updateCart(updatedCart);
  }

  // Get the number of items in the cart
  getItemCount(): number {
    const cartItems = this.getItems();
    return cartItems.length;
  }
}
