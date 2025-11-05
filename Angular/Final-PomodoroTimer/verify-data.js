const axios = require('axios');

// Update with your token
const YOUR_JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTBiNjM5YmI5ZmM2M2EwOGExM2E5NmUiLCJpYXQiOjE3NjIzNTQwNzUsImV4cCI6MTc2Mjk1ODg3NX0.7jWF7RvjBIe2-ocicuKJlw0t_mTnYEbuVZiFBhNyvJY';
const API_URL = 'http://localhost:3000/api';

const headers = {
  'Authorization': `Bearer ${YOUR_JWT_TOKEN}`,
  'Content-Type': 'application/json'
};

async function verifyData() {
  console.log('🔍 Checking if sessions were created with correct dates...\n');
  
  try {
    // Get stats
    const statsResponse = await axios.get(`${API_URL}/pomodoros/stats`, { headers });
    const stats = statsResponse.data;
    
    console.log('📊 Stats Response:');
    console.log(`   Total Pomodoros: ${stats.totalPomodoros}`);
    console.log(`   Total Focus Time: ${stats.totalFocusTime} minutes`);
    console.log(`   Streak: ${stats.streak} days`);
    console.log(`   Most Productive Hour: ${stats.mostProductiveHour}`);
    console.log(`   Task Completion Rate: ${stats.taskCompletionRate.toFixed(1)}%`);
    
    console.log('\n📅 Daily Pomodoros (last 7 days):');
    Object.entries(stats.dailyPomodoros).sort().forEach(([date, count]) => {
      console.log(`   ${date}: ${count} pomodoros`);
    });
    
    console.log('\n📈 Weekly Pomodoros:');
    Object.entries(stats.weeklyPomodoros).forEach(([week, count]) => {
      console.log(`   ${week}: ${count} pomodoros`);
    });
    
    console.log('\n⏰ Hourly Productivity:');
    const hourlyEntries = Object.entries(stats.hourlyProductivity)
      .filter(([hour, count]) => count > 0)
      .sort((a, b) => parseInt(b[1]) - parseInt(a[1]));
    
    hourlyEntries.slice(0, 5).forEach(([hour, count]) => {
      const hourNum = parseInt(hour);
      const hourStr = hourNum === 0 ? '12 AM' :
                     hourNum < 12 ? `${hourNum} AM` :
                     hourNum === 12 ? '12 PM' :
                     `${hourNum - 12} PM`;
      console.log(`   ${hourStr}: ${count} pomodoros`);
    });
    
  } catch (error) {
    console.error('❌ Error fetching stats:', error.response?.data || error.message);
  }
}

verifyData();

