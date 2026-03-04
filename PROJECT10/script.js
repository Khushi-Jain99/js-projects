const emojiBox = document.getElementById("emoji");
const btn = document.getElementById("change");
const copyBtn = document.getElementById("copy");
const countDisplay = document.getElementById("count");
const historyDisplay = document.getElementById("history");

const emojis = [
  "😀", "😂", "😍", "😎", "🤩", "😜", "🥳", "😭", "😡", "😇",
  "🤖", "👻", "🔥", "💖", "🚀", "⭐", "🎉", "🎨", "🎭", "🎪",
  "🎸", "🎺", "🎻", "📚", "📖", "🖊️", "✏️", "🎓", "🏆", "🥇",
  "🏅", "🎯", "🎲", "🃏", "🎰", "🧩", "🎮", "🕹️", "⚽", "🏀",
  "🏈", "⚾", "🎾", "🏐", "🏉", "🥎", "🎳", "🏓", "⛳", "🚴",
  "🏊", "🏄", "🎿", "⛷️", "🏂", "🤿", "🌍", "🌎", "🌏", "🌟",
  "💫", "✨", "⚡", "☄️", "💥", "🌅", "🌄", "🌠", "🎆", "🎇",
  "🌈", "☀️", "🌤️", "⛅", "🌥️", "☁️", "🌦️", "🌧️", "⛈️", "🌩️",
  "🌨️", "❄️", "☃️", "⛄", "🌬️", "💨", "💧", "💦", "☔", "🍏",
  "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈", "🍒",
  "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆", "🥑", "🥦", "🥬",
  "🥒", "🌶️", "🌽", "🥕", "🧄", "🧅", "🥔", "🍠", "🥐", "🍞"
];

let changeCount = 0;
let lastEmoji = null;
let recentEmojis = [];

function getRandomEmoji() {
  let emoji;
  do {
    emoji = emojis[Math.floor(Math.random() * emojis.length)];
  } while (emoji === lastEmoji && emojis.length > 1);
  return emoji;
}

function updateEmoji() {
  const newEmoji = getRandomEmoji();
  emojiBox.textContent = newEmoji;
  lastEmoji = newEmoji;
  changeCount++;
  countDisplay.textContent = changeCount;
  
  // Add to recent emojis
  recentEmojis.unshift(newEmoji);
  if (recentEmojis.length > 10) recentEmojis.pop();
  historyDisplay.textContent = recentEmojis.join(" ");
  
  // Animation
  emojiBox.classList.remove("animate");
  void emojiBox.offsetWidth; // Trigger reflow
  emojiBox.classList.add("animate");
}

btn.addEventListener("click", updateEmoji);

emojiBox.addEventListener("click", updateEmoji);

copyBtn.addEventListener("click", () => {
  const emoji = emojiBox.textContent;
  navigator.clipboard.writeText(emoji).then(() => {
    const originalText = copyBtn.textContent;
    copyBtn.textContent = "✅ Copied!";
    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 1500);
  });
});

// Keyboard support
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.key === " ") {
    e.preventDefault();
    updateEmoji();
  }
});