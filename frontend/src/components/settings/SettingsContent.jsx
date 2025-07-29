import { useState } from 'react';

function SettingsContent({ settingsData }) {
  const categories = settingsData?.message?.engine || [];
  const [selectedCategory, setSelectedCategory] = useState(categories[0] || null);

  // Fallback UI for missing or empty categories
  if (!settingsData) {
    return <div style={{ padding: 32, color: 'red', fontWeight: 600 }}>No settings data received from API.</div>;
  }
  if (!Array.isArray(categories) || categories.length === 0) {
    return <div style={{ padding: 32, color: 'orange', fontWeight: 600 }}>No categories found in settings data.<br/>Raw data: <pre style={{ color: '#333', background: '#fafafa', padding: 8, borderRadius: 4 }}>{JSON.stringify(settingsData, null, 2)}</pre></div>;
  }

  return (
   <></>
  );
}

export default SettingsContent; 