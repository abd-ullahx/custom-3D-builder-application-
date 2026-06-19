import React, { Suspense, useMemo, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Center, ContactShadows, Html } from '@react-three/drei';
import * as THREE from 'three';

useGLTF.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.5/');

function Model({ url, mapping, colors, pattern, finish, mouseFollow }) {
  const { scene } = useGLTF(url);
  const meshRef = useRef();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!mouseFollow) return;
    const handleMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [mouseFollow]);

  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse(node => {
      if (node.isMesh) {
        node.material = node.material.clone();
        node.material.userData.uniforms = {
          uColor: { value: new THREE.Color('#ffffff') },
          uIsGradient: { value: 0.0 },
          uColor1: { value: new THREE.Color('#ffffff') },
          uColor2: { value: new THREE.Color('#ffffff') },
          uMinY: { value: -1 },
          uMaxY: { value: 1 },
          uPatternType: { value: 0.0 } // 0: none, 1: carbon, 2: camo, 3: dots
        };

        node.material.onBeforeCompile = (shader) => {
          Object.assign(shader.uniforms, node.material.userData.uniforms);
          shader.vertexShader = `varying vec3 vLocalPos;\nvarying vec2 vUv;\n${shader.vertexShader}`.replace(
            '#include <begin_vertex>',
            '#include <begin_vertex>\nvLocalPos = position;\nvUv = uv;'
          );
          shader.fragmentShader = `
            uniform vec3 uColor;
            uniform float uIsGradient;
            uniform vec3 uColor1;
            uniform vec3 uColor2;
            uniform float uMinY;
            uniform float uMaxY;
            uniform float uPatternType;
            varying vec3 vLocalPos;
            varying vec2 vUv;
            
            // Procedural Noise for Camo
            float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
            float noise(vec2 p) {
              vec2 i = floor(p); vec2 f = fract(p);
              f = f*f*(3.0-2.0*f);
              return mix(mix(hash(i + vec2(0,0)), hash(i + vec2(1,0)), f.x),
                         mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x), f.y);
            }

            ${shader.fragmentShader}
          `.replace(
            'vec4 diffuseColor = vec4( diffuse, opacity );',
            `
            vec3 baseColor = uColor;
            if (uIsGradient > 0.5) {
              float t = (vLocalPos.y - uMinY) / (uMaxY - uMinY);
              t = clamp(t, 0.0, 1.0);
              t = smoothstep(0.0, 1.0, t);
              baseColor = mix(uColor2, uColor1, t);
            }
            
            float patStrength = 0.0;
            if (uPatternType > 0.5 && uPatternType < 1.5) { // CARBON
              vec2 grid = fract(vUv * 40.0);
              patStrength = step(0.5, grid.x) == step(0.5, grid.y) ? 0.1 : -0.1;
            } else if (uPatternType > 1.5 && uPatternType < 2.5) { // CAMO
              patStrength = (noise(vUv * 10.0) - 0.5) * 0.4;
            } else if (uPatternType > 2.5) { // DOTS
              vec2 grid = fract(vUv * 30.0) - 0.5;
              patStrength = length(grid) < 0.3 ? -0.2 : 0.0;
            }
            
            baseColor += patStrength;
            vec4 diffuseColor = vec4( baseColor, opacity );
            `
          );
        };
      }
    });
    return clone;
  }, [scene]);

  useEffect(() => {
    const roughness = finish === 'gloss' ? 0.1 : finish === 'metallic' ? 0.2 : 0.8;
    const metalness = finish === 'metallic' ? 0.8 : 0.0;
    const pType = pattern === 'carbon' ? 1.0 : pattern === 'camo' ? 2.0 : pattern === 'dots' ? 3.0 : 0.0;

    clonedScene.traverse((node) => {
      if (node.isMesh && node.material.userData.uniforms) {
        node.updateMatrixWorld();
        node.geometry.computeBoundingBox();
        const center = new THREE.Vector3();
        node.geometry.boundingBox.getCenter(center);
        center.applyMatrix4(node.matrixWorld);

        const { x, y, z } = center;
        let type = 'Body';
        if (y > 0.5) type = "Neck";
        else if (Math.abs(x) > 0.3) type = x > 0 ? "R_Sleeve" : "L_Sleeve";
        else if (z > 0.02) type = "Front";
        else if (z < -0.02) type = "Back";
        else type = "Body";

        const colorType = mapping[type] || mapping['Body'] || 'primary';
        const config = colors[colorType];

        if (config) {
          const u = node.material.userData.uniforms;
          u.uColor.value.set(config.color).convertSRGBToLinear();
          u.uIsGradient.value = config.isGrad ? 1.0 : 0.0;
          u.uColor1.value.set(config.color2).convertSRGBToLinear();
          u.uColor2.value.set(config.color).convertSRGBToLinear();
          u.uMinY.value = node.geometry.boundingBox.min.y;
          u.uMaxY.value = node.geometry.boundingBox.max.y;
          u.uPatternType.value = pType;
        }

        node.material.roughness = roughness;
        node.material.metalness = metalness;
      }
    });
  }, [clonedScene, mapping, colors, pattern, finish]);

  useFrame((state) => {
    if (!meshRef.current) return;
    if (mouseFollow) {
      const targetX = mouse.current.x * 0.5;
      const targetY = mouse.current.y * 0.2;
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetX, 0.05);
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, -targetY, 0.05);
    } else {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.3;
      meshRef.current.rotation.x = 0;
    }
  });

  // No manual disposal of clonedScene here to avoid breaking shared geometries in useGLTF cache


  return (
    <group ref={meshRef}>
      <primitive object={clonedScene} scale={1.5} />
    </group>
  );
}

const CardLoader = () => (
  <div className="flex flex-col items-center justify-center gap-3 animate-pulse">
    <div className="relative">
      <div className="w-8 h-8 border-2 border-gray-100 rounded-full" />
      <div className="absolute top-0 left-0 w-8 h-8 border-2 border-t-blue-500 rounded-full animate-spin" />
    </div>
    <span className="text-[7px] font-black text-gray-300 uppercase tracking-[0.3em]">Loading Model</span>
  </div>
);

const DesignPreview = ({ modelUrl, mapping, primaryColor, primaryIsGrad, primaryColor2, secondaryColor, secondaryIsGrad, secondaryColor2, thirdColor, thirdIsGrad, thirdColor2, pattern, lighting, finish, mouseFollow }) => {
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const colors = useMemo(() => ({
    primary: { color: primaryColor, isGrad: primaryIsGrad, color2: primaryColor2 },
    secondary: { color: secondaryColor, isGrad: secondaryIsGrad, color2: secondaryColor2 },
    third: { color: thirdColor, isGrad: thirdIsGrad, color2: thirdColor2 }
  }), [primaryColor, primaryIsGrad, primaryColor2, secondaryColor, secondaryIsGrad, secondaryColor2, thirdColor, thirdIsGrad, thirdColor2]);

  return (
    <div ref={containerRef} className="w-full h-full bg-transparent flex items-center justify-center">
      {isInView ? (
        <Canvas
          camera={{ position: [0, 0, 4.2], fov: 30 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          dpr={[1, 2]}
        >
        <ambientLight intensity={lighting === 'night' ? 0.2 : 0.6} />
        <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={lighting === 'studio' ? 2 : 1} />
        <Suspense fallback={<Html center><CardLoader /></Html>}>
          <Center>
            <Model
              url={modelUrl} mapping={mapping} colors={colors}
              pattern={pattern} finish={finish} mouseFollow={mouseFollow}
            />
          </Center>
          <Environment preset={lighting || 'city'} />
          <ContactShadows position={[0, -1.3, 0]} opacity={0.3} scale={6} blur={2.5} far={4} />
        </Suspense>
        </Canvas>
      ) : (
        <CardLoader />
      )}
    </div>
  );
};

export default DesignPreview;
