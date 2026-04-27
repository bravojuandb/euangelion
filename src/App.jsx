import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [verses, setVerses] = useState([]);
  const [selectedVerse, setSelectedVerse] = useState(null);

  useEffect(() => {
    fetch("/data/john.json")
      .then((response) => response.json())
      .then((data) => {
        setVerses(data);
        setSelectedVerse(data[0]);
      });
  }, []);

  if (!selectedVerse) {
    return <p>Loading...</p>;
  }

  return (
    <main className="app">
      <h1>Gospel of Saint John</h1>

      <select
        value={selectedVerse.verse}
        onChange={(event) => {
          const verse = verses.find(
            (v) => v.verse === Number(event.target.value)
          );
          setSelectedVerse(verse);
        }}
      >
        {verses.map((v) => (
          <option key={v.verse} value={v.verse}>
            John {v.chapter}:{v.verse}
          </option>
        ))}
      </select>

      <div className="columns">
        <section>
          <h2>Greek</h2>
          <p>{selectedVerse.greek}</p>
        </section>

        <section>
          <h2>Latin</h2>
          <p>{selectedVerse.latin}</p>
        </section>

        <section>
          <h2>Spanish</h2>
          <p>{selectedVerse.spanish}</p>
        </section>
      </div>
    </main>
  );
}

export default App;