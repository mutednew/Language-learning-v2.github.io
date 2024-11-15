$(function() {
    const wordsA1 = [
        { en: 'Book', ua: 'Книга' },
        { en: 'Cat', ua: 'Кіт' },
        { en: 'Table', ua: 'Стіл' },
        { en: 'Chair', ua: 'Стілець' },
        { en: 'Water', ua: 'Вода' },
        { en: 'Apple', ua: 'Яблуко' },
        { en: 'House', ua: 'Будинок' },
        { en: 'School', ua: 'Школа' },
        { en: 'Friend', ua: 'Друг' },
        { en: 'Morning', ua: 'Ранок' }
    ],
    wordsB1 = [
        { en: 'Abundant', ua: 'Багатий' },
        { en: 'Benefit', ua: 'Користь' },
        { en: 'Critique', ua: 'Критика' },
        { en: 'Discuss', ua: 'Обговорювати' },
        { en: 'Enhance', ua: 'Покращувати' },
        { en: 'Express', ua: 'Виражати' },
        { en: 'Focus', ua: 'Зосереджуватися' },
        { en: 'Imagine', ua: 'Уявляти' },
        { en: 'Journey', ua: 'Подорож' },
        { en: 'Sufficient', ua: 'Достатній' }
    ],
    wordsB2 = [
        { en: 'Appreciate', ua: 'Цінувати' },
        { en: 'Hypothesis', ua: 'Гіпотеза' },
        { en: 'Facilitate', ua: 'Сприяти' },
        { en: 'Generate', ua: 'Генерувати' },
        { en: 'Illustrate', ua: 'Ілюструвати' },
        { en: 'Disrupt', ua: 'Заважати' },
        { en: 'Negotiate', ua: 'Переговори' },
        { en: 'Analyze', ua: 'Аналізувати' },
        { en: 'Persuade', ua: 'Переконувати' },
        { en: 'Evaluate', ua: 'Оцінювати' }
    ];

    const difficulty = $('input[name="lvl"]'),
        card = $('.card'),
        counter = $('.num'),
        inputVal = $('.translate'),
        correctCountElem = $('.correct'),
        incorrectCountElem = $('.incorrect'),
        sreenBlock = $('.difficulty'),
        windowDifficult = $('.choise-block'),
        buttonLvl = $('.choose-lvl');
    
    let shuffledWords,
        currentCount = 0,
        correctCount = 0,
        incorrectCount = 0,
        currentWord = null;

    function chooseDifficulty() {
        sreenBlock.css('visibility', 'visible');
        sreenBlock.css('opacity', '1');
        windowDifficult.css('transform', 'translateY(0%)');
    
        difficulty.on('change', function() {
            if (this.value === 'A1') {
                shuffledWords = shuffleArray(wordsA1);
            } else if (this.value === 'B1') {
                shuffledWords = shuffleArray(wordsB1);
            } else if (this.value === 'B2') {
                shuffledWords = shuffleArray(wordsB2);
            }
    
            sreenBlock.css('visibility', 'hidden');
            sreenBlock.css('opacity', '0');
            windowDifficult.css('transform', 'translateY(-120%)');
    
            reset();
            loadNextWord();
        });
    }
    
    function reset() {
        currentCount = 0;
        correctCount = 0;
        incorrectCount = 0;
        correctCountElem.text(`Correct: ${correctCount}`);
        incorrectCountElem.text(`Incorrect: ${incorrectCount}`);
        counter.text(`${currentCount + 1} / 10`);
        inputVal.val('');
        difficulty.prop('checked', false);
    }

    buttonLvl.on('click', () => {
        chooseDifficulty();
    });

    function shuffleArray(array) {
        for(let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function showResults() {
        const totalWords = shuffledWords.length;
        const level = correctCount / totalWords * 100;
        
        const modal = $('.modal');
        const results = $('.results');
        modal.css('visibility', 'visible');
        modal.css('opacity', '1');
        results.css('transform', 'translateY(0%)');
        
        let summaryText = `You answered ${correctCount} out of 10 correctly.`;
    
        let recommendationsText = '';
        if (level === 100) {
            recommendationsText = "Excellent job! You have a strong grasp of the vocabulary.";
        } else if (level >= 75) {
            recommendationsText = "Great work! You have a good understanding of the vocabulary, but there's still room for improvement.";
        } else if (level >= 50) {
            recommendationsText = "Not bad! However, you might want to review some words to enhance your vocabulary.";
        } else {
            recommendationsText = "Keep practicing! Regular study will help you improve your vocabulary.";
        }
    
        $('#resultsText').text(`Your English language level is: ${level.toFixed(2)}%`);
        $('.summary').text(summaryText);
        $('.recommendations').text(recommendationsText);

        $('.restart').on('click', () => {
            modal.css('visibility', 'hidden');
            modal.css('opacity', '0');
            results.css('transform', 'translateY(-120%)');

            currentCount = 0;
            correctCount = 0;
            incorrectCount = 0;
            correctCountElem.text(`Correct: ${correctCount}`);
            incorrectCountElem.text(`Incorrect: ${incorrectCount}`);
            counter.text(`${currentCount + 1} / 10`);
            inputVal.val('');
            chooseDifficulty();
        });
    }

    function loadNextWord() {
        if (currentCount < 10) {
            currentWord = shuffledWords[currentCount];
            card.html(currentWord.en); 
            counter.html(`${currentCount + 1} / 10`);
            inputVal.val('');
        } else {
            showResults();
        }
    }

    let showUA = true;
    card.on('click', () => {
        if (showUA) {
            card.text(currentWord.ua);
        } else {
            card.text(currentWord.en);
        }

        showUA = !showUA;
    });

    $('.right').on('click', (event) => {
        event.preventDefault();
        currentCount++;
        loadNextWord();
    });

    let answerStatus = [].fill(null);

    $('.left').on('click', (event) => {
        event.preventDefault();
    
        if (currentCount > 0) {
            currentCount--;
    
            if (answerStatus[currentCount] === true) {
                correctCount--;
            } else if (answerStatus[currentCount] === false) {
                incorrectCount--;
            }
    
            answerStatus[currentCount] = null;
    
            correctCountElem.text(`Correct: ${correctCount}`);
            incorrectCountElem.text(`Incorrect: ${incorrectCount}`);
    
            loadNextWord();
        }
    });

    inputVal.on('keypress', (event) => {
        if (currentCount < 10) {
            if (event.which === 13 && currentWord) {
                const userTranslation = inputVal.val().trim();
                
                if (userTranslation.toLowerCase() === currentWord.ua.toLowerCase()) {
                    correctCount++;
                    answerStatus[currentCount] = true;
                } else {
                    incorrectCount++;
                    answerStatus[currentCount] = false; 
                }

                correctCountElem.text(`Correct: ${correctCount}`);
                incorrectCountElem.text(`Incorrect: ${incorrectCount}`);

                currentCount++;
                loadNextWord();
            }
        }
    });
    });
