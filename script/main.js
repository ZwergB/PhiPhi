addEventListener('load', init);

let texts = [];
let wholeStory;
let currentchapter;

let currentId;
let nextId;
let firstText = true;

let lastText;

const images = [];

function init() {
    console.log('init');
    readJson('./story.json').then(res => {

        preloadImages(res);
        openStory(res)
    });
}

function preloadImages(res) {
    for (const chap of res.story) {
        images.push(new Image());
        images[images.length-1].img = chap.backgroundImage;    

        if(chap.interaction != null) {
            for (const int of chap.interaction) {
                images.push(new Image());
                images[images.length-1].img = int.image;
            }
        }        
    }

    console.info(images);
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

    const t = document.createElement('div');
    if (firstText) {
        t.classList.add('bold');
    }

    if (lastText !== undefined) {
        clearInterval(lastText.int);
        lastText.e.innerHTML = '&#160;' + lastText.text;
    }

    firstText = false;
    t.innerHTML = '&#160;';
    const int = printLetterByLetter(t, texts[0], 25)
    document.getElementById('texts').appendChild(t);
    lastText = {e: t, text: texts[0], int: int};
    console.log(lastText)
    texts.shift();
    t.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});

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
    img.addEventListener('mouseenter', () =>  {
        if (div.getAttribute('active') == 'true') {
            let path = img.src;
            path = path.substring(0, path.length-4);
            path += 'leuchtend.png'
            img.src = path;
        }
    })
    img.addEventListener('mouseleave', () =>  {
        console.log(div);
        if (div.getAttribute('active') == 'true' && img.src.includes('leuchtend.png')) {
            let path = img.src; 
            path = path.substring(0, path.length-('leuchtend.png').length);
            path += '.png'
            console.log(img.src);
            img.src = path;
        }
})
    

    const tooltipBox = document.createElement('div');
    tooltipBox.classList.add('tooltip')
    const displayText = document.createElement('span');
    displayText.classList.add('hoverText', 'tooltiptext');
    displayText.innerHTML = element.actionText;
    div.append(displayText);


    const storyText = document.createElement('div');
    storyText.classList.add('invis', 'storyText');

    for (const text of element.resultText) {
        const t = document.createElement('span');
        t.innerHTML = text;
        storyText.appendChild(t);
    }    
  
    div.append(tooltipBox);
    div.append(storyText);   

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

    texts = t.slice();
    document.getElementById('texts').innerHTML = '';
    document.getElementById('main').addEventListener('click', nextText);

    firstText = true;
}

async function readJson (url) {
    // http://localhost:8080
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("HTTP error " + response.status);
    }
    return await response.json();
 }


 function printLetterByLetter(destination, message, speed){
    var i = 0;
    var interval = setInterval(function(){
        destination.innerHTML += message.charAt(i);
        i++;
        if (i > message.length){
            clearInterval(interval);
        }
    }, speed);

    return interval;
}
