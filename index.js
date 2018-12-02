var canvas, canvasContext;
var circleRadius = 30;
var erasedPercentage = 0;
var erasableArea = 50; // By percentage

window.onload = function(){
    canvas = document.getElementById("scratchCanvas");
    canvasContext = canvas.getContext("2d");

    drawRect(0, 0, canvas.width, canvas.height, "rgba(0,0,0,.9)");

    canvas.addEventListener("mousedown", function(e){
        canvas.onmousemove = function(e){
            var mousePosition = calculateMousePosition(e);
            drawCircle(mousePosition.x, mousePosition.y, circleRadius);
            erasedPercentage = calculatePercentage();
            if(erasedPercentage >= erasableArea){
                drawRect(0, 0, canvas.width, canvas.height, ""); // Remove cover
            }
        }
    });
 
    canvas.addEventListener("mouseup", function(e){
        canvas.onmousemove = null;
        console.log("erasedPercentage: ", erasedPercentage);
    });
}

function calculatePercentage(){
    var imgData = canvasContext.getImageData(0, 0, canvas.width, canvas.height);    
    var pixelData = imgData.data;
    var pixelDataLength = pixelData.length;
    // [r,g,b,a,...] - pixelData is stored by rgba values. So, every 4 values in an array, represents a pixel.
    var totalPixelAmount = pixelDataLength / 4;
    var pixelsCounted = 0;
    
    // i starts from 3 because we need to check every fourth element in the array.
    for(var i = 3; i < pixelDataLength; i += 4){  
        if(pixelData[i] === 0){ // If erased
            pixelsCounted++;            
        }
    }

    return Math.round((pixelsCounted/totalPixelAmount)*100);
}

function calculateMousePosition(e){
    var rect = canvas.getBoundingClientRect();
    
    var mouseX = e.clientX - rect.left;
    var mouseY = e.clientY - rect.top;
    
    return{
        x: mouseX,
        y: mouseY
    };
}

function drawCircle(centerX, centerY, radius){    
    canvasContext.globalCompositeOperation="destination-out";
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
    canvasContext.closePath();
    canvasContext.fill();
}

function drawRect(leftX, topY, width, height, drawColor){
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}


