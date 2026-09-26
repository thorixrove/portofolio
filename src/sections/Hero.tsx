import { Float, PerspectiveCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Leva } from 'leva';
import { Suspense } from 'react';
import { useMediaQuery } from 'react-responsive';

import Button from '../components/Button.jsx';
import Cube from '../components/Cube.jsx';
import Draggable from '../components/Draggable.jsx';
import HeroCamera from '../components/HeroCamera.jsx';
import CanvasLoader from '../components/Loading.jsx';
import ReactLogo from '../components/ReactLogo.jsx';
import Rings from '../components/Rings.jsx';
import Target from '../components/Target.jsx';
import { calculateSizes } from '../constants/index.js';

const Hero = () => {

  const TargetModel = Target as any;
  const ReactLogoModel = ReactLogo as any;
  const RingsModel = Rings as any;
  const CubeModel = Cube as any;
  const DraggableGroup = Draggable as any;

  const isSmall = useMediaQuery({ maxWidth: 440 })
  const isMobile = useMediaQuery({ maxWidth: 768 })
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1024 })

  const sizes = calculateSizes(isSmall, isMobile, isTablet)



  return (
    <section className="w-full" id="home">
      <div className="w-full h-full absolute inset-0 overflow-hidden">
        <Canvas
          className="w-full h-full"
          style={{ pointerEvents: 'auto', touchAction: 'none', cursor: 'grab' }}
        >
          <Suspense fallback={<CanvasLoader />}>
            {/* To hide controller */}
            <Leva hidden />
            <PerspectiveCamera makeDefault position={[0, 0, 30]} />

            <HeroCamera isMobile={isMobile}>
              <TargetModel
                position={sizes.targetPosition}
                scale={sizes.targetScale}
                screenVideo="/textures/nono_square.mp4"
                screenMeshIndex={5}
                screenOffsetX={5.3}
                screenOffsetY={1}
                screenOffsetZ={2}
                screenWidth={6}
                screenHeight={5}
                screenCornerRadius={8}
                screenCurvature={0.8}
                screenBottomConcavity={0.001}
                screenTopConcavity={0.3}
                screenLeftConcavity={0.2}
                screenRightConcavity={0.3}
              />
            </HeroCamera>

            {/* Elemen lain sekarang bisa di-drag bebas oleh kursor/jari,
                dan dikasih efek melayang (Float) biar hidup kayak Cube */}
            <DraggableGroup
              initialPosition={sizes.reactLogoPosition}
              dragRadius={isSmall ? 2.6 : isMobile ? 3.2 : 4}
              driftStrength={0.85}
              driftSpeedX={1.2}
              driftSpeedY={1.7}
            >
              <Float floatIntensity={1.5} rotationIntensity={0.4}>
                <ReactLogoModel position={[0, 0, 0]} scale={sizes.reactLogoScale} />
              </Float>
            </DraggableGroup>

            <DraggableGroup
              initialPosition={sizes.ringPosition}
              dragRadius={isSmall ? 3.3 : isMobile ? 4.2 : 5.4}
              driftStrength={1.4}
              driftSpeedX={0.9}
              driftSpeedY={1.1}
            >
              <Float floatIntensity={1.5} rotationIntensity={0.4}>
                <RingsModel position={[0, 0, 0]} scale={sizes.ringScale} />
              </Float>
            </DraggableGroup>

            <DraggableGroup
              initialPosition={sizes.cubePosition}
              dragRadius={isSmall ? 2.2 : isMobile ? 2.8 : 3.5}
              driftStrength={0.55}
              driftSpeedX={1.8}
              driftSpeedY={1.3}
            >
              <CubeModel position={[0, 0, 0]} scale={sizes.cubeScale} />
            </DraggableGroup>

            <ambientLight intensity={1} />
            <directionalLight position={[10, 10, 10]} intensity={0.5} />
          </Suspense>
        </Canvas>
      </div>

      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="w-full mx-auto flex flex-col sm:mt-36 mt-20 c-space gap-3 pointer-events-none">
          <p className="sm:text-3xl text-xl font-medium text-white text-center font-generalsans">
            Hi, I am Thoriq <span className="waving-hand">👋</span>
          </p>
          <p className="hero_tag text-gray_gradient">Building Products & Brands</p>
        </div>

        <div className="absolute bottom-7 left-0 right-0 w-full c-space pointer-events-none">
          <a href="#about" className="w-fit pointer-events-auto">
            <Button name="Let's work together" isBeam containerClass="sm:w-fit w-full sm:min-w-96" />
          </a>
        </div>
      </div>
    </section>
  )
}

export default Hero