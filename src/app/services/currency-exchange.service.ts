import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EXCHANGE_HOST_API_BASE_URL } from './auth-interceptor';
import { LocalStorageService } from './local-storage.service';
import { toObservable } from '@angular/core/rxjs-interop';

type CurrencyExchange = {
  success: boolean;
  timestamp: number;
  source: 'EUR';
  quotes: {
    EURUSD: number;
  };
};

@Injectable({
  providedIn: 'root',
})
export class CurrencyExchangeService {
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    this.ngOnInit();
  }
  readonly currencyExchange = signal<CurrencyExchange | undefined>(undefined);
  readonly currencyExchange$ = toObservable(this.currencyExchange);

  ngOnInit() {
    console.log('FINAL');
    try {
      const data = this.localStorageService.getItem('currency_exchange');
      if (!data) throw new Error('Currency Exchange not found');

      const parsedData = JSON.parse(data) as CurrencyExchange;

      if (this.isDateOlderThanOneDay(new Date(parsedData.timestamp))) {
        throw new Error('Currency Exchange is older than 1 day');
      }

      this.currencyExchange.set(parsedData);
    } catch (err) {
      this.http
        .get<CurrencyExchange>(EXCHANGE_HOST_API_BASE_URL)
        .subscribe((data) => {
          this.currencyExchange.set(data);
        });
    }
  }

  private isDateOlderThanOneDay(date: Date) {
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
    const currentDate = new Date();
    const comparedDate = new Date(date);

    return currentDate.getTime() - comparedDate.getTime() >= oneDay;
  }
}
