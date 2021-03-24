/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkviewer"] = self["webpackChunkviewer"] || []).push([["main"],{

/***/ "./src/Main.js":
/*!*********************!*\
  !*** ./src/Main.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"animate\": () => (/* binding */ animate)\n/* harmony export */ });\n/* harmony import */ var _Render_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Render.js */ \"./src/Render.js\");\n\n//import { ipcRenderer } from  'electron';\nlet mainElement;\nlet resizeDebouncer;\n\nlet frog;\nlet model;\nconst fileReader = new FileReader();\n\nlet zAxis=true;\n\nfunction init() {\n    mainElement = document.querySelector('main');\n\n    if (window.api) {\n        window.api.receive(\"client\", (data) => {\n            console.log(`Received ${data} from main process`);\n            alert(data)\n            if (data && data.length) {\n                data.forEach(path => {\n                    if (path) {\n                        if (typeof path == \"object\")\n                            path = path[0]\n\n                        if (path && typeof path ==\"string\" && (path.endsWith('.gltf') || path.endsWith('.glb')))\n                            _Render_js__WEBPACK_IMPORTED_MODULE_0__.loadModel(path, modelProcess)\n                    }\n                })\n            }\n\n        });\n        window.api.send(\"server\", \"check\");\n    }\n\n\n\n\n    _Render_js__WEBPACK_IMPORTED_MODULE_0__.init(mainElement);\n    _Render_js__WEBPACK_IMPORTED_MODULE_0__.loadModel('assets/froggy.glb', m => {\n        frog = m;\n        modelProcess(m)\n    })\n    resize();\n    window.addEventListener('resize', resize);\n    document.body.addEventListener(\"drop\", dropItem);\n    document.body.addEventListener(\"dragover\", dragItemOver);\n    assignButton('.axis',ev=>{\n        zAxis=!zAxis\n        if(zAxis)\n            model.children[0].rotation.x=Math.PI/2;\n        else\n            model.children[0].rotation.x=0;\n    })\n\n\n\n}\ninit();\nfunction assignButton(query,callback){\n    let element=document.querySelector(query);\n    if(element)\n        element.addEventListener('click',callback)\n}\n\n\nfunction resize() {\n\n    clearTimeout(resizeDebouncer);\n    resizeDebouncer = setTimeout(function() {\n        //svg.setAttribute('width', window.innerWidth + \"px\")\n        //svg.setAttribute('height', window.innerHeight + \"px\")\n        //barAdjust();\n        if (_Render_js__WEBPACK_IMPORTED_MODULE_0__) {\n            _Render_js__WEBPACK_IMPORTED_MODULE_0__.resize();\n        }\n        //UI.systemMessage('inner ' + window.innerWidth + '; screen ' + window.screen.width, 'success')\n    }, 250);\n}\n\nfunction animate(delta) {\n    if (model)\n        model.rotation.z += delta;\n}\n\nfunction dropItem(e) {\n    e.preventDefault();\n    e.stopPropagation();\n    var data = e.dataTransfer.getData(\"text\");\n\n    let file = e.dataTransfer.files[0];\n\n\n    fileReader.addEventListener(\"load\", function() {\n        // convert image file to base64 string\n\n        //preview.src = reader.result;\n\n        _Render_js__WEBPACK_IMPORTED_MODULE_0__.parseModel(fileReader.result, modelProcess);\n    }, false);\n    //FileReader.readAsDataURL()\n    if (file) {\n        if (file.name.endsWith('.gltf') || file.name.endsWith('.glb')) {\n            fileReader.readAsArrayBuffer(file)\n        }\n        //readAsText(file); readAsBinaryString\n    }\n\n\n    //sendFile(file);\n    return false;\n}\n\nfunction dragItemOver(e) {\n    e.stopPropagation();\n    e.preventDefault();\n    e.dataTransfer.dropEffect = 'copy'\n}\n\nfunction modelProcess(m) {\n    if(model)\n        model.position.z -= 1\n    let box=_Render_js__WEBPACK_IMPORTED_MODULE_0__.makeSizer(m)\n    //console.log( box.min, box.max, box.getSize() );\n    let vec=box.getSize()\n    let max=Math.max(Math.max(vec.x,vec.y),vec.z)\n    let inv=1/max;\n    \n    model = _Render_js__WEBPACK_IMPORTED_MODULE_0__.makeGroup(m);\n    if(zAxis)\n            model.children[0].rotation.x=Math.PI/2;\n        else\n            model.children[0].rotation.x=0;\n    model.scale.set(inv,inv,inv)\n    //model.scale()\n    _Render_js__WEBPACK_IMPORTED_MODULE_0__.addModel(model)\n}\n\n\n\n//# sourceURL=webpack://viewer/./src/Main.js?");

/***/ }),

/***/ "./src/Render.js":
/*!***********************!*\
  !*** ./src/Render.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"init\": () => (/* binding */ init),\n/* harmony export */   \"bufferPrint\": () => (/* binding */ bufferPrint),\n/* harmony export */   \"addModel\": () => (/* binding */ addModel),\n/* harmony export */   \"loadModel\": () => (/* binding */ loadModel),\n/* harmony export */   \"parseModel\": () => (/* binding */ parseModel),\n/* harmony export */   \"makeGroup\": () => (/* binding */ makeGroup),\n/* harmony export */   \"makeSizer\": () => (/* binding */ makeSizer),\n/* harmony export */   \"specterMaterial\": () => (/* binding */ specterMaterial),\n/* harmony export */   \"resize\": () => (/* binding */ resize)\n/* harmony export */ });\n/* harmony import */ var _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/three.module.js */ \"./src/lib/three.module.js\");\n/* harmony import */ var _lib_GLTFLoader_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/GLTFLoader.js */ \"./src/lib/GLTFLoader.js\");\n/* harmony import */ var _Main_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Main.js */ \"./src/Main.js\");\n\n\n\n\n\n//import * as Control from \"./Control.js?v=16\";\n//import * as World from \"./World.js?v=16\";\n//import {OrbitControls} from \"./lib/OrbitControls.js\";\n//import * as Texture from \"./Texture.js?v=16\";\n//import * as Stats from \"./lib/stats.js\";\n//import * as AssetManager from \"./AssetManager.js?v=16\";\n//import * as Experiment from \"./Experiment.js?v=16\";\n\n\nvar camera, renderer;\n\nvar docWidth, docHeight;\n\nvar loader;\nvar mixer;\n\nvar SHADOW_SIZE = 2048;\nvar SIZE_DIVIDER = 8;\n\nvar alphaCanvas;\nvar betaCanvas;\n\n\nvar activeCanvas;\n\nvar composer;\n\nvar specterMaterial;\nvar mainScene;\n\n\nfunction init(dom, initialScene) {\n    mainScene=new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__.Scene();\n\n    camera = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 5000);\n    camera.position.z = 2; //400\n    camera.position.y = -2; //-800\n    camera.up = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 0, 1)\n\n    camera.lookAt(new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 0, 0));\n\n\n    alphaCanvas = document.createElement('div');\n    betaCanvas = document.createElement('div');\n    alphaCanvas.classList.add('canvas-holder');\n    betaCanvas.classList.add('canvas-holder');\n    betaCanvas.style.background = '#fff5'\n    alphaCanvas.reserved = false;\n    betaCanvas.reserved = false;\n\n\n    renderer = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__.WebGLRenderer({ alpha: true, antialias: true });\n    renderer.shadowMap.enabled = true;\n    renderer.shadowMap.type = _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__.PCFSoftShadowMap;\n\n    renderer.setClearColor(0xb0e9fd, 1); //0xb0e9fd,1);//0xb0e9fd,1)\n\n    alphaCanvas.appendChild(renderer.domElement);\n\n    loader = new _lib_GLTFLoader_js__WEBPACK_IMPORTED_MODULE_1__.GLTFLoader();\n\n    initCustomMaterial();\n    initObjects();\n\n    activeCanvas = alphaCanvas;\n    dom.appendChild(alphaCanvas)\n\n\n\n    //resize();\n\n\n    animate();\n}\nfunction initObjects(){\n    const geometry = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__.PlaneBufferGeometry(10,10);\n    const material = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__.MeshBasicMaterial({ color: 0xffff00, side: _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__.DoubleSide });\n    const plane = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__.Mesh(geometry, material);\n    plane.position.z=-1;\n    mainScene.add(plane)\n\n    let ambientLight = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__.AmbientLight(0xffffff); // soft white light\n    mainScene.add(ambientLight);\n    let sunLight = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__.DirectionalLight(0xffffff, 0.6); //DirectionalLight\n    sunLight.position.set(0, 1, 0);\n    sunLight.castShadow = true;\n    mainScene.add(sunLight);\n    let sunTarget = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__.Object3D();\n    sunTarget.position.set(-20, 0, -20);\n    mainScene.add(sunTarget);\n    sunLight.target = sunTarget;\n}\n\nfunction getAlphaCanvas() {\n    return alphaCanvas;\n}\n\nfunction getBetaCanvas() {\n    return betaCanvas;\n}\n\nfunction loadModel(model, callback, texture, color) {\n    loader.load(\n        ('' + model), //villager22.gltf',\n        (gltf) => {\n            // called when the resource is loaded\n            //gltf.scene.scale.set(10,10,10);\n            let model; //=gltf.scene.children[0];\n            gltf.scene.rotation.x = Math.PI / 2;\n            gltf.scene.traverse(function(child) {\n                if (child instanceof _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__.Mesh) {\n                    //if(child.name==\"Cube\"){\n                    model = child;\n                    if (!texture) {\n                        if (color)\n                            child.material = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__.MeshStandardMaterial({ color: color, metalness: 0, roughness: 1.0 }); // \n                        else\n                            child.material = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__.MeshStandardMaterial({ vertexColors: _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__.VertexColors, metalness: 0, roughness: 1.0}); // \n                        //specterMaterial\n                        child.material.needsUpdate = true;\n                        //child.material.skinning=true;\n                    }\n                    //child.material.morphTargets=true;\n\n                    //child.material.map.needsUpdate = true;\n                    // }else{\n\n                    //}\n                }\n            });\n            //gltf.scene.children[0].children[1].scale.set(20,20,20);\n            //gltf.scene.children.pop();\n            //let mixer = new THREE.AnimationMixer( gltf.scene );\n            //model=gltf.scene.children[0]\n            let m2 = gltf.scene.children[0];\n            if (model) {\n                var animations = gltf.animations;\n                if (animations && animations.length) {\n\n                    mixer = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__.AnimationMixer(model);\n                    for (var i = 0; i < animations.length; i++) {\n                        var animation = animations[i];\n                        // There's .3333 seconds junk at the tail of the Monster animation that\n                        // keeps it from looping cleanly. Clip it at 3 seconds\n\n                        //if ( sceneInfo.animationTime ) {\n                        //    animation.duration = sceneInfo.animationTime;\n\n\n                        // }\n                        action = mixer.clipAction(animation);\n                        //action.setEffectiveTimeScale(200);\n                        //action.timeScale=0.002;\n                        action.timeScale = 0.002;\n                        //if ( state.playAnimation ) \n                        action.play();\n                    }\n                }\n                //mainScene.add( gltf.scene.children[0] );\n            }\n            callback(gltf.scene);\n        },\n        (xhr) => {\n            // called while loading is progressing\n            console.log(`${( xhr.loaded / xhr.total * 100 )}% loaded`);\n        },\n        (error) => {\n            // called when loading has errors\n            console.error('An error happened', error);\n        },\n    );\n}\nfunction parseModel(text,callback){\n    loader.parse(text,'',gltf=>{\n        gltf.scene.traverse(function(child) {\n                if (child instanceof _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__.Mesh) {\n                    child.material = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__.MeshStandardMaterial({ vertexColors: _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__.VertexColors, metalness: 0, roughness: 1.0}); // \n                }\n        });\n        callback(gltf.scene)\n    }, error=>{\n            console.error( error );\n    });\n}\n\nfunction resize() {\n    //Math.max(window.screen.width, window.innerWidth)\n    //Math.max(window.screen.height, window.innerHeight)\n\n    /*\n    if(window.screen.width> window.innerWidth){\n        docWidth =  window.innerWidth\n        docHeight = window.innerHeight\n    }else{\n        docWidth =  window.screen.width\n        docHeight = window.screen.height\n    }*/\n    if (alphaCanvas.custom) {\n        docWidth = alphaCanvas.custom;\n        docHeight = alphaCanvas.custom\n    } else {\n        docWidth = document.documentElement.clientWidth\n        docHeight = document.documentElement.clientHeight\n    }\n    //docWidth =  window.innerWidth //Math.max(window.screen.width, window.innerWidth)\n    //docHeight = window.innerHeight //Math.max(window.screen.height, window.innerHeight)//window.innerHeight;\n\n    camera.aspect = docWidth / docHeight;\n    camera.updateProjectionMatrix();\n\n    renderer.setPixelRatio(1); //window.devicePixelRatio / SIZE_DIVIDER);\n    renderer.setSize(docWidth, docHeight);\n\n}\nvar lastTime = 0\n\nfunction animate(time) {\n    let delta = time - lastTime;\n    delta /= 1000.0\n\n    lastTime = time;\n    _Main_js__WEBPACK_IMPORTED_MODULE_2__.animate(delta);\n    \n    renderer.render(mainScene, camera);\n    //composer.render();\n\n    requestAnimationFrame(animate);\n}\n\nfunction dumpImage(img) {\n    let dom = document.querySelector('#afterImage');\n    if (dom)\n        dom.setAttribute('src', img);\n}\n\nfunction bufferPrint() {\n    //_grabImage=true;\n    renderer.render(getScene(), camera);\n    dumpImage(renderer.domElement.toDataURL());\n}\n\nvar anchors = [];\n\nfunction addAnchor(host, bubble) {\n    let anchor = {\n        host: host,\n        bubble: bubble,\n        x: 0,\n        y: 0,\n        offset: 0,\n    }\n    anchors.forEach(a => {\n        if (a.host == host) {\n            a.offset -= 40;\n        }\n    })\n    anchors.push(anchor);\n    console.log(anchors.length + ' anchors');\n    updateAnchor(anchor, anchors.length - 1);\n    return anchor;\n}\n\nfunction updateAnchor(anchor, index) {\n    if (!anchor.bubble) {\n        anchors.splice(index, 1);\n        return false;\n    }\n    if (anchor.host) {\n        let vector = projectVector(anchor.host);\n        anchor.bubble.style.left = -16 + vector.x + 'px';\n        anchor.bubble.style.top = (40 + anchor.offset + vector.y) + 'px';\n        anchor.x = vector.x;\n        anchor.y = vector.y;\n    }\n\n}\n\nfunction roundEdge(x) {\n    x = x % (Math.PI)\n    if (x < 0)\n        x += Math.PI * 2;\n\n    if (x > Math.PI / 4) {\n        if (x > 5 * Math.PI / 4) {\n            if (x < 7 * Math.PI / 4) {\n                return Math.PI * 3 / 2;\n            }\n        } else {\n            if (x > 3 * Math.PI / 4) {\n                return Math.PI;\n            } else {\n                return Math.PI / 2;\n            }\n        }\n    }\n    return 0;\n}\n\nfunction syncModel(index, obj) {\n    let m = modelsIndexed[index];\n    m.position.x = obj.x;\n    m.position.y = obj.y;\n    m.position.z = obj.z;\n}\n\nfunction createModel(index) {\n    let model = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__.Mesh(cubeGeometry, cubeMaterial);\n    modelsIndexed[index] = model;\n    return model;\n}\n/*\nfunction cubit(w,h,d,x,y,z,color,layer){\n    let geom = new THREE.BoxBufferGeometry( w, h, d );\n    let mat;\n    if(color)\n        mat=new THREE.MeshStandardMaterial( { color: parseInt(color)} );\n    \n    let model = new THREE.Mesh( geom,mat);\n    model.position.x=x;\n    model.position.y=y;\n    model.position.z=z;\n    model.castShadow=true;\n    model.receiveShadow=true;\n    if(layer!=undefined && scenes[layer]){\n        scenes[layer].add(model);\n    }else\n       scenes[0].add(model);\n    return model;\n}*/\nfunction getRandomColor() {\n    var letters = '0123456789ABCDEF';\n    var color = Math.random() > 0.5 ? 0x66B136 : 0x76610E;\n    return parseInt(color);\n}\n\nfunction applyCursor() {\n    if (Control.down()) {\n        pointer.material = pointerMatOn;\n    } else\n        pointer.material = pointerMat;\n    var vector = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__.Vector3();\n    vector.set((Control.screenX() / window.innerWidth) * 2 - 1, -(Control.screenY() / window.innerHeight) * 2 + 1, 0.5);\n    vector.unproject(camera)\n    var dir = vector.sub(camera.position).normalize();\n    var distance = -camera.position.z / dir.z;\n    var pos = camera.position.clone().add(dir.multiplyScalar(distance));\n\n    pointer.position.x = pos.x;\n    pointer.position.y = pos.y\n    Control.setVector(pointer.position);\n\n}\n\nfunction projectVector(object) {\n\n    var width = docWidth,\n        height = docHeight;\n    var widthHalf = width / 2,\n        heightHalf = height / 2;\n\n    let vector = object.position.clone();\n    vector.z += 30\n    //vector.applyMatrix4(object.matrixWorld);\n    vector.project(camera)\n\n    //var projector = new THREE.Projector();\n    //projector.projectVector( vector.setFromMatrixPosition( object.matrixWorld ), camera );\n\n    vector.x = (vector.x * widthHalf) + widthHalf;\n    vector.y = -(vector.y * heightHalf) + heightHalf;\n    return vector;\n\n}\n\n\nvar specterMaterial\n\nfunction initCustomMaterial() {\n\n    var meshphysical_frag = `\n    #define STANDARD\n#ifdef PHYSICAL\n    #define REFLECTIVITY\n    #define CLEARCOAT\n    #define TRANSPARENCY\n#endif\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform float roughness;\nuniform float metalness;\nuniform float opacity;\n#ifdef TRANSPARENCY\n    uniform float transparency;\n#endif\n#ifdef REFLECTIVITY\n    uniform float reflectivity;\n#endif\n#ifdef CLEARCOAT\n    uniform float clearcoat;\n    uniform float clearcoatRoughness;\n#endif\n#ifdef USE_SHEEN\n    uniform vec3 sheen;\n#endif\nvarying vec3 vViewPosition;\n#ifndef FLAT_SHADED\n    varying vec3 vNormal;\n    #ifdef USE_TANGENT\n        varying vec3 vTangent;\n        varying vec3 vBitangent;\n    #endif\n#endif\n#include <common>\n#include <packing>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <uv2_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <bsdfs>\n#include <cube_uv_reflection_fragment>\n#include <envmap_common_pars_fragment>\n#include <envmap_physical_pars_fragment>\n#include <fog_pars_fragment>\n#include <lights_pars_begin>\n#include <lights_physical_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n\n#include <roughnessmap_pars_fragment>\n#include <metalnessmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n    #include <clipping_planes_fragment>\n    vec4 diffuseColor = vec4( diffuse, opacity );\n    ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n    vec3 totalEmissiveRadiance = emissive;\n    #include <logdepthbuf_fragment>\n    #include <map_fragment>\n    #include <color_fragment>\n    #include <alphamap_fragment>\n    #include <alphatest_fragment>\n    #include <roughnessmap_fragment>\n    #include <metalnessmap_fragment>\n    #include <normal_fragment_begin>\n    #include <normal_fragment_maps>\n    #include <clearcoat_normal_fragment_begin>\n    #include <clearcoat_normal_fragment_maps>\n    #include <emissivemap_fragment>\n    #include <lights_physical_fragment>\n    #include <lights_fragment_begin>\n    #include <lights_fragment_maps>\n    #include <lights_fragment_end>\n    #include <aomap_fragment>\n    vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;\n    #ifdef TRANSPARENCY\n        diffuseColor.a *= saturate( 1. - transparency + linearToRelativeLuminance( reflectedLight.directSpecular + reflectedLight.indirectSpecular ) );\n    #endif\n    float v=clamp(1.-((0.2125 * outgoingLight.r) + (0.7154 * outgoingLight.g) + (0.0721 * outgoingLight.b)),0.1,1.0);\n    gl_FragColor = vec4(outgoingLight,v);//vec4( outgoingLight,1.-(((0.2125 * outgoingLight.r) + (0.7154 * outgoingLight.g) + (0.0721 * outgoingLight.b)) ) );\n    #include <tonemapping_fragment>\n    #include <encodings_fragment>\n    #include <fog_fragment>\n    #include <premultiplied_alpha_fragment>\n    #include <dithering_fragment>\n}`\n\n    //gl_FragColor = vec4( outgoingLight, diffuseColor.a );\n\n\n    /*\n    #ifdef USE_COLOR\n                if(vColor==vec3(0,0,1))\n                    diffuseColor.rgb *= vec3(1,0,0);\n                else\n                    diffuseColor.rgb *= vColor;\n        #endif*/\n\n    //    #include <color_vertex>\n\n    var meshphysical_vert = `#define STANDARD\nvarying vec3 vViewPosition;\n#ifndef FLAT_SHADED\n    varying vec3 vNormal;\n    #ifdef USE_TANGENT\n        varying vec3 vTangent;\n        varying vec3 vBitangent;\n    #endif\n#endif\n#include <common>\n#include <uv_pars_vertex>\n#include <uv2_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\n\nuniform vec3 shirt;\nuniform vec3 wind;\n\nvoid main() {\n    #include <uv_vertex>\n    #include <uv2_vertex>\n    #ifdef USE_COLOR\n        if(color==vec3(0,0,1))\n            vColor.xyz = shirt;\n        else\n            vColor.xyz = color.xyz;\n        \n    #endif\n    #include <beginnormal_vertex>\n    #include <morphnormal_vertex>\n    #include <skinbase_vertex>\n    #include <skinnormal_vertex>\n    #include <defaultnormal_vertex>\n#ifndef FLAT_SHADED\n    vNormal = normalize( transformedNormal );\n    #ifdef USE_TANGENT\n        vTangent = normalize( transformedTangent );\n        vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );\n    #endif\n#endif\n    #include <begin_vertex>\n    #include <morphtarget_vertex>\n    #include <skinning_vertex>\n    #include <displacementmap_vertex>\n\n    \n        if(color==vec3(1,0,0)){\n            float val=max(0.0, 1.0976 - transformed.z);\n            transformed.xyz+=val*wind;\n            transformed.y*=1.0+sin((wind.z+transformed.z)*4.0)/2.0;\n\n        }\n    \n\n    #include <project_vertex>\n    #include <logdepthbuf_vertex>\n    #include <clipping_planes_vertex>\n    vViewPosition = - mvPosition.xyz;\n    #include <worldpos_vertex>\n    #include <shadowmap_vertex>\n    #include <fog_vertex>\n}`\n\n    var uniforms = _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__.UniformsUtils.merge(\n        [_lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__.ShaderLib.standard.uniforms,\n            //{shirt: {value:new THREE.Vector3(0,1,0)},\n            //wind: {value:new THREE.Vector3(0,0,0)}}\n        ]\n    );\n\n    /*specterMaterial =  new THREE.ShaderMaterial({\n    uniforms: uniforms,\n    fragmentShader: fragmentShader(),\n    vertexShader: vertexShader(),\n  })**/\n\n\n    specterMaterial = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__.ShaderMaterial({\n        uniforms: uniforms,\n        derivatives: false,\n        lights: true,\n        vertexColors: true,\n        vertexShader: meshphysical_vert,\n        fragmentShader: meshphysical_frag,\n        roughness: 0.0,\n        metalness: 1.0,\n        //vertexShader: THREE.ShaderChunk.cube_vert,\n        //fragmentShader: THREE.ShaderChunk.cube_frag\n    });\n\n}\n\nfunction addModel(model){\n    mainScene.add(model)\n}\nfunction makeGroup(model){\n    let group= new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__.Group();\n    if(model)\n        group.add(model)\n    return group;\n\n}\n\n\nfunction makeSizer(model){\n    var box = new _lib_three_module_js__WEBPACK_IMPORTED_MODULE_0__.Box3().setFromObject( model );\n    return box\n}\n\n\n\n\n\n\n//# sourceURL=webpack://viewer/./src/Render.js?");

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ "use strict";
/******/ 
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["libs"], () => (__webpack_exec__("./src/Main.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);