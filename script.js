const form = document.getElementById("dailyForm");
const toggle = document.getElementById("themeToggle");
const overlay = document.createElement("div");

overlay.id = "overlay";
overlay.innerHTML = `
  <div class="spinner"></div>
  <div class="checkmark">✔</div>
`;
document.body.appendChild(overlay);

// Escape Markdown characters
function escapeMarkdown(text) {
  return text.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1');
}

toggle.addEventListener("change", () => {
  document.body.classList.toggle("dark");
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  const targets = escapeMarkdown(data.get("T").trim())
    .split("\n").filter(Boolean).map(t => `* ${t}`).join("\n");
  const extracurriculars = escapeMarkdown(data.get("exc").trim())
    .split("\n").filter(Boolean).map(e => `* ${e}`).join("\n");

  const message = `
Good morning sir!

🌃 Yesterday I slept at ${escapeMarkdown(data.get("st"))}
🌇 Today I woke up at ${escapeMarkdown(data.get("wt"))}

🎯Today's targets:
${targets || '* None'}

🎵Extracurriculars:
${extracurriculars || '* None'}

\`\`\`
Yesterday ${escapeMarkdown(data.get("pdp"))} a productive day for me.
${escapeMarkdown(data.get("pdc"))}
\`\`\`

${escapeMarkdown(data.get("comments") || '')}
`;

  const chatId = "7950461357";
  const token = "8166409334:AAHeuZQx_d6aTsOc3lZeM7-yblvAfGv7rQo";

  overlay.classList.add("visible");

  try {
    const sendMessageRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "MarkdownV2"  // More strict than Markdown
      })
    });

    const sendMessageJson = await sendMessageRes.json();
    if (!sendMessageRes.ok) {
      throw new Error(`sendMessage error: ${sendMessageJson.description}`);
    }

    const file = data.get("attachment");
    if (file && file.type === "application/pdf") {
      const fileData = new FormData();
      fileData.append("chat_id", chatId);
      fileData.append("document", file);

      const docRes = await fetch(`https://api.telegram.org/bot${token}/sendDocument`, {
        method: "POST",
        body: fileData
      });

      const docJson = await docRes.json();
      if (!docRes.ok) {
        throw new Error(`sendDocument error: ${docJson.description}`);
      }
    }

    overlay.classList.remove("loading");
    overlay.classList.add("success");
    setTimeout(() => {
      overlay.classList.remove("visible", "success");
      form.reset();
    }, 2000);

  } catch (err) {
    console.error("Telegram error:", err.message);
    alert("Error: " + err.message);
    overlay.classList.remove("visible");
  }
});
