import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private searchQuerySubject = new BehaviorSubject<string>(''); // Initialize with an empty query
  searchQuery$ = this.searchQuerySubject.asObservable();

  updateSearchQuery(query: string): void {
    this.searchQuerySubject.next(query);
  }
}
