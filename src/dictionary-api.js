const API_BASE_URL =
  "https://api.dictionaryapi.dev/api/v2/entries/en";

export async function getWordData(word) {
  const normalizedWord = word.trim().toLowerCase();

  if (!normalizedWord) {
    throw new Error("Please enter an English word.");
  }

  const requestUrl =
    `${API_BASE_URL}/${encodeURIComponent(normalizedWord)}`;

  const response = await fetch(requestUrl);

  if (!response.ok) {
    throw new Error(
      `Dictionary request failed with status ${response.status}.`,
    );
  }

  const data = await response.json();

  return data;
}