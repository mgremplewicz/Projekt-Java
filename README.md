# System Egzaminacyjny

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

Frontend dziala pod adresem `http://localhost:5173`, a backend pod `http://localhost:8080`.

## Konta testowe

- `uczen` / `uczen123`
- `nauczyciel` / `nauczyciel123`

## Baza danych

Domyslna konfiguracja PostgreSQL:

- baza: `system_egzaminacyjny`
- uzytkownik: `egzaminy`
- haslo: `egzaminy`

Po starcie backend tworzy podstawowe dane: dwoch uzytkownikow, pytania oraz egzamin probny.
