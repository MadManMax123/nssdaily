document.getElementById("themeToggle").addEventListener("change", function () {
  document.body.classList.toggle("dark");
});

document.getElementById("dailyForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const data = new FormData(form);

  const targets = data.get("T").trim().split('\n').filter(t => t).map(t => `* ${t}`).join('\n');
  const extracurriculars = data.get("exc").trim().split('\n').filter(e => e).map(e => `* ${e}`).join('\n');

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

  try {
    // Send formatted message
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown"
      })
    });

    // If PDF is attached, upload it
    const file = data.get("attachment");
    if (file && file.name && file.type === "application/pdf") {
      const fileData = new FormData();
      fileData.append("chat_id", chatId);
      fileData.append("document", file);
      await fetch(`https://api.telegram.org/bot${token}/sendDocument`, {
        method: "POST",
        body: fileData
      });
    }

    alert("Report successfully submitted to Telegram!");
    form.reset();

  } catch (err) {
    console.error("Telegram API error:", err);
    alert("Failed to send message. Please try again.");
  }
});
