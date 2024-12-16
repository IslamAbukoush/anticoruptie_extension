// Load and manage saved drafts
window.onload = function() {
  loadDrafts();
};

function loadDrafts() {
  chrome.storage.local.get(['savedDrafts'], function(result) {
      const draftsContainer = document.getElementById('draftsContainer');
      const drafts = result.savedDrafts || [];

      // Clear previous content
      draftsContainer.innerHTML = '';

      if (drafts.length === 0) {
          draftsContainer.innerHTML = `
              <div class="empty-state">
                  <p>No saved drafts. Start writing to save your progress!</p>
              </div>
          `;
          return;
      }

      // Sort drafts by timestamp (most recent first)
      drafts.sort((a, b) => b.timestamp - a.timestamp);

      // Remove drafts older than a month
      const oneMonthAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      const filteredDrafts = drafts.filter(draft => draft.timestamp > oneMonthAgo);

      // Update storage with filtered drafts
      if (filteredDrafts.length !== drafts.length) {
          chrome.storage.local.set({ savedDrafts: filteredDrafts });
      }

      // Render draft cards
      filteredDrafts.forEach((draft, index) => {
          const draftCard = document.createElement('div');
          draftCard.className = 'draft-card';
          
          const formattedDate = new Date(draft.timestamp).toLocaleString();
          
          draftCard.innerHTML = `
              <div class="draft-header">
                  <span class="timestamp">Saved: ${formattedDate}</span>
                  <div>
                      <button class="toggle-html-btn" data-index="${index}">View HTML</button>
                      <button class="delete-btn" data-index="${index}">Delete</button>
                  </div>
              </div>
              <div class="draft-content">${draft.content}</div>
              <div class="draft-html" data-index="${index}">${escapeHtml(draft.content)}</div>
          `;
          
          draftsContainer.appendChild(draftCard);
      });

      // Add event listeners for delete and toggle buttons
      document.querySelectorAll('.delete-btn').forEach(btn => {
          btn.addEventListener('click', deleteDraft);
      });

      document.querySelectorAll('.toggle-html-btn').forEach(btn => {
          btn.addEventListener('click', toggleHtmlView);
      });
  });
}

function toggleHtmlView(event) {
  const draftCard = event.target.closest('.draft-card');
  const draftContent = draftCard.querySelector('.draft-content');
  const draftHtml = draftCard.querySelector('.draft-html');
  const btn = event.target;

  if (draftContent.style.display !== 'none') {
      draftContent.style.display = 'none';
      draftHtml.style.display = 'block';
      btn.textContent = 'View Content';
  } else {
      draftContent.style.display = 'block';
      draftHtml.style.display = 'none';
      btn.textContent = 'View HTML';
  }
}

function escapeHtml(unsafe) {
  return unsafe
       .replace(/&/g, "&amp;")
       .replace(/</g, "&lt;")
       .replace(/>/g, "&gt;")
       .replace(/"/g, "&quot;")
       .replace(/'/g, "&#039;");
}

function deleteDraft(event) {
  const index = event.target.dataset.index;

  chrome.storage.local.get(['savedDrafts'], function(result) {
      let drafts = result.savedDrafts || [];
      
      // Remove the draft at the specified index
      drafts.splice(index, 1);

      // Update storage
      chrome.storage.local.set({ savedDrafts: drafts }, function() {
          // Reload drafts to refresh the view
          loadDrafts();
      });
  });
}

// Clear all data
document.getElementById('clearAllData')?.addEventListener('click', function() {
  chrome.storage.local.remove(['savedDrafts'], function() {
      loadDrafts();
  });
});