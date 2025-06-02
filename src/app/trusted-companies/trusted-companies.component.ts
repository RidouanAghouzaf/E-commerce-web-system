import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { CartService } from '../services/cart.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Subject } from 'rxjs';
import { SharedService } from '../services/shared.service';
import { WishlistService } from '../services/wishlist.service';



interface Perfume {
  name: string;
  image: string;
  description: string;
  tags: string[];
}
@Component({
  selector: 'app-trusted-companies',
  standalone: true,
  imports: [CommonModule, DialogModule, FormsModule, ToastModule, InputTextModule,DropdownModule],
  providers: [MessageService],
  templateUrl: './trusted-companies.component.html',
  styleUrls: ['./trusted-companies.component.scss']
})
export class TrustedCompaniesComponent {
  private searchSubject = new Subject<string>();
  totalPrice: number = 0;
  wishlistItems: any[] = []; // To hold wishlist items
  constructor(
    private cartService: CartService,
    private messageService: MessageService,
    private sharedService: SharedService,
    private wishlistService: WishlistService,
    
  ) {
    // Setup search query debounce
    this.searchSubject.pipe(
      debounceTime(300), // Wait for 300ms after the user stops typing
      distinctUntilChanged() // Trigger search only if the query has changed
    ).subscribe(searchQuery => {
      this.searchQuery = searchQuery;
      this.onSearch();
    })
  }
  
  ngOnInit(): void {
    this.wishlistItems = this.wishlistService.getWishlistItems();
    this.filteredCompanies=this.selectedCategory === 'parfumswomen' ? this.parfumswomen : this.parfumsmen;
  }
  onSearchInput(event: Event): void {
  const inputValue = (event.target as HTMLInputElement).value || '';
  this.searchSubject.next(inputValue); // Pass the input value to the subject
}
 
  
  // Variables
  showModal: boolean = false;
  cartItems: any[] = []; // Array to hold cart items
  parfumswomen = [
    { 
      name: 'Trust & Co. (Women)', 
      image: 'https://images.unsplash.com/photo-1601049676869-702ea24cfd58?q=80&w=2073&auto=format&fit=crop', 
      description: 'Women perfume.', 
      
      price:50
    },
    { 
      name: 'Tonic (Women)', 
      image: 'https://images.unsplash.com/photo-1672848700942-68b6a4550540?q=80&w=1935&auto=format&fit=crop', 
      description: 'Women fragrance.', 
      
      price:65
    },
    { 
      name: 'Interdit (Women)', 
      image: 'https://images.unsplash.com/photo-1667480099552-92bfee05685d?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
      description: 'Women fragrance.', 
   
      price:70
    },
    { 
      name: 'Gio (Women)', 
      image: 'https://images.unsplash.com/photo-1706924179763-7f2744656823?q=80&w=1915&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
      description: 'Giorgia armani.', 
      
      price:34
    }

  ];

  parfumsmen = [
    { 
      name: 'Shower Gel (Men)', 
      image: 'https://images.unsplash.com/photo-1673847401561-fcd75a7888c5?q=80&w=2070&auto=format&fit=crop', 
      description: 'Men’s shower gel fragrance.', 
     
      price:40 
    },
    { 
      name: 'Tonic (Men)', 
      image: 'https://images.unsplash.com/photo-1672848700942-68b6a4550540?q=80&w=1935&auto=format&fit=crop', 
      description: 'Men fragrance.', 
     
      price:90 
    },
    { 
      name: 'Hugo Boss (Men)', 
      image: 'https://images.unsplash.com/photo-1664198891866-8a35b73bb95f?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
      description: 'Joe Malone.', 
     
      price:49 
    },
    { 
      name: 'King (men)', 
      image: 'https://images.unsplash.com/photo-1637336698223-0d5f048b09ee?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
      description: 'King of Seduction.', 
      
      price:122
    },
  ];
  categoryOptions: { label: string, value: string }[] = [
    { label: 'Women', value: 'parfumswomen' },
    { label: 'Men', value: 'parfumsmen' }
  ];
  selectedCategory: string = 'parfumswomen'; // Default to Women’s perfumes
  filteredCompanies: any[] = [...this.parfumswomen]; // Initially show women's perfumes  showModal: boolean = false;
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

  // Filter based on both search query and category
  onSearch(): void {
    console.log('Selected Category:', this.selectedCategory);
    console.log('Search Query:', this.searchQuery);
  
    // Reset filtered companies based on selected category
    this.filteredCompanies = this.selectedCategory === 'parfumswomen' ? this.parfumswomen : this.parfumsmen;
  
    // Apply search filtering on name
    if (this.searchQuery) {
      this.filteredCompanies = this.filteredCompanies.filter(company =>
        company.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
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
      existingItem.quantity += 1;
      existingItem.subtotal = existingItem.price * existingItem.quantity; // Update subtotal
    } else {
      this.cartItems.push({ 
        ...company, 
        quantity: 1, 
        subtotal: company.price // Initialize subtotal
      });
    }
    this.cartService.updateCart(this.cartItems);
    this.calculateTotalPrice(); // Update total price
    this.messageService.add({ severity: 'success', summary: 'Success', detail: `${company.name} added to cart!` });
  }
  

  // Remove item from cart
  removeFromCart(item: any): void {
    this.cartItems = this.cartItems.filter(i => i.name !== item.name);
    this.cartService.updateCart(this.cartItems); // Update cart in the service
    this.calculateTotalPrice();//update total price
    this.messageService.add({ severity: 'info', summary: 'Removed', detail: `${item.name} removed from cart.` });
  }

  // Increase item quantity
  increaseQuantity(item: any): void {
    const cartItem = this.cartItems.find(i => i.name === item.name);
    if (cartItem) {
      cartItem.quantity += 1;
      cartItem.subtotal = cartItem.price * cartItem.quantity; // Update subtotal
      this.cartService.updateCart(this.cartItems);
      this.calculateTotalPrice(); // Update total price
    }
  }

  // Decrease item quantity
  decreaseQuantity(item: any): void {
    const cartItem = this.cartItems.find(i => i.name === item.name);
    if (cartItem && cartItem.quantity > 1) {
      cartItem.quantity -= 1;
      cartItem.subtotal = cartItem.price * cartItem.quantity; // Update subtotal
      this.cartService.updateCart(this.cartItems);
      this.calculateTotalPrice(); // Update total price
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
  calculateTotalPrice(): void {
    this.totalPrice = this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }
  // Save item to wishlist
  saveToWishlist(company: any): void {
    this.wishlistService.addToWishlist(company);
    this.wishlistItems = this.wishlistService.getWishlistItems(); // Update local list
    this.messageService.add({ 
      severity: 'info', 
      summary: 'Saved to Wishlist', 
      detail: `${company.name} has been added to your wishlist.` 
    });
  }

  // Remove item from wishlist
  removeFromWishlist(item: any): void {
    this.wishlistService.removeFromWishlist(item);
    this.wishlistItems = this.wishlistService.getWishlistItems(); // Update local list
    this.messageService.add({ 
      severity: 'info', 
      summary: 'Removed from Wishlist', 
      detail: `${item.name} has been removed from your wishlist.` 
    });
  }
  showWishlistModal: boolean = false;

openWishlistModal(): void {
  this.wishlistItems = this.wishlistService.getWishlistItems();
  this.showWishlistModal = true;
}

closeWishlistModal(): void {
  this.showWishlistModal = false;
}
}

