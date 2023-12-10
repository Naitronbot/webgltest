const vertexShader = `#version 300 es
precision highp float;

in vec4 a_position;
out vec2 uv;

void main() {
    gl_Position = a_position;
    uv = 0.5*a_position.xy+0.5;
}
`;

const fragmentShader = `#version 300 es
precision highp float;
    
in vec2 uv;
out vec4 fragColor;

uniform sampler2D u_texture;
uniform int u_frame;

void main() {
    if (u_frame == 0) {
        fragColor = vec4(uv.x, 0.0, uv.y, 1);
    } else {
        fragColor = texture(u_texture, uv) + 0.001 * vec4(1.0, 1.0, 1.0, 0.0);
    }
}
`;

const canvasShader = `#version 300 es
precision highp float;
    
in vec2 uv;
out vec4 fragColor;

uniform sampler2D u_texture;

void main() {
    fragColor = texture(u_texture, uv);
}
`;

export function createVertex(GL: WebGL2RenderingContext) {
    const shader = GL.createShader(GL.VERTEX_SHADER)!;
    GL.shaderSource(shader, vertexShader);
    GL.compileShader(shader);

    if (GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
        return shader;
    }

    throw Error(`ERROR: ${GL.getShaderInfoLog(shader)}`);
}

export function createFragment(GL: WebGL2RenderingContext) {
    const shader = GL.createShader(GL.FRAGMENT_SHADER)!;
    GL.shaderSource(shader, fragmentShader);
    GL.compileShader(shader);

    if (GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
        return shader;
    }
    
    throw Error(`ERROR: ${GL.getShaderInfoLog(shader)}`);
}

export function createCanvas(GL: WebGL2RenderingContext) {
    const shader = GL.createShader(GL.FRAGMENT_SHADER)!;
    GL.shaderSource(shader, canvasShader);
    GL.compileShader(shader);

    if (GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
        return shader;
    }
    
    throw Error(`ERROR: ${GL.getShaderInfoLog(shader)}`);
}