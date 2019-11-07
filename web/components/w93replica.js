let page;
let root;
let icons;
let toolbar;
let process;

const apps = {
    pointChecker1: {
        name: 'point-checker-1',
        icoImgUrl: 'img/point-checker.png',
        url: 'point-checker/base.html'
    },
    pointChecker2: {
        name: 'point-checker-2',
        icoImgUrl: 'img/point-checker.png',
        url: 'point-checker/base.html'
    },
    pointChecker3: {
        name: 'point-checker-3',
        icoImgUrl: 'img/point-checker.png',
        url: 'point-checker/base.html'
    },
    pointChecker4: {
        name: 'point-checker-4',
        icoImgUrl: 'img/point-checker.png',
        url: 'point-checker/base.html'
    },
    pointChecker5: {
        name: 'point-checker-5',
        icoImgUrl: 'img/point-checker.png',
        url: 'point-checker/base.html'
    }
};

class Ico {
    constructor(imgUrl, name = '') {
        if (!name)
            name = ('' + Math.random()).substr(2);
        this.imgUrl = imgUrl;
        this.name = name;
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
        this.ico.appendChild(title);

        return this.ico;
    }
}

class Window {

    constructor(name, url) {
        this.name = name;
        this.src = url || `./${name}/base.html`;

        if (!Window.template)
            Window.createTemplate();
    }

    render() {
        console.log('start window rendering');

        if (this.html !== undefined)
            return this.html;

        let iframe = document.createElement('iframe');
        iframe.src = this.src;

        this.html = Window.template.cloneNode(true);
        this.html.id = name + '-window';
        this.html.querySelector('[app-root]').appendChild(iframe);

        return this.html;
    }

    static createTemplate() {
        console.log('start window template creating');
        let tmp = document.createElement('div');
        tmp.innerHTML = '<div class="window">' +
            '<table><tbody>' +
            '<tr><td>a</td></tr>' +
            '<tr><td app-root=""></td></tr>' +
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
        this.isRunnig = false;
    }

    open() {
        this.isRunnig = true;
        process.appendChild(this.window.render());
    }

    close() {
        let window = process.getElementById(this.name);
        if (window !== null) {
            this.isRunnig = false;
            window.remove();
        }
    }
}

class Page {
    constructor(toolbar, context = {running: [], programs: []}) {
        this.toolbar = toolbar;
        this.context = context;
    }

    runProgramByName(programName) {
        for (let i in this.context.programs) {
            if (this.context.programs[i].name === programName) {
                this.context.programs[i].open();
                return null;
            }
        }

        console.log(`program with name ${name} not found`);
    }

    init(configs) {
        for (let i in configs) {
            let ico = new Ico(configs[i].icoImgUrl, configs[i].name);
            let window = new Window(configs[i].name, configs[i].url);
            let program = new Program(ico, configs[i].name, window);
            this.context.programs.push(program);
            Page.showProgramIco(program);
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
    page.init(apps);
    page.render();
}
