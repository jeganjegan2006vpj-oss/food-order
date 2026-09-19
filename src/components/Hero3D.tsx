import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ArrowRight, Sparkles, ShoppingCart, ShieldCheck, Zap, RefreshCw } from 'lucide-react';
import { PageView } from '../types';

interface Hero3DProps {
  onNavigate: (page: PageView) => void;
  onExploreCategories: () => void;
}

export const Hero3D: React.FC<Hero3DProps> = ({ onNavigate, onExploreCategories }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [is3DLoaded, setIs3DLoaded] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 580;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const mainDirectional = new THREE.DirectionalLight(0xffffff, 2.0);
    mainDirectional.position.set(8, 12, 10);
    mainDirectional.castShadow = true;
    scene.add(mainDirectional);

    const greenFillLight = new THREE.PointLight(0x22c55e, 1.5, 30);
    greenFillLight.position.set(-8, 5, 6);
    scene.add(greenFillLight);

    const yellowAccentLight = new THREE.PointLight(0xf59e0b, 1.2, 25);
    yellowAccentLight.position.set(6, -6, 5);
    scene.add(yellowAccentLight);

    // Group for all floating objects
    const groceryGroup = new THREE.Group();
    scene.add(groceryGroup);

    // Array of objects with their float anim offsets
    const floaters: { mesh: THREE.Object3D; speed: number; rotSpeed: number; basePos: THREE.Vector3; timeOffset: number }[] = [];

    // Helper: Material creator
    const matGlossy = (color: number, roughness = 0.25) =>
      new THREE.MeshStandardMaterial({
        color,
        roughness,
        metalness: 0.1,
      });

    // 1. Shopping Basket
    const createBasket = () => {
      const basketGroup = new THREE.Group();
      // Outer crate frame
      const frameGeo = new THREE.BoxGeometry(3.6, 2.2, 2.6);
      const frameMat = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        roughness: 0.35,
        wireframe: false
      });
      const frameMesh = new THREE.Mesh(frameGeo, frameMat);
      frameMesh.castShadow = true;
      basketGroup.add(frameMesh);

      // Basket rim (white plastic trim)
      const rimGeo = new THREE.BoxGeometry(3.8, 0.2, 2.8);
      const rimMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
      const rimMesh = new THREE.Mesh(rimGeo, rimMat);
      rimMesh.position.y = 1.1;
      basketGroup.add(rimMesh);

      // Two handles (torus)
      const handleGeo = new THREE.TorusGeometry(1.2, 0.12, 12, 24, Math.PI);
      const handleMat = new THREE.MeshStandardMaterial({ color: 0x047857, metalness: 0.4, roughness: 0.3 });
      const handle1 = new THREE.Mesh(handleGeo, handleMat);
      handle1.rotation.x = Math.PI / 2;
      handle1.rotation.y = Math.PI / 8;
      handle1.position.set(0, 1.4, 0);
      basketGroup.add(handle1);

      return basketGroup;
    };
    const basket = createBasket();
    basket.position.set(2.4, -0.4, 1.2);
    basket.rotation.set(0.2, -0.4, 0.1);
    groceryGroup.add(basket);
    floaters.push({ mesh: basket, speed: 1.2, rotSpeed: 0.4, basePos: basket.position.clone(), timeOffset: 0 });

    // 2. Fresh Red Apple
    const createApple = () => {
      const appleGroup = new THREE.Group();
      const bodyGeo = new THREE.SphereGeometry(0.75, 24, 24);
      bodyGeo.scale(1, 0.92, 1);
      const bodyMat = matGlossy(0xef4444, 0.2);
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.castShadow = true;
      appleGroup.add(body);

      // Stem
      const stemGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.35, 8);
      const stemMat = new THREE.MeshStandardMaterial({ color: 0x5c3a21 });
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.set(0, 0.8, 0);
      stem.rotation.z = 0.15;
      appleGroup.add(stem);

      // Green Leaf
      const leafGeo = new THREE.ConeGeometry(0.18, 0.45, 8);
      leafGeo.scale(1, 1, 0.2);
      const leafMat = new THREE.MeshStandardMaterial({ color: 0x22c55e });
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      leaf.position.set(0.15, 0.78, 0);
      leaf.rotation.z = -1.2;
      appleGroup.add(leaf);

      return appleGroup;
    };
    const apple = createApple();
    apple.position.set(-1.8, 1.6, 2.2);
    groceryGroup.add(apple);
    floaters.push({ mesh: apple, speed: 1.6, rotSpeed: 0.8, basePos: apple.position.clone(), timeOffset: 1.2 });

    // 3. Banana
    const createBanana = () => {
      const bananaGroup = new THREE.Group();
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.9, -0.3, 0),
        new THREE.Vector3(-0.4, 0.2, 0),
        new THREE.Vector3(0.4, 0.3, 0),
        new THREE.Vector3(1.0, -0.1, 0),
      ]);
      const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.24, 12, false);
      const bananaMat = matGlossy(0xfacc15, 0.3);
      const tube = new THREE.Mesh(tubeGeo, bananaMat);
      bananaGroup.add(tube);

      // Tips
      const tipGeo = new THREE.SphereGeometry(0.16, 12, 12);
      const tipMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
      const tip1 = new THREE.Mesh(tipGeo, tipMat);
      tip1.position.set(-0.9, -0.3, 0);
      bananaGroup.add(tip1);
      const tip2 = new THREE.Mesh(tipGeo, tipMat);
      tip2.position.set(1.0, -0.1, 0);
      bananaGroup.add(tip2);

      return bananaGroup;
    };
    const banana = createBanana();
    banana.position.set(0.2, 2.2, 0.8);
    banana.rotation.set(0.4, 0.2, -0.5);
    groceryGroup.add(banana);
    floaters.push({ mesh: banana, speed: 1.4, rotSpeed: 0.6, basePos: banana.position.clone(), timeOffset: 2.5 });

    // 4. Juicy Orange
    const createOrange = () => {
      const orangeGroup = new THREE.Group();
      const orangeGeo = new THREE.SphereGeometry(0.72, 24, 24);
      const orangeMat = matGlossy(0xf97316, 0.4);
      const orangeMesh = new THREE.Mesh(orangeGeo, orangeMat);
      orangeGroup.add(orangeMesh);

      // Leaf dot
      const dotGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.1, 8);
      const dotMat = new THREE.MeshStandardMaterial({ color: 0x15803d });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.y = 0.72;
      orangeGroup.add(dot);

      return orangeGroup;
    };
    const orange = createOrange();
    orange.position.set(4.2, 1.8, 0.2);
    groceryGroup.add(orange);
    floaters.push({ mesh: orange, speed: 1.8, rotSpeed: 0.9, basePos: orange.position.clone(), timeOffset: 3.1 });

    // 5. Tomato
    const createTomato = () => {
      const tomatoGroup = new THREE.Group();
      const bodyGeo = new THREE.SphereGeometry(0.65, 20, 20);
      bodyGeo.scale(1.1, 0.9, 1.1);
      const bodyMat = matGlossy(0xdc2626, 0.2);
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      tomatoGroup.add(body);

      // Green Star calyx
      const calyxMat = new THREE.MeshStandardMaterial({ color: 0x16a34a });
      for (let i = 0; i < 5; i++) {
        const starGeo = new THREE.ConeGeometry(0.12, 0.35, 6);
        const star = new THREE.Mesh(starGeo, calyxMat);
        const angle = (i * Math.PI * 2) / 5;
        star.position.set(Math.cos(angle) * 0.25, 0.62, Math.sin(angle) * 0.25);
        star.rotation.x = Math.PI / 2;
        star.rotation.z = -angle;
        tomatoGroup.add(star);
      }

      return tomatoGroup;
    };
    const tomato = createTomato();
    tomato.position.set(-3.2, -0.6, 1.8);
    groceryGroup.add(tomato);
    floaters.push({ mesh: tomato, speed: 1.5, rotSpeed: 0.7, basePos: tomato.position.clone(), timeOffset: 0.8 });

    // 6. Milk Bottle
    const createMilkBottle = () => {
      const milkGroup = new THREE.Group();
      // Body
      const bodyGeo = new THREE.CylinderGeometry(0.55, 0.65, 1.8, 20);
      const bodyMat = new THREE.MeshPhysicalMaterial({
        color: 0xf8fafc,
        roughness: 0.15,
        transmission: 0.6,
        thickness: 0.8
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      milkGroup.add(body);

      // Neck
      const neckGeo = new THREE.CylinderGeometry(0.3, 0.55, 0.6, 16);
      const neck = new THREE.Mesh(neckGeo, bodyMat);
      neck.position.y = 1.1;
      milkGroup.add(neck);

      // Blue Cap
      const capGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.2, 16);
      const capMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.y = 1.45;
      milkGroup.add(cap);

      // Label
      const labelGeo = new THREE.CylinderGeometry(0.57, 0.66, 0.8, 20, 1, true);
      const labelMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.4 });
      const label = new THREE.Mesh(labelGeo, labelMat);
      milkGroup.add(label);

      return milkGroup;
    };
    const milk = createMilkBottle();
    milk.position.set(1.1, -1.8, 2.5);
    milk.rotation.set(0.2, 0.1, 0.25);
    groceryGroup.add(milk);
    floaters.push({ mesh: milk, speed: 1.3, rotSpeed: 0.5, basePos: milk.position.clone(), timeOffset: 1.9 });

    // 7. Bread Loaf
    const createBread = () => {
      const breadGeo = new THREE.BoxGeometry(2.0, 0.9, 1.1);
      const breadMat = matGlossy(0xd97706, 0.7);
      const bread = new THREE.Mesh(breadGeo, breadMat);
      bread.scale.set(1, 1.1, 1);
      return bread;
    };
    const bread = createBread();
    bread.position.set(-1.2, -2.0, 1.0);
    bread.rotation.set(-0.3, 0.4, -0.2);
    groceryGroup.add(bread);
    floaters.push({ mesh: bread, speed: 1.1, rotSpeed: 0.4, basePos: bread.position.clone(), timeOffset: 4.0 });

    // 8. Cereal Box
    const createCerealBox = () => {
      const boxGeo = new THREE.BoxGeometry(1.6, 2.4, 0.7);
      const boxMat = matGlossy(0xf59e0b, 0.3);
      const box = new THREE.Mesh(boxGeo, boxMat);

      // Top flaps
      const topFlapGeo = new THREE.BoxGeometry(1.65, 0.1, 0.75);
      const topFlapMat = new THREE.MeshStandardMaterial({ color: 0xb45309 });
      const topFlap = new THREE.Mesh(topFlapGeo, topFlapMat);
      topFlap.position.y = 1.25;
      box.add(topFlap);

      return box;
    };
    const cereal = createCerealBox();
    cereal.position.set(3.8, -1.6, -0.8);
    cereal.rotation.set(0.1, -0.5, 0.1);
    groceryGroup.add(cereal);
    floaters.push({ mesh: cereal, speed: 1.0, rotSpeed: 0.3, basePos: cereal.position.clone(), timeOffset: 2.1 });

    // 9. Paper Grocery Bag
    const createGroceryBag = () => {
      const bagGeo = new THREE.BoxGeometry(1.8, 2.6, 1.2);
      const bagMat = new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.85 });
      const bag = new THREE.Mesh(bagGeo, bagMat);
      return bag;
    };
    const bag = createGroceryBag();
    bag.position.set(-4.0, 1.5, -0.5);
    bag.rotation.set(-0.2, 0.5, 0.15);
    groceryGroup.add(bag);
    floaters.push({ mesh: bag, speed: 0.9, rotSpeed: 0.3, basePos: bag.position.clone(), timeOffset: 3.5 });

    // 10. Fresh Broccoli / Vegetable head
    const createBroccoli = () => {
      const brocGroup = new THREE.Group();
      // Stem
      const stemGeo = new THREE.CylinderGeometry(0.2, 0.3, 0.8, 12);
      const stemMat = new THREE.MeshStandardMaterial({ color: 0x86efac });
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.y = -0.4;
      brocGroup.add(stem);

      // Crown spheres
      const crownMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });
      for (let i = 0; i < 7; i++) {
        const sphereGeo = new THREE.SphereGeometry(0.35, 12, 12);
        const sphere = new THREE.Mesh(sphereGeo, crownMat);
        const angle = (i * Math.PI * 2) / 6;
        if (i === 6) {
          sphere.position.set(0, 0.35, 0);
        } else {
          sphere.position.set(Math.cos(angle) * 0.3, 0.15, Math.sin(angle) * 0.3);
        }
        brocGroup.add(sphere);
      }
      return brocGroup;
    };
    const broccoli = createBroccoli();
    broccoli.position.set(-2.6, 2.8, -1.0);
    broccoli.rotation.set(0.3, -0.2, 0.4);
    groceryGroup.add(broccoli);
    floaters.push({ mesh: broccoli, speed: 1.4, rotSpeed: 0.6, basePos: broccoli.position.clone(), timeOffset: 1.7 });

    // Background floating glowing particles
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 24;
      particlePos[i + 1] = (Math.random() - 0.5) * 16;
      particlePos[i + 2] = (Math.random() - 0.5) * 14;

      // Emerald to golden tones
      const isGold = Math.random() > 0.5;
      particleColors[i] = isGold ? 0.98 : 0.15;
      particleColors[i + 1] = isGold ? 0.8 : 0.85;
      particleColors[i + 2] = isGold ? 0.3 : 0.45;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse movement interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetMouseX = x * 2;
      targetMouseY = y * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize handling with ResizeObserver
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0) {
          camera.aspect = newW / newH;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(container);

    setIs3DLoaded(true);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Group rotation following mouse
      groceryGroup.rotation.y = mouseX * 0.45;
      groceryGroup.rotation.x = -mouseY * 0.3;

      // Animate each floating grocery object
      floaters.forEach(f => {
        const t = elapsedTime * f.speed + f.timeOffset;
        f.mesh.position.y = f.basePos.y + Math.sin(t) * 0.28;
        f.mesh.position.x = f.basePos.x + Math.cos(t * 0.8) * 0.12;
        f.mesh.rotation.y += 0.005 * f.rotSpeed;
        f.mesh.rotation.z = Math.sin(t * 0.5) * 0.1;
      });

      // Slowly rotate particle field
      particles.rotation.y = elapsedTime * 0.04;
      particles.rotation.x = Math.sin(elapsedTime * 0.02) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div id="hero-3d-section" className="relative w-full overflow-hidden bg-gradient-to-b from-emerald-950 via-[#0d2a1b] to-emerald-900 text-white min-h-[640px] lg:min-h-[720px] flex items-center">
      {/* Background radial gradient mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.22),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.15),transparent_40%)] pointer-events-none" />

      {/* 3D Canvas Container */}
      <div
        ref={mountRef}
        className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing"
        title="Interactive 3D Groceries: Move your cursor to rotate"
      />

      {/* Hero Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
        <div className="max-w-2xl">
          {/* Tag Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-semibold mb-6 backdrop-blur-md shadow-lg">
            <Sparkles className="w-4 h-4 text-emerald-300 animate-pulse" />
            <span>Next-Generation 3D Supermarket</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-emerald-200/80 font-normal hidden sm:inline">15-Minute Local Delivery</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] mb-6 drop-shadow-sm font-display">
            Fresh Groceries.{' '}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-200 to-amber-300">
              Delivered to Your Door.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-emerald-100/90 font-normal leading-relaxed mb-8 max-w-xl">
            Shop fresh fruits, vegetables, dairy, snacks and everyday essentials with a next-generation grocery experience.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 mb-10">
            <button
              id="hero-shop-now-btn"
              onClick={() => onNavigate('shop')}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-base shadow-xl shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              id="hero-explore-categories-btn"
              onClick={onExploreCategories}
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-base border border-white/20 backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Explore Categories</span>
            </button>

            <button
              id="hero-enter-3d-store-btn"
              onClick={() => onNavigate('store3d')}
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-base shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Enter 3D Store</span>
            </button>
          </div>

          {/* Value Props Bar */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-emerald-800/60 max-w-lg">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                <Zap className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-white">15 Min Delivery</div>
                <div className="text-emerald-200/70">From local dark store</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-white">100% Organic</div>
                <div className="text-emerald-200/70">Certified farm fresh</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-white">Easy Returns</div>
                <div className="text-emerald-200/70">No questions asked</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating interactive 3D hint badge */}
      <div className="hidden lg:flex absolute bottom-6 right-8 z-10 items-center gap-2 px-4 py-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/15 text-xs text-emerald-200">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>Move cursor to tilt 3D scene • 10 floating grocery items</span>
      </div>
    </div>
  );
};
