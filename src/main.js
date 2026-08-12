import "./style.css";
import { getWordData } from "./dictionary-api.js";
import { getRelatedWords } from "./datamuse-api.js";
import {
  getSavedWords,
  saveWord,
  removeSavedWord,
  isWordSaved,
} from "./saved-words-storage.js";
import levelUpLogo from "./assets/level-up-logo.webp";

const app = document.querySelector("#app");

app.innerHTML = `
  <header class="site-header" id="top">
    <a href="#top" class="site-brand">
  <img
    src="${levelUpLogo}"
    alt="Level Up English Institute logo"
    class="site-brand-logo"
  />
  <div class="site-brand-text">
    <span class="site-brand-title">Level Up</span>
    <span class="site-brand-subtitle">Vocabulary Lab</span>
  </div>
</a>

    <nav class="main-navigation" aria-label="Primary navigation">
      <a href="#search">Search</a>
      <a href="#practice">Practice</a>
      <a href="#saved">Saved Words</a>
    </nav>
  </header>

  <main>
    <section class="hero-section" id="search">
      <div class="hero-content">
        <p class="eyebrow">Learn one word at a time</p>

        <h1>Build your English vocabulary</h1>

        <p class="hero-description">
          Search for an English word and discover its meaning,
          pronunciation, part of speech, and example sentences.
        </p>

        <form class="search-form" id="search-form" role="search">
          <label for="word-input">Enter an English word</label>

          <div class="search-controls">
            <input
              id="word-input"
              name="word"
              type="search"
              placeholder="Example: level up"
              autocomplete="off"
              required
            />

            <button type="submit">Search Word</button>
          </div>

          <p class="form-help">
            Start with a word or phrase such as level up, happy, good, or practice.
          </p>
        </form>
      </div>

      <aside class="hero-card" aria-label="Vocabulary learning steps">
        <span class="hero-card-label">Vocabulary Mission</span>

        <h2>Search. Understand. Practice.</h2>

        <ol>
          <li>Search for a word.</li>
          <li>Read its definition.</li>
          <li>Listen to its pronunciation.</li>
          <li>Practice using the word.</li>
        </ol>
      </aside>
    </section>

    <section
      class="results-section"
      id="results"
      aria-live="polite"
      aria-labelledby="results-title"
    >
      <div class="empty-result">
        <span class="result-icon" aria-hidden="true">Aa</span>

        <div>
          <h2 id="results-title">Your vocabulary result will appear here</h2>

          <p>
            Enter an English word in the search box to begin.
          </p>
        </div>
      </div>
    </section>

    <section class="features-section" id="practice">
      <div class="section-heading">
        <p class="eyebrow">Vocabulary tools</p>
        <h2>Learn vocabulary step by step</h2>
      </div>

      <div class="feature-grid">
        <article class="feature-card">
          <span class="feature-number">01</span>
          <h3>Understand</h3>
          <p>
            Read clear definitions and identify the part of speech.
          </p>
        </article>

        <article class="feature-card">
          <span class="feature-number">02</span>
          <h3>Listen</h3>
          <p>
            Hear the pronunciation when audio is available.
          </p>
        </article>

        <article class="feature-card">
          <span class="feature-number">03</span>
          <h3>Practice</h3>
          <p>
            Review examples and use each word in a sentence.
          </p>
        </article>
      </div>
    </section>

    <section class="saved-section" id="saved">
      <div>
        <p class="eyebrow">Personal word collection</p>
        <h2>Saved Words</h2>
        <p>
          Words saved for future practice will appear in this section.
        </p>
      </div>

      <span class="saved-count" id="saved-count">0 words saved</span>
    </section>

    <div
      class="saved-words-list"
      id="saved-words-list"
      aria-live="polite"
    >
    </div>

<section class="level-up-cta">
  <p class="eyebrow">Ready to start?</p>

  <h2>Study English online with Level Up</h2>

  <p>
    Keep growing your vocabulary and join our live online English classes for
    children, teens, university students, and adults.
  </p>

  <a
    class="level-up-cta-button"
    href="https://rosapos.github.io/wdd231/project/index.html"
    target="_blank"
    rel="noopener noreferrer"
  >
    Visit Level Up English Institute
  </a>
</section>
</main>

  <footer class="site-footer">
  <p>
    Level Up Vocabulary Lab - Learn, practice, and grow.
  </p>

  <p class="api-credit">
    Dictionary data provided by
    <a
      href="https://dictionaryapi.dev/"
      target="_blank"
      rel="noopener noreferrer"
    >
      Free Dictionary API
    </a>.
  </p>
</footer>
`;

const searchForm = document.querySelector("#search-form");
const resultsSection = document.querySelector("#results");

const savedCount = document.querySelector("#saved-count");
const savedWordsList = document.querySelector("#saved-words-list");

function renderSavedWords() {
  const savedWords = getSavedWords();

  savedCount.textContent =
    `${savedWords.length} ${savedWords.length === 1 ? "word" : "words"} saved`;

  savedWordsList.innerHTML = "";

  if (savedWords.length === 0) {
    const emptyMessage = document.createElement("p");

    emptyMessage.className = "saved-empty";
    emptyMessage.textContent =
      "No saved words yet. Search for a word and save it for later practice.";

    savedWordsList.append(emptyMessage);

    return;
  }

  savedWords.forEach((savedWord) => {
    const card = document.createElement("article");
    card.className = "saved-word-card";

    const title = document.createElement("h3");
    title.textContent = savedWord.word;

    const meta = document.createElement("p");
    meta.className = "saved-word-meta";
    meta.textContent =
      `${savedWord.partOfSpeech} · ${savedWord.phonetic}`;

    const definition = document.createElement("p");
    definition.textContent = savedWord.definition;

    const example = document.createElement("p");
    example.className = "saved-word-example";
    example.textContent = `Example: ${savedWord.example}`;

    const removeButton = document.createElement("button");
    removeButton.className = "remove-saved-button";
    removeButton.type = "button";
    removeButton.textContent = "Remove";

    removeButton.addEventListener("click", () => {
      removeSavedWord(savedWord.word);
      renderSavedWords();
    });

    card.append(
      title,
      meta,
      definition,
      example,
      removeButton,
    );

    savedWordsList.append(card);
  });
}

renderSavedWords();

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  function extractWordInfo(entry) {
    const firstMeaning = entry.meanings?.[0];
    const firstDefinition = firstMeaning?.definitions?.[0];

    const phonetic =
      entry.phonetic ||
      entry.phonetics?.find((item) => item.text)?.text ||
      "Pronunciation not available";

    const audio =
      entry.phonetics?.find((item) => item.audio)?.audio || "";

    const synonyms = [
      ...new Set(
        entry.meanings?.flatMap((meaning) => meaning.synonyms ?? []) ?? [],
      ),
    ].slice(0, 5);

    const antonyms = [
      ...new Set(
        entry.meanings?.flatMap((meaning) => meaning.antonyms ?? []) ?? [],
      ),
    ].slice(0, 5);

    return {
      word: entry.word || "Unknown word",
      phonetic,
      audio,
      partOfSpeech:
        firstMeaning?.partOfSpeech || "Part of speech not available",
      definition:
        firstDefinition?.definition || "Definition not available",
      example:
        firstDefinition?.example || "Example not available",
      synonyms,
      antonyms,
    };
  }

  const formData = new FormData(searchForm);
  const word = String(formData.get("word") ?? "");

  resultsSection.innerHTML = `
    <div class="empty-result">
      <span class="result-icon" aria-hidden="true">...</span>

      <div>
        <h2 id="results-title">Searching...</h2>

        <p>
          Connecting to the dictionary service.
        </p>
      </div>
    </div>
  `;

  try {
    const data = await getWordData(word);
    const entry = data[0];
    const wordInfo = extractWordInfo(entry);

    let relatedWords = [];

    try {
      const relatedData = await getRelatedWords(word);

      relatedWords = relatedData
        .map((item) => item.word)
        .filter(
          (relatedWord) =>
            relatedWord.toLowerCase() !== wordInfo.word.toLowerCase(),
        )
        .slice(0, 8);
    } catch {
      relatedWords = [];
    }

    resultsSection.innerHTML = `
    <article class="word-result">
      <div class="word-result-header">
        <div>
          <p class="eyebrow">Dictionary result</p>
          <h2 id="results-title"></h2>
          <p id="result-phonetic"></p>
        </div>

        <div class="word-result-meta">
          <span id="result-part-of-speech"></span>

          <button
            class="audio-button"
            id="play-audio-button"
            type="button"
          >
            Listen
          </button>

          <button
            class="save-word-button"
            id="save-word-button"
            type="button"
          >
            Save Word
          </button>

        </div>
      </div>

      <div class="word-result-body">
        <h3>Definition</h3>
        <p id="result-definition"></p>

        <h3>Example</h3>
        <p id="result-example"></p>

        <div class="word-result-details">
          <section class="word-detail-card">
            <h3>Synonyms</h3>
            <p id="result-synonyms"></p>
          </section>

          <section class="word-detail-card">
            <h3>Antonyms</h3>
            <p id="result-antonyms"></p>
          </section>

          <section class="word-detail-card related-words-card">
            <h3>Related Words</h3>
            <p id="result-related-words"></p>
          </section>
        </div>
      </div>
    </article>
  `;

    document.querySelector("#results-title").textContent =
      wordInfo.word;

    document.querySelector("#result-phonetic").textContent =
      wordInfo.phonetic;

    document.querySelector("#result-part-of-speech").textContent =
      wordInfo.partOfSpeech;

    document.querySelector("#result-definition").textContent =
      wordInfo.definition;

    document.querySelector("#result-example").textContent =
      wordInfo.example;

    document.querySelector("#result-synonyms").textContent =
      wordInfo.synonyms.length > 0
        ? wordInfo.synonyms.join(", ")
        : "Synonyms not available";

    document.querySelector("#result-antonyms").textContent =
      wordInfo.antonyms.length > 0
        ? wordInfo.antonyms.join(", ")
        : "Antonyms not available";

    document.querySelector("#result-related-words").textContent =
      relatedWords.length > 0
        ? relatedWords.join(", ")
        : "Related words not available";

    const saveWordButton =
      document.querySelector("#save-word-button");

    if (isWordSaved(wordInfo.word)) {
      saveWordButton.disabled = true;
      saveWordButton.textContent = "Saved";
    }

    saveWordButton.addEventListener("click", () => {
      const wasSaved = saveWord(wordInfo);

      if (wasSaved) {
        saveWordButton.disabled = true;
        saveWordButton.textContent = "Saved";

        renderSavedWords();
      }
    });

    const audioButton =
      document.querySelector("#play-audio-button");

    if (wordInfo.audio) {
      audioButton.addEventListener("click", async () => {
        const audioUrl = wordInfo.audio.startsWith("//")
          ? `https:${wordInfo.audio}`
          : wordInfo.audio;

        const pronunciation = new Audio(audioUrl);

        audioButton.disabled = true;
        audioButton.textContent = "Loading...";

        try {
          await pronunciation.play();

          audioButton.textContent = "Playing";

          pronunciation.addEventListener(
            "ended",
            () => {
              audioButton.disabled = false;
              audioButton.textContent = "Listen";
            },
            { once: true },
          );
        } catch {
          audioButton.textContent = "No audio";
          audioButton.setAttribute(
            "aria-label",
            "Audio unavailable for this word",
          );
        }
      });
    } else {
      audioButton.disabled = true;
      audioButton.textContent = "No audio";
      audioButton.setAttribute(
        "aria-label",
        "Audio unavailable for this word",
      );
    }

  } catch {
    resultsSection.innerHTML = `
      <div class="empty-result">
        <span class="result-icon" aria-hidden="true">!</span>

        <div>
          <h2 id="results-title">Search unavailable</h2>

          <p>
            The dictionary information could not be loaded.
          </p>
        </div>
      </div>
    `;
  }
});
