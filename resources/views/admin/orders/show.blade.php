@extends('admin.master')

@section('title', 'Retail Order Details')

@section('header', 'Retail Order Breakdown')

@section('content')
    <!-- Three.js Libraries for 3D Preview -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/RGBELoader.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/geometries/DecalGeometry.js"></script>

    <div class="mb-4">
        <a href="{{ route('admin.orders.index') }}" class="btn btn-sm btn-outline-secondary">
            <i class="bi bi-chevron-left me-1"></i> Back to Orders Log
        </a>
    </div>

    <!-- Alert Messages -->
    @if(session('success'))
        <div class="alert alert-success alert-dismissible fade show rounded-3 border-0 shadow-sm mb-4" role="alert">
            <i class="bi bi-check-circle-fill me-2"></i>
            {{ session('success') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    @endif

    <div class="row g-4">
        <!-- Order Items Breakdown -->
        <div class="col-lg-8">
            <div class="card border-0 shadow-sm rounded-3 bg-white p-4 mb-4">
                <h5 class="fw-bold border-bottom pb-3 mb-4 text-dark uppercase tracking-wide">Products Invoice</h5>
                
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="bg-light text-muted small text-uppercase">
                            <tr>
                                <th class="ps-3 py-3">Product</th>
                                <th class="py-3">Specifications</th>
                                <th class="py-3">Quantity</th>
                                <th class="py-3">Unit Price</th>
                                <th class="text-end pe-3 py-3">Row Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($order->items as $item)
                                <tr>
                                    <td class="ps-3 py-3">
                                        <div class="d-flex align-items-center">
                                            <div class="bg-light rounded p-1 me-3 d-flex align-items-center justify-content-center border" style="width: 50px; height: 50px; overflow:hidden;">
                                                <img src="{{ $item->image ?: 'https://images.unsplash.com/photo-1551280857-2b9bbe52acf4?w=600&h=400&fit=crop&q=80' }}" alt="{{ $item->product_name }}" class="img-fluid rounded" style="object-fit: cover; width: 100%; height: 100%;">
                                            </div>
                                            <div>
                                                <div class="fw-bold text-dark text-truncate" style="max-width: 180px;">{{ $item->product_name }}</div>
                                                <small class="text-muted">Product ID: #{{ $item->product_id ?: 'N/A' }}</small>
                                            </div>
                                        </div>
                                        @if($item->savedDesign)
                                            <div class="mt-2">
                                                <span class="badge bg-primary rounded px-2 py-1 text-white" style="font-size: 9px; font-weight: 600; text-shadow: none;">
                                                    <i class="bi bi-cube-fill me-1"></i> Custom 3D Design Attached
                                                </span>
                                            </div>
                                        @endif
                                    </td>
                                    <td>
                                        <div class="d-flex flex-column gap-1.5 align-items-start">
                                            @if($item->size)
                                                <span class="border fw-bold text-center" style="color: #4f46e5 !important; background-color: #f5f3ff !important; border-color: #ddd6fe !important; font-size: 11px; padding: 6px 12px; display: inline-block; border-radius: 50px; min-width: 90px; text-shadow: none;">Size: {{ $item->size }}</span>
                                            @endif
                                            @if($item->color)
                                                <span class="border fw-bold text-center" style="color: #4b5563 !important; background-color: #f3f4f6 !important; border-color: #e5e7eb !important; font-size: 11px; padding: 6px 12px; display: inline-block; border-radius: 50px; min-width: 90px; text-shadow: none;">Color: {{ $item->color }}</span>
                                            @endif
                                            @if($item->custom_name)
                                                <span class="border fw-bold text-center" style="color: #be123c !important; background-color: #fff1f2 !important; border-color: #fecdd3 !important; font-size: 11px; padding: 6px 12px; display: inline-block; border-radius: 50px; min-width: 90px; text-shadow: none;">Name: {{ strtoupper($item->custom_name) }}</span>
                                            @endif
                                            @if($item->custom_number)
                                                <span class="border fw-bold text-center" style="color: #047857 !important; background-color: #ecfdf5 !important; border-color: #a7f3d0 !important; font-size: 11px; padding: 6px 12px; display: inline-block; border-radius: 50px; min-width: 90px; text-shadow: none;">No: {{ $item->custom_number }}</span>
                                            @endif
                                        </div>
                                    </td>
                                    <td class="fw-semibold text-dark">{{ $item->quantity }} units</td>
                                    <td>${{ number_format($item->price, 2) }}</td>
                                    <td class="text-end pe-3 fw-bold text-dark">${{ number_format($item->price * $item->quantity, 2) }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Customized 3D Design Details Section -->
            @php
                $hasCustomDesigns = false;
                foreach($order->items as $item) {
                    if($item->savedDesign) {
                        $hasCustomDesigns = true;
                        break;
                    }
                }
            @endphp

            @if($hasCustomDesigns)
                <div class="card border-0 shadow-sm rounded-3 bg-white p-4 mb-4">
                    <h5 class="fw-bold border-bottom pb-3 mb-4 text-dark uppercase tracking-wide">
                        <i class="bi bi-palette-fill text-primary me-2"></i> Custom 3D Design Specifications
                    </h5>
                    
                    @foreach($order->items as $item)
                        @if($item->savedDesign)
                            <div class="mb-5 border-bottom pb-4 last-border-0">
                                <div class="d-flex align-items-center mb-3">
                                    <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style="width: 24px; height: 24px; font-size: 12px; font-weight: bold;">
                                        {{ $loop->iteration }}
                                    </div>
                                    <h6 class="fw-bold text-dark mb-0">{{ $item->product_name }} - Custom Design Specifications</h6>
                                </div>

                                <div class="row g-4 align-items-stretch">
                                    <!-- 3D Interactive Model Viewer -->
                                    @if($item->model_url)
                                        <div class="col-md-6">
                                            <div class="card border bg-light h-100 p-3 rounded-3 shadow-none">
                                                <div class="d-flex justify-content-between align-items-center mb-2">
                                                    <span class="text-secondary fw-bold text-uppercase" style="font-size: 11px; letter-spacing: 0.5px;">
                                                        <i class="bi bi-3d-rotate me-1"></i> 3D Interactive Viewer
                                                    </span>
                                                    <small class="text-muted" style="font-size: 9px;">Drag to rotate | Scroll to zoom</small>
                                                </div>
                                                <div id="three-container-{{ $item->id }}" style="width: 100%; height: 350px; background: #eef2f3; position: relative;" class="rounded border bg-gradient">
                                                    <div class="position-absolute top-50 start-50 translate-middle text-muted small spinner-label" style="font-size: 11px;">
                                                        <div class="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                                                        Loading 3D Workspace...
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <script>
                                                (function() {
                                                    const container = document.getElementById('three-container-{{ $item->id }}');
                                                    const modelUrl = '{{ $item->model_url }}';
                                                    const meshStates = @json($item->savedDesign->design_data['meshStates'] ?? []);
                                                    const decals = @json($item->savedDesign->design_data['decals'] ?? []);
                                                    const materialFinish = '{{ $item->savedDesign->design_data['materialFinish'] ?? 'matte' }}';
                                                    const lightingPreset = '{{ $item->savedDesign->design_data['lightingPreset'] ?? 'city' }}';

                                                    const scene = new THREE.Scene();
                                                    scene.background = new THREE.Color('#eef2f3');

                                                    const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 100);
                                                    camera.position.set(0, 0.4, 2.8);

                                                    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
                                                    renderer.setSize(container.clientWidth, container.clientHeight);
                                                    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
                                                    renderer.outputEncoding = THREE.sRGBEncoding;
                                                    renderer.toneMapping = THREE.ACESFilmicToneMapping;
                                                    renderer.toneMappingExposure = 0.85;
                                                    container.appendChild(renderer.domElement);

                                                    // Load HDRi Environment Map to match builder lighting/coloration perfectly
                                                    const pmremGenerator = new THREE.PMREMGenerator(renderer);
                                                    pmremGenerator.compileEquirectangularShader();

                                                    const presetUrls = {
                                                         city: 'https://raw.githubusercontent.com/pmndrs/3d-assets/main/hdri/potsdamer_platz_1k.hdr',
                                                         sunset: 'https://raw.githubusercontent.com/pmndrs/3d-assets/main/hdri/venice_sunset_1k.hdr',
                                                         dawn: 'https://raw.githubusercontent.com/pmndrs/3d-assets/main/hdri/kiara_1_dawn_1k.hdr',
                                                         night: 'https://raw.githubusercontent.com/pmndrs/3d-assets/main/hdri/glowing_passage_out_1k.hdr',
                                                         warehouse: 'https://raw.githubusercontent.com/pmndrs/3d-assets/main/hdri/empty_warehouse_01_1k.hdr',
                                                         forest: 'https://raw.githubusercontent.com/pmndrs/3d-assets/main/hdri/forest_slope_1k.hdr',
                                                         apartment: 'https://raw.githubusercontent.com/pmndrs/3d-assets/main/hdri/shanghai_bund_1k.hdr',
                                                         studio: 'https://raw.githubusercontent.com/pmndrs/3d-assets/main/hdri/studio_small_03_1k.hdr',
                                                         park: 'https://raw.githubusercontent.com/pmndrs/3d-assets/main/hdri/rooftop_night_1k.hdr',
                                                         lobby: 'https://raw.githubusercontent.com/pmndrs/3d-assets/main/hdri/morning_sanitary_landfill_1k.hdr'
                                                    };

                                                    const hdriUrl = presetUrls[lightingPreset] || presetUrls.city;

                                                    new THREE.RGBELoader().load(hdriUrl, function(texture) {
                                                         const envMap = pmremGenerator.fromEquirectangular(texture).texture;
                                                         scene.environment = envMap;
                                                         texture.dispose();
                                                         pmremGenerator.dispose();
                                                    });

                                                    const ambientLight = new THREE.AmbientLight('#ffffff', lightingPreset === 'night' ? 0.1 : 0.4);
                                                    scene.add(ambientLight);

                                                    const spotLight = new THREE.SpotLight('#ffffff', lightingPreset === 'studio' ? 1.5 : 0.8);
                                                    spotLight.position.set(10, 15, 10);
                                                    spotLight.angle = 0.3;
                                                    spotLight.penumbra = 1;
                                                    scene.add(spotLight);

                                                    const dirLight = new THREE.DirectionalLight('#ffffff', lightingPreset === 'night' ? 0.05 : 0.3);
                                                    dirLight.position.set(-5, 5, -5);
                                                    scene.add(dirLight);

                                                    const controls = new THREE.OrbitControls(camera, renderer.domElement);
                                                    controls.enableDamping = true;
                                                    controls.dampingFactor = 0.05;
                                                    controls.maxPolarAngle = Math.PI / 1.8;
                                                    controls.minPolarAngle = Math.PI / 4;
                                                    controls.minDistance = 1.5;
                                                    controls.maxDistance = 6.0;

                                                    const loader = new THREE.GLTFLoader();
                                                    loader.load(modelUrl, function(gltf) {
                                                        const spinner = container.querySelector('.spinner-label');
                                                        if (spinner) spinner.remove();

                                                        const model = gltf.scene;
                                                        
                                                        // Scale the model first (using fixed 1.8 scale to match the builder exactly)
                                                        const scale = 1.8;
                                                        model.scale.set(scale, scale, scale);
                                                        
                                                        // Then center it
                                                        model.updateMatrixWorld(true);
                                                        const scaledBox = new THREE.Box3().setFromObject(model);
                                                        const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
                                                        model.position.sub(scaledCenter);
                                                        
                                                        const meshesMap = {};
                                                        model.traverse(function(node) {
                                                            if (node.isMesh) {
                                                                meshesMap[node.name] = node;
                                                                meshesMap[node.name + '.obj'] = node;
                                                                
                                                                if (node.material) {
                                                                    node.material.side = THREE.DoubleSide;
                                                                }
                                                                
                                                                const state = meshStates[node.name] || meshStates[node.name + '.obj'];
                                                                if (state) {
                                                                    const color = state.color || '#ffffff';
                                                                    const mat = new THREE.MeshStandardMaterial({
                                                                        color: new THREE.Color(color),
                                                                        roughness: materialFinish === 'gloss' ? 0.1 : materialFinish === 'metallic' ? 0.2 : 0.8,
                                                                        metalness: materialFinish === 'metallic' ? 0.8 : 0.0,
                                                                        side: THREE.DoubleSide,
                                                                    });
                                                                    
                                                                    if (state.pUrl) {
                                                                        const textureLoader = new THREE.TextureLoader();
                                                                         textureLoader.load(state.pUrl, function(tex) {
                                                                             tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
                                                                             tex.repeat.set(6, 6);
                                                                             mat.map = tex;
                                                                             mat.needsUpdate = true;
                                                                         });
                                                                    }
                                                                    
                                                                    if (state.isGrad && state.grad1 && state.grad2) {
                                                                        const canvas = document.createElement('canvas');
                                                                        canvas.width = 16;
                                                                        canvas.height = 256;
                                                                        const ctx = canvas.getContext('2d');
                                                                        const grad = ctx.createLinearGradient(0, 0, 0, 256);
                                                                        grad.addColorStop(0, state.grad1);
                                                                        grad.addColorStop(1, state.grad2);
                                                                        ctx.fillStyle = grad;
                                                                        ctx.fillRect(0, 0, 16, 256);
                                                                        
                                                                        const gradTex = new THREE.CanvasTexture(canvas);
                                                                        mat.map = gradTex;
                                                                    }
                                                                    
                                                                    node.material = mat;
                                                                }
                                                            }
                                                        });
                                                        
                                                        const viewerGroup = new THREE.Group();
                                                        scene.add(viewerGroup);
                                                        viewerGroup.add(model);
                                                        
                                                        // Update world matrices so DecalGeometry projects correctly
                                                        model.updateMatrixWorld(true);
                                                        
                                                        decals.forEach(function(d) {
                                                            if (!d.worldPoint || !d.worldNormal) return;
                                                            const targetMesh = meshesMap[d.meshId];
                                                            if (!targetMesh) return;
                                                            
                                                            try {
                                                                let canvas;
                                                                if (d.type === 'image' && d.imageUrl) {
                                                                    canvas = document.createElement('canvas');
                                                                    canvas.width = 512;
                                                                    canvas.height = 512;
                                                                    const ctx = canvas.getContext('2d');
                                                                    ctx.fillStyle = 'rgba(200,200,200,0.3)';
                                                                    ctx.fillRect(0, 0, 512, 512);
                                                                    
                                                                    const img = new Image();
                                                                    img.crossOrigin = 'anonymous';
                                                                    img.onload = function() {
                                                                        ctx.clearRect(0, 0, 512, 512);
                                                                        const scale = Math.min(512 / img.width, 512 / img.height) * 0.85;
                                                                        const w = img.width * scale;
                                                                        const h = img.height * scale;
                                                                        ctx.drawImage(img, (512 - w) / 2, (512 - h) / 2, w, h);
                                                                        texture.needsUpdate = true;
                                                                    };
                                                                    img.src = d.imageUrl;
                                                                } else {
                                                                    canvas = document.createElement('canvas');
                                                                    canvas.width = 1024;
                                                                    canvas.height = 256;
                                                                    const ctx = canvas.getContext('2d');
                                                                    ctx.clearRect(0, 0, 1024, 256);
                                                                    
                                                                    const fontSize = 120;
                                                                    ctx.font = 'bold ' + fontSize + 'px ' + (d.font || 'Arial');
                                                                    ctx.textAlign = 'center';
                                                                    ctx.textBaseline = 'middle';
                                                                    
                                                                    const x = 512;
                                                                    const y = 128;
                                                                    
                                                                    const drawPass = function(isStroke, strokeWidth, strokeColor) {
                                                                        ctx.fillStyle = strokeColor || d.color || '#ffffff';
                                                                        ctx.strokeStyle = strokeColor;
                                                                        ctx.lineWidth = strokeWidth * 2;
                                                                        ctx.lineJoin = 'round';
                                                                        ctx.lineCap = 'round';
                                                                        
                                                                        if (d.effect === 'arch') {
                                                                            const intensity = d.effectIntensity || 0.5;
                                                                            const radius = 400 / intensity;
                                                                            const characters = d.text.split('');
                                                                            const totalWidth = ctx.measureText(d.text).width;
                                                                            const anglePerPixel = 1 / radius;
                                                                            const totalAngle = totalWidth * anglePerPixel;
                                                                            
                                                                            let currentAngle = -totalAngle / 2;
                                                                            
                                                                            ctx.save();
                                                                            ctx.translate(x, y + radius - 20);
                                                                            
                                                                            characters.forEach(function(char) {
                                                                                const charWidth = ctx.measureText(char).width;
                                                                                const charAngle = charWidth * anglePerPixel;
                                                                                ctx.save();
                                                                                ctx.rotate(currentAngle + charAngle / 2);
                                                                                if (isStroke) ctx.strokeText(char, 0, -radius);
                                                                                else ctx.fillText(char, 0, -radius);
                                                                                ctx.restore();
                                                                                currentAngle += charAngle;
                                                                            });
                                                                            ctx.restore();
                                                                        } else {
                                                                            if (isStroke) ctx.strokeText(d.text, x, y - 10);
                                                                            else ctx.fillText(d.text, x, y - 10);
                                                                        }
                                                                    };
                                                                    
                                                                    if (d.outline2Width > 0) {
                                                                        drawPass(true, (d.outline1Width || 0) + (d.outline2Width || 0), d.outline2Color);
                                                                    }
                                                                    if (d.outline1Width > 0) {
                                                                        drawPass(true, d.outline1Width, d.outline1Color);
                                                                    }
                                                                    drawPass(false);
                                                                }
                                                                
                                                                const texture = new THREE.CanvasTexture(canvas);
                                                                
                                                                const point = new THREE.Vector3().fromArray(d.worldPoint);
                                                                const normal = new THREE.Vector3().fromArray(d.worldNormal);
                                                                
                                                                const up = Math.abs(normal.y) < 0.95
                                                                    ? new THREE.Vector3(0, 1, 0)
                                                                    : new THREE.Vector3(1, 0, 0);
                                                                const right = new THREE.Vector3().crossVectors(up, normal).normalize();
                                                                const newUp = new THREE.Vector3().crossVectors(normal, right).normalize();
                                                                const m4 = new THREE.Matrix4().makeBasis(right, newUp, normal);
                                                                const rotation = d.rotation || 0;
                                                                const mRotation = new THREE.Matrix4().makeRotationZ(rotation);
                                                                m4.multiply(mRotation);
                                                                const orientation = new THREE.Euler().setFromRotationMatrix(m4);
                                                                
                                                                const sx = d.decalScaleX !== undefined ? d.decalScaleX : (d.decalScale || 0.15);
                                                                const sy = d.decalScaleY !== undefined ? d.decalScaleY : (d.decalScale || 0.15);
                                                                const decalSize = (d.type === 'image' || d.type === 'pattern')
                                                                    ? new THREE.Vector3(sx, sy, 0.3)
                                                                    : new THREE.Vector3(sx, sy * 0.25, 0.3);
                                                                    
                                                                const DecalGeo = THREE.DecalGeometry || window.DecalGeometry;
                                                                const geo = new DecalGeo(targetMesh, point, orientation, decalSize);
                                                                const mat = new THREE.MeshBasicMaterial({
                                                                    map: texture,
                                                                    transparent: true,
                                                                    depthTest: true,
                                                                    depthWrite: false,
                                                                    polygonOffset: true,
                                                                    polygonOffsetFactor: -4,
                                                                    polygonOffsetUnits: -4,
                                                                });
                                                                const decalMesh = new THREE.Mesh(geo, mat);
                                                                decalMesh.renderOrder = 999;
                                                                viewerGroup.add(decalMesh);
                                                            } catch(decalErr) {
                                                                console.error("Error loading decal onto 3D model:", decalErr);
                                                            }
                                                        });

                                                        function animate() {
                                                            requestAnimationFrame(animate);
                                                            viewerGroup.rotation.y += 0.008;
                                                            controls.update();
                                                            renderer.render(scene, camera);
                                                        }
                                                        animate();
                                                    }, undefined, function(error) {
                                                        console.error(error);
                                                        container.innerHTML = '<div class="h-100 d-flex align-items-center justify-content-center text-muted" style="font-size: 11px;">Error loading model</div>';
                                                    });

                                                    window.addEventListener('resize', () => {
                                                        if (!container.clientWidth || !container.clientHeight) return;
                                                        camera.aspect = container.clientWidth / container.clientHeight;
                                                        camera.updateProjectionMatrix();
                                                        renderer.setSize(container.clientWidth, container.clientHeight);
                                                    });
                                                })();
                                            </script>
                                        </div>
                                    @endif

                                    <!-- Specifications Details -->
                                    <div class="col-md-6">
                                        <div class="card border h-100 p-4 rounded-3 shadow-none bg-light">
                                            <div class="fw-bold text-primary mb-3 text-uppercase tracking-wider" style="font-size: 11px;">
                                                <i class="bi bi-gear-wide-connected me-1"></i> Custom Specifications Breakdown
                                            </div>

                                            @if(isset($item->savedDesign->design_data['materialFinish']) || isset($item->savedDesign->design_data['globalPattern']))
                                                <div class="mb-3">
                                                    <span class="text-secondary fw-bold d-block mb-1" style="font-size: 10px; text-transform: uppercase;">Material & Texture Finish</span>
                                                    <span class="badge bg-secondary text-white rounded-pill uppercase px-3 py-1.5" style="font-size: 10px; font-weight: 600;">
                                                        Finish: {{ $item->savedDesign->design_data['materialFinish'] ?? 'default' }}
                                                    </span>
                                                    @if(isset($item->savedDesign->design_data['globalPattern']))
                                                        <span class="badge bg-dark text-white rounded-pill uppercase px-3 py-1.5" style="font-size: 10px; font-weight: 600;">
                                                            Pattern: {{ $item->savedDesign->design_data['globalPattern'] }}
                                                        </span>
                                                    @endif
                                                </div>
                                            @endif

                                            @if(isset($item->savedDesign->design_data['meshStates']))
                                                <div class="mb-3">
                                                    <span class="text-secondary fw-bold d-block mb-1.5" style="font-size: 10px; text-transform: uppercase;">Component Colors</span>
                                                    <div class="row g-2">
                                                        @foreach($item->savedDesign->design_data['meshStates'] as $meshId => $state)
                                                            @if(isset($state['color']))
                                                                <div class="col-sm-6">
                                                                    <div class="bg-white border rounded p-2 d-flex align-items-center gap-2">
                                                                        <span class="d-inline-block rounded-circle border" style="width: 14px; height: 14px; background-color: {{ $state['color'] }}; flex-shrink: 0;"></span>
                                                                        <div class="text-truncate" style="font-size: 10.5px;">
                                                                            <span class="fw-bold text-dark">{{ ucwords(str_replace('_', ' ', str_replace('.obj', '', $meshId))) }}</span>
                                                                            @if(isset($state['pUrl']) && $state['pUrl'])
                                                                                <div class="text-indigo-600" style="font-size: 9px; font-weight: 600;">
                                                                                    Tiled Overlay Txtr
                                                                                </div>
                                                                            @endif
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            @endif
                                                        @endforeach
                                                    </div>
                                                </div>
                                            @endif

                                            @php
                                                $textDecals = array_filter($item->savedDesign->design_data['decals'] ?? [], function($d) { return ($d['type'] ?? 'text') === 'text'; });
                                                $imageDecals = array_filter($item->savedDesign->design_data['decals'] ?? [], function($d) { return ($d['type'] ?? 'text') === 'image'; });
                                            @endphp

                                            @if(count($textDecals) > 0)
                                                <div class="mb-3">
                                                    <span class="text-secondary fw-bold d-block mb-1.5" style="font-size: 10px; text-transform: uppercase;">Custom Typography Layers</span>
                                                    @foreach($textDecals as $decal)
                                                        <div class="bg-white border rounded p-3 mb-2" style="font-size: 11px;">
                                                            <div class="d-flex justify-content-between align-items-center mb-2">
                                                                <span class="fw-bold text-dark fs-6">"{{ $decal['text'] ?? '' }}"</span>
                                                                <span class="badge bg-primary-subtle text-primary border rounded-pill px-2 py-0.5" style="font-size: 9px;">Text Decal</span>
                                                            </div>
                                                            <div class="row g-2 text-muted" style="font-size: 10px;">
                                                                <div class="col-6">Font: <strong class="text-dark">{{ $decal['font'] ?? 'Outfit' }}</strong></div>
                                                                <div class="col-6">Color: <span class="d-inline-block rounded-circle border" style="width: 10px; height: 10px; background-color: {{ $decal['color'] ?? '#fff' }}; vertical-align: middle;"></span> <strong class="text-dark">{{ $decal['color'] ?? '#ffffff' }}</strong></div>
                                                                
                                                                <div class="col-6">
                                                                    Outline 1: 
                                                                    @if(isset($decal['outline1Width']) && $decal['outline1Width'] > 0)
                                                                        <strong class="text-dark">{{ $decal['outline1Width'] }}px</strong> <span class="d-inline-block rounded-circle border" style="width: 10px; height: 10px; background-color: {{ $decal['outline1Color'] ?? '#000' }}; vertical-align: middle;"></span>
                                                                    @else
                                                                        <strong class="text-dark">None</strong>
                                                                    @endif
                                                                </div>
                                                                <div class="col-6">
                                                                    Outline 2: 
                                                                    @if(isset($decal['outline2Width']) && $decal['outline2Width'] > 0)
                                                                        <strong class="text-dark">{{ $decal['outline2Width'] }}px</strong> <span class="d-inline-block rounded-circle border" style="width: 10px; height: 10px; background-color: {{ $decal['outline2Color'] ?? '#000' }}; vertical-align: middle;"></span>
                                                                    @else
                                                                        <strong class="text-dark">None</strong>
                                                                    @endif
                                                                </div>
                                                                
                                                                <div class="col-12">
                                                                    Curve Effect: 
                                                                    @if(isset($decal['effect']) && $decal['effect'] !== 'none')
                                                                        <strong class="text-dark">{{ strtoupper($decal['effect']) }} ({{ round(($decal['effectIntensity'] ?? 0.5) * 100) }}% intensity)</strong>
                                                                    @else
                                                                        <strong class="text-dark">None</strong>
                                                                    @endif
                                                                </div>
                                                            </div>
                                                        </div>
                                                    @endforeach
                                                </div>
                                            @endif

                                            @if(count($imageDecals) > 0)
                                                <div>
                                                    <span class="text-secondary fw-bold d-block mb-1.5" style="font-size: 10px; text-transform: uppercase;">Applied Graphics/Logos</span>
                                                    <div class="d-flex flex-wrap gap-2">
                                                        @foreach($imageDecals as $decal)
                                                            <div class="bg-white border rounded p-2 d-inline-flex align-items-center gap-2">
                                                                @if(isset($decal['imageUrl']))
                                                                    <img src="{{ $decal['imageUrl'] }}" alt="Logo" style="height: 24px; max-width: 40px; object-fit: contain;" />
                                                                @endif
                                                                <div>
                                                                    <span class="text-dark fw-bold d-block" style="font-size: 10px;">{{ $decal['text'] ?? 'Logo Layer' }}</span>
                                                                    <small class="text-muted" style="font-size: 8px;">Scale: {{ $decal['decalScale'] ?? '0.15' }}</small>
                                                                </div>
                                                            </div>
                                                        @endforeach
                                                    </div>
                                                </div>
                                            @endif
                                        </div>
                                    </div>
                                </div>
                            </div>
                        @endif
                    @endforeach
                </div>
            @endif
        </div>

        <!-- Order Summary & Status Update Panel -->
        <div class="col-lg-4">
            <!-- Status Update -->
            <div class="card border-0 shadow-sm rounded-3 bg-white p-4 mb-4">
                <h5 class="fw-bold border-bottom pb-3 mb-4 text-dark uppercase tracking-wide">Order Status</h5>
                
                <form action="{{ route('admin.orders.updateStatus', $order->id) }}" method="POST" class="space-y-4">
                    @csrf
                    <div class="mb-3">
                        <label class="form-label text-xs font-bold text-muted uppercase">Set Current Status</label>
                        <select name="status" class="form-select rounded-xl py-2.5 px-3 border-slate-200 cursor-pointer fw-semibold text-dark">
                            @foreach($statuses as $status)
                                <option value="{{ $status->name }}" {{ strtolower($order->status) === strtolower($status->name) ? 'selected' : '' }}>
                                    {{ $status->name }}
                                </option>
                            @endforeach
                            @if($order->status && !$statuses->contains('name', $order->status))
                                <option value="{{ $order->status }}" selected>{{ $order->status }}</option>
                            @endif
                        </select>
                        @error('status')
                            <p class="text-xs text-danger mt-1">{{ $message }}</p>
                        @enderror
                    </div>

                    <div class="mb-3">
                        <label for="admin_note" class="form-label text-xs font-bold text-muted uppercase">Admin Internal Note</label>
                        <textarea id="admin_note" name="admin_note" rows="4" class="form-control rounded-xl border-slate-200 p-3 text-sm" placeholder="Write internal processing notes here (visible to admin only)...">{{ old('admin_note', $order->admin_note) }}</textarea>
                        @error('admin_note')
                            <p class="text-xs text-danger mt-1">{{ $message }}</p>
                        @enderror
                    </div>

                    <button type="submit" class="btn btn-primary w-100 py-2.5 fw-bold d-flex align-items-center justify-content-center gap-1.5 shadow-sm" style="border-radius: 0.75rem;">
                        <i class="bi bi-save fs-5"></i> &nbsp;Save Changes
                    </button>
                </form>
            </div>

            <!-- Customer & Payment details -->
            <div class="card border-0 shadow-sm rounded-3 bg-white p-4 mb-4">
                <h5 class="fw-bold border-bottom pb-3 mb-4 text-dark uppercase tracking-wide">Customer Details</h5>
                <div class="space-y-2 small fw-semibold text-slate-500 mb-3">
                    <div class="d-flex justify-content-between mb-2">
                        <span>Name:</span>
                        <strong class="text-dark">{{ $order->billing_name }}</strong>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span>Email:</span>
                        <strong class="text-dark">{{ $order->billing_email }}</strong>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span>Phone:</span>
                        <strong class="text-dark">{{ $order->phone }}</strong>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span>Payment Method:</span>
                        <strong class="text-dark">{{ $order->payment_method }}</strong>
                    </div>
                </div>
            </div>

            <!-- Financial Summary -->
            <div class="card border-0 shadow-sm rounded-3 bg-white p-4 mb-4">
                <h5 class="fw-bold border-bottom pb-3 mb-4 text-dark uppercase tracking-wide">Order Summary</h5>

                <div class="space-y-3 small fw-semibold text-slate-500">
                    <div class="d-flex justify-content-between mb-2">
                        <span>Subtotal:</span>
                        <strong class="text-dark">${{ number_format($order->subtotal, 2) }}</strong>
                    </div>
                    @if($order->discount_amount > 0)
                        <div class="d-flex justify-content-between mb-2 text-emerald-600">
                            <span>Discount ({{ $order->coupon_code }}):</span>
                            <strong>-${{ number_format($order->discount_amount, 2) }}</strong>
                        </div>
                    @endif
                    <div class="d-flex justify-content-between mb-2">
                        <span>Shipping:</span>
                        <strong class="text-dark">${{ number_format($order->shipping, 2) }}</strong>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span>Tax:</span>
                        <strong class="text-dark">${{ number_format($order->tax, 2) }}</strong>
                    </div>
                    <div class="d-flex justify-content-between mb-3 border-top border-bottom py-2">
                        <span>Shipping Address:</span>
                        <strong class="text-dark text-end" style="max-width: 180px; word-wrap: break-word;">{{ $order->shipping_address }}</strong>
                    </div>
                    <div class="d-flex justify-content-between align-items-center pt-2">
                        <span class="text-xs font-extrabold text-slate-800 uppercase tracking-widest">GRAND TOTAL:</span>
                        <h4 class="mb-0 fw-extrabold text-primary">${{ number_format($order->total, 2) }}</h4>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
