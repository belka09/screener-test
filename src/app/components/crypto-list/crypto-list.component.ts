import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  WritableSignal,
} from '@angular/core';
import { FilterDialogComponent } from '../filter-dialog/filter-dialog.component';
import { ApiService } from '../../services/api.service';
import { interval, Subscription, switchMap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crypto-list',
  standalone: true,
  imports: [FilterDialogComponent],
  templateUrl: './crypto-list.component.html',
  styleUrls: ['./crypto-list.component.scss'],
})
export class CryptoListComponent implements OnInit, OnDestroy {
  priceSubscriptions: Subscription[] = [];
  isLoading = signal(false);

  cryptoList: WritableSignal<any[]> = signal([]);
  filteredList: WritableSignal<any[]> = signal([]);

  constructor(private cryptoService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.cryptoService.getUSDTBasePairs().subscribe((data) => {
      this.cryptoList.set(data);
      this.filteredList.set(data);
      this.cryptoList().forEach((crypto) => {
        this.cryptoService
          .get24hrTickerInfo(crypto.symbol)
          .subscribe((info) => {
            crypto.volume = parseFloat(info.quoteVolume).toFixed(2);
            crypto.priceChangePercent = parseFloat(
              info.priceChangePercent
            ).toFixed(2);
            crypto.highPrice = parseFloat(info.highPrice).toFixed(2);
            crypto.lowPrice = parseFloat(info.lowPrice).toFixed(2);
          });
      });
      this.startPriceUpdates();
    });
  }

  ngOnDestroy(): void {
    this.stopPriceUpdates();
  }

  startPriceUpdates(): void {
    this.stopPriceUpdates();

    this.isLoading.set(true);
    const symbols = this.filteredList().map((crypto) => crypto.symbol);

    interval(10000)
      .pipe(switchMap(() => this.cryptoService.getPrices(symbols)))
      .subscribe((prices) => {
        prices.forEach((priceData, index) => {
          const crypto = this.filteredList()[index];
          crypto.price = parseFloat(priceData?.price).toFixed(2);
        });
        this.isLoading.set(false);
      });
  }

  stopPriceUpdates(): void {
    this.priceSubscriptions.forEach((sub) => sub.unsubscribe());
    this.priceSubscriptions = [];
  }

  applyFilters(filters: any): void {
    const newList = this.cryptoList().filter((crypto) => {
      const matchesVolume =
        (!filters.minVolume || crypto.volume >= filters.minVolume) &&
        (!filters.maxVolume || crypto.volume <= filters.maxVolume);
      const matchesPriceChange =
        (!filters.minPriceChange ||
          Math.abs(crypto.priceChangePercent) >= filters.minPriceChange) &&
        (!filters.maxPriceChange ||
          Math.abs(crypto.priceChangePercent) <= filters.maxPriceChange);
      const matchesPriceRange =
        (!filters.minPrice || crypto.price >= filters.minPrice) &&
        (!filters.maxPrice || crypto.price <= filters.maxPrice);

      return matchesVolume && matchesPriceChange && matchesPriceRange;
    });
    this.filteredList.set(newList);
    this.startPriceUpdates();
  }

  openFilterDialog(): void {
    const dialogRef = document.getElementById('filterDialog');
    if (dialogRef) {
      dialogRef.style.display = 'block';
    }
  }

  closeFilterDialog(): void {
    const dialogRef = document.getElementById('filterDialog');
    if (dialogRef) {
      dialogRef.style.display = 'none';
    }
  }

  gotoDetails(row: any) {
    this.router.navigate(['coin-detail', row.symbol]);
  }
}
