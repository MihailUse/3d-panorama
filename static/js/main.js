let container = document.querySelector('#container');
let progressBar = document.getElementById('progress');

function onEnter(event) {
    progressBar.style.width = '0px';
    progressBar.classList.remove('finish');

}

function onProgress(event) {
    let progress = event.progress.loaded / event.progress.total * 80;
    progressBar.style.width = progress + '%';
    if (progress === 80) {
        progressBar.classList.add('finish');
    }
}

// get json
// fetch("./static/points.json")
//     .then(response => response.json())
//     .then(json => (panoramas, json) => {
//         panoramas = json;
//     });


let viewer = new PANOLENS.Viewer({
    container: container,
    autoRotate: true,
    autoRotateSpeed: 0.1,
    autoRotateActivationDuration: 5000
});

let all_links = {};
for (let panoramaName in panoramas) {
    console.log('Panorama: ' + panoramaName);

    let links = panoramas[panoramaName]['links'];
    let infoSpots = panoramas[panoramaName]['infospots'];

    let imgPanorama = new PANOLENS.ImagePanorama(panoramas[panoramaName]['img']);
    imgPanorama.addEventListener('progress', onProgress);
    imgPanorama.addEventListener('enter', onEnter);

    // define links
    all_links[panoramaName] = {};
    all_links[panoramaName]['ImgPanorama'] = imgPanorama;
    all_links[panoramaName]['links'] = links;

    // set links to another panoramas
    for (let infoSpotName in infoSpots) {
        console.log('\tinfospot - ' + infoSpotName);

        let radius = infoSpots[infoSpotName]['radius'];
        let text = infoSpots[infoSpotName]['text'];
        let [x, y, z] = infoSpots[infoSpotName]['pos'];

        // append element in DOM
        let infoSpotElement = document.createElement('div');
        infoSpotElement.className = 'desc-container';
        infoSpotElement.textContent = text;
        container.appendChild(infoSpotElement);

        // append info spot in panorama
        let infospot = new PANOLENS.Infospot(radius, PANOLENS.DataImage.Info);
        infospot.position.set(x, y, z); // x, y, z
        infospot.addHoverElement(infoSpotElement, -100); // element, element position

        imgPanorama.add(infospot);
    }
    viewer.add(imgPanorama);
}


for (let panoramaName in panoramas) {
    let imgPanorama = all_links[panoramaName]['ImgPanorama'];

    for (let link of all_links[panoramaName]['links']) {
        let src = link['src'];
        let [x, y, z] = link['pos'];

        src = all_links[src]['ImgPanorama'];
        imgPanorama.link(src, new THREE.Vector3(x, y, z));
    }
}

