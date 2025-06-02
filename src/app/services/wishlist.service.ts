import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private wishlistItems: any[] = [];

  constructor() {}

  // Get wishlist items
  getWishlistItems(): any[] {
    return this.wishlistItems;
  }

  // Add item to wishlist
  addToWishlist(item: any): void {
    const existingItem = this.wishlistItems.find((i) => i.name === item.name);
    if (!existingItem) {
      this.wishlistItems.push(item);
    }
  }

  // Remove item from wishlist
  removeFromWishlist(item: any): void {
    this.wishlistItems = this.wishlistItems.filter((i) => i.name !== item.name);
  }
}
