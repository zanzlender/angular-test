import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EXCHANGE_HOST_API_BASE_URL } from './auth-interceptor';
import { LocalStorageService } from './local-storage.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { isPlatformBrowser } from '@angular/common';

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
    private localStorageService: LocalStorageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.initializeCurrencyExchange();
  }
  readonly currencyExchange = signal<CurrencyExchange | undefined>(undefined);
  readonly currencyExchange$ = toObservable(this.currencyExchange);

  private initializeCurrencyExchange() {
    /**
     * This check is necessary because this code will always run on the server
     * first, which means it will increase the API usage...
     * since it's limited we wait to fetch on client
     */
    if (isPlatformBrowser(this.platformId)) {
      try {
        const data = this.localStorageService.getItem('currency_exchange');
        if (!data) throw new Error('Currency Exchange not found');

        const parsedData = JSON.parse(data) as CurrencyExchange;
        if (parsedData.success !== true) {
          this.localStorageService.removeItem('currency_exchange');
          throw new Error('Currency Exchange is not valid');
          return;
        }

        if (this.isDateOlderThanOneDay(new Date(parsedData.timestamp))) {
          throw new Error('Currency Exchange is older than 1 day');
          return;
        }

        this.currencyExchange.set(parsedData);
      } catch (err) {
        this.localStorageService.removeItem('currency_exchange');
        this.http
          .get<CurrencyExchange>(EXCHANGE_HOST_API_BASE_URL)
          .subscribe((data) => {
            this.currencyExchange.set(data);
            this.localStorageService.setItem(
              'currency_exchange',
              JSON.stringify(data)
            );
          });
      }
    }
  }

  private isDateOlderThanOneDay(date: Date) {
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
    const currentDate = new Date();
    const comparedDate = new Date(date);

    return currentDate.getTime() - comparedDate.getTime() >= oneDay;
  }
}
