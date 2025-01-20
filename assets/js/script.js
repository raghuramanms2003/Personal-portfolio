 // Mobile Menu functionality
 const menuBtn = document.getElementById('menuBtn');
 const closeBtn = document.getElementById('closeBtn');
 const mobileMenu = document.getElementById('mobileMenu');
 const menuOverlay = document.getElementById('menuOverlay');

 function openMenu() {
     mobileMenu.classList.add('active');
     menuOverlay.classList.remove('hidden');
     document.body.style.overflow = 'hidden';
 }

 function closeMenu() {
     mobileMenu.classList.remove('active');
     menuOverlay.classList.add('hidden');
     document.body.style.overflow = '';
 }

 menuBtn.addEventListener('click', openMenu);
 closeBtn.addEventListener('click', closeMenu);
 menuOverlay.addEventListener('click', closeMenu);

 // Close menu on link click
 const mobileLinks = mobileMenu.getElementsByTagName('a');
 Array.from(mobileLinks).forEach(link => {
     link.addEventListener('click', closeMenu);
 });


 // Globe points and lines creation
const createGlobe = () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('globe'),
        alpha: true,
        antialias: true
    });
    
    function updateSize() {
        const container = document.querySelector('.sphere-container');
        const width = container.offsetWidth;
        const height = container.offsetHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
    
    updateSize();
    window.addEventListener('resize', updateSize);

    // Globe parameters
    const radius = 1;
    const segments = 50;
    const points = [];
    const lines = [];

    // Create points around the globe
    for (let i = 0; i < 200; i++) {
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI;
        
        const x = radius * Math.sin(theta) * Math.cos(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(theta);
        
        points.push(new THREE.Vector3(x, y, z));
    }

    // Create point geometries
    const pointGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const pointMaterial = new THREE.PointsMaterial({
        color: 0x0ea5e9,
        size: 0.02,
    });
    const pointCloud = new THREE.Points(pointGeometry, pointMaterial);
    scene.add(pointCloud);

    // Create connections between nearby points
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            if (points[i].distanceTo(points[j]) < 0.5) {
                const lineGeometry = new THREE.BufferGeometry().setFromPoints([points[i], points[j]]);
                const lineMaterial = new THREE.LineBasicMaterial({
                    color: 0x0ea5e9,
                    transparent: true,
                    opacity: 0.15
                });
                const line = new THREE.Line(lineGeometry, lineMaterial);
                lines.push(line);
                scene.add(line);
            }
        }
    }

    // Add location marker (London coordinates)
    const londonLat = 51.5074;
    const londonLon = -0.1278;
    
    // Convert latitude and longitude to 3D coordinates
    const londonPhi = (90 - londonLat) * (Math.PI / 180);
    const londonTheta = (londonLon + 180) * (Math.PI / 180);
    
    const markerX = radius * Math.sin(londonPhi) * Math.cos(londonTheta);
    const markerY = radius * Math.cos(londonPhi);
    const markerZ = radius * Math.sin(londonPhi) * Math.sin(londonTheta);

    // Create location marker
    const markerGeometry = new THREE.SphereGeometry(0.03, 16, 16);
    const markerMaterial = new THREE.MeshBasicMaterial({
        color: 0xff3366
    });
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    marker.position.set(markerX, markerY, markerZ);
    scene.add(marker);

    // Add pulse effect around marker
    const pulseGeometry = new THREE.SphereGeometry(0.04, 16, 16);
    const pulseMaterial = new THREE.MeshBasicMaterial({
        color: 0xff3366,
        transparent: true,
        opacity: 0.3
    });
    const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial);
    pulse.position.set(markerX, markerY, markerZ);
    scene.add(pulse);

    camera.position.z = 2;

    // Animation
    let frame = 0;
    function animate() {
        requestAnimationFrame(animate);
        frame += 0.002;

        // Rotate the entire scene
        pointCloud.rotation.y = frame;
        lines.forEach(line => {
            line.rotation.y = frame;
        });
        marker.rotation.y = frame;
        pulse.rotation.y = frame;

        // Pulse effect
        const scale = 1 + Math.sin(frame * 5) * 0.2;
        pulse.scale.set(scale, scale, scale);
        pulseMaterial.opacity = 0.3 - (Math.sin(frame * 5) * 0.15);

        renderer.render(scene, camera);
    }

    animate();
}

// Initialize globe
createGlobe();
