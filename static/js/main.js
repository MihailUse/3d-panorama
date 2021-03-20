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

function create_panorama(panoramas) {
    let viewer = new PANOLENS.Viewer({
        output: 'console',
        container: container,
        autoHideInfospot: false,
        autoRotate: true,
        autoRotateSpeed: 0.1,
        autoRotateActivationDuration: 5000,
        cameraFov: 100,
    });

    let all_links = {};
    for (let panoramaName in panoramas) {
        console.log('Panorama: ' + panoramaName);

        let img = panoramas[panoramaName]['img'];
        let links = panoramas[panoramaName]['links'];
        let infoSpots = panoramas[panoramaName]['infospots'];

        imgPanorama = new PANOLENS.ImagePanorama(img);
        panoramas[panoramaName]['imgPanorama'] = imgPanorama;
        imgPanorama.addEventListener('progress', onProgress);
        imgPanorama.addEventListener('enter', onEnter);

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

    // set links to another panorams
    for (let panoramaName in panoramas) {
        let imgPanorama = panoramas[panoramaName]['imgPanorama'];
        let links = panoramas[panoramaName]['links'];

        for (let link of links) {
            let src = panoramas[link['src']]['imgPanorama'];
            let [x, y, z] = link['pos'];

            imgPanorama.link(src, new THREE.Vector3(x, y, z));
        }
    }
}

// get json and create panoram
fetch("./static/points.json")
    .then(response => response.json())
    .then(json => {
        create_panorama(json)
    });





