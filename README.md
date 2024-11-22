# Angular test example

## Instructions

To build the application follow these steps:

1. Install the dependencies - run `npm install`
2. Run the application - run `npm start`
3. The application will be available at [http://localhost:4200/](http://localhost:4200/)

## Specifikacija aplikacije

> Upravljanje popisom proizvoda s API integracijom i autentifikacijom

### 1. Osnovna funkcionalnost

- [x] Prikaz popisa proizvoda u tabličnom obliku (npr. naziv, cijena, kategorija).
- [x] Dodavanje novog proizvoda putem forme.
- [x] Uređivanje postojećeg proizvoda.
- [x] Brisanje proizvoda.
- [x] Pretraživanje proizvoda po nazivu ili kategoriji.

### 2. Podaci o proizvodu

- [x] id (broj - automatski generiran)
- [x] name (string - naziv proizvoda)
- [x] price (broj - cijena proizvoda u EUR valuti)
- [x] category (string - kategorija proizvoda, npr. "Elektronika", "Hrana", "Namještaj")
- [x] description (string - opcionalno, opis proizvoda)
- [x] Cijena u više valuta: Prikaz cijene u EUR i USD, gdje se USD konverzija radi preko API-ja.

### 3. API integracija

- [x] Koristi besplatni API za valutnu konverziju (npr. exchangerate.host).
- [x] Na prikazu popisa proizvoda povuci aktualni tečaj za USD i prikaži cijenu proizvoda u obje valute (EUR i USD).

### 4. Napredne Angular funkcionalnosti

- [x] Auth Guard:
  - [x] Dodaj jednostavan login sustav (koristi dummy username/password, npr. "admin" / "password").
  - [x] Omogući pristup stranici za uređivanje i brisanje proizvoda samo ako je korisnik prijavljen.
- [x] Interceptor:
  - [x] Implementiraj HTTP Interceptor koji dodaje Authorization header za sve zahtjeve prema API-ju.
- [x] Angular Signal API (bonus):
  - [x] Koristi Signal API za pohranu tečaja valuta i njihovo ažuriranje u stvarnom vremenu bez potrebe za ponovnim dohvaćanjem API-ja.
- [x] Lazy Loading:
  - [x] Podijeli aplikaciju na module (npr. ProductModule za upravljanje proizvodima i AuthModule za autentifikaciju). (**SIDENOTE:** Looking at the new docs, the Angular team recommends a Standalone component approach, as the main goal of Modules was lazy loading. Since v19 it's possible and more optimal to lazy import specific routes [NgModules](https://angular.dev/guide/ngmodules/overview), which also helps the compiler to optimize the bundle size. Therefore "modules" are mostly defined only by the project structure)
- [x] State Management (bonus bodovi):
  - [x] 1/2 Implementiraj jednostavni state management koristeći RxJS ili Angular Signal API. (**SIDENOTE:** It mostly works, only the part where it needs to connect to the table to update it doesnt...)

### 5. Dodatne funkcionalnosti

- [ ] Filtriranje i sortiranje:
  - [x] Omogući filtriranje proizvoda po kategorijama
  - [ ] i cjenovnom rasponu.
  - [ ] Omogući sortiranje proizvoda po cijeni (rast/uopće).
- [x] Validacija podataka:
  - [x] Validiraj unos u formama (npr. naziv obavezan, cijena mora biti pozitivna).

### 6. Bonus bodovi

- [x] Implementiraj paginaciju na popisu proizvoda.
- [x] Dodaj "snackbar" obavijesti za akcije (npr. "Proizvod uspješno dodan!").
- [x] Koristi Angular Material ili PrimeNG za UI komponente.
- [x] Dodaj mogućnost eksportiranja popisa proizvoda u CSV format.

### Tehnićki zahtjevi

- [x] Koristi Angular 16 ili noviji.
- [x] Podaci o korisnicima i proizvodima mogu se privremeno čuvati u LocalStorage ili mock API-u.
- [x] Kôd mora biti modularno organiziran.

## Upute za dostavu

1. Pošalji rješenje kao GitHub repo ili ZIP arhivu.
2. Uključi README.md datoteku s uputama za instalaciju i pokretanje aplikacije.
