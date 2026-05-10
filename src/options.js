// Save options to chrome.storage
function saveOptions() {
    const hidePromoted = document.getElementById('hide-promoted').checked;
    const hideSuggested = document.getElementById('hide-suggested').checked;
    const hideCustom = document.getElementById('hide-custom').checked;
    const customKeywords = document.getElementById('custom-keywords').value.trim();

    chrome.storage.sync.set({
        hidePromoted: hidePromoted,
        hideSuggested: hideSuggested,
        hideCustom: hideCustom,
        customKeywords: customKeywords
    }, function() {
        // Update status to let user know options were saved
        const status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
}

// Load options from chrome.storage
function restoreOptions() {
    chrome.storage.sync.get({
        hidePromoted: true,  // default to true
        hideSuggested: true, // default to true
        hideCustom: false,
        customKeywords: ''
    }, function(items) {
        document.getElementById('hide-promoted').checked = items.hidePromoted;
        document.getElementById('hide-suggested').checked = items.hideSuggested;
        document.getElementById('hide-custom').checked = items.hideCustom;
        const keywordsField = document.getElementById('custom-keywords');
        keywordsField.value = items.customKeywords || '';
        keywordsField.disabled = !items.hideCustom;
    });
}

document.addEventListener('DOMContentLoaded', function() {
    restoreOptions();
    const hideCustomCheckbox = document.getElementById('hide-custom');
    const keywordsField = document.getElementById('custom-keywords');

    hideCustomCheckbox.addEventListener('change', function() {
        keywordsField.disabled = !this.checked;
    });

    keywordsField.addEventListener('input', function() {
        if (this.value.trim().length > 0) {
            hideCustomCheckbox.checked = true;
            keywordsField.disabled = false;
        }
    });
});

document.getElementById('options-form').addEventListener('submit', function(e) {
    e.preventDefault();
    saveOptions();
});