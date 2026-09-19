import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Compass,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Eye,
  Sparkles,
  ShoppingBag,
  Info,
  Maximize2
} from 'lucide-react';
import { PageView } from '../types';

interface Supermarket3DProps {
  onSelectCategory: (slug: string) => void;
  onNavigate?: (page: PageView) => void;
}

interface IAisleInfo {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  description: string;
  position: [number, number, number];
}

const aislesData: IAisleInfo[] = [
  {
    id: 'fruits',
    name: 'Fruits Department',
    slug: 'fruits',
    icon: '🍎',
    color: '#ef4444',
    description: 'Fresh organic Honeycrisp apples, sweet bananas, oranges, and seasonal berries.',
    position: [-5, 1.2, -3]
  },
  {
    id: 'vegetables',
    name: 'Vegetables Section',
    slug: 'vegetables',
    icon: '🥦',
    color: '#10b981',
    description: 'Crisp green broccoli, vine tomatoes, carrots, bell peppers, and fresh greens.',
    position: [5, 1.2, -3]
  },
  {
    id: 'dairy',
    name: 'Dairy & Cheese Chillers',
    slug: 'dairy',
    icon: '🥛',
    color: '#0284c7',
    description: 'Grass-fed organic milk, farm cheeses, cultured yogurts, and butter.',
    position: [-5, 1.2, 4]
  },
  {
    id: 'bakery',
    name: 'Artisan Bakery Oven',
    slug: 'bakery',
    icon: '🍞',
    color: '#d97706',
    description: 'Freshly leavened sourdough loaves, baguettes, buns, and warm morning pastries.',
    position: [5, 1.2, 4]
  },
  {
    id: 'beverages',
    name: 'Cold Drinks Wall',
    slug: 'beverages',
    icon: '🥤',
    color: '#ec4899',
    description: 'Cold-pressed natural juices, iced teas, sparkling water, and tonics.',
    position: [0, 1.5, -8]
  },
  {
    id: 'checkout',
    name: 'Express Checkout Counter',
    slug: 'shop',
    icon: '🛒',
    color: '#8b5cf6',
    description: 'Smart self-checkout kiosks and friendly cashiers ready to pack your bags.',
    position: [0, 0.8, 8]
  }
];

export const Supermarket3D: React.FC<Supermarket3DProps> = ({
  onSelectCategory
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedAisle, setSelectedAisle] = useState<IAisleInfo | null>(aislesData[0]);
  const [cameraPosText, setCameraPosText] = useState('Central Aisle');
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 900;
    const height = container.clientHeight || 560;

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // dark supermarket evening atmosphere
    scene.fog = new THREE.FogExp2(0x0f172a, 0.035);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 3, 11);
    camera.lookAt(0, 1.5, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Supermarket Floor Tiles
    const floorGeo = new THREE.PlaneGeometry(36, 36);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.25,
      metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Floor tile grid lines
    const grid = new THREE.GridHelper(36, 18, 0x334155, 0x1e293b);
    grid.position.y = 0.01;
    scene.add(grid);

    // Ceiling with illuminated rows
    const ceilingGeo = new THREE.PlaneGeometry(36, 36);
    const ceilingMat = new THREE.MeshBasicMaterial({ color: 0x090d16 });
    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceiling.position.y = 6.5;
    ceiling.rotation.x = Math.PI / 2;
    scene.add(ceiling);

    // Ambient & Spot Lights
    const ambient = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambient);

    // Warm fluorescent ceiling strips
    for (let z = -12; z <= 12; z += 6) {
      const stripGeo = new THREE.BoxGeometry(28, 0.1, 0.4);
      const stripMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
      const strip = new THREE.Mesh(stripGeo, stripMat);
      strip.position.set(0, 6.4, z);
      scene.add(strip);

      const light = new THREE.PointLight(0xffedd5, 1.2, 14);
      light.position.set(0, 6, z);
      scene.add(light);
    }

    // Raycasting for shelf clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const clickableObjects: { mesh: THREE.Object3D; data: IAisleInfo }[] = [];

    // Helper: Build Shelf Unit
    const buildShelf = (aisle: IAisleInfo) => {
      const shelfGroup = new THREE.Group();
      shelfGroup.position.set(...aisle.position);

      // Shelf Base Stand
      const standGeo = new THREE.BoxGeometry(4.2, 2.4, 1.6);
      const standMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.4
      });
      const stand = new THREE.Mesh(standGeo, standMat);
      stand.castShadow = true;
      stand.receiveShadow = true;
      shelfGroup.add(stand);

      // 3 Shelf Tiers
      for (let y = -0.6; y <= 0.8; y += 0.7) {
        const tierGeo = new THREE.BoxGeometry(4.4, 0.08, 1.8);
        const tierMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.2 });
        const tier = new THREE.Mesh(tierGeo, tierMat);
        tier.position.y = y;
        shelfGroup.add(tier);

        // Populate items on shelf
        const colorHex = parseInt(aisle.color.replace('#', '0x'), 16);
        for (let x = -1.6; x <= 1.6; x += 0.8) {
          const itemGeo = new THREE.SphereGeometry(0.22, 12, 12);
          const itemMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.3 });
          const item = new THREE.Mesh(itemGeo, itemMat);
          item.position.set(x, y + 0.22, 0.4);
          shelfGroup.add(item);

          const itemBack = item.clone();
          itemBack.position.z = -0.4;
          shelfGroup.add(itemBack);
        }
      }

      // Department Overhead Signboard
      const signGeo = new THREE.BoxGeometry(3.6, 0.8, 0.15);
      const signMat = new THREE.MeshStandardMaterial({
        color: parseInt(aisle.color.replace('#', '0x'), 16),
        roughness: 0.2
      });
      const sign = new THREE.Mesh(signGeo, signMat);
      sign.position.y = 2.0;
      shelfGroup.add(sign);

      // Sign glow point light
      const signLight = new THREE.PointLight(parseInt(aisle.color.replace('#', '0x'), 16), 1.5, 6);
      signLight.position.set(0, 2.2, 0.6);
      shelfGroup.add(signLight);

      scene.add(shelfGroup);
      clickableObjects.push({ mesh: stand, data: aisle });
      clickableObjects.push({ mesh: sign, data: aisle });
    };

    aislesData.forEach(buildShelf);

    // Shopping Cart in Center Aisle
    const cartGroup = new THREE.Group();
    cartGroup.position.set(0, 0.6, 2);
    const cartFrameGeo = new THREE.BoxGeometry(1.6, 1.0, 1.2);
    const cartFrameMat = new THREE.MeshStandardMaterial({ color: 0x10b981, wireframe: true });
    const cartFrame = new THREE.Mesh(cartFrameGeo, cartFrameMat);
    cartGroup.add(cartFrame);

    // Wheels
    for (const [wx, wz] of [[-0.7, -0.5], [0.7, -0.5], [-0.7, 0.5], [0.7, 0.5]]) {
      const wheelGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 12);
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(wx, -0.5, wz);
      cartGroup.add(wheel);
    }
    scene.add(cartGroup);

    // Click handler on 3D shelves
    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(clickableObjects.map(c => c.mesh), true);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const match = clickableObjects.find(c => c.mesh === hit || c.mesh === hit.parent);
        if (match) {
          setSelectedAisle(match.data);
          // Animate camera look
          camera.lookAt(match.data.position[0], match.data.position[1], match.data.position[2]);
        }
      }
    };

    // Drag to rotate / Orbit look
    let isMouseDown = false;
    let lastX = 0;
    let cameraYaw = 0;

    const onMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      lastX = e.clientX;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isMouseDown) return;
      const dx = e.clientX - lastX;
      cameraYaw -= dx * 0.005;
      camera.rotation.y = cameraYaw;
      lastX = e.clientX;
    };
    const onMouseUp = () => { isMouseDown = false; };

    container.addEventListener('click', onClick);
    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Resize
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width: nw, height: nh } = entry.contentRect;
        if (nw > 0 && nh > 0) {
          camera.aspect = nw / nh;
          camera.updateProjectionMatrix();
          renderer.setSize(nw, nh);
        }
      }
    });
    resizeObserver.observe(container);

    let frameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Gentle floating animation on shopping cart
      cartGroup.position.y = 0.6 + Math.sin(time * 2) * 0.05;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      container.removeEventListener('click', onClick);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const moveCamera = (direction: 'forward' | 'backward' | 'left' | 'right' | 'reset') => {
    if (!cameraRef.current) return;
    const cam = cameraRef.current;
    if (direction === 'forward') {
      cam.position.z = Math.max(-5, cam.position.z - 2);
      setCameraPosText('Front Aisles');
    } else if (direction === 'backward') {
      cam.position.z = Math.min(13, cam.position.z + 2);
      setCameraPosText('Entrance');
    } else if (direction === 'left') {
      cam.position.x = Math.max(-8, cam.position.x - 2);
      setCameraPosText('Left Wing: Produce');
    } else if (direction === 'right') {
      cam.position.x = Math.min(8, cam.position.x + 2);
      setCameraPosText('Right Wing: Bakery');
    } else if (direction === 'reset') {
      cam.position.set(0, 3, 11);
      cam.lookAt(0, 1.5, 0);
      setCameraPosText('Central Aisle');
    }
  };

  return (
    <div id="supermarket-3d-experience" className="relative w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
      {/* Top Header Bar */}
      <div className="absolute top-0 inset-x-0 z-20 p-4 sm:p-6 bg-gradient-to-b from-slate-950/90 via-slate-950/60 to-transparent flex items-center justify-between text-white pointer-events-none">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive 3D Supermarket</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold font-display mt-1">
            Walk the Aisles in Real-Time 3D
          </h2>
          <p className="text-xs text-slate-300 hidden sm:block">
            Click any grocery shelf to inspect items or use walk controls to navigate
          </p>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-800/80 text-emerald-400 border border-slate-700">
            📍 {cameraPosText}
          </span>
        </div>
      </div>

      {/* 3D Canvas Viewport */}
      <div
        ref={mountRef}
        className="w-full h-[520px] sm:h-[600px] cursor-grab active:cursor-grabbing"
      />

      {/* Navigation Walk Controls overlay (Bottom Left) */}
      <div className="absolute bottom-6 left-6 z-20 flex flex-col items-center bg-slate-900/85 backdrop-blur-md p-3 rounded-2xl border border-slate-700/80 shadow-xl">
        <span className="text-[10px] font-bold uppercase text-slate-400 mb-1 flex items-center gap-1">
          <Compass className="w-3 h-3 text-emerald-400" /> Walk Controls
        </span>
        <div className="grid grid-cols-3 gap-1">
          <div />
          <button
            onClick={() => moveCamera('forward')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-emerald-600 text-white transition active:scale-95"
            title="Step Forward"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <div />
          <button
            onClick={() => moveCamera('left')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-emerald-600 text-white transition active:scale-95"
            title="Step Left"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => moveCamera('reset')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold transition active:scale-95"
            title="Reset to Central Aisle"
          >
            •
          </button>
          <button
            onClick={() => moveCamera('right')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-emerald-600 text-white transition active:scale-95"
            title="Step Right"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <div />
          <button
            onClick={() => moveCamera('backward')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-emerald-600 text-white transition active:scale-95"
            title="Step Backward"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
          <div />
        </div>
      </div>

      {/* Selected Shelf Inspector Card (Bottom Right) */}
      {selectedAisle && (
        <div className="absolute bottom-6 right-6 z-20 max-w-sm w-full bg-slate-900/90 backdrop-blur-md p-5 rounded-3xl border border-slate-700 shadow-2xl text-white animate-in slide-in-from-bottom-2">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{selectedAisle.icon}</span>
            <div>
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Current Aisle Selected
              </div>
              <h3 className="text-lg font-bold text-white font-display">
                {selectedAisle.name}
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-300 mb-4 leading-relaxed">
            {selectedAisle.description}
          </p>

          <button
            onClick={() => onSelectCategory(selectedAisle.slug)}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Open {selectedAisle.name} Catalog</span>
          </button>
        </div>
      )}
    </div>
  );
};
