// Import necessary modules
const request = require('request');
const fs = require('fs');

// Define the URL of the document to fetch
const url = 'http://norvig.com/big.txt';

// Function to fetch a document from a URL and return it as a promise
async function fetchDocument(url) {
  return new Promise((resolve, reject) => {
    request(url, (err, response, body) => {
      if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
}

// Function to analyze a document and count word occurrences
async function analyzeDocument(document) {
  // Split the document into words based on whitespace and remove empty strings
  const words = document.split(/\s+/).filter(word => word.trim() !== '');
  const wordCounts = {};

  // Loop through each word in the document
  words.forEach(word => {
    // Clean the word by making it lowercase and removing punctuation
    const cleanedWord = word.toLowerCase().replace(/[.,-/#!$%^&*;:{}=\-_`~()'"?]/g, '');
    // Increment the word count in the object or set it to 1 if it doesn't exist
    wordCounts[cleanedWord] = (wordCounts[cleanedWord] || 0) + 1;
  });

  return wordCounts;
}

// Function to get the top N words from a word count object
async function getTopWords(wordCounts, count) {
  // Convert the word count object into an array of [word, count] pairs and sort it by count in descending order
  const sortedWords = Object.entries(wordCounts).sort((a, b) => b[1] - a[1]);
  // Get the top N words from the sorted array
  const topWords = sortedWords.slice(0, count);
  const topWordsJson = {};

  // Convert the top words array back into an object
  topWords.forEach(([word, count]) => {
    topWordsJson[word] = count;
  });

  return topWordsJson;
}

// An immediately invoked async function to execute the entire process
(async () => {
  try {
    // Fetch the document from the URL
    const document = await fetchDocument(url);
    // Analyze the document and get word counts
    const wordCounts = await analyzeDocument(document);
    // Get the top 10 words
    const topWords = await getTopWords(wordCounts, 10);
    // Print the top words as JSON with indentation
    console.log(JSON.stringify(topWords, null, 2));
  } catch (err) {
    // Handle and print any errors that occur
    console.error('Error:', err);
  }
})();
