let page;
let root;
let icons;
let toolbar;
let process;

const apps = {
    pointChecker1: {
        name: 'point-checker-1',
        icoImgUrl: 'img/point-checker.png'
    },
    pointChecker2: {
        name: 'point-checker-2',
        icoImgUrl: 'img/point-checker.png'
    },
    pointChecker3: {
        name: 'point-checker-3',
        icoImgUrl: 'img/point-checker.png'
    },
    pointChecker4: {
        name: 'point-checker-4',
        icoImgUrl: 'img/point-checker.png'
    },
    pointChecker5: {
        name: 'point-checker-5',
        icoImgUrl: 'img/point-checker.png'
    }
};

class Ico {
    constructor(imgUrl, title = '') {
        if (!title)
            title = ('' + Math.random()).substr(2);
        this.imgUrl = imgUrl;
        this.title = title;
        this.id = title + '-ico';
    }

    render(){
        let ico = document.createElement('div');

        let img = document.createElement('img');
        img.src = this.imgUrl;

        let title = document.createElement('span');
        title.classList.add('program-title');
        title.innerText = this.title;

        ico.id = this.id;
        ico.appendChild(img);
        ico.innerHTML += `<br>`;
        ico.appendChild(title);

        return ico;
    }
}

class Window {
    constructor(name, url) {
        this.name = name;
        this.html = document.createElement('iframe');
        this.src = name !== undefined ? `/components/${name}/base.html` : url;
        this.html.src = this.src;
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
        process.appendChild(this.window.html);
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

    runProgram(program) {
        program.open();
    }

    init(configs) {
        for (let i in configs) {
            let ico = new Ico(configs[i].icoImgUrl, configs[i].name);
            let window = new Window(configs[i].name || configs[i].url);
            let program = new Program(ico, name, window);
            this.showProgramIco(program);
        }
    }

    render() {
    }

    showProgramIco(program) {
        if (document.getElementById(program.ico.title) === null) {
            icons.appendChild(program.ico.render());
            this.context.programs.push(program);
        } else
            console.log(`WTF, icon ${program.ico.title} is already displayed`)
    }

    hideProgramIco(program) {
        if (document.getElementById(program.ico.title) !== null)
            this.context.programs.push(program);
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
