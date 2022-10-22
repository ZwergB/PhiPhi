addEventListener('load', init);

let texts = [];
let wholeStory;
let currentchapter;

let currentId;
let nextId;

function init() {
    console.log('init');
    readJson('./story.json').then(res => {
        openStory(res)
    });

}

function openStory(s) {
    story = s;
    const chapters = story.story;
    currentId = story.firstChapter;
    currentchapter = getChapterById(currentId, chapters);
    nextId = currentId;

    openStoryScreen(currentchapter);

}

function getChapterById(id, chapters) {
    for (const chapter of chapters) {
        if (chapter.id == id) return chapter;
    }
    console.error('No chapter with matching id found:' + id);
    return false;
}

function storyTransition(){

}

function openStoryScreen(screen) {
    clearActionElements();
    setBackground(screen.backgroundImage);


    
    for (const element of screen.interaction) {
        createActionElement(element)        
    }

    startText(screen.texts);
}

function clearActionElements() {
    document.getElementById('actionElements').innerHTML = '';

}

function nextText() {
    if (!texts.length) {
        document.getElementById('main').removeEventListener('click', nextText);
        activateActionElements();

        if (currentId != nextId) {
            currentId = nextId;
            currentchapter = getChapterById(nextId, story.story);
    
            openStoryScreen(currentchapter);
        }

        return;
    }


    document.getElementById('texts').innerHTML += texts[0] + '<br>';
    texts.shift();

    function activateActionElements() {
        const elements = document.getElementsByClassName('actionElement');
        
        for (const element of elements) {
            element.setAttribute("active", true);
        }
    }
}


function setBackground(path) {
    document.getElementById('background').querySelector('img').src = path;
}

function createActionElement(element) {
    const parent = document.getElementById('actionElements');

    const div = document.createElement('div');
    div.classList.add('actionElement', 'tooltip');
    div.setAttribute('active', false);
    div.style.left = element.position.x + 'px';
    div.style.top = element.position.y + 'px';
    div.addEventListener('click', clickActionElement);
    div.setAttribute('next', element.next)
    parent.appendChild(div);

    const img = document.createElement('img');
    img.src = element.image;
    div.appendChild(img);

    const tooltipBox = document.createElement('div');
    tooltipBox.classList.add('tooltip')
    const displayText = document.createElement('span');
    displayText.classList.add('hoverText', 'tooltiptext');
    displayText.innerHTML = element.actionText;
    div.append(displayText);


    const storyText = document.createElement('div');
    storyText.classList.add('invis', 'storyText');

    for (const text of element.resultText) {
        console.log(text)
        const t = document.createElement('span');
        t.innerHTML = text;
        storyText.appendChild(t);
    }    

    
    div.append(tooltipBox);
    div.append(storyText);
    console.log(img)    

    function clickActionElement() {
        if(this.getAttribute('active') == "true") {
            const text = this.querySelectorAll('.storyText span');

            const t = [];
            for (let i = 0; i < text.length; i++) {
                const ele = text[i];
                t.push(ele.innerHTML);
                
            }

            startText(t, this.getAttribute('next'));
            const elements = document.getElementsByClassName('actionElement');
            for (const element of elements) {
                element.setAttribute("active", false);
            }
            
        }
        
    }
}

function startText(t, next) {
    if (next !== undefined)
        nextId = next;

    texts = t;
    
    document.getElementById('texts').innerHTML = '';
    document.getElementById('main').addEventListener('click', nextText);

    const elements = document.getElementsByClassName('actionElement');

}

async function readJson (url) {
    // http://localhost:8080
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("HTTP error " + response.status);
    }
    return await response.json();
 }