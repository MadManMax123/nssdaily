document.getElementById("themeToggle").addEventListener("change", function () {
  document.body.classList.toggle("dark");
});

document.getElementById("dailyForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const data = new FormData(form);

  const targets = data.get("T").split('\n').map(t => `* ${t}`).join('\n');
  const extracurriculars = data.get("exc").split('\n').map(e => `* ${e}`).join('\n');

  const message = `
Good morning sir!

🌃 Yesterday I slept at ${data.get("st")}
🌇 Today I woke up at ${data.get("wt")}

🎯Today's targets:
${targets}

🎵Extracurriculars:
${extracurriculars}

\`\`\`
Yesterday ${data.get("pdp")} a productive day for me.
${data.get("pdc")}
\`\`\`

${data.get("comments")}
`;

  const payload = new FormData();
  payload.append("message", message);
  payload.append("attachment", data.get("attachment"));

  // Replace this Zapier webhook with yours
  await fetch("https://hooks.zapier.com/hooks/catch/14350637/2nctk7b/", {
    method: "POST",
    body: payload
  });

  alert("Submitted!");
  form.reset();
});
