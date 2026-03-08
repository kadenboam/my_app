import { useState } from "react";
import './index.css'

interface Item {
  id: number;
  name: string;
  type: string;
  rarity: string;
}

interface Event {
  id: number;
  name: string;
  type: string;
  impact: string;
}

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [activeTable, setActiveTable] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const tableFetchers: Record<string, () => Promise<void>> = {
    items: async () => {
      const res = await fetch("http://localhost:3001/api/items");
      const json = await res.json();
      setItems(json.data);
      setActiveTable("items");
    },
    events: async () => {
      const res = await fetch("http://localhost:3001/api/events");
      const json = await res.json();
      setEvents(json.data);
      setActiveTable("events");
    }
  };

  function handleSearch() {
    const key = search.toLowerCase().trim();

    if (tableFetchers[key]) {
      setError("");
      tableFetchers[key]();
    } else {
      setActiveTable(null);
      setError(`No table found matching "${search}"`);
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Table Viewer</h1>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search for a table..."
      />

      <button onClick={handleSearch}>Search</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {activeTable === "items" && (
        <div>
          <h2>Items</h2>
          <ul>
            {items.map(i => (
              <li key={i.id}>
                {i.name} — {i.type} — {i.rarity}
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTable === "events" && (
        <div>
          <h2>Events</h2>
          <ul>
            {events.map(e => (
              <li key={e.id}>
                {e.name} — {e.type} — {e.impact}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;