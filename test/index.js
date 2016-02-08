import test from 'tape';
import getGl from '@vaalentin/gl-context';
import Texture from '@vaalentin/gl-texture';
import Fbo from '../src';

const canvas = document.createElement('canvas');
const gl = getGl(canvas);

test('should be instanciable', t => {
  t.plan(1);

  const fbo = new Fbo(gl, 512, 512);

  t.ok(fbo instanceof Fbo, 'instance of Fbo');
});

test('should expose a texture', t => {
  t.plan(1);

  const fbo = new Fbo(gl, 512, 512);

  t.ok(fbo.texture instanceof Texture, 'instance of Texture');
});

test('bind should make it the active fbo', t => {
  t.plan(2);

  const fbo = new Fbo(gl, 512, 512);
  fbo.bind();

  t.equal(gl.getParameter(gl.FRAMEBUFFER_BINDING), fbo.fbo, 'fbo is active');

  fbo.unbind();

  t.notEqual(gl.getParameter(gl.FRAMEBUFFER_BINDING), fbo.fbo, 'fbo is not active');
});

test('dispose should delete fbo and texture', t => {
  t.plan(2);

  const fbo = new Fbo(gl, 512, 512);
  fbo.dispose();

  t.equal(fbo.fbo, null, 'fbo deleted');
  t.equal(fbo.texture.texture, null, 'texture deleted');
});

test.onFinish(window.close.bind(window));

