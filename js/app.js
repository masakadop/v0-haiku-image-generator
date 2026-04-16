// DOM Elements
const inputSection = document.getElementById('input-section');
const previewSection = document.getElementById('preview-section');
const shareSection = document.getElementById('share-section');

const line1Input = document.getElementById('line1');
const line2Input = document.getElementById('line2');
const line3Input = document.getElementById('line3');
const authorInput = document.getElementById('author');

const count1 = document.getElementById('count1');
const count2 = document.getElementById('count2');
const count3 = document.getElementById('count3');

const createBtn = document.getElementById('create-btn');
const backBtn = document.getElementById('back-btn');
const downloadBtn = document.getElementById('download-btn');
const restartBtn = document.getElementById('restart-btn');

const colorBtns = document.querySelectorAll('.color-btn');
const canvas = document.getElementById('tanzaku-canvas');
const ctx = canvas.getContext('2d');

// State
let currentColor = '#f5e6d3';
let haikuData = {
  line1: '',
  line2: '',
  line3: '',
  author: ''
};
const validColors = Array.from(colorBtns).map((btn) => btn.dataset.color);

function updateCharCounts() {
  count1.textContent = `${line1Input.value.length}文字`;
  count2.textContent = `${line2Input.value.length}文字`;
  count3.textContent = `${line3Input.value.length}文字`;
}

function setActiveColor(color) {
  const resolvedColor = validColors.includes(color) ? color : '#f5e6d3';
  currentColor = resolvedColor;
  colorBtns.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.color === resolvedColor);
  });
}

function buildShareUrl() {
  const shareUrl = new URL(window.location.href);
  shareUrl.search = '';
  shareUrl.searchParams.set('l1', haikuData.line1);
  shareUrl.searchParams.set('l2', haikuData.line2);
  shareUrl.searchParams.set('l3', haikuData.line3);
  shareUrl.searchParams.set('a', haikuData.author);
  shareUrl.searchParams.set('c', currentColor);
  return shareUrl.toString();
}

function syncUrlWithState() {
  const shareUrl = buildShareUrl();
  window.history.replaceState({}, '', shareUrl);
}

function initializeFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const line1 = params.get('l1') || '';
  const line2 = params.get('l2') || '';
  const line3 = params.get('l3') || '';
  const author = params.get('a') || '';
  const color = params.get('c') || '#f5e6d3';

  const hasSharedData = Boolean(line1 || line2 || line3 || author);
  if (!hasSharedData) return;

  line1Input.value = line1;
  line2Input.value = line2;
  line3Input.value = line3;
  authorInput.value = author;
  updateCharCounts();

  haikuData = { line1, line2, line3, author };
  setActiveColor(color);
  drawTanzaku();

  inputSection.classList.add('hidden');
  previewSection.classList.remove('hidden');
  shareSection.classList.remove('hidden');
}

// Character count updates
line1Input.addEventListener('input', () => {
  count1.textContent = `${line1Input.value.length}文字`;
});

line2Input.addEventListener('input', () => {
  count2.textContent = `${line2Input.value.length}文字`;
});

line3Input.addEventListener('input', () => {
  count3.textContent = `${line3Input.value.length}文字`;
});

// Create button click
createBtn.addEventListener('click', () => {
  haikuData = {
    line1: line1Input.value.trim(),
    line2: line2Input.value.trim(),
    line3: line3Input.value.trim(),
    author: authorInput.value.trim()
  };

  if (!haikuData.line1 && !haikuData.line2 && !haikuData.line3) {
    alert('俳句を入力してください');
    return;
  }

  drawTanzaku();
  syncUrlWithState();
  inputSection.classList.add('hidden');
  previewSection.classList.remove('hidden');
  shareSection.classList.remove('hidden');
  
  // Scroll to preview
  previewSection.scrollIntoView({ behavior: 'smooth' });
});

// Back button click
backBtn.addEventListener('click', () => {
  previewSection.classList.add('hidden');
  shareSection.classList.add('hidden');
  inputSection.classList.remove('hidden');
  
  inputSection.scrollIntoView({ behavior: 'smooth' });
});

// Color selection
colorBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    setActiveColor(btn.dataset.color);
    drawTanzaku();
    if (!previewSection.classList.contains('hidden')) {
      syncUrlWithState();
    }
  });
});

// Download button
downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = `haiku-tanzaku-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
});

// Restart button
restartBtn.addEventListener('click', () => {
  line1Input.value = '';
  line2Input.value = '';
  line3Input.value = '';
  authorInput.value = '';
  count1.textContent = '0文字';
  count2.textContent = '0文字';
  count3.textContent = '0文字';
  
  previewSection.classList.add('hidden');
  shareSection.classList.add('hidden');
  inputSection.classList.remove('hidden');
  setActiveColor('#f5e6d3');
  currentColor = '#f5e6d3';
  haikuData = { line1: '', line2: '', line3: '', author: '' };
  window.history.replaceState({}, '', window.location.pathname);
  
  inputSection.scrollIntoView({ behavior: 'smooth' });
});

// Draw Tanzaku
function drawTanzaku() {
  const width = 400;
  const height = 700;
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Background
  ctx.fillStyle = currentColor;
  ctx.fillRect(0, 0, width, height);
  
  // Border decoration
  const isDark = isColorDark(currentColor);
  const borderColor = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)';
  const accentColor = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(139,69,19,0.3)';
  
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(15, 15, width - 30, height - 30);
  
  // Inner decorative border
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1;
  ctx.strokeRect(25, 25, width - 50, height - 50);
  
  // Top decoration (simple line pattern)
  ctx.beginPath();
  ctx.moveTo(50, 50);
  ctx.lineTo(width - 50, 50);
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Bottom decoration
  ctx.beginPath();
  ctx.moveTo(50, height - 50);
  ctx.lineTo(width - 50, height - 50);
  ctx.stroke();
  
  // Text settings
  const textColor = isDark ? '#ffffff' : '#2d2d2d';
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Combine haiku lines
  const fullHaiku = haikuData.line1 + haikuData.line2 + haikuData.line3;
  
  // Calculate font size based on text length
  let fontSize = 48;
  if (fullHaiku.length > 20) {
    fontSize = 42;
  }
  if (fullHaiku.length > 25) {
    fontSize = 36;
  }
  
  ctx.font = `${fontSize}px "Noto Serif JP", serif`;
  
  // Draw vertical text (縦書き)
  const chars = fullHaiku.split('');
  const lineHeight = fontSize * 1.4;
  const startY = 100;
  const centerX = width / 2;
  
  // Calculate total height needed
  const totalHeight = chars.length * lineHeight;
  const maxHeight = height - 200; // Leave space for author
  
  // Adjust line height if text is too long
  const adjustedLineHeight = totalHeight > maxHeight ? maxHeight / chars.length : lineHeight;
  
  chars.forEach((char, index) => {
    const y = startY + (index * adjustedLineHeight);
    
    // Handle special characters that need rotation for vertical writing
    if (isSmallChar(char)) {
      ctx.font = `${fontSize * 0.7}px "Noto Serif JP", serif`;
      ctx.fillText(char, centerX + fontSize * 0.15, y);
      ctx.font = `${fontSize}px "Noto Serif JP", serif`;
    } else if (isPunctuation(char)) {
      ctx.fillText(char, centerX + fontSize * 0.3, y - fontSize * 0.3);
    } else {
      ctx.fillText(char, centerX, y);
    }
  });
  
  // Author name
  if (haikuData.author) {
    ctx.font = `24px "Noto Serif JP", serif`;
    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)';
    
    const authorChars = haikuData.author.split('');
    const authorStartY = height - 150;
    const authorX = width - 60;
    
    authorChars.forEach((char, index) => {
      ctx.fillText(char, authorX, authorStartY + (index * 30));
    });
  }
  
  // Decorative stamp effect (印鑑風)
  if (haikuData.author) {
    const stampX = width - 60;
    const stampY = height - 80;
    
    ctx.strokeStyle = isDark ? 'rgba(255,100,100,0.6)' : 'rgba(180,50,50,0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(stampX, stampY, 20, 0, Math.PI * 2);
    ctx.stroke();
    
    // First character of author name in stamp
    ctx.fillStyle = isDark ? 'rgba(255,100,100,0.6)' : 'rgba(180,50,50,0.5)';
    ctx.font = `16px "Noto Serif JP", serif`;
    ctx.fillText(haikuData.author.charAt(0), stampX, stampY);
  }
}

// Helper functions
function isColorDark(color) {
  // Convert hex to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}

function isSmallChar(char) {
  const smallChars = 'ぁぃぅぇぉっゃゅょゎァィゥェォッャュョヮ';
  return smallChars.includes(char);
}

function isPunctuation(char) {
  const punctuation = '、。！？・…';
  return punctuation.includes(char);
}

// SNS Share links
document.getElementById('twitter-share').addEventListener('click', (e) => {
  e.preventDefault();
  const haiku = `${haikuData.line1} ${haikuData.line2} ${haikuData.line3}`;
  const text = encodeURIComponent(`${haiku}\n\n#俳句 #haiku #俳句短冊メーカー`);
  const url = encodeURIComponent(buildShareUrl());
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
});

document.getElementById('line-share').addEventListener('click', (e) => {
  e.preventDefault();
  const haiku = `${haikuData.line1} ${haikuData.line2} ${haikuData.line3}`;
  const text = encodeURIComponent(haiku);
  const url = encodeURIComponent(buildShareUrl());
  window.open(`https://social-plugins.line.me/lineit/share?text=${text}&url=${url}`, '_blank');
});

document.getElementById('facebook-share').addEventListener('click', (e) => {
  e.preventDefault();
  window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(buildShareUrl()), '_blank');
});

// Font loading check - redraw when font is loaded
document.fonts.ready.then(() => {
  if (!previewSection.classList.contains('hidden')) {
    drawTanzaku();
  }
});

initializeFromQuery();
