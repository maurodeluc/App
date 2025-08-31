// Mock data for Daylio clone
export const moodLevels = [
  { id: 1, name: 'awful', emoji: '😞', color: '#FF4747' },
  { id: 2, name: 'bad', emoji: '😔', color: '#FF8E53' },
  { id: 3, name: 'meh', emoji: '😐', color: '#FFD23F' },
  { id: 4, name: 'good', emoji: '😊', color: '#6BCF7F' },
  { id: 5, name: 'rad', emoji: '😄', color: '#4FC3F7' }
];

export const activityCategories = [
  {
    id: 1,
    name: 'Health',
    activities: [
      { id: 1, name: 'Exercise', icon: '💪', category: 'Health' },
      { id: 2, name: 'Sleep well', icon: '😴', category: 'Health' },
      { id: 3, name: 'Doctor', icon: '🏥', category: 'Health' },
      { id: 4, name: 'Vitamins', icon: '💊', category: 'Health' }
    ]
  },
  {
    id: 2,
    name: 'Food',
    activities: [
      { id: 5, name: 'Cooking', icon: '🍳', category: 'Food' },
      { id: 6, name: 'Restaurant', icon: '🍽️', category: 'Food' },
      { id: 7, name: 'Fast food', icon: '🍔', category: 'Food' },
      { id: 8, name: 'Healthy food', icon: '🥗', category: 'Food' }
    ]
  },
  {
    id: 3,
    name: 'Social',
    activities: [
      { id: 9, name: 'Friends', icon: '👥', category: 'Social' },
      { id: 10, name: 'Family', icon: '👨‍👩‍👧‍👦', category: 'Social' },
      { id: 11, name: 'Party', icon: '🎉', category: 'Social' },
      { id: 12, name: 'Date', icon: '💕', category: 'Social' }
    ]
  },
  {
    id: 4,
    name: 'Hobbies',
    activities: [
      { id: 13, name: 'Reading', icon: '📚', category: 'Hobbies' },
      { id: 14, name: 'Music', icon: '🎵', category: 'Hobbies' },
      { id: 15, name: 'Gaming', icon: '🎮', category: 'Hobbies' },
      { id: 16, name: 'Art', icon: '🎨', category: 'Hobbies' }
    ]
  },
  {
    id: 5,
    name: 'Work',
    activities: [
      { id: 17, name: 'Meeting', icon: '💼', category: 'Work' },
      { id: 18, name: 'Productive', icon: '✅', category: 'Work' },
      { id: 19, name: 'Stressful', icon: '😰', category: 'Work' },
      { id: 20, name: 'Travel', icon: '✈️', category: 'Work' }
    ]
  }
];

export const mockEntries = [
  {
    id: 1,
    date: '2025-01-30',
    mood: moodLevels[3],
    activities: [activityCategories[0].activities[0], activityCategories[1].activities[0]],
    note: 'Had a great workout today and cooked a healthy meal!'
  },
  {
    id: 2,
    date: '2025-01-29',
    mood: moodLevels[2],
    activities: [activityCategories[4].activities[0], activityCategories[4].activities[2]],
    note: 'Work was okay, but had a stressful meeting.'
  },
  {
    id: 3,
    date: '2025-01-28',
    mood: moodLevels[4],
    activities: [activityCategories[2].activities[0], activityCategories[3].activities[1]],
    note: 'Amazing day with friends and listened to great music!'
  },
  {
    id: 4,
    date: '2025-01-27',
    mood: moodLevels[1],
    activities: [activityCategories[0].activities[1], activityCategories[1].activities[2]],
    note: 'Didn\'t sleep well and ate too much fast food.'
  },
  {
    id: 5,
    date: '2025-01-26',
    mood: moodLevels[3],
    activities: [activityCategories[3].activities[0], activityCategories[0].activities[3]],
    note: 'Read a good book and took my vitamins.'
  }
];

// Generate more mock data for the past month
const generateMockEntries = () => {
  const entries = [...mockEntries];
  const today = new Date();
  
  for (let i = 6; i <= 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const randomMood = moodLevels[Math.floor(Math.random() * moodLevels.length)];
    const randomActivities = [];
    
    // Add 1-3 random activities
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