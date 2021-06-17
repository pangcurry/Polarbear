function LoadingImage() {
    console.log('load');
    document.getElementById("loadingId").style.display = 'block';
}

function closeLodingImage() {
    console.log('close');
    document.getElementById("loadingId").style.display = 'none';
}

function loadSuccessImage() {
    console.log('success load');
    document.getElementById("successId").style.display = 'block';
}
// successId
function closeSuccessImage() {
    console.log('success close');
    document.getElementById("successId").style.display = 'none';
}

function button1() {
    LoadingImage();
    closeSuccessImage();
}

function button2() {
    closeLodingImage();
    loadSuccessImage();
}