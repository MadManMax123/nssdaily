const form = document.getElementById("dailyForm");
const toggle = document.getElementById("themeToggle");
const overlay = document.createElement("div");

overlay.id = "overlay";
overlay.innerHTML = `
  <div class="spinner"></div>
  <div class="checkmark">✔</div>
`;
document.body.appendChild(overlay);

// Escape MarkdownV2 characters (and also remove '!')
function escapeMarkdownV2(text) {
  // Remove exclamation mark and escape other necessary characters
  return text.replace(/!/g, '').replace(/([_*[\]()~`>#+\-=|{}])/g, '\\$1');
}

toggle.addEventListener("change", () => {
  document.body.classList.toggle("dark");
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  const targets = escapeMarkdownV2(data.get("T").trim())
    .split("\n").filter(Boolean).map(t => `* ${t}`).join("\n");
  const extracurriculars = escapeMarkdownV2(data.get("exc").trim())
    .split("\n").filter(Boolean).map(e => `* ${e}`).join("\n");

  const message = `
Good morning sir!

🌃 Yesterday I slept at ${escapeMarkdownV2(data.get("st"))}
🌇 Today I woke up at ${escapeMarkdownV2(data.get("wt"))}

🎯Today's targets:
${targets || '* None'}

🎵Extracurriculars:
${extracurriculars || '* None'}

\`\`\`
Yesterday ${escapeMarkdownV2(data.get("pdp"))} a productive day for me.
${escapeMarkdownV2(data.get("pdc"))}
\`\`\`

${escapeMarkdownV2(data.get("comments") || '')}
`;

  const chatId = "7950461357";
  const token = "8166409334:AAHeuZQx_d6aTsOc3lZeM7-yblvAfGv7rQo";

  overlay.classList.add("visible");

  try {
    console.log("Sending the following message to Telegram:", message);  // Debugging the message

    const sendMessageRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "MarkdownV2"  // Using MarkdownV2 for stricter escaping
      })
    });

    const sendMessageJson = await sendMessageRes.json();
    if (!sendMessageRes.ok) {
      throw new Error(`sendMessage error: ${sendMessageJson.description} (Error Code: ${sendMessageJson.error_code})`);
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
        throw new Error(`sendDocument error: ${docJson.description} (Error Code: ${docJson.error_code})`);
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
