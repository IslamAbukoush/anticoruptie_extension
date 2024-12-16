// Popup script with improved functionality
document.addEventListener('DOMContentLoaded', function() {
  // Update draft count
  updateDraftCount();

  // Show drafts
  document.getElementById('showData').addEventListener('click', function() {
      chrome.storage.local.get(['savedDrafts'], function(result) {
          const drafts = result.savedDrafts || [];
          if (drafts.length > 0) {
              let draftPreview = drafts.map((draft, index) => 
                  `Draft ${index + 1} (${new Date(draft.timestamp).toLocaleString()}):\n` + 
                  draft.content.substring(0, 200) + '...'
              ).join('\n\n');
              
              alert(draftPreview);
          } else {
              alert('No drafts saved.');
          }
      });
  });

  // Redirect to data page
  document.getElementById('redirectToDataPage').addEventListener('click', function() {
      chrome.tabs.create({ url: chrome.runtime.getURL('data.html') });
  });

  // Clear all drafts
  document.getElementById('clearData').addEventListener('click', function() {
      chrome.storage.local.remove(['savedDrafts'], function() {
          alert('All drafts have been cleared.');
          updateDraftCount();
      });
  });
});

// Function to update draft count
function updateDraftCount() {
  chrome.storage.local.get(['savedDrafts'], function(result) {
      const drafts = result.savedDrafts || [];
      document.getElementById('draftCount').textContent = drafts.length;
  });
}