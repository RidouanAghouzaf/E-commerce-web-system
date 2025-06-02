import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private stripeEndpoint = 'https://your-server-api.com/charge'; // Replace with your backend API

  constructor(private http: HttpClient) {}

  processPayment(paymentData: any): Observable<any> {
    return this.http.post(this.stripeEndpoint, paymentData);
  }
}
