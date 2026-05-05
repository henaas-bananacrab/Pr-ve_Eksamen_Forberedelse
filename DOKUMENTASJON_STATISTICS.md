# Dokumentasjon - Statistics Funksjonalitet

## Oversikt
Statistics-funksjonaliteten muliggjør at ledelsen kan se statistikk over antall avvik per kategori per måned, uten at enkeltmeldinger eller avsendere kan identifiseres. Dette sikrer anonymiteten til de ansatte som sender inn avviksmeldinger.

---

## 1. `fetchMonthlyAvvik` API-Endepunkt

### Beskrivelse
Backend-endepunktet som henter aggregert statistikk over avvik gruppert etter måned og kategori.

### Plassering
- **Fil**: `Helsebygg_API/src/v1.0.0/repositories/avvikRepositorie.js`
- **Funksjon**: `fetchMonthlyAvvik()`

### Funksjonalitet
```javascript
const fetchMonthlyAvvik = async () => {
  const [rows] = await db.query(`
    SELECT
      DATE_FORMAT(a.Dato, '%Y-%m') AS month,
      k.Kategori AS kategori,
      COUNT(*) AS total
    FROM avvik a
    JOIN kategori k ON a.Kategori_Kategori_id = k.Kategori_id
    ...
  `);
  return rows;
};
```

### Input
Ingen - endepunktet ber ikke om filterparametere.

### Output
JSON-array med følgende struktur:
```json
[
  {
    "month": "2026-01",
    "kategori": "Pasient problemer",
    "total": 5
  },
  {
    "month": "2026-01",
    "kategori": "Utstyrsproblemer",
    "total": 3
  }
]
```

### Anonymitet
- ✅ **Returnerer kun aggregerte tall** – ingen enkeltmeldinger eksponeres
- ✅ **Ingen brukerinformasjon** – meldingene er helt frakoblet sin avsender
- ✅ **Kun statistikk** – viser kun antall per kategori per måned
- ✅ **Sikker for ledelsen** – HR-ansvarlige kan analysere trender uten å krenke anonymiteten

---

## 2. `Statistics.jsx` Komponent

### Beskrivelse
React-komponent som visualiserer aggregert avviksstatistikk. Komponenten organiserer data etter måned og viser antall avvik per kategori for hver måned.

### Plassering
- **Fil**: `Helsebygg_frontend/Helsebygg-front/src/components/Statistics.jsx`

### Funksjonalitet

#### Livssyklus
1. **Mount**: Henter statistikkdata fra API når komponenten lastes
2. **Datahåndtering**: Grupperer data etter måned
3. **Sortering**: Viser måneder i omvendt kronologisk rekkefølge (nyeste først)
4. **Rendering**: Viser tabeller for hver måned med kategori-detaljer

#### Nøkkellogikk
```javascript
// Gruppering av data etter måned
const groupedByMonth = stats.reduce((acc, item) => {
  if (!acc[item.month]) {
    acc[item.month] = [];
  }
  acc[item.month].push(item);
  return acc;
}, {});
```

#### Rendering
- **Hver måned**: Egne seksjoner i separate kort
- **Tabell per måned**: 
  - Kolonne 1: Kategori-navn
  - Kolonne 2: Antall avvik
- **Måned-totalt**: Summert antall avvik for hele måneden

### Props
Komponenten tar ingen props.

### State
```javascript
const [stats, setStats] = useState([]);        // Statistikkdata fra API
const [loading, setLoading] = useState(true);  // Lastingstatus
const [error, setError] = useState('');        // Feilmeldinger
```

### Error Handling
- Hvis API-kall mislykkes: Viser feilmelding
- Hvis ingen data finnes: Viser "No statistics available"
- Loading-state: Viser "Loading statistics..." mens data hentes

### Styling
Bruker CSS-klasser:
- `.statistics-container` – Hovedcontainer
- `.month-section` – Kortlayout for hver måned
- `.statistics-table` – Tabellformattering
- `.month-total-row` – Fremhevet rad for måned-totalt

---

## 3. Integrasjon med Anonymiteten

### Hvorfor denne løsningen er sikker:

1. **Aggregering på database-nivå**
   - Statistikken beregnes direkte i SQL
   - Individuelle meldinger blir aldri eksponert

2. **Ingen bruker-identifikasjon**
   - Avvikene er allerede frakoblet brukeren i databasen
   - Statistikken viser kun tall, aldri tekst fra meldinger

3. **Ledelse kan analysere uten å bryte anonymitet**
   - Kan se trender (f.eks. "mange pasient problemer i januar")
   - Kan ikke se hvem som sendte dem

4. **Sikker data-flow**
   ```
   Anonym avviksmelding → Database (fra-koplet fra bruker)
                           ↓
   fetchMonthlyAvvik (aggregerer kun statistikk)
                           ↓
   Statistics.jsx (visualiserer anonymisert data)
   ```

---

## 4. API-Integrasjon

### Endpoint
- **Route**: `GET /avvik/stats/monthly`
- **Controller**: `getMonthlyAvvik()` i `avvikController.js`
- **Repository**: `fetchMonthlyAvvik()` i `avvikRepositorie.js`

### Kall fra Frontend
```javascript
const response = await avvikAPI.getMonthlyAvvik();
```

### Autentisering
Kravet til autentisering kan vurderes basert på:
- Hvis **alle med login** skal se statistikk: Require authentication
- Hvis **kun admin/leder** skal se: Require role-based access

---

## 5. Sikkerhet og Etikk

### GDPR-Compliance
✅ Personopplysninger lagres ikke i statistikken  
✅ Meldinger kan ikke spores til individer  
✅ Aggregert data alene kan ikke identifisere noen  

### Best Practice
- Ledelsen ser bare **hva** som skjer (antall avvik per kategori)
- Ledelsen ser **når** det skjer (per måned)
- Ledelsen ser **ikke hvem** det skjer til (anonymt)

---

## 6. Mulige Utvidelser

- Filtrering etter datoperiode (fra/til dato)
- Visuell grafvisning (bar chart, pie chart) med bibliotek som Chart.js
- Eksport til CSV/Excel
- Sammenligning mellom måneder/år
- Departements-nivå statistikk (med departement som kategori)
