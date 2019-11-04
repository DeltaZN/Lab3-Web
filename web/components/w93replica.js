import {pointCheckerConfig} from "point-checker/base.js";

class Ico {
    constructor(img, name = '') {
        this.img = img;
        this.name = name;
    }
}

class Window {
    async constructor(name) {
        this.name = name;
        this.html = await fetch(`/components/${name}/base.html`)
            .then(resp => resp.text())
            .catch(err => console.log(err));
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
        let process = document.getElementById("process");
        process.appendChild(this.window.html);
    }

    close() {
        let process = document.getElementById("process");
        let window = process.getElementById(this.name);
        if (window.length !== 0)
            window[0].remove();
    }
}

class Page {
    constructor(bg, toolbar, context = {running: [], programs: []}) {
        this.bg = bg;
        this.toolbar = toolbar;
        this.context = context;
    }

    runProgram(program) {
        program.open()
    }

    init(configs) {
        for (let config in configs) {
            let ico = new Ico(config.img, config.name);
            let window = new Window(config.name);
            let program = new Program(ico, name, window);
            this.context.programs.push(program);
        }
    }
}

function onInit() {
    var page = Page();
    page.init([pointCheckerConfig]);
}