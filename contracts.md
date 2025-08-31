# LEAF - Contratti API e Piano di Integrazione Backend

## 1. API Contracts

### Authentication (Futuro)
- `POST /api/auth/login` - Login paziente/terapeuta
- `POST /api/auth/register` - Registrazione nuovo paziente

### Mood Entries
- `GET /api/entries` - Ottieni tutte le entries del paziente
- `GET /api/entries/:date` - Ottieni entry per data specifica
- `POST /api/entries` - Crea nuova entry
- `PUT /api/entries/:id` - Aggiorna entry esistente
- `DELETE /api/entries/:id` - Elimina entry

### Activities & Moods
- `GET /api/moods` - Ottieni tutti i livelli di umore disponibili
- `GET /api/activities` - Ottieni tutte le attività disponibili
- `GET /api/activity-categories` - Ottieni categorie di attività

### Statistics
- `GET /api/stats/overview` - Statistiche generali del paziente
- `GET /api/stats/mood-trends` - Trend dell'umore nel tempo
- `GET /api/stats/activity-frequency` - Frequenza delle attività

## 2. Dati Mock da Sostituire

### In `/frontend/src/data/mockData.js`:
- `moodLevels` → Verrà caricato da API `/api/moods`
- `activityCategories` → Verrà caricato da API `/api/activity-categories`
- `allMockEntries` → Verrà caricato da API `/api/entries`

### Componenti Frontend da Aggiornare:
- `HomePage.jsx` → Integrare chiamate API per save/load entries
- `Calendar.jsx` → Caricare entries reali da database
- `ActivitySelector.jsx` → Caricare attività da API
- `MoodSelector.jsx` → Caricare mood levels da API

## 3. Backend Implementation Plan

### Database Models (MongoDB):
```javascript
// MoodEntry Schema
{
  _id: ObjectId,
  date: String (YYYY-MM-DD),
  mood: {
    id: Number,
    name: String,
    emoji: String,
    color: String
  },
  activities: [{
    id: Number,
    name: String,
    icon: String,
    category: String
  }],
  note: String,
  createdAt: Date,
  updatedAt: Date,
  patientId: String (futuro per multi-patient)
}

// MoodLevel Schema
{
  _id: ObjectId,
  id: Number,
  name: String,
  emoji: String,
  color: String,
  order: Number
}

// Activity Schema
{
  _id: ObjectId,
  id: Number,
  name: String,
  icon: String,
  category: String,
  categoryId: Number
}

// ActivityCategory Schema
{
  _id: ObjectId,
  id: Number,
  name: String,
  activities: [Activity]
}
```

### API Endpoints da Implementare:
1. **Mood Entries CRUD**
2. **Reference Data** (moods, activities, categories)
3. **Statistics & Analytics**
4. **Data Validation & Error Handling**

## 4. Frontend-Backend Integration

### Step 1: Create API Service Layer
- `/frontend/src/services/api.js` - Centralized API calls
- `/frontend/src/hooks/useEntries.js` - Custom hooks for entries
- `/frontend/src/hooks/useReferenceData.js` - Custom hooks for moods/activities

### Step 2: Replace Mock Data
- Remove dependency on `mockData.js`
- Update components to use API calls
- Add loading states and error handling

### Step 3: State Management
- Update React state to handle API responses
- Add caching for reference data (moods, activities)
- Implement optimistic updates for better UX

## 5. Data Migration
- Seed database with initial mood levels and activity categories
- Convert existing mock entries format to database format
- Ensure backward compatibility during transition

## 6. Error Handling & Validation
- Frontend: Loading states, error messages, offline handling
- Backend: Input validation, proper HTTP status codes, error responses
- Database: Constraints, unique indexes, data integrity

## 7. Performance Considerations
- Frontend: Lazy loading, caching, debounced API calls
- Backend: Database indexing, query optimization, pagination
- API: Response compression, proper HTTP caching headers

## 8. Testing Strategy
- Backend API testing with sample data
- Frontend integration testing
- End-to-end user flow testing
- Data persistence verification