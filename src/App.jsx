import { useEffect, useMemo, useState } from "react";
import "./App.css";

function App() {
  const [verses, setVerses] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [selectedVerse, setSelectedVerse] = useState(1);
  const [fontScale, setFontScale] = useState(1);

  useEffect(() => {
    fetch("/data/john.json")
      .then((response) => response.json())
      .then((data) => {
        setVerses(data);
      });
  }, []);

  const chapters = useMemo(() => {
    return [...new Set(verses.map((verse) => verse.chapter))];
  }, [verses]);

  const chapterVerses = useMemo(() => {
    return verses.filter((verse) => verse.chapter === selectedChapter);
  }, [selectedChapter, verses]);

  useEffect(() => {
    if (!chapterVerses.length) {
      return;
    }

    const hasSelectedVerse = chapterVerses.some(
      (verse) => verse.verse === selectedVerse,
    );

    if (!hasSelectedVerse) {
      setSelectedVerse(chapterVerses[0].verse);
    }
  }, [chapterVerses, selectedVerse]);

  if (!verses.length) {
    return <p>Loading...</p>;
  }

  return (
    <main
      className="app"
      style={{
        "--reader-font-scale": fontScale,
      }}
    >
      <header className="page-header">
        <p className="eyebrow">Parallel Gospel Reader</p>
        <h1>Gospel of Saint John</h1>
      </header>

      <div className="reader-controls">
        <label className="control-group">
          <span>Chapter</span>
          <select
            className="reader-select"
            value={selectedChapter}
            onChange={(event) => {
              setSelectedChapter(Number(event.target.value));
            }}
          >
            {chapters.map((chapter) => (
              <option key={chapter} value={chapter}>
                John {chapter}
              </option>
            ))}
          </select>
        </label>

        <label className="control-group">
          <span>Jump to verse</span>
          <select
            className="reader-select"
            value={selectedVerse}
            onChange={(event) => {
              const verseNumber = Number(event.target.value);
              setSelectedVerse(verseNumber);
              document
                .getElementById(`verse-${selectedChapter}-${verseNumber}`)
                ?.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
          >
            {chapterVerses.map((verse) => (
              <option key={verse.verse} value={verse.verse}>
                John {selectedChapter}:{verse.verse}
              </option>
            ))}
          </select>
        </label>

        <div className="control-group text-size-group">
          <span>Text size</span>
          <div className="size-buttons" role="group" aria-label="Text size controls">
            <button
              type="button"
              className="size-button"
              onClick={() => {
                setFontScale((currentScale) => Math.max(0.85, currentScale - 0.1));
              }}
            >
              -
            </button>
            <button
              type="button"
              className="size-button"
              onClick={() => {
                setFontScale((currentScale) => Math.min(1.5, currentScale + 0.1));
              }}
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="columns">
        <section className="text-column">
          <h2>Greek</h2>
          <div className="chapter-text">
            {chapterVerses.map((verse) => (
              <article
                key={`greek-${verse.verse}`}
                id={`verse-${verse.chapter}-${verse.verse}`}
                className={`verse-row ${selectedVerse === verse.verse ? "is-target" : ""}`}
              >
                <span className="verse-number">{verse.verse}</span>
                <p className="verse greek-text">{verse.greek || "—"}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="text-column">
          <h2>Latin</h2>
          <div className="chapter-text">
            {chapterVerses.map((verse) => (
              <article
                key={`latin-${verse.verse}`}
                className={`verse-row ${selectedVerse === verse.verse ? "is-target" : ""}`}
              >
                <span className="verse-number">{verse.verse}</span>
                <p className="verse latin-text">{verse.latin || "—"}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="text-column">
          <h2>Spanish</h2>
          <div className="chapter-text">
            {chapterVerses.map((verse) => (
              <article
                key={`spanish-${verse.verse}`}
                className={`verse-row ${selectedVerse === verse.verse ? "is-target" : ""}`}
              >
                <span className="verse-number">{verse.verse}</span>
                <p className="verse spanish-text">{verse.spanish || "—"}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
