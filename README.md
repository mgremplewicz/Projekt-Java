# System Egzaminacyjny

## Wymagania do uruchomienia projektu

1. Java JDK 17
   - backend wymaga Java 17


2. Docker + Docker Compose
   - używany kontener PostgreSQL: postgres:16
   - na Windows najlepiej Docker Desktop, który zawiera docker compose


3. Node.js + npm
   - zalecana wersja Node.js: 18+

Używane wersje bibliotek i narzędzi:
- Spring Boot 4.0.6
- PostgreSQL 16
- React 19.2.5
- react-router-dom 7.15.0
- Axios 1.16.0
- Vite 8.0.10
- Tailwind CSS 4.2.4

## Uruchomienie

1. Uruchom PostgreSQL:

   ```bash
   docker compose up -d postgres
   ```

2. Uruchom backend:

   ```bash
   ./mvnw spring-boot:run
   ```

3. Uruchom frontend:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

Frontend dziala pod adresem `http://localhost:5173`

## Konta testowe

- `4gremplewicz` / `12345`
- `4bosak` / `12345`
- `nauczyciel` / `nauczyciel123`

## Baza danych

Domyslna konfiguracja PostgreSQL:

- baza: `system_egzaminacyjny`
- uzytkownik: `egzaminy`
- haslo: `egzaminy`



  Jeśli chcesz usunać zawartość bazy to:

   ```bash
   docker compose down -v
   ```