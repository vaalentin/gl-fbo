import getPlaneGeometry from '@vaalentin/geo-plane';
import Program from '@vaalentin/gl-program';
import Buffer from '@vaalentin/gl-buffer';

// TODO accept texture instead of fbo
export default class FboHelper {
  constructor(gl, fbo, width = 0.25, height = 0.25, left = 0, top = 0) {
    this.gl = gl;
    this.fbo = fbo;

    this.program = new Program(gl,
      `
      attribute vec3 aPosition;
      attribute vec2 aUv;

      varying vec2 vUv;

      void main() {
        vUv = aUv;
        gl_Position = vec4(aPosition, 1.0);
      }
      `,
      `
      precision mediump float;

      uniform sampler2D uTexture;

      varying vec2 vUv;

      void main() {
        gl_FragColor = texture2D(uTexture, vUv);
      }
      `
    );

    this.program.addAttribute('aPosition', 3, gl.FLOAT);
    this.program.addAttribute('aUv', 2, gl.FLOAT);
    this.program.addUniform('uTexture', gl.INT);

    const planeWidth = 2 * width;
    const planeHeight = 2 * height;

    const planeGeometry = getPlaneGeometry(planeWidth, planeHeight, 1, 1);

    const planeOffsetLeft = (1 - (planeWidth / 2)) - (2 * left);
    const planeOffsetTop = 1 - (planeHeight / 2) - (2 * top);

    for(let i = 0; i < planeGeometry.verts.length; i += 3) {
      planeGeometry.verts[i] -= planeOffsetLeft;
      planeGeometry.verts[i + 1] += planeOffsetTop;
    }

    this.planeVerticesBuffer = new Buffer(gl, gl.ARRAY_BUFFER, planeGeometry.verts);
    this.planeUvsBuffer = new Buffer(gl, gl.ARRAY_BUFFER, planeGeometry.uvs);
    this.planeFacesBuffer = new Buffer(gl, gl.ELEMENT_ARRAY_BUFFER, planeGeometry.faces);
  }

  render() {
    const { gl } = this;

    this.program.bind();
    this.planeVerticesBuffer.bind();
    this.program.setAttributePointer('aPosition');
    this.planeUvsBuffer.bind();
    this.program.setAttributePointer('aUv');
    this.planeFacesBuffer.bind();
    
    // fbo should use gl-texture
    gl.activeTexture(gl.TEXTURE0 + 1);
    gl.bindTexture(gl.TEXTURE_2D, this.fbo.texture);
    this.program.setUniform('uTexture', 1);

    gl.drawElements(gl.TRIANGLES, this.planeFacesBuffer.length, gl.UNSIGNED_SHORT, 0);
  }
}
