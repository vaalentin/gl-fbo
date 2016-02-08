# GL Fbo

WebGL framebuffer wrapper.

## Installation

```sh
$ npm install --save @vaalentin/gl-fbo
```

## Usage

```js
import Fbo from '@vaalentin/gl-fbo';

// setup gl, program and buffers

const fbo = new Fbo(gl, 512, 512);

// render to fbo
fbo.bind();
gl.drawElements(gl.POINTS, 0, 6);
fbo.unbind();

// render to default framebuffer
gl.drawElements(gl.POINTS, 0, 6);
```

## API

#### `fbo = new Fbo(gl, width, height)`

Create a new instance, where `gl` is the [WebGL context](https://github.com/vaalentin/gl-context).

#### `fbo.bind()`

Make the fbo the active one. Every draw calls will target him. To restore the default framebuffer call `fbo.unbind()` or `gl.bindFramebuffer(gl.FRAMEBUFFER, null)`.

#### `fbo.unbind()`

Same as calling `gl.bindFramebuffer(gl.FRAMEBUFFER, null);`.

#### `fbo.dispose()`

Delete instance and underlying `Texture`. Calls `gl.deleteFramebuffer`.

## License

MIT, see [LICENSE.md](https://github.com/vaalentin/gl-fbo/blob/master/LICENSE.md) for more details.
