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

    document.getElementById('main').addEventListener('click', nextText);

    function nextText(texts) {
        texts = screen.texts;
        console.log(texts)
        document.getElementById('texts').innerText += texts[0] + '\n';
        texts.shift();
    
        if (!texts.length) {
            document.getElementById('main').removeEventListener('click', nextText);
            activateActionElements();

        }
    }

    function activateActionElements() {
        const elements = document.getElementsByClassName('actionElement');
        
        for (const element of elements) {
            element.setAttribute("active", true);
        }

        console.log(elements)

        const invis = document.querySelectorAll('.invis');
        for (let i = 0; i < invis.length; i++) {
            const e = invis[i];
            e.classList.remove('invis');
            
        }
    }
}


function setBackground(path) {
    document.getElementById('background').querySelector('img').src = path;
}

function createActionElement(element) {
    const parent = document.getElementById('actionElements');

    const div = document.createElement('div');
    div.classList.add('actionElement');
    div.setAttribute("active", false);
    div.style.left = element.position.x + 'px';
    div.style.top = element.position.y + 'px';
    div.addEventListener('click', clickActionElement);
    parent.appendChild(div);

    const img = document.createElement('img');
    img.src = element.image;
    div.appendChild(img);

    const displayText = document.createElement('span');
    displayText.classList.add('invis', 'hoverText');
    displayText.innerHTML = element.actionText;
    div.append(displayText);

    console.log(img)    

    function clickActionElement() {
        const element = this.getElementsByClassName('hoverText')[0];

        if (!element.classList.contains('invis')) {
            const text = element.innerHTML;
            console.log(text);
        }
    }
}

async function readJson (url) {
    // http://localhost:8080
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("HTTP error " + response.status);
    }
    return await response.json();
 }