import React, { useState, useEffect } from 'react';
import './App.css';

// Array of character filenames
const characterFiles = [
"neferpitou.jpg",
"illumi-zoldyck.png",
"hanzo.png",
"machi.jpg",
"gon-freecss.jpg",
"ging-freecss.jpg",
"hisoka.jpg",
"chrollo-lucilfer.jpg",
// "menchi.png",
// "shaiapouf.jpg",
// "shalnark.jpg",
// "alluka-zoldyck.jpg",
// "leorio-palladiknight.jpg",
// "piyon.jpg",
// "knov.jpg",
// "shizuku.jpg",
// "killua-zoldyck.jpg",
// "meruem.jpg",
// "chairman-netero.png",
// "shoot-mcmahon.jpg",
// "melody.png",
// "kurapika.jpg",
// "colt.jpg",
// "meleoron.jpg",
// "nobunaga-hazama.jpg",
// "pokkle.png",
// "franklin.jpg",
// "cheetu.png",
// "kaito.jpg",
// "menthuthuyoupi.jpg",
// "biscuit-krueger.jpg",
// "feitan.jpg",
// "komugi.jpg",
];

// Function to convert filename to character name
function formatCharacterName(fileName) {
  return fileName
    .replace(/\.(jpg|png)$/, '')              // Remove file extension
    .replace(/-/g, ' ')                       // Replace hyphens with spaces
    .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize first letter of each word
}

// Filter and create an array of characters with names and image paths
const validExtensions = ['.jpg', '.png'];
const characters = characterFiles
  .filter(file => validExtensions.some(ext => file.toLowerCase().endsWith(ext)))
  .map(file => ({
    name: formatCharacterName(file),
    image: `./images/${file}`, // Image path
    score: 0,                 // Initial score
    tier: 0,                  // Initial tier
  }));

function App() {
  const [currentPair, setCurrentPair] = useState([]);
  const [remainingComparisons, setRemainingComparisons] = useState([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    initializeComparisons();
  }, []);

  function initializeComparisons() {
    characters.forEach(char => char.tier = 0); // Reset tiers
    updateTiers();

    const comparisons = generateComparisons();
    setRemainingComparisons(comparisons);
    showNextPair(comparisons);
  }

  function updateTiers() {
    // Divide characters into tiers based on their scores
    const sortedCharacters = [...characters].sort((a, b) => b.score - a.score);
    const tierSize = Math.ceil(characters.length / 5); // 5 tiers as an example

    sortedCharacters.forEach((char, index) => {
      char.tier = Math.floor(index / tierSize);
    });
  }

  function generateComparisons() {
    const comparisons = [];
    for (let i = 0; i < characters.length; i++) {
      for (let j = i + 1; j < characters.length; j++) {
        // Only compare characters within the same tier or adjacent tiers
        if (Math.abs(characters[i].tier - characters[j].tier) <= 1) {
          comparisons.push([characters[i], characters[j]]);
        }
      }
    }
    return comparisons;
  }

  function showNextPair(comparisons) {
    if (comparisons.length === 0) {
      setShowResults(true);
      return;
    }

    const randomIndex = Math.floor(Math.random() * comparisons.length);
    setCurrentPair(comparisons[randomIndex]);
  }

  function recordPreference(winner, loser) {
    // Update the score of the winner
    winner.score += 1;

    // Update tiers after score changes
    updateTiers();

    // Filter out the current comparison from the remaining list
    const nextComparisons = remainingComparisons.filter(
      pair => !(pair.includes(winner) && pair.includes(loser))
    );

    setRemainingComparisons(nextComparisons);
    showNextPair(nextComparisons);
  }

  function calculateRankings() {
    // Sort characters by score in descending order
    return characters.sort((a, b) => b.score - a.score);
  }

  function resetGame() {
    characters.forEach(char => {
      char.score = 0;
      char.tier = 0;
    }); // Reset scores and tiers
    setShowResults(false);
    initializeComparisons();
  }

  return (
    <div className="App">
      <h1>Character Sorter</h1>
      {showResults ? (
        <div className="results">
          <h2>Your Ranked Characters:</h2>
          {calculateRankings().map((character, index) => (
            <div key={index} className="character-result">
              <img src={character.image} alt={character.name} />
              <p>{index + 1}. {character.name}</p>
            </div>
          ))}
          <button onClick={resetGame}>Start Over</button>
        </div>
      ) : (
        <div className="character-container">
          <div className="character" onClick={() => recordPreference(currentPair[0], currentPair[1])}>
            {currentPair[0] && (
              <>
                <img src={currentPair[0].image} alt={currentPair[0].name} />
                <p>{currentPair[0].name}</p>
              </>
            )}
          </div>
          <div className="character" onClick={() => recordPreference(currentPair[1], currentPair[0])}>
            {currentPair[1] && (
              <>
                <img src={currentPair[1].image} alt={currentPair[1].name} />
                <p>{currentPair[1].name}</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
