import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { StripeService } from '../services/stripe.service'; // Service for handling Stripe payment

@Component({
  selector: 'app-checkout-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './checkout-form.component.html',
  styleUrls: ['./checkout-form.component.css']
})
export class CheckoutFormComponent {
  checkoutForm: FormGroup;
  isProcessing: boolean = false;
  paymentSuccess: boolean = false;

  constructor(private fb: FormBuilder, private stripeService: StripeService) {
    this.checkoutForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      zip: ['', Validators.required],
      cardNumber: ['', [Validators.required, Validators.minLength(16)]],
      expiry: ['', Validators.required],
      cvc: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  onSubmit() {
    if (this.checkoutForm.invalid) {
      alert('Please fill out all required fields correctly.');
      return;
    }

    this.isProcessing = true;

    // Trigger Stripe Payment
    this.stripeService.processPayment(this.checkoutForm.value).subscribe(
      (response) => {
        this.isProcessing = false;
        this.paymentSuccess = true;
        alert('Payment Successful! Thank you for your order.');
      },
      (error) => {
        this.isProcessing = false;
        alert('Payment failed. Please try again.');
      }
    );
  }
}
