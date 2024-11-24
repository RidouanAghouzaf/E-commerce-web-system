import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { SelectItem } from 'primeng/api';
import { MenuItem } from 'primeng/api';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { Product } from './product.model';

@Component({
  selector: 'app-rendez-vous',
  standalone: true,
  providers: [MessageService],
  imports: [DropdownModule, FormsModule, RadioButtonModule, TableModule, ToastModule, CommonModule, PanelModule, ButtonModule],
  templateUrl: './rendez-vous.component.html',
  styleUrls: ['./rendez-vous.component.scss'] // Correct property name
})
export class RendezVousComponent {
  selectedDate: string = '';
  datefactureDebut: any;
  dateDebut!: string;
  products: Product[] = [];
  dropdownOptions: string[] = ['service1', 'service2', 'service3'];
  dropdownOptions2: string[] = [];
  dropdownOptions3: string[] = [];
  dropdownOptions1: SelectItem[] = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    // ... more options
  ];

  items: MenuItem[] | undefined;
  selectedop!: string;
  ingredient: string | null = null;
  showSecondaryTable = false;
  secondaryTableData: any[] = [];
  primaryTableData = [
    { code: '001', name: 'Product A', category: 'Category 1', quantity: 10 },
    { code: '002', name: 'Product B', category: 'Category 2', quantity: 20 },
    // Add more products as needed
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.items = [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      // ... more options
    ];
    this.products = [
      new Product('P001', 'Product 1', 'Category A', 10),
      new Product('P002', 'Product 2', 'Category B', 15),
      new Product('P003', 'Product 3', 'Category A', 20),
      // Add more products as needed
    ];
  }

  selectProduct(product: any) {
    // Add selected product to secondaryTableData if it's not already there
    if (!this.secondaryTableData.some(item => item.code === product.code)) {
      this.secondaryTableData.push(product);
      
    }
    console.log("Product selected:", product);
    // Show the secondary table
    this.showSecondaryTable = true;
    this.cdr.detectChanges(); // Ensure Angular detects changes
  }

  onRoleChange() {
    // Reset selected values when the role changes
    this.ingredient = null;
    this.showSecondaryTable = false; // Hide the secondary table when switching roles
    this.secondaryTableData = []; // Clear the secondary table data
  }
}
