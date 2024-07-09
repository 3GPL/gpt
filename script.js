// Load the MobileNet model from TensorFlow Hub
let mobilenet;
(async function() {
    mobilenet = await tf.loadLayersModel('https://tfhub.dev/google/imagenet/mobilenet_v2_100_224/classification/5');
    console.log('Model loaded');
})();

// Handle image classification
const classifyImage = async () => {
    const imageUpload = document.getElementById('image-upload');
    const outputDiv = document.getElementById('output');
    
    if (!mobilenet || !imageUpload.files || !imageUpload.files[0]) return;
    
    const img = new Image();
    const reader = new FileReader();
    
    reader.onload = async function(event) {
        img.onload = async function() {
            const tensor = tf.browser.fromPixels(img)
                .resizeNearestNeighbor([224, 224])
                .toFloat()
                .sub(255 / 2)
                .div(255 / 2)
                .expandDims();
            
            const predictions = await mobilenet.predict(tensor).data();
            const top5 = Array.from(predictions)
                .map((p, i) => ({
                    probability: p,
                    className: IMAGENET_CLASSES[i]
                }))
                .sort((a, b) => b.probability - a.probability)
                .slice(0, 5);
            
            outputDiv.innerHTML = '';
            top5.forEach(p => {
                outputDiv.innerHTML += `<div>${p.className}: ${(p.probability * 100).toFixed(2)}%</div>`;
            });
        };
        img.src = event.target.result;
    };
    
    reader.readAsDataURL(imageUpload.files[0]);
};

// Event listener for classify button
const classifyButton = document.getElementById('classify-btn');
classifyButton.addEventListener('click', classifyImage);

// Display result section after image selection
const imageUpload = document.getElementById('image-upload');
imageUpload.addEventListener('change', function() {
    const resultSection = document.getElementById('result');
    resultSection.classList.add('active');
});
