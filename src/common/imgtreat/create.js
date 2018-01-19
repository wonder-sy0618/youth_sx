

export default (width, height) => {
  let canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return new Promise((resolve, reject) => resolve(canvas));
}
