
import React, { useState } from 'react';
import { Textarea } from './components/ui/textarea';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { Switch } from './components/ui/switch';
import { Sun, Moon } from 'lucide-react';

export default function App() {
  const [formData, setFormData] = useState({
    dt: '', st: '', wt: '', T: [''], exc: [''], pdp: false, pdc: '', comments: '', file: null
  });
  const [darkMode, setDarkMode] = useState(false);

  const handleArrayChange = (field, index, value) => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData({ ...formData, [field]: updated });
  };

  const addField = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  const formattedMessage = `Good morning sir!\n\n🌃 Yesterday I slept at ${formData.st}\n🌇 Today I woke up at ${formData.wt}\n\n🎯Today's targets:\n${formData.T.map(t => `* ${t}`).join('\n')}\n\n🎵 Extracurriculars:\n${formData.exc.map(e => `* ${e}`).join('\n')}\n\n\`\`\nYesterday ${formData.pdp ? 'was' : 'was not'} a productive day for me.\n${formData.pdc}\n\`\`\n\n${formData.comments}`;

  const data = new FormData();
  data.append('message', formattedMessage);
  if (formData.file) data.append('attachment', formData.file);

  // Send the message to Telegram
  fetch(`https://api.telegram.org/bot8166409334:AAHeuZQx_d6aTsOc3lZeM7-yblvAfGv7rQo/sendMessage?chat_id=7950461357&text=${encodeURIComponent(formattedMessage)}`, {
    method: 'GET',
  })
  .then(res => res.json())
  .then(response => {
    if (response.ok) {
      alert('Message sent to Telegram!');
    } else {
      alert('Error sending message');
    }
  })
  .catch(err => alert('Error sending message to Telegram'));
};


    fetch('https://formspree.io/f/xdkgdvgq', {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' },
    }).then(res => alert('Submitted!')).catch(err => alert('Error'));
  };

  return (
    <div style={{ 
      backgroundColor: darkMode ? 'black' : 'white',
      color: darkMode ? 'white' : 'black',
      backgroundImage: 'url(bg.png)', 
      backgroundSize: 'cover', 
      minHeight: '100vh', 
      padding: '2rem' 
    }}>
      <img src="logo.png" alt="logo" style={{ position: 'fixed', bottom: '4rem', right: '4rem', width: '48px', height: '48px', opacity: 0.7 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Daily Log</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sun />
          <Switch checked={darkMode} onCheckedChange={() => setDarkMode(!darkMode)} />
          <Moon />
        </div>
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
        <Input type="date" value={formData.dt} onChange={e => setFormData({ ...formData, dt: e.target.value })} />
        <Input placeholder="Sleep Time" value={formData.st} onChange={e => setFormData({ ...formData, st: e.target.value })} />
        <Input placeholder="Wakeup Time" value={formData.wt} onChange={e => setFormData({ ...formData, wt: e.target.value })} />

        <label style={{ fontWeight: '600' }}>Targets:</label>
        {formData.T.map((t, i) => (
          <Input key={i} placeholder={`Target ${i + 1}`} value={t} onChange={e => handleArrayChange('T', i, e.target.value)} />
        ))}
        <Button type="button" onClick={() => addField('T')}>Add Target</Button>

        <label style={{ fontWeight: '600' }}>Extracurriculars:</label>
        {formData.exc.map((ex, i) => (
          <Input key={i} placeholder={`Activity ${i + 1}`} value={ex} onChange={e => handleArrayChange('exc', i, e.target.value)} />
        ))}
        <Button type="button" onClick={() => addField('exc')}>Add Activity</Button>

        <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span>Was yesterday productive?</span>
          <input type="checkbox" checked={formData.pdp} onChange={e => setFormData({ ...formData, pdp: e.target.checked })} />
        </label>

        <Textarea placeholder="Previous Day Completion" value={formData.pdc} onChange={e => setFormData({ ...formData, pdc: e.target.value })} />
        <Textarea placeholder="Comments" value={formData.comments} onChange={e => setFormData({ ...formData, comments: e.target.value })} />

        <Input type="file" accept="application/pdf" onChange={e => setFormData({ ...formData, file: e.target.files[0] })} />

        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
