const SAVED_WORDS_KEY = "levelUpSavedWords";

export function getSavedWords() {
  const savedWordsJson = localStorage.getItem(SAVED_WORDS_KEY);

  if (!savedWordsJson) {
    return [];
  }

  try {
    const savedWords = JSON.parse(savedWordsJson);

    return Array.isArray(savedWords) ? savedWords : [];
  } catch (error) {
    console.warn("Could not read saved words:", error);

    return [];
  }
}

export function saveWord(wordInfo) {
  const savedWords = getSavedWords();

  const alreadySaved = savedWords.some(
    (savedWord) =>
      savedWord.word.toLowerCase() === wordInfo.word.toLowerCase(),
  );

  if (alreadySaved) {
    return false;
  }

  const wordToSave = {
    word: wordInfo.word,
    phonetic: wordInfo.phonetic,
    partOfSpeech: wordInfo.partOfSpeech,
    definition: wordInfo.definition,
    example: wordInfo.example,
  };

  savedWords.push(wordToSave);

  localStorage.setItem(
    SAVED_WORDS_KEY,
    JSON.stringify(savedWords),
  );

  return true;
}

export function removeSavedWord(word) {
  const savedWords = getSavedWords();

  const updatedWords = savedWords.filter(
    (savedWord) =>
      savedWord.word.toLowerCase() !== word.toLowerCase(),
  );

  localStorage.setItem(
    SAVED_WORDS_KEY,
    JSON.stringify(updatedWords),
  );

  return updatedWords;
}

export function isWordSaved(word) {
  return getSavedWords().some(
    (savedWord) =>
      savedWord.word.toLowerCase() === word.toLowerCase(),
  );
}
