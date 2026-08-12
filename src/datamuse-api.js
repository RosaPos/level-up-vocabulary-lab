const DATAMUSE_BASE_URL = "https://api.datamuse.com/words";

export async function getRelatedWords(word) {
  const normalizedWord = word.trim().toLowerCase();

  if (!normalizedWord) {
    throw new Error("Please enter an English word.");
  }

  const queryParameters = new URLSearchParams({
    ml: normalizedWord,
    max: "8",
  });

  const requestUrl =
    `${DATAMUSE_BASE_URL}?${queryParameters.toString()}`;

  const response = await fetch(requestUrl);

  if (!response.ok) {
    throw new Error(
      `Related words request failed with status ${response.status}.`,
    );
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error(
      "Datamuse returned an unexpected related words response.",
    );
  }

  return data;
}
