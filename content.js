// Improved content script for saving drafts

function saveDataToStorage(data) {
    notify();
    chrome.storage.local.get(['savedDrafts'], function(result) {
        const drafts = result.savedDrafts || [];
        
        // Create a new draft object
        const newDraft = {
            content: data,
            timestamp: Date.now()
        };

        // Add the new draft to the beginning of the array
        drafts.unshift(newDraft);

        // Limit to last 50 drafts to prevent storage overflow
        const limitedDrafts = drafts.slice(0, 50);

        chrome.storage.local.set({ savedDrafts: limitedDrafts }, function() {
            // console.log('Draft saved successfully');
        });
    });
}

window.onload = function() {
    setTimeout(main, 2000);
};

function main() {
    const iframes = Array.from(document.querySelectorAll(".cke_wysiwyg_frame"));
    
    if(iframes) {
        const targets = iframes.map(iframe => (iframe.contentDocument || iframe.contentWindow.document).querySelector(".cke_editable"))
        
        targets.forEach(target => {
            let changed = false;
            let lastSavedContent = '';

            target.addEventListener('input', _ => changed = true);
            
            setInterval(() => {
                if(changed) {
                    const newValue = target.innerHTML;
                    
                    // Only save if content has significantly changed
                    if (newValue !== lastSavedContent) {
                        saveDataToStorage(newValue);
                        lastSavedContent = newValue;
                    }
                    
                    changed = false;
                }
            }, 10000); // Save every 10 seconds
        });
    }
}

// Notification element
let notiBox = document.createElement("div");
notiBox.innerHTML = `
    <div style="
        display: flex;
        align-items: center;
        background-color: #4CAF50;
        color: white;
        padding: 10px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        position: fixed;
        top: -60px;
        left: 10px;
        transition: top 500ms ease;
        z-index: 10000;
    ">
        <img src="${chrome.runtime.getURL("icon128.png")}" style="width: 30px; height: 30px; margin-right: 10px;">
        <span>Draft saved!</span>
    </div>
`;
notiBox = notiBox.firstElementChild;
document.body.append(notiBox);

function notify() {
    notiBox.style.top = "10px";
    setTimeout(() => {
        notiBox.style.top = "-60px";
    }, 1500);
}