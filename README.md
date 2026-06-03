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

Frontend dziala pod adresem `http://localhost:5173`

## Konta testowe

- `4gremplewicz` / `12345`
- `4bosak` / `12345`

## Baza danych

Domyslna konfiguracja PostgreSQL:

- baza: `system_egzaminacyjny`
- uzytkownik: `egzaminy`
- haslo: `egzaminy`

Zeby wejsc do bazy w dockerze w Exec i wywsitelic tabele:

   ```bash
   /usr/bin/psql -h localhost -U egzaminy -d system_egzaminacyjny
   \dt -- pokazuje liste tabeli
   SELECT * FROM (tutaj nazwa tabeli)
   ```

Po starcie backend tworzy podstawowe dane: dwoch uzytkownikow, pytania oraz egzamin probny.
