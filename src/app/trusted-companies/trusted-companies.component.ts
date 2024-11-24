import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { CartService } from '../services/cart.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-trusted-companies',
  standalone: true,
  imports: [CommonModule, DialogModule, FormsModule, ToastModule, InputTextModule],
  providers: [MessageService],
  templateUrl: './trusted-companies.component.html',
  styleUrls: ['./trusted-companies.component.scss']
})
export class TrustedCompaniesComponent {
  constructor(
    private cartService: CartService,
    private messageService: MessageService
  ) {}

  // Variables
  cartItems: any[] = []; // Array to hold cart items
  companies = [
    {
      name: 'Trust & Co.',
      image: 'https://images.unsplash.com/photo-1601049676869-702ea24cfd58?q=80&w=2073&auto=format&fit=crop',
      description: 'Fill out the form and the algorithm will offer the right team of experts.',
      tags: ['branding', 'packaging']
    },
    {
      name: 'Tonic',
      image: 'https://images.unsplash.com/photo-1613235788366-270e7ac489f3?q=80&w=2070&auto=format&fit=crop',
      description: 'Fill out the form and the algorithm will offer the right team of experts.',
      tags: ['branding', 'marketing']
    },
    {
      name: 'Shower Gel',
      image: 'https://images.unsplash.com/photo-1673847401561-fcd75a7888c5?q=80&w=2070&auto=format&fit=crop',
      description: 'Fill out the form and the algorithm will offer the right team of experts.',
      tags: ['branding', 'packaging', 'marketing']
    }
  ];

  filteredCompanies = [...this.companies];
  showModal: boolean = false;
  selectedCompany: any = null;
  searchQuery = ''; // Tracks the search input value
  isSearchOpen = false;

  // Open modal to manage cart
  openModal(): void {
    this.cartItems = this.cartService.getItems(); // Get cart items
    this.showModal = true;
  }

  // Close modal
  closeModal(): void {
    this.showModal = false;
  }

  // Handle search input
  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    const query = input.value.trim().toLowerCase();
    this.filteredCompanies = this.companies.filter(company =>
      company.name.toLowerCase().includes(query)
    );
  }

  // Get tag color
  tagColor(tag: string): string {
    const tagColors: { [key: string]: string } = {
      branding: '#d3b19a',
      packaging: '#70b3b1',
      marketing: '#d05fa2'
    };
    return tagColors[tag] || '#000'; // Default color if no match
  }

  // Add item to cart or update quantity
  addToCart(company: any): void {
    const existingItem = this.cartItems.find(item => item.name === company.name);
    if (existingItem) {
      existingItem.quantity += 1; // Increase quantity if item already exists
    } else {
      this.cartItems.push({ ...company, quantity: 1 }); // Add new item with quantity 1
    }
    this.cartService.updateCart(this.cartItems); // Update cart in the service
    this.messageService.add({ severity: 'success', summary: 'Success', detail: `${company.name} added to cart!` });
  }

  // Remove item from cart
  removeFromCart(item: any): void {
    this.cartItems = this.cartItems.filter(i => i.name !== item.name);
    this.cartService.updateCart(this.cartItems); // Update cart in the service
    this.messageService.add({ severity: 'info', summary: 'Removed', detail: `${item.name} removed from cart.` });
  }

  // Increase item quantity
  increaseQuantity(item: any): void {
    const cartItem = this.cartItems.find(i => i.name === item.name);
    if (cartItem) {
      cartItem.quantity += 1;
      this.cartService.updateCart(this.cartItems); // Update cart in the service
    }
  }

  // Decrease item quantity
  decreaseQuantity(item: any): void {
    const cartItem = this.cartItems.find(i => i.name === item.name);
    if (cartItem && cartItem.quantity > 1) {
      cartItem.quantity -= 1;
      this.cartService.updateCart(this.cartItems); // Update cart in the service
    }
  }

  // Buy Now functionality
  buyNow(company: any): void {
    this.addToCart(company);
    this.openModal();
  }

  // Open search bar
  openSearch(): void {
    this.isSearchOpen = true;
    setTimeout(() => {
      const inputElement = document.querySelector('.search input') as HTMLInputElement;
      inputElement?.focus();
    }, 750);
  }

  // Close search bar
  closeSearch(): void {
    this.isSearchOpen = false;
  }
}
