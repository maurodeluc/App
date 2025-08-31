// Dati mock per il clone Daylio - Studio di Psicoterapia
export const moodLevels = [
  { id: 1, name: 'molto male', emoji: '😞', color: '#FF4747' },
  { id: 2, name: 'male', emoji: '😔', color: '#FF8E53' },
  { id: 3, name: 'neutro', emoji: '😐', color: '#FFD23F' },
  { id: 4, name: 'bene', emoji: '😊', color: '#6BCF7F' },
  { id: 5, name: 'molto bene', emoji: '😄', color: '#4FC3F7' }
];

export const activityCategories = [
  {
    id: 1,
    name: 'Benessere Fisico',
    activities: [
      { id: 1, name: 'Esercizio fisico', icon: '💪', category: 'Benessere Fisico' },
      { id: 2, name: 'Sonno ristoratore', icon: '😴', category: 'Benessere Fisico' },
      { id: 3, name: 'Visite mediche', icon: '🏥', category: 'Benessere Fisico' },
      { id: 4, name: 'Cure personali', icon: '🧴', category: 'Benessere Fisico' }
    ]
  },
  {
    id: 2,
    name: 'Alimentazione',
    activities: [
      { id: 5, name: 'Cucinare', icon: '🍳', category: 'Alimentazione' },
      { id: 6, name: 'Pasti regolari', icon: '🍽️', category: 'Alimentazione' },
      { id: 7, name: 'Idratazione', icon: '💧', category: 'Alimentazione' },
      { id: 8, name: 'Alimentazione sana', icon: '🥗', category: 'Alimentazione' }
    ]
  },
  {
    id: 3,
    name: 'Relazioni Sociali',
    activities: [
      { id: 9, name: 'Tempo con amici', icon: '👥', category: 'Relazioni Sociali' },
      { id: 10, name: 'Famiglia', icon: '👨‍👩‍👧‍👦', category: 'Relazioni Sociali' },
      { id: 11, name: 'Supporto sociale', icon: '🤝', category: 'Relazioni Sociali' },
      { id: 12, name: 'Relazione di coppia', icon: '💕', category: 'Relazioni Sociali' }
    ]
  },
  {
    id: 4,
    name: 'Attività Terapeutiche',
    activities: [
      { id: 13, name: 'Meditazione', icon: '🧘', category: 'Attività Terapeutiche' },
      { id: 14, name: 'Respirazione', icon: '🌬️', category: 'Attività Terapeutiche' },
      { id: 15, name: 'Journaling', icon: '📝', category: 'Attività Terapeutiche' },
      { id: 16, name: 'Mindfulness', icon: '🎯', category: 'Attività Terapeutiche' }
    ]
  },
  {
    id: 5,
    name: 'Lavoro/Studio',
    activities: [
      { id: 17, name: 'Produttività', icon: '💼', category: 'Lavoro/Studio' },
      { id: 18, name: 'Obiettivi raggiunti', icon: '✅', category: 'Lavoro/Studio' },
      { id: 19, name: 'Stress lavorativo', icon: '😰', category: 'Lavoro/Studio' },
      { id: 20, name: 'Pausa/Riposo', icon: '☕', category: 'Lavoro/Studio' }
    ]
  },
  {
    id: 6,
    name: 'Crescita Personale',
    activities: [
      { id: 21, name: 'Lettura', icon: '📚', category: 'Crescita Personale' },
      { id: 22, name: 'Apprendimento', icon: '🎓', category: 'Crescita Personale' },
      { id: 23, name: 'Creatività', icon: '🎨', category: 'Crescita Personale' },
      { id: 24, name: 'Riflessione', icon: '💭', category: 'Crescita Personale' }
    ]
  }
];

export const mockEntries = [
  {
    id: 1,
    date: '2025-01-30',
    mood: moodLevels[3],
    activities: [activityCategories[0].activities[0], activityCategories[3].activities[0]],
    note: 'Sessione di esercizio mattutina seguita da meditazione. Mi sento più equilibrato.'
  },
  {
    id: 2,
    date: '2025-01-29',
    mood: moodLevels[2],
    activities: [activityCategories[4].activities[2], activityCategories[4].activities[3]],
    note: 'Giornata stressante al lavoro, ma ho preso delle pause regolari.'
  },
  {
    id: 3,
    date: '2025-01-28',
    mood: moodLevels[4],
    activities: [activityCategories[2].activities[0], activityCategories[5].activities[2]],
    note: 'Serata piacevole con gli amici e tempo dedicato alla creatività.'
  },
  {
    id: 4,
    date: '2025-01-27',
    mood: moodLevels[1],
    activities: [activityCategories[0].activities[1], activityCategories[1].activities[1]],
    note: 'Sonno disturbato e difficoltà con l\'alimentazione regolare.'
  },
  {
    id: 5,
    date: '2025-01-26',
    mood: moodLevels[3],
    activities: [activityCategories[5].activities[0], activityCategories[3].activities[2]],
    note: 'Lettura interessante e sessione di journaling produttiva.'
  }
];

// Genera più dati mock per il mese passato
const generateMockEntries = () => {
  const entries = [...mockEntries];
  const today = new Date();
  
  for (let i = 6; i <= 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const randomMood = moodLevels[Math.floor(Math.random() * moodLevels.length)];
    const randomActivities = [];
    
    // Aggiungi 1-3 attività casuali
    const numActivities = Math.floor(Math.random() * 3) + 1;
    const allActivities = activityCategories.flatMap(cat => cat.activities);
    
    for (let j = 0; j < numActivities; j++) {
      const randomActivity = allActivities[Math.floor(Math.random() * allActivities.length)];
      if (!randomActivities.find(a => a.id === randomActivity.id)) {
        randomActivities.push(randomActivity);
      }
    }
    
    entries.push({
      id: i,
      date: date.toISOString().split('T')[0],
      mood: randomMood,
      activities: randomActivities,
      note: ''
    });
  }
  
  return entries.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const allMockEntries = generateMockEntries();