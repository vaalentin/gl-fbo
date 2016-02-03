import getGl from '@vaalentin/gl-context';
import Program from '@vaalentin/gl-program';
import getPlaneGeometry from '@vaalentin/geo-plane';
import Buffer from '@vaalentin/gl-buffer';
import Fbo from '../src/';

const WIDTH = 400;
const HEIGHT = 400;

const canvas = document.createElement('canvas');
canvas.width = WIDTH;
canvas.height = HEIGHT;
document.body.appendChild(canvas);

const gl = getGl(canvas);
gl.viewport(0, 0, WIDTH, HEIGHT);

const renderProgram = new Program(gl,
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

  varying vec2 vUv;

  void main() {
    gl_FragColor = vec4(vUv, 1.0, 1.0);
  }
  `
);

renderProgram.addAttribute('aPosition', 3, gl.FLOAT);
renderProgram.addAttribute('aUv', 2, gl.FLOAT);

const planeGeometry = getPlaneGeometry(2, 2, 1, 1);
const positionsBuffer = new Buffer(gl, gl.ARRAY_BUFFER, planeGeometry.verts);
const uvsBuffer = new Buffer(gl, gl.ARRAY_BUFFER, planeGeometry.uvs);
const facesBuffer = new Buffer(gl, gl.ELEMENT_ARRAY_BUFFER, planeGeometry.faces);

const fbo = new Fbo(gl, WIDTH, HEIGHT);

(function tick() {
  gl.clear(gl.COLOR_DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

  renderProgram.bind();
  positionsBuffer.bind();
  renderProgram.setAttributePointer('aPosition');
  uvsBuffer.bind();
  renderProgram.setAttributePointer('aUv');
  facesBuffer.bind();

  fbo.bind();

  gl.drawElements(gl.TRIANGLES, facesBuffer.length, gl.UNSIGNED_SHORT, 0);

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  requestAnimationFrame(tick);
})();
