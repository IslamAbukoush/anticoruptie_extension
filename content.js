// console.log("content.js ran")
function saveDataToStorage(data) {
    notify()
    chrome.storage.local.get(['savedText'], function(result) {
        data = result.savedText+'\n---------------\n'+ new Date().toString()+'\n\n'+data
        chrome.storage.local.set({ savedText: data }, function() {
            // console.log('Data saved:', data);
        });
      });
}

window.onload = function() {
    setTimeout(main, 2000);
};

function main() {
    const iframes = Array.from(document.querySelectorAll(".cke_wysiwyg_frame"));
    // console.log("iframes:", iframes);
    if(iframes) {
        const targets = iframes.map(iframe => (iframe.contentDocument || iframe.contentWWindow.document).querySelector(".cke_editable"))
        // console.log("targets:", targets);
        targets.forEach(target => {
            let changed = false;
            target.addEventListener('input', _ => changed = true);
            setInterval(() => {
                if(changed) {
                    const newValue = target.innerHTML;
                    saveDataToStorage(newValue);
                    // console.log('Element value changed:', newValue);
                    changed = false;
                } else {
                    // console.log("no change detected")
                }
            }, 10000);
        });
    }
}

let notiBox = document.createElement("img");
notiBox.src = chrome.runtime.getURL("icon128.png")
notiBox.style.width = "50px";
notiBox.style.height = "50px";
notiBox.style.position = "fixed";
notiBox.style.top = "-60px";
notiBox.style.left = "10px";
notiBox.style.transition = "top 500ms ease"
document.body.append(notiBox);
function notify() {
    notiBox.style.top = "10px";
    setTimeout(() => {
        notiBox.style.top = "-60px";
    }, 1000);
}
