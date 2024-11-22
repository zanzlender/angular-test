import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

// TODO move to .env
export const EXCHANGE_HOST_API_BASE_URL = 'https://api.exchangerate.host';
const EXCHANGE_HOST_API_KEY = '47ce6b5e4f779b80ad0ae720d36f2888';
const CURRENCIES = ['USD', 'EUR'];
const EXCHANGE_HOST_API_URL = new URL(
  EXCHANGE_HOST_API_BASE_URL +
    '/live' +
    '?access_key=' +
    EXCHANGE_HOST_API_KEY +
    '&format=1&currencies=' +
    CURRENCIES.join(',') +
    '&source=EUR'
);

export function authHeaderInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  if (req.url.startsWith(EXCHANGE_HOST_API_BASE_URL)) {
    // This part does not work, setting any header will return a
    // "blocked by CORS policy: Request header field authorization is not allowed by Access-Control-Allow-Header"
    // api.exchangerate.host requires authorization to be set with query params
    // so instead I will rewrite the url with necessary query params
    const reqWithHeader = req.clone({
      // headers: req.headers.set('Authorization', EXCHANGE_HOST_API_KEY),
      url: EXCHANGE_HOST_API_URL.href,
    });

    return next(reqWithHeader);
  }
  return next(req);
}
