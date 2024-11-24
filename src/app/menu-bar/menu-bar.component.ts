import { Component } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { MenuItem } from 'primeng/api';
import { CartService } from '../services/cart.service';
import { DialogModule } from 'primeng/dialog'; // Import Dialog module
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-menu-bar',
  standalone: true,
  imports: [MenubarModule,InputTextModule,DialogModule,CommonModule],
  templateUrl: './menu-bar.component.html',
  styleUrl: './menu-bar.component.scss'
})
export class MenuBarComponent {
  cartItemCount :number= 0; // Tracks the number of items in the cart
  showCartModal:boolean =false;
  cartItems: any[] = [];//tableau pour store cart items
  constructor(private cartService: CartService) {}
  // items: MenuItem[] | undefined;

  ngOnInit() : void {
    // Subscribe to cart changes
    this.cartService.cartItemsChanged.subscribe((cartItems: any[]) => {
      this.cartItemCount = cartItems.length; // Update cart item count
    });

    // Initialize the cart count
    this.cartItemCount = this.cartService.getItemCount();
    this.cartItems = this.cartService.getItems(); // Initialize cart items

  
  }

  updateCartCount(): void {
    // Update the cart item count whenever needed
    this.cartItemCount = this.cartService.getItemCount();
  }
  openCart(): void {
    // Logic to open a cart modal or redirect to the cart page
    this.showCartModal = true;
    console.log('Cart clicked!');
  }
  closeCart(): void {
    this.showCartModal = false; // Close the cart modal
  }
//logic cartshop
items = [
  { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
  { label: 'About', icon: 'pi pi-info-circle', routerLink: '/about' }
  // Add other menu items here
];




// addToCart(item: any): void {
//   this.cartItems.push(item);
// }

// removeFromCart(index: number): void {
//   this.cartItems.splice(index, 1);
// }
}
