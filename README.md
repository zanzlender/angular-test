# Angular test example

## Instructions

To build the application follow these steps:

1. Install the dependencies - run npm install
2. Run the application - run npm start
3. The application will be available at http://localhost:4200/

## Specifikacija aplikacije

> Upravljanje popisom proizvoda s API integracijom i autentifikacijom

### 1. Osnovna funkcionalnost

- Prikaz popisa proizvoda u tabličnom obliku (npr. naziv, cijena, kategorija).
- Dodavanje novog proizvoda putem forme.
- Uređivanje postojećeg proizvoda.
- Brisanje proizvoda.
- Pretraživanje proizvoda po nazivu ili kategoriji.

### 2. Podaci o proizvodu

- id (broj - automatski generiran)
- name (string - naziv proizvoda)
- price (broj - cijena proizvoda u EUR valuti)
- category (string - kategorija proizvoda, npr. "Elektronika", "Hrana", "Namještaj")
- description (string - opcionalno, opis proizvoda)
- Cijena u više valuta: Prikaz cijene u EUR i USD, gdje se USD konverzija radi preko API-ja.

### 3. API integracija

- Koristi besplatni API za valutnu konverziju (npr. exchangerate.host).
- Na prikazu popisa proizvoda povuci aktualni tečaj za USD i prikaži cijenu proizvoda u obje valute (EUR i USD).

### 4. Napredne Angular funkcionalnosti

- Auth Guard:
  - Dodaj jednostavan login sustav (koristi dummy username/password, npr. "admin" / "password").
  - Omogući pristup stranici za uređivanje i brisanje proizvoda samo ako je korisnik prijavljen.
- Interceptor:
  - Implementiraj HTTP Interceptor koji dodaje Authorization header za sve zahtjeve prema API-ju.
- Angular Signal API (bonus):
  - Koristi Signal API za pohranu tečaja valuta i njihovo ažuriranje u stvarnom vremenu bez potrebe za ponovnim dohvaćanjem API-ja.
- Lazy Loading:
  - Podijeli aplikaciju na module (npr. ProductModule za upravljanje proizvodima i AuthModule za autentifikaciju).
- State Management (bonus bodovi):
  - Implementiraj jednostavni state management koristeći RxJS ili Angular Signal API.

### 5. Dodatne funkcionalnosti

- Filtriranje i sortiranje:
  - Omogući filtriranje proizvoda po kategorijama i cjenovnom rasponu.
  - Omogući sortiranje proizvoda po cijeni (rast/uopće).
- Validacija podataka:
  - Validiraj unos u formama (npr. naziv obavezan, cijena mora biti pozitivna).

### 6. Bonus bodovi

- Implementiraj paginaciju na popisu proizvoda.
- Dodaj "snackbar" obavijesti za akcije (npr. "Proizvod uspješno dodan!").
- Koristi Angular Material ili PrimeNG za UI komponente.
- Dodaj mogućnost eksportiranja popisa proizvoda u CSV format.
- Tehnićki zahtjevi
- Koristi Angular 16 ili noviji.
- Podaci o korisnicima i proizvodima mogu se privremeno čuvati u LocalStorage ili mock API-u.
- Kôd mora biti modularno organiziran.

## Upute za dostavu

1. Pošalji rješenje kao GitHub repo ili ZIP arhivu.
2. Uključi README.md datoteku s uputama za instalaciju i pokretanje aplikacije.
