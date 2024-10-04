// Load the stored data when the page loads
window.onload = function() {
    chrome.storage.local.get(['savedText'], function(result) {
      const dataContent = document.getElementById('dataContent');
      if (result.savedText) {
        dataContent.textContent = result.savedText;
      } else {
        dataContent.textContent = 'No data found.';
      }
    });
  };
  
  // Clear stored data when button is clicked
  document.getElementById('clearData').addEventListener('click', function() {
    chrome.storage.local.remove(['savedText'], function() {
      document.getElementById('dataContent').textContent = 'No data to display.';
      alert('Stored data cleared.');
    });
  });
  