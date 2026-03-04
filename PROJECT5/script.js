const insert = document.getElementById("insert");

window.addEventListener("keydown", (event) => {
  insert.innerHTML = `
    <div class="key-data">
      <strong>Key:</strong> ${event.key === " " ? "Space" : event.key}
    </div>
    <div class="key-data">
      <strong>Key Code:</strong> ${event.keyCode}
    </div>
    <div class="key-data">
      <strong>Code:</strong> ${event.code}
    </div>
  `;
});
