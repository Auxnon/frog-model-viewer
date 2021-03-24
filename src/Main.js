import * as Render from "./Render.js";
//import { ipcRenderer } from  'electron';
let mainElement;
let resizeDebouncer;

let frog;
let model;
const fileReader = new FileReader();

let zAxis=true;

function init() {
    mainElement = document.querySelector('main');

    if (window.api) {
        window.api.receive("client", (data) => {
            console.log(`Received ${data} from main process`);
            alert(data)
            if (data && data.length) {
                data.forEach(path => {
                    if (path) {
                        if (typeof path == "object")
                            path = path[0]

                        if (path && typeof path =="string" && (path.endsWith('.gltf') || path.endsWith('.glb')))
                            Render.loadModel(path, modelProcess)
                    }
                })
            }

        });
        window.api.send("server", "check");
    }




    Render.init(mainElement);
    Render.loadModel('assets/froggy.glb', m => {
        frog = m;
        modelProcess(m)
    })
    resize();
    window.addEventListener('resize', resize);
    document.body.addEventListener("drop", dropItem);
    document.body.addEventListener("dragover", dragItemOver);
    assignButton('.axis',ev=>{
        zAxis=!zAxis
        if(zAxis)
            model.children[0].rotation.x=Math.PI/2;
        else
            model.children[0].rotation.x=0;
    })



}
init();
function assignButton(query,callback){
    let element=document.querySelector(query);
    if(element)
        element.addEventListener('click',callback)
}


function resize() {

    clearTimeout(resizeDebouncer);
    resizeDebouncer = setTimeout(function() {
        //svg.setAttribute('width', window.innerWidth + "px")
        //svg.setAttribute('height', window.innerHeight + "px")
        //barAdjust();
        if (Render) {
            Render.resize();
        }
        //UI.systemMessage('inner ' + window.innerWidth + '; screen ' + window.screen.width, 'success')
    }, 250);
}

function animate(delta) {
    if (model)
        model.rotation.z += delta;
}

function dropItem(e) {
    e.preventDefault();
    e.stopPropagation();
    var data = e.dataTransfer.getData("text");

    let file = e.dataTransfer.files[0];


    fileReader.addEventListener("load", function() {
        // convert image file to base64 string

        //preview.src = reader.result;

        Render.parseModel(fileReader.result, modelProcess);
    }, false);
    //FileReader.readAsDataURL()
    if (file) {
        if (file.name.endsWith('.gltf') || file.name.endsWith('.glb')) {
            fileReader.readAsArrayBuffer(file)
        }
        //readAsText(file); readAsBinaryString
    }


    //sendFile(file);
    return false;
}

function dragItemOver(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy'
}

function modelProcess(m) {
    if(model)
        model.position.z -= 1
    let box=Render.makeSizer(m)
    //console.log( box.min, box.max, box.getSize() );
    let vec=box.getSize()
    let max=Math.max(Math.max(vec.x,vec.y),vec.z)
    let inv=1/max;
    
    model = Render.makeGroup(m);
    if(zAxis)
            model.children[0].rotation.x=Math.PI/2;
        else
            model.children[0].rotation.x=0;
    model.scale.set(inv,inv,inv)
    //model.scale()
    Render.addModel(model)
}

export { animate }