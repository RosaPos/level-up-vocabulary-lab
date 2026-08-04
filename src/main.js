import "./style.css";

const app = document.querySelector("#app");

app.innerHTML = `
  <header class="site-header">
    <a class="brand" href="./" aria-label="Level Up Vocabulary Lab home">
      <span class="brand-mark" aria-hidden="true">LU</span>

      <span class="brand-text">
        <strong>Level Up</strong>
        <small>Vocabulary Lab</small>
      </span>
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
              placeholder="Example: improve"
              autocomplete="off"
              required
            />

            <button type="submit">Search Word</button>
          </div>

          <p class="form-help">
            Start with a word such as learn, improve, happy, or practice.
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

      <span class="saved-count">0 words saved</span>
    </section>
  </main>

  <footer class="site-footer">
    <p>
      Level Up Vocabulary Lab - Learn, practice, and grow.
    </p>
  </footer>
`;

const searchForm = document.querySelector("#search-form");
const resultsSection = document.querySelector("#results");

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(searchForm);
  const word = formData.get("word").trim();

  resultsSection.innerHTML = `
    <div class="empty-result">
      <span class="result-icon" aria-hidden="true">Aa</span>

      <div>
        <h2 id="results-title"></h2>

        <p>
          The dictionary API will display the information for this word
          in the next project step.
        </p>
      </div>
    </div>
  `;

  document.querySelector("#results-title").textContent = word;
});
