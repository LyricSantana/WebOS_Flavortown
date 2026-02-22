// Notepad functionality
const notepadManager = {
    textarea: null,
    filenameInput: null,
    saveBtn: null,
    clearBtn: null,
    charCount: null,

    init() {
        this.textarea = document.querySelector('#notepadTextarea');
        this.filenameInput = document.querySelector('#notepadFilename');
        this.saveBtn = document.querySelector('#notepadSaveBtn');
        this.clearBtn = document.querySelector('#notepadClearBtn');
        this.charCount = document.querySelector('#charCount');

        if (!this.textarea || !this.saveBtn) return;

        // Setup event listeners
        this.saveBtn.addEventListener('click', () => this.saveFile());
        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', () => this.clearText());
        }
        if (this.textarea) {
            this.textarea.addEventListener('input', () => this.updateCharCount());
        }

        // Load saved content from localStorage if it exists
        this.loadContent();
        this.updateCharCount();
    },

    updateCharCount() {
        if (this.charCount && this.textarea) {
            const count = this.textarea.value.length;
            this.charCount.textContent = count;
        }
    },

    saveFile() {
        if (!this.textarea) return;

        const text = this.textarea.value;
        const filename = this.filenameInput?.value.trim() || 'document';
        
        // Create a blob with the text content
        const blob = new Blob([text], { type: 'text/plain' });
        
        // Create a temporary download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.txt`;
        
        // Trigger download
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Also save to localStorage
        this.saveContent();
        
        // Show feedback
        this.showSaveFeedback();
    },

    clearText() {
        if (this.textarea) {
            this.textarea.value = '';
            this.updateCharCount();
            this.saveContent();
        }
        if (this.filenameInput) {
            this.filenameInput.value = '';
        }
    },

    saveContent() {
        if (this.textarea) {
            localStorage.setItem('notepadContent', this.textarea.value);
        }
        if (this.filenameInput) {
            localStorage.setItem('notepadFilename', this.filenameInput.value);
        }
    },

    loadContent() {
        const savedContent = localStorage.getItem('notepadContent');
        const savedFilename = localStorage.getItem('notepadFilename');
        
        if (savedContent && this.textarea) {
            this.textarea.value = savedContent;
        }
        if (savedFilename && this.filenameInput) {
            this.filenameInput.value = savedFilename;
        }
    },

    showSaveFeedback() {
        if (!this.saveBtn) return;
        
        const originalText = this.saveBtn.textContent;
        this.saveBtn.textContent = 'Saved!';
        this.saveBtn.style.backgroundColor = '#4CAF50';
        
        setTimeout(() => {
            this.saveBtn.textContent = originalText;
            this.saveBtn.style.backgroundColor = '';
        }, 1500);
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    notepadManager.init();
});
