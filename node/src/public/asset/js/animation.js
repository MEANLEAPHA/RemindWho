   window.addEventListener('load', init, false);

    function init() {
      createWorld();
      createLights();
      createStickyNotes();
      animate();
    }
    var Theme = {
      primary: 0xd7dddd,
      darker: 0x101010
    };
    var scene, camera, renderer, controls;
    var _group = new THREE.Group();
    function createWorld() {
      const _width = window.innerWidth;
      const _height = document.getElementById('canvas-container').clientHeight;
      scene = new THREE.Scene();
      scene.fog = new THREE.Fog(Theme.primary, 9, 13);
      scene.background = null;
      camera = new THREE.PerspectiveCamera(35, _width / _height, 1, 1000);
      camera.position.set(0, 0, 10);
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(_width, _height);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableZoom = false;
      controls.update();
      document.getElementById('canvas-container').appendChild(renderer.domElement);
      window.addEventListener('resize', onWindowResize, false);
    }

    function onWindowResize() {
      const _width = window.innerWidth;
      const _height = window.innerHeight;
      renderer.setSize(_width, _height);
      camera.aspect = _width / _height;
      camera.updateProjectionMatrix();
    }
    function createLights() {
      const hemiLight = new THREE.HemisphereLight(Theme.primary, Theme.darker, 1);
      const dirLight = new THREE.DirectionalLight(0xFFFFFF, 1);
      dirLight.position.set(10, 20, 20);
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.width = 5000;
      dirLight.shadow.mapSize.height = 5000;
      dirLight.penumbra = 0.8;
      scene.add(hemiLight);
      scene.add(dirLight);
    }
   function CreateStickyNote() {
  this.mesh = new THREE.Object3D();
  const noteWidth = 1.2;
  const noteHeight = 1.2;
  const geo_note = new THREE.PlaneGeometry(noteWidth, noteHeight);
  //Array of pastel colors for sticky notes
  const noteColors = [
    0xfff176, // pastel yellow
    0xff8a80, // pastel pink
    0x81d4fa, // pastel blue
    0xa5d6a7, // pastel green
    0xffcc80, // pastel orange
    0xe1bee7  // pastel purple
  ];

  // Pick a random color from the list
  const randomColor = noteColors[Math.floor(Math.random() * noteColors.length)];

  const mat_note = new THREE.MeshPhongMaterial({
    color: randomColor,
    side: THREE.DoubleSide,
    flatShading: true
  });

  const mesh = new THREE.Mesh(geo_note, mat_note);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  this.mesh.add(mesh);
}

    function isTooClose(newObj, others, minDistance = 1.5) {
      const newPos = newObj.position;
      for (let existing of others) {
        const dx = newPos.x - existing.position.x;
        const dy = newPos.y - existing.position.y;
        const dz = newPos.z - existing.position.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < minDistance) return true;
      }
      return false;
    }

    function createStickyNotes() {
      const placedNotes = [];
      const area = 2;

      for (let i = 0; i < 15; i++) {
        const _object = new CreateStickyNote();
        const scale = 0.5 + Math.random() * 0.5;
        _object.mesh.scale.set(scale, scale, scale);

        let tries = 0;
        do {
          _object.mesh.position.x = (Math.random() - 0.5) * area * 2;
          _object.mesh.position.y = (Math.random() - 0.5) * area * 2;
          _object.mesh.position.z = (Math.random() - 0.5) * area * 2;
          tries++;
        } while (isTooClose(_object.mesh, placedNotes, 1.0) && tries < 20);

        _object.mesh.rotation.x = Math.random() * 2 * Math.PI;
        _object.mesh.rotation.y = Math.random() * 2 * Math.PI;
        _object.mesh.rotation.z = Math.random() * 2 * Math.PI;

        TweenMax.to(_object.mesh.rotation, 6 + Math.random() * 6, {
          x: (Math.random() - 0.5) * 0.4,
          y: (Math.random() - 0.5) * 0.4,
          z: (Math.random() - 0.5) * 0.4,
          yoyo: true,
          repeat: -1,
          ease: Sine.easeInOut,
          delay: 0.05 * i
        });

        _group.add(_object.mesh);
        placedNotes.push(_object.mesh);
      }

      scene.add(_group);
      _group.position.x = 2;
    }

    function animate() {
      _group.rotation.x -= 0.003;
      _group.rotation.y -= 0.003;
      _group.rotation.z -= 0.003;
      controls.update();
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }