import './index.css'
import { useState, useEffect } from 'react';

interface Item {
  id: number;
  name: string;
}

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [source, setSource] = useState<string>("");
  const [events, setEvents] = useState([]);

  const [showItems, setShowItems] = useState(false);
  const [showEvents, setShowEvents] = useState(false);

  function toggleItems() {
    setShowItems(prev => !prev);
    if (!showItems) {
      fetch("http://localhost:3001/api/items")
        .then(res => res.json())
        .then(json => setItems(json.data));
    }
  }

  function toggleEvents() {
    setShowEvents(prev => !prev);
    if (!showEvents) {
      fetch("http://localhost:3001/api/events")
        .then(res => res.json())
        .then(json => setEvents(json.data));
    }
  }

  useEffect(() => {
    fetch("http://localhost:3001/api/items")
      .then(res => res.json())
      .then(json => {
        setItems(json.data);
        setSource(json.source);
      })
      .catch(() => {
        setItems([]);
        setSource("error");
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Data Pull ({source})</h1>

      <button onClick={toggleItems}>
        {showItems ? "Hide Items" : "Show Items"}
      </button>

      <button onClick={toggleEvents}>
        {showEvents ? "Hide Events" : "Show Events"}
      </button>

      {showItems && (
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

      {showEvents && (
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