
import create from "./create"

// 打开图片
export let imageOpen = (url) => {
  let img = new Image();
  img.crossOrigin="*"
  return new Promise((resolve, reject) => {
    img.onload = () => {
      resolve(img);
    };
    img.onerror = reject;
    img.src = url;
  });
}

// 旋转图片
export let imageRotate = (imgObj, rotate) => {
  // 计算旋转后宽高
  let rotateWidth = imgObj.width * Math.cos(rotate * Math.PI / 180) + imgObj.height * Math.sin(rotate * Math.PI / 180);
  let rotateHeight = imgObj.height * Math.cos(rotate * Math.PI / 180) + imgObj.width * Math.sin(rotate * Math.PI / 180);
  // 创建图像
  return create(
    rotateWidth,
    rotateHeight
  ).then(canvas => {
    // 取中心点旋转
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;
    let context = canvas.getContext('2d');
    context.save();
    // 旋转画布
    context.translate(centerX, centerY);
    context.rotate((rotate % 360) * Math.PI / 180);
    context.translate(-imgObj.width/2, -imgObj.height/2);
    context.drawImage(imgObj, 0, 0, imgObj.width, imgObj.height);
    context.restore();
    //
    let base64Url = canvas.toDataURL("image/png");
    return imageOpen(base64Url);
  })
}

// 重置大小
export let imageResize = (imgObj, width, height) => {
  return create(
    width,
    height
  ).then(canvas => {
    let context = canvas.getContext('2d');
    context.drawImage(imgObj, 0, 0, width, height);
    //
    let base64Url = canvas.toDataURL("image/png");
    return imageOpen(base64Url);
  })
}
