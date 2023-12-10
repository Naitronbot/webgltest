export function createTextures(GL: WebGL2RenderingContext) {
    const textures = [GL.createTexture()!, GL.createTexture()!] as const;
    
    for (let i = 0; i < 2; i++) {
        GL.bindTexture(GL.TEXTURE_2D, textures[i]);
        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA32F, GL.canvas.width, GL.canvas.height, 0, GL.RGBA, GL.FLOAT, null);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
        GL.bindTexture(GL.TEXTURE_2D, null);
    }

    return textures;
}