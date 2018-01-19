
import extend from "extend"

// 输出文本
// 位置都以左上角为准
export let textDraw = (canvas, text, posX, posY, option) => {
  const defaultOption = {
    font : '20px 黑体',
    fillStyle : 'blue',
    lineSpacing : 1,    // 行间距，倍数
    wordSpacing : 1,    // 字间距，倍数
    middlePos : false,  // 以显示的中点为测量
    isVertical : false
  };
  let opt = extend({}, defaultOption, option)
  //
  let context = canvas.getContext("2d");
  context.font = opt.font;
  context.fillStyle = opt.fillStyle;
  let textHeight = parseInt(context.font.match(/\d+/), 10) * opt.lineSpacing;
  if (opt.isVertical == true) {
    let maxCharWidth = 0;
    for (let i=0; i<text.length; i++) {
      let width = context.measureText(text[i]).width
      if (width > maxCharWidth) maxCharWidth = width;
    }
    maxCharWidth = maxCharWidth * opt.wordSpacing
    // 以中点测量y轴
    if (opt.middlePos) {
      let maxRowHeight = 0;
      for (let i=0; i<text.split("\n").length; i++) {
        let height = text.split("\n")[i].length * textHeight;
        if (height > maxRowHeight) maxRowHeight = height;
      }
      posY = posY - maxRowHeight / 2;
      //
      posX = posX - textHeight * text.split("\n").length / 2
    }
    //
    let textLineArray = text.split("\n");
    for (let i=0; i<textLineArray.length; i++) {
      for (let j=0; j<textLineArray[i].length; j++) {
          let char = textLineArray[i][j];
          context.fillText(char, posX + maxCharWidth * i, posY + textHeight * (j+1));
      }
    }
  } else {
    // 最宽的字符
    let maxCharWidth = 0;
    for (let i=0; i<text.length; i++) {
      let width = context.measureText(text[i]).width
      if (width > maxCharWidth) maxCharWidth = width;
    }
    maxCharWidth = maxCharWidth * opt.wordSpacing
    // 以中点测量x轴
    if (opt.middlePos) {
      let maxRowWidth = 0;
      for (let i=0; i<text.split("\n").length; i++) {
        let width = text.split("\n")[i].length * maxCharWidth;
        if (width > maxRowWidth) maxRowWidth = width;
      }
      posX = posX - maxRowWidth / 2;
      //
      posY = posY - textHeight * opt.lineSpacing * text.split("\n").length / 2
    }
    //
    let textLineArray = text.split("\n");
    for (let i=0; i<textLineArray.length; i++) {
      for (let j=0; j<textLineArray[i].length; j++) {
          let char = textLineArray[i][j];
          context.fillText(char, posX + maxCharWidth * (j), posY + textHeight * (i+1));
      }
    }
  }
}
