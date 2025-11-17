const canvasEl = document.querySelector("#fire-overlay");
const devicePixelRatio = Math.min(window.devicePixelRatio, 2);

let startTime = performance.now();
let animationProgress = 0.3;

let uniforms;
let textTexture;

// 🔑 Load an image as a WebGL texture
function createImageTexture(gl, url, callback) {
  const image = new Image();
  image.crossOrigin = "anonymous"; // allow Supabase public URLs
  image.onload = function () {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    callback(texture);
  };
  image.src = url;
}

function initShader() {
  const vsSource = document.getElementById("vertShader").innerHTML;
  const fsSource = document.getElementById("fragShader").innerHTML;

  const gl =
    canvasEl.getContext("webgl") || canvasEl.getContext("experimental-webgl");

  if (!gl) {
    alert("WebGL is not supported by your browser.");
    return null;
  }

  function createShader(gl, sourceCode, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, sourceCode);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(
        "An error occurred compiling the shaders: " +
          gl.getShaderInfoLog(shader)
      );
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  const vertexShader = createShader(gl, vsSource, gl.VERTEX_SHADER);
  const fragmentShader = createShader(gl, fsSource, gl.FRAGMENT_SHADER);

  function createShaderProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(
        "Unable to initialize the shader program: " +
          gl.getProgramInfoLog(program)
      );
      return null;
    }

    return program;
  }

  const shaderProgram = createShaderProgram(gl, vertexShader, fragmentShader);
  uniforms = getUniforms(shaderProgram);

  function getUniforms(program) {
    const uniforms = {};
    const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < uniformCount; i++) {
      const uniformName = gl.getActiveUniform(program, i).name;
      uniforms[uniformName] = gl.getUniformLocation(program, uniformName);
    }
    return uniforms;
  }

  const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  gl.useProgram(shaderProgram);

  const positionLocation = gl.getAttribLocation(shaderProgram, "a_position");
  gl.enableVertexAttribArray(positionLocation);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  // 🔑 Load your bare logo image into the shader
createImageTexture(
  gl,
  "",
  function (tex) {
    textTexture = tex;
    resizeCanvas();
    render();
  }
);

  return gl;
}

const gl = initShader();

function render() {
  const currentTime = performance.now();
  const elapsed = (currentTime - startTime) / 8000;

  if (elapsed <= 1) {
    animationProgress = 0.3 + 0.7 * easeInOut(elapsed);
  } else {
    canvasEl.style.display = "none";
    return;
  }

  gl.uniform1f(uniforms.u_time, currentTime);
  gl.uniform1f(uniforms.u_progress, animationProgress);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, textTexture);
  gl.uniform1i(uniforms.u_text, 0);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  requestAnimationFrame(render);
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function resizeCanvas() {
  canvasEl.width = window.innerWidth * devicePixelRatio;
  canvasEl.height = window.innerHeight * devicePixelRatio;
  gl.viewport(0, 0, canvasEl.width, canvasEl.height);
  gl.uniform2f(uniforms.u_resolution, canvasEl.width, canvasEl.height);
}

window.addEventListener("resize", resizeCanvas);
