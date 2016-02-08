import { isPOT } from 'math-utils';
import Texture from '@vaalentin/gl-texture';

/**
 * @class Fbo
 */
export default class Fbo {
  /**
   * @constructs Fbo
   * @param {WebGLRenderingContext} gl
   * @param {uint} width
   * @param {uint} height
   */
  constructor(gl, width, height) {
    this.gl = gl;

    this.width = width;
    this.height = height;

    this.fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);

    this.texture = new Texture(gl, gl.TEXTURE_2D, this.width, this.height);

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture.texture, 0);

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  /**
   * @method bind
   * @public
   */
  bind() {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fbo);
  }

  /**
   * @method unbind
   * @public
   */
  unbind() {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
  }

  /**
   * @method dispose
   * @public
   */
  dispose() {
    this.gl.deleteFramebuffer(this.fbo);
    this.fbo = null;
    this.texture.dispose();
  }
}
