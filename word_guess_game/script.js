// classes from HTML
const wordText = document.querySelector(".word"),
hintText = document.querySelector(".hint span"),
inputbox = document.querySelector("input"),
refresh_button = document.querySelector(".refresh_word"),
check_button = document.querySelector(".check_word");

// assign a variable for the correct answer(currently have nothing)
let correctWord;

// what will happens when refresh button is clicked
const refreshGame = () => {
    const randomWords = words[Math.floor(Math.random() * words.length)]; //choose a random word
    const ranWordArray = randomWords.word.split(""); // split into letters with space
    // the following codes is a loop to shuffle the words
    for (let i = ranWordArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ranWordArray[i], ranWordArray[j]] = [ranWordArray[j], ranWordArray[i]];
    }
    wordText.innerText = ranWordArray.join(""); // join back the shuffled word
    hintText.innerText = randomWords.hint; // the hint
    correctWord = randomWords.word.toLowerCase(); // the chosen word from line 13
    inputbox.value = ""; // for user to input string
    inputbox.setAttribute("maxlength", correctWord.length); // maximum input length
}

// call the function to start the game
refreshGame();

// the function for checking the input is correct or not
const check = () => {
    const inputWord = inputbox.value.toLowerCase(); // convert input to lower case as line 22 converted the answer to lower case too
    // if there is no input
    if (!inputWord) {
        alert("Please enter a word!");
        // a pop up window will appears
        // if the input is not correct
    } else if (inputWord !== correctWord) {
        alert(`Oh no! ${inputWord} is not correct.`);
    } else
        // if the input is correct, refresh the game at last
    {
        alert(`Yay! ${correctWord.toUpperCase()} is correct.`);
        refreshGame();
    }
}

// make the HTML buttons functionable
refresh_button.addEventListener("click", refreshGame);
check_button.addEventListener("click", check);