const editor = document.getElementById('editor');
const wordCount = document.getElementById('wordCount');
const charCount = document.getElementById('charCount');
const status = document.getElementById('status');
const fontSelect = document.getElementById('fontSelect');
const fontSizeSelect = document.getElementById('fontSizeSelect');
const textColorInput = document.getElementById('textColor');
const bgColorInput = document.getElementById('bgColor');

// Toolbar buttons
const boldBtn = document.getElementById('bold');
const italicBtn = document.getElementById('italic');
const underlineBtn = document.getElementById('underline');
const strikethroughBtn = document.getElementById('strikethrough');
const alignLeftBtn = document.getElementById('alignLeft');
const alignCenterBtn = document.getElementById('alignCenter');
const alignRightBtn = document.getElementById('alignRight');
const bulletListBtn = document.getElementById('bulletList');
const numberListBtn = document.getElementById('numberList');
const codeBlockBtn = document.getElementById('codeBlock');
const undoBtn = document.getElementById('undo');
const redoBtn = document.getElementById('redo');
const clearBtn = document.getElementById('clearBtn');
const downloadTxtBtn = document.getElementById('downloadTxt');
const downloadHtmlBtn = document.getElementById('downloadHtml');
const copyBtn = document.getElementById('copyBtn');

const STORAGE_KEY = 'textEditorContent';

// Load content from localStorage
function loadContent() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    editor.innerHTML = saved;
    updateStats();
  }
}

// Save content to localStorage
function saveContent() {
  localStorage.setItem(STORAGE_KEY, editor.innerHTML);
  status.textContent = '💾 Saved';
  setTimeout(() => {
    status.textContent = 'Ready';
  }, 2000);
}

// Update word and character counts
function updateStats() {
  const text = editor.innerText;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  wordCount.textContent = words;
  charCount.textContent = chars;
}

// Formatting functions
function formatText(command, value = null) {
  document.execCommand(command, false, value);
  saveContent();
  updateStats();
}

function setAlignment(align) {
  document.execCommand('justify' + align, false, null);
}

function setFontFamily() {
  formatText('fontName', fontSelect.value);
}

function setFontSize() {
  formatText('fontSize', '5');
  editor.style.fontSize = fontSizeSelect.value;
}

function setTextColor() {
  formatText('foreColor', textColorInput.value);
}

function setBackgroundColor() {
  formatText('backColor', bgColorInput.value);
}

function insertCodeBlock() {
  formatText('formatBlock', '<pre>');
}

// Button event listeners
boldBtn.addEventListener('click', () => formatText('bold'));
italicBtn.addEventListener('click', () => formatText('italic'));
underlineBtn.addEventListener('click', () => formatText('underline'));
strikethroughBtn.addEventListener('click', () => formatText('strikethrough'));
alignLeftBtn.addEventListener('click', () => { setAlignment('Left'); });
alignCenterBtn.addEventListener('click', () => { setAlignment('Center'); });
alignRightBtn.addEventListener('click', () => { setAlignment('Right'); });
bulletListBtn.addEventListener('click', () => formatText('insertUnorderedList'));
numberListBtn.addEventListener('click', () => formatText('insertOrderedList'));
codeBlockBtn.addEventListener('click', insertCodeBlock);
undoBtn.addEventListener('click', () => formatText('undo'));
redoBtn.addEventListener('click', () => formatText('redo'));
fontSelect.addEventListener('change', setFontFamily);
fontSizeSelect.addEventListener('change', setFontSize);
textColorInput.addEventListener('change', setTextColor);
bgColorInput.addEventListener('change', setBackgroundColor);

clearBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear all text?')) {
    editor.innerHTML = '';
    saveContent();
    updateStats();
  }
});

downloadTxtBtn.addEventListener('click', () => {
  const text = editor.innerText;
  const blob = new Blob([text], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `document-${Date.now()}.txt`;
  link.click();
});

downloadHtmlBtn.addEventListener('click', () => {
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    pre { background: #f4f4f4; padding: 10px; border-radius: 5px; }
  </style>
</head>
<body>
${editor.innerHTML}
</body>
</html>`;
  
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `document-${Date.now()}.html`;
  link.click();
});

copyBtn.addEventListener('click', () => {
  const text = editor.innerText;
  navigator.clipboard.writeText(text).then(() => {
    status.textContent = '✅ Copied to clipboard!';
    setTimeout(() => {
      status.textContent = 'Ready';
    }, 2000);
  });
});

// Auto-save on input
editor.addEventListener('input', () => {
  updateStats();
  saveContent();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey) {
    if (e.key === 's') {
      e.preventDefault();
      saveContent();
    }
  }
});

// Update button states based on selection
editor.addEventListener('mouseup', () => {
  updateButtonStates();
});

editor.addEventListener('keyup', () => {
  updateButtonStates();
});

function updateButtonStates() {
  boldBtn.classList.toggle('active', document.queryCommandState('bold'));
  italicBtn.classList.toggle('active', document.queryCommandState('italic'));
  underlineBtn.classList.toggle('active', document.queryCommandState('underline'));
  strikethroughBtn.classList.toggle('active', document.queryCommandState('strikethrough'));
}

// Initialize
loadContent();
editor.focus();