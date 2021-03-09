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

let panoramas = {
    'panorama1': {
        'img': './static/images/tunnel.jpg',
        'links': {
            'link1': {
                'src': 'panorama2',
                'pos': [2000, 0, -2000]
            }
        },
        'infospots': {
            'infospot1': {
                'radius': 300,
                'pos': [0, 0, -5000],
                'text': 'infospot1 \nLorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti eligendi, libero odit\n' +
                    '            provident quam quidem recusandae sunt vitae. Adipisci animi consectetur consequatur, consequuntur culpa debitis\n' +
                    '            dicta doloremque est iste itaque quae, quidem quis sunt suscipit voluptatem. Consequuntur distinctio\n' +
                    '            exercitationem\n' +
                    '            fugiat id, laborum magni maiores, officiis, perspiciatis quas quasi quidem ullam?',
            }
        }
    },
    'panorama2': {
        'img': './static/images/Melbourne_Docklands.jpg',
        'links': {
            'link1': {
                'src': 'panorama1',
                'pos': [2000, 0, -2000]
            }
        },
        'infospots': {
            'infospot1': {
                'radius': 300,
                'pos': [0, 0, -5000],
                'text': 'infospot1 \nLorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti eligendi, libero odit\n' +
                    '            provident quam quidem recusandae sunt vitae. Adipisci animi consectetur consequatur, consequuntur culpa debitis\n' +
                    '            dicta doloremque est iste itaque quae, quidem quis sunt suscipit voluptatem. Consequuntur distinctio\n' +
                    '            exercitationem\n' +
                    '            fugiat id, laborum magni maiores, officiis, perspiciatis quas quasi quidem ullam?',
            }
        }
    }
}


let viewer = new PANOLENS.Viewer({
    container: container,
    autoRotate: true,
    autoRotateSpeed: 0.1,
    autoRotateActivationDuration: 5000
});

for (let panoramaName in panoramas) {
    console.log('Panorama: ' + panoramaName);

    // let links = panoramas[panoramaName]['links'];
    let infoSpots = panoramas[panoramaName]['infospots'];

    let imgPanorama = new PANOLENS.ImagePanorama(panoramas[panoramaName]['img']);
    imgPanorama.addEventListener('progress', onProgress);
    imgPanorama.addEventListener('enter', onEnter);

    panoramas[panoramaName]['ImgPanorama'] = imgPanorama; // ghghhhhhhhhh

    // set links
    // for (let link of links) {
    //     let src = link['src'];
    //     let [x, y, z] = link['pos'];
    //
    //     imgPanorama.link(eval(src), new THREE.Vector3(x, y, z));
    // }

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
    let links = panoramas[panoramaName]['links'];
    let imgPanorama = panoramas[panoramaName]['ImgPanorama'];

    for (let link in links) {
        let src = links[link]['src'];
        let [x, y, z] = links[link]['pos'];

        src = panoramas[src]['ImgPanorama'];

        imgPanorama.link(src, new THREE.Vector3(x, y, z));
    }
}

