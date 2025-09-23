// Admin Panel Utility Functions
function escapeHtml(s) {
  return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
}

// Chart rendering variables
let __courseChart = null, __yearChart = null, __coursePctChart = null;
let __byDayChart = null;

async function renderCharts(byCourse, byCollege) {
  try {
    const { Chart } = await import('https://cdn.jsdelivr.net/npm/chart.js@4.4.3/auto/+esm');
    
    const bd = document.getElementById('byDay');
    const bc = document.getElementById('byCourse');
    const by = document.getElementById('byCollege');
    const bcp = document.getElementById('byCoursePct');
    
    if (!bd || !bc || !by || !bcp) {
      console.warn('Chart canvases not found');
      return;
    }
    
    // Destroy existing charts
    if (__byDayChart) __byDayChart.destroy();
    if (__courseChart) __courseChart.destroy();
    if (__yearChart) __yearChart.destroy();
    if (__coursePctChart) __coursePctChart.destroy();
    
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#B3B3B3' }
        }
      },
      scales: {
        x: { 
          ticks: { color: '#B3B3B3' },
          grid: { color: '#31302F' }
        },
        y: { 
          ticks: { color: '#B3B3B3' },
          grid: { color: '#31302F' }
        }
      }
    };
    
    // By Day Chart (placeholder - would need actual daily data)
    __byDayChart = new Chart(bd, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Registrations',
          data: [12, 19, 3, 5, 2, 3, 7],
          borderColor: '#7bbf44',
          backgroundColor: 'rgba(123, 191, 68, 0.1)',
          tension: 0.4
        }]
      },
      options: chartOptions
    });
    
    // By Course Chart
    __courseChart = new Chart(bc, {
      type: 'bar',
      data: {
        labels: Object.keys(byCourse),
        datasets: [{
          label: 'Count',
          data: Object.values(byCourse),
          backgroundColor: ['#7bbf44', '#6aac37', '#5a9b2a', '#4a8b1d']
        }]
      },
      options: chartOptions
    });
    
    // By College Chart (replacing year chart)
    __yearChart = new Chart(by, {
      type: 'doughnut',
      data: {
        labels: ['Sample College 1', 'Sample College 2', 'Others'],
        datasets: [{
          data: [10, 8, 5],
          backgroundColor: ['#7bbf44', '#6aac37', '#5a9b2a']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#B3B3B3' }
          }
        }
      }
    });
    
    // Course Percentage Chart
    const total = Object.values(byCourse).reduce((a, b) => a + b, 0);
    const percentages = Object.values(byCourse).map(v => total > 0 ? ((v / total) * 100).toFixed(1) : 0);
    
    __coursePctChart = new Chart(bcp, {
      type: 'pie',
      data: {
        labels: Object.keys(byCourse).map((k, i) => `${k} (${percentages[i]}%)`),
        datasets: [{
          data: Object.values(byCourse),
          backgroundColor: ['#7bbf44', '#6aac37', '#5a9b2a', '#4a8b1d']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#B3B3B3' }
          }
        }
      }
    });
    
  } catch (error) {
    console.error('Chart rendering failed:', error);
    throw error;
  }
}

// Export CSV functionality
function exportToCsv(data) {
  const headers = ['#', 'Username', 'Course', 'Payment', 'College', 'IP', 'Token No', 'Created'];
  const csvContent = [
    headers.join(','),
    ...data.map((row, index) => [
      index + 1,
      `"${(row.username || '').replace(/"/g, '""')}"`,
      row.course || '',
      row.paymentMode || '',
      `"${(row.college || '').replace(/"/g, '""')}"`,
      row.ip || '',
      row.shortId || 'N/A',
      row.createdAt?.toDate ? row.createdAt.toDate().toISOString() : ''
    ].join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `illumina-registrations-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Debug ID functionality
function debugIds(data) {
  const ids = data.map(d => d.shortId || 'N/A');
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index && id !== 'N/A');
  const unique = [...new Set(ids)];
  
  console.log('ID Debug Report:');
  console.log('Total records:', data.length);
  console.log('Unique IDs:', unique.length);
  console.log('Duplicates:', duplicates);
  console.log('Missing IDs:', ids.filter(id => id === 'N/A').length);
  
  alert(`ID Debug:\nTotal: ${data.length}\nUnique: ${unique.length}\nDuplicates: ${duplicates.length}\nMissing: ${ids.filter(id => id === 'N/A').length}`);
}

// Test runner
async function runDiagnostics() {
  const results = [];
  
  function add(name, testFn) {
    results.push({ name, test: testFn });
  }
  
  function pass(name) {
    console.log(`✓ ${name}`);
  }
  
  function fail(name, error) {
    console.error(`✗ ${name}:`, error);
  }
  
  // Firebase connection test
  add('Firebase Connection', async () => {
    try {
      const { db } = await import('./firebase-config.js');
      const { collection, getDocs, limit, query } = await import("https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js");
      const testQuery = query(collection(db, 'registrations'), limit(1));
      await getDocs(testQuery);
      pass('Firebase Connection');
    } catch (e) {
      throw e;
    }
  });
  
  // Chart rendering test
  add('Charts Render', async () => {
    try {
      await renderCharts({ 'PUC / 12th / ISC / CBSE':0, 'Degree / UG':0, 'PG':0 }, { 'Sample College':0 });
      pass('Charts Render');
    } catch (e) {
      throw e;
    }
  });
  
  // DOM elements test
  add('DOM Elements', () => {
    const required = ['rows', 'totalBadge', 'filterCourse', 'searchBox'];
    const missing = required.filter(id => !document.getElementById(id));
    if (missing.length > 0) {
      throw new Error(`Missing elements: ${missing.join(', ')}`);
    }
    pass('DOM Elements');
  });
  
  // Run all tests
  const testResults = [];
  for (const { name, test } of results) {
    try {
      await test();
      testResults.push({ name, status: 'pass' });
    } catch (error) {
      fail(name, error);
      testResults.push({ name, status: 'fail', error: error.message });
    }
  }
  
  return testResults;
}

// Make functions globally available
window.escapeHtml = escapeHtml;
window.renderCharts = renderCharts;
window.exportToCsv = exportToCsv;
window.debugIds = debugIds;
window.runDiagnostics = runDiagnostics;