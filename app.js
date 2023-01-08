/**
 * Date : 05.01.2023
 * Author : Nazim Uddin
 * Description : Color Picker application with DOM functionalities
 */
let div = null;
const defaultColor = {
    red :218,
    green : 112, 
    blue : 214,
}


window.onload = () => {
    main();
    updateColorCodeInDOM(defaultColor); 
}


function main(){
    //dom references
    const headerBtn = document.getElementById('header-btn');
    const hexInput = document.getElementById('hex-input');
    const colorSliderRed = document.getElementById('slider-heading-red');
    const colorSliderGreen = document.getElementById('slider-heading-green');
    const colorSliderBlue = document.getElementById('slider-heading-blue');
    const copyToClipboardBtn = document.getElementById('body-btn');






    //event listeners
    headerBtn.addEventListener('click', generateRandomColorBtn);
    hexInput.addEventListener('keyup', handleHexColorInput);
    colorSliderRed.addEventListener('change', handleColorSlider(colorSliderRed, colorSliderGreen, colorSliderBlue));
    colorSliderGreen.addEventListener('change', handleColorSlider(colorSliderRed, colorSliderGreen, colorSliderBlue));
    colorSliderBlue.addEventListener('change', handleColorSlider(colorSliderRed, colorSliderGreen, colorSliderBlue));
    copyToClipboardBtn.addEventListener('click',handleCopyToClipboard);

}


//Event handlers functions
function generateRandomColorBtn(){
    const decimalColor = generateDecimalColorCode();  
    updateColorCodeInDOM(decimalColor);
}


function handleHexColorInput(e){
        const hexCode = e.target.value;
        if (hexCode){
            this.value = hexCode.toUpperCase();
        }
        if (isHexValid(hexCode)){
            const color = hexToDecimal(hexCode)
            console.log(color);
            updateColorCodeInDOM(color)
           
        }
      
}

function handleColorSlider(colorSliderRed, colorSliderGreen, colorSliderBlue){
    return function(){
        const color ={
            red : parseInt(colorSliderRed.value),
            green : parseInt(colorSliderGreen.value),
            blue : parseInt(colorSliderBlue.value)
        };
        updateColorCodeInDOM(color);
    };
}


function handleCopyToClipboard(){
    const colorModeRadios = document.getElementsByName('color-mode');
    const colorMode = getCheckedValueFromRadiosBtn(colorModeRadios);
    if (colorMode === null){
        throw new Error(`invalid radio input`);
    }
    if (colorMode === 'hex'){
        const hexCode = document.getElementById('hex-input').value;
        if(hexCode && isHexValid(hexCode)){
            navigator.clipboard.writeText(hexCode);
            if (div != null){
                div.remove();
                generateToastMessage(hexCode);
            }else{
                generateToastMessage(hexCode);
            }
        }else{
            alert(`Invalid HexCode`)
        }
        
    }
    else {
        const rgbCode = document.getElementById('rgb-input').value;
        navigator.clipboard.writeText(rgbCode);
        if (div != null){
            div.remove();
            generateToastMessage(rgbCode);
        }else{
            generateToastMessage(rgbCode);
        };
    }
};

// DOM functions
function updateColorCodeInDOM(decimalColor){
    const {red,green,blue} = decimalColor;//destructuring

    const hexColor = generateHexColorCode(decimalColor);
    const rgbColor = generateRgbColorCode(decimalColor);
    document.getElementById('color-display').style.backgroundColor = hexColor;
    document.getElementById('hex-input').value = hexColor;
    document.getElementById('rgb-input').value = rgbColor;
    document.getElementById('slider-one-value').innerText = red;
    document.getElementById('slider-two-value').innerText = green;
    document.getElementById('slider-three-value').innerText =blue;
    document.getElementById('slider-heading-red').value = red;
    document.getElementById('slider-heading-green').value = green;
    document.getElementById('slider-heading-blue').value = blue;
    
}

/**
 * find the checked element in the list of radio buttons
 * @param {Array} nodes 
 * @return {null | string}
 */
function getCheckedValueFromRadiosBtn(nodes){
    let checkedValue = null;
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].checked){
            checkedValue = nodes[i].value;
            break;
        }
    }
    return checkedValue;
}


/**
 * Show a toast message
 * @param {*} msg 
 */

function generateToastMessage(msg){
    div = document.createElement('div');
    div.innerHTML = `${msg} copied`;
    div.className = 'toast-message toast-message-slide-in';
    div.addEventListener('click', function(){
        div.classList.remove('toast-message-slide-in');
        div.classList.add('toast-message-slide-out');
        div.addEventListener('animationend',function (){
            div.remove();
            div = null;
        })
    })
    document.body.appendChild(div);
}

// Utils functions
/**
 * 
 * @returns {object}
 */
function generateDecimalColorCode(){
    let red = Math.round(Math.random() *255);
    let green = Math.round(Math.random() *255);
    let blue = Math.round(Math.random() *255);
    return {red,green,blue};
}


/**
 * @param {object}
 * @returns {string}
 */
function generateHexColorCode({red,green,blue}){
    const getTwoCode = (value) => {
        let hexcode = value.toString(16);
        return hexcode.length === 1 ? `0${hexcode}` : hexcode;
    }
    return `#${getTwoCode(red)}${getTwoCode(green)}${getTwoCode(blue)}`.toUpperCase();
}


/**
 * 
 * @param {object}  
 * @returns {string}
 */
function generateRgbColorCode({red,green,blue}){
    return `rgb(${red},${green},${blue})`
}


/**
 * 
 * @param {string} hexCode 
 * @returns {string}
 */
function isHexValid(hexCode){
    if (hexCode[0] != `#`)  return false;
    if (hexCode.length!= 7) return false;
    hexCode = hexCode.substring(1);
    return /^[A-Fa-f0-9]{6}$/i.test(hexCode);
}

/**
 * 
 * @param {string} hexCode 
 * @returns {object}
 */
function hexToDecimal(hexCode){
    const red = parseInt(hexCode.slice(1, 3), 16);
    const green = parseInt(hexCode.slice(3, 5), 16);
    const blue = parseInt(hexCode.slice(5), 16);
    return {red,green,blue}
}