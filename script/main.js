addEventListener('load', init);

function init() {
    console.log('init');

    readJson('/story.json').then(res => {
        openStory(res)
    });
}

function openStory(story) {
    const chapters = story.story;
    let currentchapter = getChapterById(story.firstChapter, chapters);
    
    let nextChapterId;

    nextChapterId = openStoryScreen(currentchapter);
    currentchapter = getChapterById(nextChapterId, chapters);
}

function getChapterById(id, chapters) {
    for (const chapter of chapters) {
        if (chapter.id == id) return chapter;
    }
    console.error('No chapter with matching id found:' + id);
    return false;
}

function openStoryScreen(screen) {
    setBackground(screen.backgroundImage);

    for (const element of screen.interaction) {
        createActionElement(element)        
    }

    for (const text of screen.texts) {
        document.getElementById('texts')
    }
}

function setBackground(path) {
    document.getElementById('background').querySelector('img').src = 'bg.png';
}

function createActionElement(element) {
    const parent = document.getElementById('actionElements');

    const div = document.createElement('div');
    parent.appendChild(div);

    const img = document.createElement('img');
    img.src = element.image;
    img.style.left = element.position.x + 'px';
    img.style.top = element.position.y + 'px';
    div.appendChild(img);
    console.log(img)
}

async function readJson (url) {
    // http://localhost:8080
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("HTTP error " + response.status);
    }
    return await response.json();
 }