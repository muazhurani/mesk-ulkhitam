const fileInput = document.getElementById('fileInput');
const chapterSelect = document.getElementById('chapterSelect');
const startVerseSelect = document.getElementById('startVerseSelect');
const endVerseSelect = document.getElementById('endVerseSelect');
const generateButton = document.getElementById('generateButton');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let quranData = null;

function fetchQuranData() {
    fetch('/get-quran-data')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            quranData = data;
            populateChapterSelect(quranData);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert('Error fetching data');
        });
}

// Call the function to fetch data when needed (e.g., on page load)
fetchQuranData();


function populateChapterSelect(data) {
    chapterSelect.innerHTML = '<option value="">Select a Chapter</option>';
    data.forEach(chapter => {
        const option = document.createElement('option');
        option.value = chapter.id;
        option.textContent = `Chapter ${chapter.id} - ${chapter.name}`;
        chapterSelect.appendChild(option);
    });

    chapterSelect.disabled = false;
    startVerseSelect.disabled = true;
    endVerseSelect.disabled = true;
    generateButton.disabled = true;
}

function populateVerseSelects(chapter) {
    startVerseSelect.innerHTML = '<option value="">Select Start Verse</option>';
    endVerseSelect.innerHTML = '<option value="">Select End Verse</option>';

    if (chapter && chapter.array && chapter.array.length > 0) {
        chapter.array.forEach(verse => {
            const startOption = document.createElement('option');
            startOption.value = verse.id;
            startOption.textContent = `Verse ${verse.id}`;
            startVerseSelect.appendChild(startOption);

            const endOption = document.createElement('option');
            endOption.value = verse.id;
            endOption.textContent = `Verse ${verse.id}`;
            endVerseSelect.appendChild(endOption);
        });

        startVerseSelect.disabled = false;
        endVerseSelect.disabled = false;
        generateButton.disabled = true; 
    } else {
        startVerseSelect.disabled = true;
        endVerseSelect.disabled = true;
        generateButton.disabled = true;
    }
}

chapterSelect.addEventListener('change', function() {
    const selectedChapterId = this.value;
    const selectedChapter = quranData.find(ch => ch.id === parseInt(selectedChapterId));

    if (selectedChapter) {
        populateVerseSelects(selectedChapter);
    } else {
        startVerseSelect.disabled = true;
        endVerseSelect.disabled = true;
        generateButton.disabled = true;
    }
});

startVerseSelect.addEventListener('change', checkVerseRange);
endVerseSelect.addEventListener('change', checkVerseRange);


function checkVerseRange() {
    const startVerse = parseInt(startVerseSelect.value);
    const endVerse = parseInt(endVerseSelect.value);

    if (startVerse && endVerse && startVerse <= endVerse) {
        generateButton.disabled = false;
    } else {
        generateButton.disabled = true;
    }
}


generateButton.addEventListener('click', function() {
    const selectedChapterId = parseInt(chapterSelect.value);
    const startVerse = parseInt(startVerseSelect.value);
    const endVerse = parseInt(endVerseSelect.value);

    if (selectedChapterId && startVerse && endVerse) {
        processQuranData(quranData, selectedChapterId, startVerse, endVerse);
    } else {
        alert('Please select a chapter and verse range.');
    }
});



function drawText(ctx, text, x, y, maxWidth, lineHeight, fontSize, fontFace, align = 'center') {
    ctx.font = `${fontSize}px ${fontFace}`;
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    const words = text.split(' ');
    let line = '';
    let currentY = y;
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, currentY);
            line = words[n] + ' ';
            currentY += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, currentY);
    return currentY - y + lineHeight; 
}

function createImage(ctx, verseArabic, verseEnglish, verseNumber, callback) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const arabicFontSize = 50;
    const arabicLineHeight = 60;
    const englishFontSize = 20;
    const englishLineHeight = 30;
    ctx.fillStyle = '#fff';
    const arabicFont = '"Noto Naskh Arabic", serif';
    const arabicTextHeight = drawText(ctx, verseArabic, 0, 0, ctx.canvas.width - 100, arabicLineHeight, arabicFontSize, arabicFont, 'left');
    const englishTextHeight = drawText(ctx, verseEnglish, 0, 0, ctx.canvas.width - 100, englishLineHeight, englishFontSize, 'Arial', 'left');
    const totalHeight = arabicTextHeight + englishTextHeight;
    const arabicStartY = (ctx.canvas.height - totalHeight) / 2;
    const englishStartY = arabicStartY + arabicTextHeight;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    drawText(ctx, verseArabic, ctx.canvas.width / 2, arabicStartY, ctx.canvas.width - 100, arabicLineHeight, arabicFontSize, arabicFont, 'center');
    drawText(ctx, verseEnglish, ctx.canvas.width / 2, englishStartY, ctx.canvas.width - 100, englishLineHeight, englishFontSize, 'Arial', 'center');
    if (callback && typeof callback === 'function') {
        callback(ctx.canvas.toDataURL(), `verse-${verseNumber}.png`);
    }
}

function processQuranData(quranData, chapterNumber, startVerse, endVerse) {
    const chapter = quranData.find(ch => ch.id === chapterNumber);
    if (chapter) {
        const zip = new JSZip();

        const filteredVerses = chapter.array.filter(verse => verse.id >= startVerse && verse.id <= endVerse);

        let promises = filteredVerses.map(verse => {
            return new Promise((resolve, reject) => {
                createImage(ctx, verse.ar, verse.en, verse.id, function(dataUrl, filename) {
                    zip.file(filename, dataUrl.split(',')[1], {base64: true});
                    resolve();
                });
            });
        });

        Promise.all(promises).then(() => {
            zip.generateAsync({type:"blob"}).then(function(content) {
                saveAs(content, "quran_verses.zip");
            });
        });
    } else {
        console.error('Chapter not found');
    }
}
