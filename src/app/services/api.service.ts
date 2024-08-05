import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { forkJoin, Observable, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { ToasterService } from './toaster.service';
import { LoaderService } from './loader.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private toasterService: ToasterService,
    private loaderService: LoaderService
  ) {}

  getUSDTBasePairs(): Observable<any> {
    this.loaderService.showLoader();
    return this.http.get<any>(`${environment.apiUrl}/exchangeInfo`).pipe(
      map((data) =>
        data.symbols.filter((item: any) => item.quoteAsset === 'USDT')
      ),
      finalize(() => this.loaderService.hideLoader()),
      catchError(this.handleError.bind(this))
    );
  }

  getPrices(symbols: string[]): Observable<any[]> {
    const requests = symbols.map((symbol) =>
      this.http.get<{ symbol: string; price: string }>(
        `${environment.apiUrl}/ticker/price?symbol=${symbol}`
      )
    );
    return forkJoin(requests).pipe(catchError(this.handleError.bind(this)));
  }

  get24hrTickerInfo(symbol: string): Observable<any> {
    this.loaderService.showLoader();
    return this.http
      .get<any>(`${environment.apiUrl}/ticker/24hr?symbol=${symbol}`)
      .pipe(
        finalize(() => this.loaderService.hideLoader()),
        catchError(this.handleError.bind(this))
      );
  }

  get24hrPriceHistory(symbol: string): Observable<any> {
    return this.http
      .get<any>(`${environment.apiUrl}/ticker/24hr?symbol=${symbol}`)
      .pipe(catchError(this.handleError.bind(this)));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    this.loaderService.hideLoader();
    this.toasterService.showError(
      'Something bad happened; please try again later.'
    );
    return throwError(() => new Error(error.message));
  }
}
