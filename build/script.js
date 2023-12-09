"use strict";
(() => {
  // src/shader.ts
  var vertexShader = `#version 300 es
precision highp float;

in vec4 a_position;
out vec2 uv;

void main() {
    gl_Position = a_position;
    uv = 0.5*a_position.xy+0.5;
}
`;
  var fragmentShader = `#version 300 es
precision highp float;
    
in vec2 uv;
out vec4 fragColor;

uniform sampler2D u_texture;
uniform int u_frame;

void main() {
    if (u_frame == 0) {
        fragColor = vec4(uv.x, 0.0, uv.y, 1);
    } else {
        fragColor = texture(u_texture, uv) + 0.005 * vec4(1.0, 1.0, 1.0, 0.0);
    }
}
`;
  var canvasShader = `#version 300 es
precision highp float;
    
in vec2 uv;
out vec4 fragColor;

uniform sampler2D u_texture;

void main() {
    fragColor = texture(u_texture, uv);
}
`;
  function createVertex(GL2) {
    const shader = GL2.createShader(GL2.VERTEX_SHADER);
    GL2.shaderSource(shader, vertexShader);
    GL2.compileShader(shader);
    if (GL2.getShaderParameter(shader, GL2.COMPILE_STATUS)) {
      return shader;
    }
    throw Error(`ERROR: ${GL2.getShaderInfoLog(shader)}`);
  }
  function createFragment(GL2) {
    const shader = GL2.createShader(GL2.FRAGMENT_SHADER);
    GL2.shaderSource(shader, fragmentShader);
    GL2.compileShader(shader);
    if (GL2.getShaderParameter(shader, GL2.COMPILE_STATUS)) {
      return shader;
    }
    throw Error(`ERROR: ${GL2.getShaderInfoLog(shader)}`);
  }
  function createCanvas(GL2) {
    const shader = GL2.createShader(GL2.FRAGMENT_SHADER);
    GL2.shaderSource(shader, canvasShader);
    GL2.compileShader(shader);
    if (GL2.getShaderParameter(shader, GL2.COMPILE_STATUS)) {
      return shader;
    }
    throw Error(`ERROR: ${GL2.getShaderInfoLog(shader)}`);
  }

  // src/textures.ts
  function createTextures(GL2) {
    const textures2 = [GL2.createTexture(), GL2.createTexture()];
    for (let i = 0; i < 2; i++) {
      GL2.bindTexture(GL2.TEXTURE_2D, textures2[i]);
      GL2.texImage2D(GL2.TEXTURE_2D, 0, GL2.RGBA, GL2.canvas.width, GL2.canvas.height, 0, GL2.RGBA, GL2.UNSIGNED_BYTE, null);
      GL2.texParameteri(GL2.TEXTURE_2D, GL2.TEXTURE_MIN_FILTER, GL2.LINEAR);
      GL2.texParameteri(GL2.TEXTURE_2D, GL2.TEXTURE_WRAP_S, GL2.CLAMP_TO_EDGE);
      GL2.texParameteri(GL2.TEXTURE_2D, GL2.TEXTURE_WRAP_T, GL2.CLAMP_TO_EDGE);
      GL2.bindTexture(GL2.TEXTURE_2D, null);
    }
    return textures2;
  }

  // src/script.ts
  var CANVAS = document.querySelector("canvas");
  var GL = CANVAS.getContext("webgl2");
  GL.clearColor(0, 0, 0, 1);
  GL.clear(GL.COLOR_BUFFER_BIT);
  var textureProgram = GL.createProgram();
  var canvasProgram = GL.createProgram();
  var vertexShader2 = createVertex(GL);
  var fragmentShader2 = createFragment(GL);
  var canvasShader2 = createCanvas(GL);
  GL.attachShader(textureProgram, vertexShader2);
  GL.attachShader(textureProgram, fragmentShader2);
  GL.attachShader(canvasProgram, vertexShader2);
  GL.attachShader(canvasProgram, canvasShader2);
  GL.linkProgram(textureProgram);
  GL.linkProgram(canvasProgram);
  var textures = createTextures(GL);
  var framebuffer = GL.createFramebuffer();
  var vertexData = [-1, -1, -1, 1, 1, 1, -1, -1, 1, 1, 1, -1];
  var vertBuffer = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, vertBuffer);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(vertexData), GL.STATIC_DRAW);
  GL.enableVertexAttribArray(0);
  for (let program of [textureProgram, canvasProgram]) {
    const posAttrib = GL.getAttribLocation(program, "a_position");
    GL.enableVertexAttribArray(posAttrib);
    GL.vertexAttribPointer(posAttrib, 2, GL.FLOAT, false, 0, 0);
  }
  var frameUniform = GL.getUniformLocation(textureProgram, "u_frame");
  var frame = 0;
  function draw() {
    drawTexture();
    drawCanvas();
    frame++;
    requestAnimationFrame(draw);
  }
  function drawTexture() {
    GL.bindFramebuffer(GL.FRAMEBUFFER, framebuffer);
    GL.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, textures[frame % 2], 0);
    GL.bindTexture(GL.TEXTURE_2D, textures[(frame + 1) % 2]);
    GL.useProgram(textureProgram);
    GL.uniform1i(frameUniform, frame);
    GL.viewport(0, 0, CANVAS.width, CANVAS.height);
    GL.clearColor(0, 0, 0, 1);
    GL.clear(GL.COLOR_BUFFER_BIT);
    GL.drawArrays(GL.TRIANGLES, 0, 6);
  }
  function drawCanvas() {
    GL.useProgram(canvasProgram);
    GL.bindFramebuffer(GL.FRAMEBUFFER, null);
    GL.viewport(0, 0, CANVAS.width, CANVAS.height);
    GL.clearColor(0, 0, 0, 1);
    GL.clear(GL.COLOR_BUFFER_BIT);
    GL.drawArrays(GL.TRIANGLES, 0, 6);
  }
  requestAnimationFrame(draw);
})();
//# sourceMappingURL=script.js.map
