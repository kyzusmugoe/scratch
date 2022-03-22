
import "../css/main.sass"

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('div.scratch').forEach(item => {
        //console.log("find item, init to scratch...", item)
        const shWidth = item.dataset.shWidth
        const shHeight = item.dataset.shHeight
        const shImgBottom = item.dataset.shImgBottom
        const shImgTop = item.dataset.shImgTop
        const shBrushSize = item.dataset.shBrushSize
        const shPercent = item.dataset.shPercent
        const cvs = document.createElement('canvas')
        let scale = 1


        cvs.width = shWidth
        cvs.height = shHeight

        cvs.style.width = "100%"
        item.style.maxWidth = shWidth
        item.style.width = "fit-content"
        //item.style.maxHeight = shHeight
        //cvs.style.height = "100%"
        item.style.position = "relative"

        item.appendChild(cvs)

        var isDrawing = true, lastPoint;
        var container = item,
            canvas = cvs,
            canvasWidth = cvs.width,
            canvasHeight = cvs.height,
            ctx = cvs.getContext('2d'),
            imageTop = new Image(),
            imageBottom = new Image(),
            brush = new Image();

        imageTop.src = shImgTop
        imageBottom.src = shImgBottom
        imageBottom.style.display = "none"

        imageTop.onload = function () {
            const ib = imageTop
            if (ib.width > ib.height) { //landscape
                //console.log('landscape') 
                const nw = ib.width * (shHeight / ib.height) //重新計算過的寬度
                ctx.drawImage(imageTop, (shWidth - nw) / 2, 0, nw, shHeight);

            } else if (ib.width < ib.height) { //portrait 
                //console.log('portrait')
                const nh = ib.height * (shWidth / ib.width) //重新計算過的高度
                ctx.drawImage(imageTop, 0, (shHeight - nh) / 2, shWidth, nh);

            } else {//square
                //console.log('square')
                ctx.drawImage(imageTop, 0, 0, shWidth, shHeight);
            }
            scale = shWidth / item.offsetWidth
        }

        imageBottom.onload = function () {
            imageBottom.style.position = "absolute"
            imageBottom.style.width = "100%"
            imageBottom.style.maxWidth = shWidth + "px"
            imageBottom.style.height = "100%"
            imageBottom.style.maxHeight = shHeight + "px"
            imageBottom.style.objectFit = "cover"
            imageBottom.style.top = 0
            imageBottom.style.left = 0
            imageBottom.style.zIndex = -1
            imageBottom.style.display = "block"

            item.appendChild(imageBottom)
            /*
            const ib = imageBottom
            if (ib.width > ib.height) { //landscape
                console.log('landscape') 
                const nw = ib.width * (shHeight / ib.height) //重新計算過的寬度
                ctx.drawImage(imageBottom, (shWidth - nw) / 2, 0, nw, shHeight);
    
            } else if (ib.width < ib.height) { //portrait 
                console.log('portrait')
                const nh = ib.height * (shWidth / ib.width) //重新計算過的高度
                ctx.drawImage(imageBottom, 0, (shHeight - nh) / 2, shWidth, nh);
    
            } else {//square
                console.log('square')
                ctx.drawImage(imageBottom, 0, 0, shWidth, shHeight);
            }
            */

        };


        brush.src = 'data:image/png;base64,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'
        /*
        console.log(brush.width, brush.height)
        brush.width = shBrushSize?shBrushSize:80
        brush.height = shBrushSize?shBrushSize:50
        console.log(shBrushSize, shBrushSize)
        console.log(brush.width, brush.height)
    */
        canvas.addEventListener('mousedown', handleMouseDown, false);
        canvas.addEventListener('touchstart', handleMouseDown, false);
        canvas.addEventListener('mousemove', handleMouseMove, false);
        canvas.addEventListener('touchmove', handleMouseMove, false);
        canvas.addEventListener('mouseup', handleMouseUp, false);
        canvas.addEventListener('touchend', handleMouseUp, false);

        function distanceBetween(point1, point2) {
            //console.log(point2.x , point1.x)
            return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
        }

        function angleBetween(point1, point2) {
            return Math.atan2(point2.x - point1.x, point2.y - point1.y);
        }

        // Only test every `stride` pixel. `stride`x faster,
        // but might lead to inaccuracy
        function getFilledInPixels(stride) {
            if (!stride || stride < 1) { stride = 1; }
            var pixels = ctx.getImageData(0, 0, canvasWidth, canvasHeight),
                pdata = pixels.data,
                l = pdata.length,
                total = (l / stride),
                count = 0;
            // Iterate over all pixels
            for (var i = count = 0; i < l; i += stride) {
                if (parseInt(pdata[i]) === 0) {
                    count++;
                }
            }
            return Math.round((count / total) * 100);
        }

        function getMouse(e, canvas) {
            var offsetX = 0, offsetY = 0, mx, my;
            if (canvas.offsetParent !== undefined) {
                do {
                    offsetX += canvas.offsetLeft;
                    offsetY += canvas.offsetTop;
                } while ((canvas = canvas.offsetParent));
            }
            //console.log( offsetY)
            /*
            mx = (e.pageX || e.touches[0].clientX) - offsetX - 30;
            my = (e.pageY || e.touches[0].clientY) - offsetY - 30;
            */
           
            if(e.touches){
                //touch
                //console.log(e.touches[0])
                mx = e.touches[0].pageX - offsetX - 30;
                my = e.touches[0].pageY - offsetY - 30;
            }else{
                //mouse
                mx = e.pageX - offsetX - 30;
                my = e.pageY - offsetY - 30;

            }
            return { x: mx * scale, y: my * scale };
        }



        function handlePercentage(filledInPixels) {


            filledInPixels = filledInPixels || 0;

            //console.log((filledInPixels+20) + '%', shPercent);

            if ((filledInPixels + 20) > shPercent) {

                isDrawing = false
                canvas.classList.add("off")
                canvas.style.transition = "opacity 1s ease"
                canvas.style.opacity = 0
                //canvas.parentNode.removeChild(canvas);
            }


            /*
            console.log(shWidth*shHeight)
            let area = Math.PI * Math.pow(shWidth/2,2);
            console.log(area)
            */
        }

        function handleMouseDown(e) {
            //isDrawing = true;
            //lastPoint = getMouse(e, canvas);
           // console.log("handleMouseDown")
        }
        let ct = true
        function handleMouseMove(e) {


            if (e.cancelable) {
               e.preventDefault();
            }
              
            //if (!isDrawing) { return; }
            lastPoint = getMouse(e, canvas)
           
            //lastPoint.x -=10
            //lastPoint.y -=10


            if (ct < 3) {
                ct++
                setTimeout(() => {
                    e.preventDefault();
                    
                    let currentPoint = getMouse(e, canvas),
                        dist = distanceBetween(lastPoint, currentPoint),
                        angle = angleBetween(lastPoint, currentPoint),
                        x, y;

                    for (var i = 0; i < dist; i++) {
                        x = lastPoint.x + (Math.sin(angle) * i);
                        y = lastPoint.y + (Math.cos(angle) * i);
                        ctx.globalCompositeOperation = 'destination-out';
                        ctx.drawImage(brush, x, y, shBrushSize, shBrushSize);
                    }

                    lastPoint = currentPoint;
                    handlePercentage(getFilledInPixels(32));
                    ct--
                    //console.log(ct)

                }, 50)
            }
        }
        window.addEventListener("resize", (event) => {

            scale = shWidth / item.offsetWidth
        })



        function handleMouseUp(e) {
            //isDrawing = false;
        }
    })
})