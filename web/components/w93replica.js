let page;
let root;
let icons;
let toolbar;
let process;

const apps = {
    pointChecker1: {
        name: 'Лаба №1',
        icoImgUrl: 'img/cat.png',
        url: 'http://p-n-p.herokuapp.com/l1/'
    },
    pointChecker5: {
        name: 'Лаба №2',
        icoImgUrl: 'img/afanas.png',
        url: 'http://localhost:8080/lab_2/'
    },
    pointChecker2: {
        name: 'Лаба №3',
        icoImgUrl: 'img/dak.png',
        // TODO: set url to main.xhtml
        url: 'point-checker/base.html'
    }
};

// function onMouseMove(event) {
//     console.log(event);
//     let program = page.getResizingProgram();
//     let oldX = program.window.resizeEvent.clientX;
//     let oldY = program.window.resizeEvent.clientY;
//     let newX = event.clientX;
//     let newY = event.clientY;
//     program.window.addToWindowSize(newX-oldX, newY-oldY);
// }

function onIcoMouseDown(event) {
    console.log('mousedown on ico');
    let target = event.currentTarget || event.target;
    let id = target.id || target.parentNode.id;
    let name = id.substr(0, id.length - 4);

    let program = page.getProgramByName(name);
    program.ico.didMouseDown = true;
}

class Ico {
    constructor(imgUrl, name = '') {
        if (!name)
            name = ('' + Math.random()).substr(2);
        this.imgUrl = imgUrl;
        this.name = name;
        this.didMouseDown = false;
    }

    moveTo(x, y){
        this.ico.style.left = `${x}px`;
        this.ico.style.top = `${y}px`;
        this.ico.style.position = 'absolute';
    }

    render() {
        if (this.ico !== undefined)
            return this.ico;

        const name = this.name;
        this.ico = document.createElement('div');

        let img = document.createElement('img');
        img.src = this.imgUrl;

        let title = document.createElement('span');
        title.classList.add('program-name');
        title.innerText = this.name;

        this.ico.id = this.name + '-ico';
        this.ico.appendChild(img);
        this.ico.innerHTML += '<br>';

        this.ico.addEventListener('dblclick', event => {
            console.log(event);
            let target = event.currentTarget || event.target;
            let id = target.id || target.parentNode.id;
            let name = id.substr(0, id.length - 4);

            page.runProgramByName(name);
        });
        title.addEventListener('mousedown', event=>onIcoMouseDown(event));
        this.ico.appendChild(title);

        return this.ico;
    }
}

class Window {

    constructor(name, url) {
        this.name = name;
        this.src = url || `./${name}/base.html`;
        this.didMouseDownOnHeader = false;
        this.didMouseDownOnBorder = false;
        this.resizeEvent = null;

        if (!Window.template)
            Window.createTemplate();
    }

    moveTo(x, y){
        this.html.style.left = `${x}px`;
        this.html.style.top = `${y}px`;
    }

    addToWindowSize(x, y){
        let iframe = this.html.querySelector('iframe');
        let oldWidth = iframe.style.width;
        let oldHeight = iframe.style.height;

        if (!(oldHeight&&oldWidth)){
            console.log(`not found old size value for ${this.name}'s window`)
            return null;
        }

        let newWidth = Number(oldWidth.substr(0, oldWidth.length - 2)) + x;
        let newHeight = Number(oldHeight.substr(0, oldHeight.length - 2)) + y;

        if (!(newHeight&&newWidth)){
            console.log(`get wrong result while calc new size of ${this.name}'s window`);
            return null;
        }

        iframe.style.width = `${newWidth}px`;
        iframe.style.height = `${newHeight}px`;

    }

    render() {
        console.log('start window rendering');

        if (this.html !== undefined)
            return this.html;

        let iframe = document.createElement('iframe');
        iframe.src = this.src;
        iframe.style.width = '300px';
        iframe.style.height = '305px';

        this.html = Window.template.cloneNode(true);
        this.html.id = this.name + '-window';
        this.html.querySelector('div.title').innerText = this.name;
        this.html.querySelector('td.app-root').appendChild(iframe);
        this.html.querySelector('div.button').id = this.name + '-closeButton';
        this.html.querySelector('td.app-root').id = this.name + '-appRoot';

        let header = this.html.querySelector('td.window-header');
        header.id = this.name + '-windowHeader';
        header.addEventListener('mousedown', event=>page.onWindowHeaderMouseDown(event));

        return this.html;
    }

    static createTemplate() {
        console.log('start window template creating');
        let tmp = document.createElement('div');
        Window.template = tmp.firstChild;
        tmp.innerHTML = '<div class="window">' +
                            '<table><tbody>' +
                                '<tr><td class="window-header">' +
                                    '<div class="title">Title</div>' +
                                    '<div onclick="page.stopProgramByName(this.id.substr(0, this.id.length - 12))" class="button">X</div>' +
                                '</td></tr>' +
                                '<tr><td class="app-root" onmousedown="page.onMouseDownWindowBorder(event)"></td></tr>' +
                            '</tbody></table>' +
                        '</div>';
        Window.template = tmp.firstChild;
    }
}

class Program {
    constructor(ico, name, window) {
        this.name = name;
        this.ico = ico;
        this.window = window;
        this.isRunning = false;
    }

    open() {
        this.isRunning = true;
        process.appendChild(this.window.render());
    }

    close() {
        let window = document.getElementById(`${this.name}-window`);
        if (window !== null) {
            this.isRunning = false;
            window.remove();
        }
    }
}

class Page {
    constructor(toolbar, context = {programs: []}) {
        this.toolbar = toolbar;
        this.context = context;
    }

    onWindowHeaderMouseDown(event) {
        console.log('mousedown on window header');
        let target = event.currentTarget || event.target;
        let id = target.id || target.parentNode.id;
        let name = id.substr(0, id.length - 13);

        let program = this.getProgramByName(name);
        program.window.didMouseDownOnHeader = true;
    }

    onMouseUp(event){
        console.log('mouseup on body');
        let programToMove;
        let programToResize;
        let icoToMove;
        for (let i in this.context.programs) {
            if (this.context.programs[i].window.didMouseDownOnHeader) {
                programToMove = this.context.programs[i];
            }
            if (this.context.programs[i].window.didMouseDownOnBorder) {
                programToResize = this.context.programs[i];
            }
            if (this.context.programs[i].ico.didMouseDown) {
                icoToMove = this.context.programs[i].ico;
            }
        }
        if (programToMove){
            programToMove.window.moveTo(event.clientX, event.clientY);
            programToMove.window.didMouseDownOnHeader = false;
        }else{
            console.log('mouse up but clicked window header not found');
        }
        if (icoToMove){
            icoToMove.moveTo(event.clientX, event.clientY);
            icoToMove.didMouseDown = false;
        }else{
            console.log('mouse up but clicked ico not found');
        }
        if (programToResize){
            // document.body.removeEventListener('mousemove', onMouseMove);
            let oldX = programToResize.window.resizeEvent.clientX;
            let oldY = programToResize.window.resizeEvent.clientY;
            let newX = event.clientX;
            let newY = event.clientY;
            programToResize.window.addToWindowSize(newX-oldX, newY-oldY);

            programToResize.window.didMouseDownOnBorder = false;
            programToResize.window.resizeEvent = null;
        }else{
            console.log('mouse up but clicked window border not found');
        }


    }

    onMouseDownWindowBorder(event){
        console.log('mousedown on window border');
        let target = event.currentTarget || event.target;
        let name = target.id.substr(0, target.id.length - 8);
        let program = this.getProgramByName(name);
        if (program === null)
            console.log(`program with name ${name} not found`);
        program.window.didMouseDownOnBorder = true;
        program.window.resizeEvent = event;
        // document.body.addEventListener('mousemove', onMouseMove)
    }

    getProgramByName(programName){
        for (let i in this.context.programs) {
            if (this.context.programs[i].name === programName) {
                return this.context.programs[i];
            }
        }
        return null;
    }

    getResizingProgram(){
        let program = null;


        return program;
    }

    runProgramByName(programName) {
        let program = this.getProgramByName(programName);
        if (program === null)
            console.log(`program with name ${name} not found`);
        program.open();
    }

    stopProgramByName(programName) {
        let program = this.getProgramByName(programName);
        if (program === null)
            console.log(`program with name ${name} not found`);
        program.close();
    }

    init(configs) {
        for (let i in configs) {
            let ico = new Ico(configs[i].icoImgUrl, configs[i].name);
            let window = new Window(configs[i].name, configs[i].url);
            let program = new Program(ico, configs[i].name, window);
            this.context.programs.push(program);
            setTimeout(()=>Page.showProgramIco(program), 1000*Math.random());
        }
    }

    render() {
    }

    static showProgramIco(program) {
        if (document.getElementById(program.ico.title) === null) {
            icons.appendChild(program.ico.render());
        } else
            console.log(`WTF, icon ${program.ico.title} is already displayed`)
    }

    hideProgramIco(program) {
        if (document.getElementById(program.ico.title) !== null)
            this.context.programs.pop(program);
        else
            console.log(`WTF, icon ${program.ico.title} is already displayed`);
    }
}

async function onInit() {
    page = new Page(null);
    root = document.getElementById('root');
    icons = document.getElementById('icons');
    toolbar = document.getElementById('toolbar');
    process = document.getElementById("process");
    document.body.addEventListener('mouseup', (event)=>page.onMouseUp(event));
    page.init(apps);
    page.render();
}
