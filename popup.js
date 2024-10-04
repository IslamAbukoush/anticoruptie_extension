// Show stored data in the popup
document.getElementById('showData').addEventListener('click', function() {
    chrome.storage.local.get(['savedText'], function(result) {
      alert(result.savedText || 'No data found.');
    });
  });
  
 // Redirect to the data page
document.getElementById('redirectToDataPage').addEventListener('click', function() {
    chrome.tabs.create({ url: chrome.runtime.getURL('data.html') });
  });
  
  // Clear stored data when button is clicked
  document.getElementById('clearData').addEventListener('click', function() {
    chrome.storage.local.remove(['savedText'], function() {
      alert('Stored data cleared.');
    });
  });