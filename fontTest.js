const dropArea = document.getElementById("drop-area");
const fontFileElem = document.getElementById("fontFile");
const fontFamilyNameElem = document.getElementById("font-family-name");
const textSamplesElem = document.getElementById("text-samples");
const customTextElem = document.getElementById("customText");
const fontSizeInput = document.getElementById("fontSize");
const currentFontSizeElem = document.getElementById("currentFontSize");
const lineHeightInput = document.getElementById("lineHeight");
const currentLineHeightElem = document.getElementById("currentLineHeight");
const letterSpacingInput = document.getElementById("letterSpacing");
const currentLetterSpacingElem = document.getElementById("letterSpacing");

let currentFontFamily = "";

["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

["dragenter", "dragover"].forEach((eventName) => {
  dropArea.addEventListener(eventName, highlight, false);
});

["dragleave", "drop"].forEach((eventName) => {
  dropArea.addEventListener(eventName, unhighlight, false);
});

function highlight(e) {
  dropArea.classList.add("highlight");
}

function unhighlight(e) {
  dropArea.classList.remove("highlight");
}

dropArea.addEventListener("drop", handleDrop, false);
fontFileElem.addEventListener("change", handleFileSelect, false);
customTextElem.addEventListener("input", updatePreviewText);
fontSizeInput.addEventListener("input", updateFontSize);
lineHeightInput.addEventListener("input", updateLineHeight);
letterSpacingInput.addEventListener("input", updateLetterSpacing);

function handleDrop(e) {
  let dt = e.dataTransfer;
  let files = dt.files;
  handleFiles(files);
}

function handleFileSelect(e) {
  let files = e.target.files;
  handleFiles(files);
}

function handleFiles(files) {
  const file = files[0];
  const fileType = file.type;

  const reader = new FileReader();

  reader.onload = function (e) {
    const fontDataURL = e.target.result;
    applyFont(file, fontDataURL);
  };

  reader.readAsDataURL(file);
}

function applyFont(file, fontDataURL) {
  const fontFamily = file.name.split(".")[0];
  fontFamilyNameElem.textContent = `Font Family: ${fontFamily}`;
  currentFontFamily = fontFamily;

  let style = document.createElement("style");
  style.type = "text/css";
  document.head.appendChild(style);

  let css = `
                @font-face {
                    font-family: '${fontFamily}';
                    src: url('${fontDataURL}');
                }
            `;

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  updatePreviewText();
}

function updatePreviewText() {
  const customText = customTextElem.value;
  textSamplesElem.innerHTML = "";
  const p = document.createElement("p");
  p.textContent = customText || "The quick brown fox jumps over the lazy dog";
  p.style.fontFamily = `'${currentFontFamily}'`;
  p.style.fontSize = `${fontSizeInput.value}px`;
  p.style.lineHeight = `${lineHeightInput.value}em`;
  p.style.letterSpacing = `${letterSpacingInput.value}px`;
  textSamplesElem.appendChild(p);
}

function updateFontSize() {
  const fontSize = fontSizeInput.value;
  currentFontSizeElem.textContent = `${fontSize}px`;
  updatePreviewText();
}

function updateLineHeight() {
  const lineHeight = lineHeightInput.value;
  currentLineHeightElem.textContent = `${lineHeight}em`;
  updatePreviewText();
}

function updateLetterSpacing() {
  const letterSpacing = letterSpacingInput.value;
  currentLetterSpacingElem.textContent = `${letterSpacing}px`;
  updatePreviewText();
}