const form = document.getElementById("dailyForm");
const toggle = document.getElementById("themeToggle");
const overlay = document.createElement("div");

overlay.id = "overlay";
overlay.innerHTML = `
  <div class="spinner"></div>
  <div class="checkmark">✔</div>
`;
document.body.appendChild(overlay);

toggle.addEventListener("change", () => {
  document.body.classList.toggle("dark");
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  const targets = data.get("T").trim().split("\n").filter(Boolean).map(t => `* ${t}`).join("\n");
  const extracurriculars = data.get("exc").trim().split("\n").filter(Boolean).map(e => `* ${e}`).join("\n");

  const message = `
Good morning sir!

🌃 Yesterday I slept at ${data.get("st")}
🌇 Today I woke up at ${data.get("wt")}

🎯Today's targets:
${targets || '* None'}

🎵Extracurriculars:
${extracurriculars || '* None'}

\`\`\`
Yesterday ${data.get("pdp")} a productive day for me.
${data.get("pdc")}
\`\`\`

${data.get("comments") || ''}
`;

  const chatId = "7950461357";
  const token = "8166409334:AAHeuZQx_d6aTsOc3lZeM7-yblvAfGv7rQo";

  overlay.classList.add("visible");

  try {
    // Send text message first
    const sendMessageRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown"
      })
    });

    if (!sendMessageRes.ok) throw new Error("Failed to send text");

    // If PDF is attached, send it too
    const file = data.get("attachment");
    if (file && file.type === "application/pdf") {
      const fileData = new FormData();
      fileData.append("chat_id", chatId);
      fileData.append("document", file);

      const docRes = await fetch(`https://api.telegram.org/bot${token}/sendDocument`, {
        method: "POST",
        body: fileData
      });

      if (!docRes.ok) throw new Error("Failed to send PDF");
    }

    // Show checkmark
    overlay.classList.remove("loading");
    overlay.classList.add("success");

    setTimeout(() => {
      overlay.classList.remove("visible", "success");
      form.reset();
    }, 2000);

  } catch (err) {
    console.error(err);
    alert("Failed to send message. Please try again.");
    overlay.classList.remove("visible");
  }
});
