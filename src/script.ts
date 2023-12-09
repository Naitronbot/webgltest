import { createCanvas, createFragment, createVertex } from "./shader.ts";
import { createTextures } from "./textures.ts";

const CANVAS = document.querySelector("canvas")!;
const GL = CANVAS.getContext("webgl2")!;

GL.clearColor(0.0, 0.0, 0.0, 1.0);
GL.clear(GL.COLOR_BUFFER_BIT);

const textureProgram = GL.createProgram()!;
const canvasProgram = GL.createProgram()!;
const vertexShader = createVertex(GL);
const fragmentShader = createFragment(GL);
const canvasShader = createCanvas(GL);

GL.attachShader(textureProgram, vertexShader);
GL.attachShader(textureProgram, fragmentShader);

GL.attachShader(canvasProgram, vertexShader);
GL.attachShader(canvasProgram, canvasShader);

GL.linkProgram(textureProgram);
GL.linkProgram(canvasProgram);

const textures = createTextures(GL);
const framebuffer = GL.createFramebuffer()!;

const vertexData = [-1, -1, -1, 1, 1, 1, -1, -1, 1, 1, 1, -1];
const vertBuffer = GL.createBuffer();
GL.bindBuffer(GL.ARRAY_BUFFER, vertBuffer);
GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(vertexData), GL.STATIC_DRAW);
    
GL.enableVertexAttribArray(0);

for (let program of [textureProgram, canvasProgram]) {
    const posAttrib = GL.getAttribLocation(program, "a_position");
    GL.enableVertexAttribArray(posAttrib);
    GL.vertexAttribPointer(posAttrib, 2, GL.FLOAT, false, 0, 0);
}

const frameUniform = GL.getUniformLocation(textureProgram, "u_frame")!;

let frame = 0;
function draw() {
    drawTexture();

    drawCanvas();

    frame++;
    requestAnimationFrame(draw);
}

function drawTexture() {
    GL.bindFramebuffer(GL.FRAMEBUFFER, framebuffer);
    GL.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, textures[frame%2], 0);

    GL.bindTexture(GL.TEXTURE_2D, textures[(frame+1)%2]);

    GL.useProgram(textureProgram);

    GL.uniform1i(frameUniform, frame);

    GL.viewport(0, 0, CANVAS.width, CANVAS.height);
    GL.clearColor(0.0, 0.0, 0.0, 1.0);
    GL.clear(GL.COLOR_BUFFER_BIT);
    GL.drawArrays(GL.TRIANGLES, 0, 6);
}

function drawCanvas() {
    GL.useProgram(canvasProgram);
    
    GL.bindFramebuffer(GL.FRAMEBUFFER, null);

    GL.viewport(0, 0, CANVAS.width, CANVAS.height);
    GL.clearColor(0.0, 0.0, 0.0, 1.0);
    GL.clear(GL.COLOR_BUFFER_BIT);
    GL.drawArrays(GL.TRIANGLES, 0, 6);
}

requestAnimationFrame(draw);