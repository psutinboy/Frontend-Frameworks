const axios = require('axios');

// ========== CONFIGURATION - UPDATE THESE ==========
const API_URL = 'http://localhost:3000/api';
const YOUR_JWT_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTBiNmE3NjQ2MTUxYmFhYjBlODJlMjQiLCJpYXQiOjE3NjIzNTU4MzAsImV4cCI6MTc2Mjk2MDYzMH0.nUdCz6pMHc4dfOzGVnapfBSxoVOFHlAPlhdLrXfUHC8'; // Get this from login/register
const YOUR_TASK_IDS = [
  '690b6a8f46151baab0e82e26',
  '690b6a9346151baab0e82e28',
  '690b6a9646151baab0e82e2a',
  '690b6a9946151baab0e82e2c',
  '690b6a9c46151baab0e82e2e'
];
// ==================================================

const headers = {
  Authorization: `Bearer ${YOUR_JWT_TOKEN}`,
  'Content-Type': 'application/json',
};

// Helper function to create a date X days ago at a specific hour
function getDaysAgo(daysAgo, hour, minute = 0) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hour, minute, 0, 0);
  return date;
}

// Generate realistic work sessions over the past week
async function seedDemoData() {
  console.log('🌱 Starting to seed demo data...\n');

  const sessions = [
    // ===== 6 DAYS AGO =====
    { taskId: YOUR_TASK_IDS[0], type: 'work', duration: 25, completedAt: getDaysAgo(6, 9, 15) },
    { taskId: YOUR_TASK_IDS[0], type: 'work', duration: 25, completedAt: getDaysAgo(6, 10, 0) },
    { taskId: YOUR_TASK_IDS[1], type: 'work', duration: 25, completedAt: getDaysAgo(6, 11, 30) },
    { taskId: YOUR_TASK_IDS[1], type: 'work', duration: 25, completedAt: getDaysAgo(6, 14, 0) },
    { taskId: YOUR_TASK_IDS[0], type: 'work', duration: 25, completedAt: getDaysAgo(6, 15, 30) },

    // ===== 5 DAYS AGO =====
    { taskId: YOUR_TASK_IDS[1], type: 'work', duration: 25, completedAt: getDaysAgo(5, 9, 0) },
    { taskId: YOUR_TASK_IDS[1], type: 'work', duration: 25, completedAt: getDaysAgo(5, 10, 15) },
    { taskId: YOUR_TASK_IDS[2], type: 'work', duration: 25, completedAt: getDaysAgo(5, 11, 0) },
    { taskId: YOUR_TASK_IDS[2], type: 'work', duration: 25, completedAt: getDaysAgo(5, 13, 30) },
    { taskId: YOUR_TASK_IDS[0], type: 'work', duration: 25, completedAt: getDaysAgo(5, 14, 45) },
    { taskId: YOUR_TASK_IDS[1], type: 'work', duration: 25, completedAt: getDaysAgo(5, 16, 0) },

    // ===== 4 DAYS AGO =====
    { taskId: YOUR_TASK_IDS[0], type: 'work', duration: 25, completedAt: getDaysAgo(4, 8, 45) },
    { taskId: YOUR_TASK_IDS[0], type: 'work', duration: 25, completedAt: getDaysAgo(4, 9, 30) },
    { taskId: YOUR_TASK_IDS[1], type: 'work', duration: 25, completedAt: getDaysAgo(4, 10, 45) },
    { taskId: YOUR_TASK_IDS[2], type: 'work', duration: 25, completedAt: getDaysAgo(4, 13, 15) },
    { taskId: YOUR_TASK_IDS[2], type: 'work', duration: 25, completedAt: getDaysAgo(4, 14, 30) },
    { taskId: YOUR_TASK_IDS[1], type: 'work', duration: 25, completedAt: getDaysAgo(4, 15, 45) },
    { taskId: YOUR_TASK_IDS[0], type: 'work', duration: 25, completedAt: getDaysAgo(4, 16, 30) },

    // ===== 3 DAYS AGO =====
    { taskId: YOUR_TASK_IDS[2], type: 'work', duration: 25, completedAt: getDaysAgo(3, 9, 0) },
    { taskId: YOUR_TASK_IDS[2], type: 'work', duration: 25, completedAt: getDaysAgo(3, 10, 0) },
    { taskId: YOUR_TASK_IDS[1], type: 'work', duration: 25, completedAt: getDaysAgo(3, 11, 15) },
    { taskId: YOUR_TASK_IDS[1], type: 'work', duration: 25, completedAt: getDaysAgo(3, 14, 0) },
    { taskId: YOUR_TASK_IDS[0], type: 'work', duration: 25, completedAt: getDaysAgo(3, 15, 15) },

    // ===== 2 DAYS AGO =====
    { taskId: YOUR_TASK_IDS[1], type: 'work', duration: 25, completedAt: getDaysAgo(2, 9, 30) },
    { taskId: YOUR_TASK_IDS[1], type: 'work', duration: 25, completedAt: getDaysAgo(2, 10, 30) },
    { taskId: YOUR_TASK_IDS[2], type: 'work', duration: 25, completedAt: getDaysAgo(2, 11, 45) },
    { taskId: YOUR_TASK_IDS[0], type: 'work', duration: 25, completedAt: getDaysAgo(2, 13, 30) },
    { taskId: YOUR_TASK_IDS[0], type: 'work', duration: 25, completedAt: getDaysAgo(2, 14, 45) },
    { taskId: YOUR_TASK_IDS[2], type: 'work', duration: 25, completedAt: getDaysAgo(2, 16, 0) },

    // ===== YESTERDAY =====
    { taskId: YOUR_TASK_IDS[0], type: 'work', duration: 25, completedAt: getDaysAgo(1, 8, 30) },
    { taskId: YOUR_TASK_IDS[0], type: 'work', duration: 25, completedAt: getDaysAgo(1, 9, 45) },
    { taskId: YOUR_TASK_IDS[1], type: 'work', duration: 25, completedAt: getDaysAgo(1, 11, 0) },
    { taskId: YOUR_TASK_IDS[1], type: 'work', duration: 25, completedAt: getDaysAgo(1, 13, 15) },
    { taskId: YOUR_TASK_IDS[2], type: 'work', duration: 25, completedAt: getDaysAgo(1, 14, 30) },
    { taskId: YOUR_TASK_IDS[2], type: 'work', duration: 25, completedAt: getDaysAgo(1, 15, 45) },
    { taskId: YOUR_TASK_IDS[1], type: 'work', duration: 25, completedAt: getDaysAgo(1, 17, 0) },

    // ===== TODAY =====
    { taskId: YOUR_TASK_IDS[0], type: 'work', duration: 25, completedAt: getDaysAgo(0, 9, 0) },
    { taskId: YOUR_TASK_IDS[0], type: 'work', duration: 25, completedAt: getDaysAgo(0, 10, 0) },
    { taskId: YOUR_TASK_IDS[1], type: 'work', duration: 25, completedAt: getDaysAgo(0, 11, 15) },
    { taskId: YOUR_TASK_IDS[2], type: 'work', duration: 25, completedAt: getDaysAgo(0, 13, 30) },
    { taskId: YOUR_TASK_IDS[2], type: 'work', duration: 25, completedAt: getDaysAgo(0, 14, 45) },
  ];

  let successCount = 0;
  let errorCount = 0;

  for (const session of sessions) {
    try {
      await axios.post(`${API_URL}/pomodoros`, session, { headers });
      successCount++;
      console.log(`✅ Created session: ${session.type} on ${session.completedAt.toLocaleString()}`);

      // Small delay to avoid overwhelming the server
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      errorCount++;
      console.error(`❌ Error creating session:`, error.response?.data || error.message);
    }
  }

  console.log(`\n🎉 Seeding complete!`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📊 Total: ${sessions.length} sessions`);
  console.log(`\n💡 Refresh your stats dashboard to see the data!`);
}

// Run the seeder
seedDemoData().catch(console.error);
