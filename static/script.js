(function () {
    const signatureInput = $('#signature');
    const canvas = $('canvas');

    const containerWidth = $(window).width();

    document.addEventListener('DOMContentLoaded', () => {
        if (containerWidth < 1000) {
            canvas[0].width = 0.8 * containerWidth;
        }
    });

    const context = canvas[0].getContext('2d');

    // Clear Canvas on Button
    $('#clear-canvas').on('click', e => {
        e.preventDefault();
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    });

    // Canvas
    canvas.on('mousedown', drawSignature);

    function drawSignature(e) {
        const initX = e.pageX - this.offsetLeft;
        const initY = e.pageY - this.offsetTop;

        const clickPositions = [];

        context.moveTo(initX, initY);

        canvas.on('mousemove.drawSignature', function (e) {
            const x = e.pageX - this.offsetLeft;
            const y = e.pageY - this.offsetTop;

            clickPositions.push({ x, y });

            context.beginPath();

            const grad = context.createLinearGradient(0, 0, 900, 100);
            grad.addColorStop(0, '#3f3fe4');
            grad.addColorStop(0.8, '#81d9eb');
            grad.addColorStop(1, '#f3f3f3');

            context.strokeStyle = grad;
            context.lineWidth = 3;

            clickPositions.forEach(position => {
                context.lineTo(position.x, position.y);
                context.stroke();
            });
        });

        $(document).on('mouseup.convertCanvas', () => {
            signatureInput.val(canvas[0].toDataURL());
            canvas.off('mousemove.drawSignature');
            $(document).off('mouseup.convertCanvas');
        });
    }

    // Submit Form
})();
