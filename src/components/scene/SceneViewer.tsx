import { ContactShadows, Environment, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense, useState } from 'react'
import { CATEGORY_OPTIONS, MATERIAL_OPTIONS } from '../../constants/design'
import { useDesignStore } from '../../store/designStore'
import { useEditorStore } from '../../store/editorStore'
import { EditableModel } from './EditableModel'
import { EditorToolbar } from './EditorToolbar'
import { TransformInspector } from './TransformInspector'

function SceneContent({
  controlsEnabled,
  onDraggingChange,
}: {
  controlsEnabled: boolean
  onDraggingChange: (dragging: boolean) => void
}) {
  const showGrid = useEditorStore((state) => state.showGrid)
  const select = useEditorStore((state) => state.select)

  return (
    <>
      <color attach="background" args={['#0f172a']} />
      <ambientLight intensity={0.55} />
      <directionalLight
        castShadow
        intensity={1.15}
        position={[4, 8, 3]}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight intensity={0.35} position={[-4, 3, -2]} />

      <Suspense fallback={null}>
        <EditableModel onDraggingChange={onDraggingChange} />
        <Environment preset="warehouse" environmentIntensity={0.35} />
      </Suspense>

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
        onClick={(event) => {
          event.stopPropagation()
          select(null)
        }}
      >
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#1e293b" roughness={0.95} metalness={0} />
      </mesh>

      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.45}
        scale={20}
        blur={2.5}
        far={12}
      />

      {showGrid ? (
        <gridHelper args={[20, 20, '#334155', '#1e293b']} position={[0, 0.02, 0]} />
      ) : null}

      <OrbitControls
        makeDefault
        enabled={controlsEnabled}
        enableDamping
        dampingFactor={0.08}
        minDistance={1}
        maxDistance={30}
        maxPolarAngle={Math.PI * 0.49}
        target={[0, 0.8, 0]}
      />
    </>
  )
}

export function SceneViewer() {
  const category = useDesignStore((state) => state.category)
  const materialId = useDesignStore((state) => state.materialId)
  const [draggingGizmo, setDraggingGizmo] = useState(false)

  const categoryLabel =
    CATEGORY_OPTIONS.find((option) => option.id === category)?.label ?? category
  const materialLabel =
    MATERIAL_OPTIONS.find((option) => option.id === materialId)?.label ??
    materialId

  return (
    <section className="relative flex h-full min-h-0 flex-1 flex-col bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">Visor 3D</h2>
          <p className="text-xs text-slate-500">
            Q Select · W Move · E Rotate · R Scale · X World/Local · S Snap · G Grid
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-300">
            {categoryLabel}
          </span>
          <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs text-amber-300">
            {materialLabel}
          </span>
        </div>
      </div>

      <div className="relative min-h-0 flex-1">
        <EditorToolbar />

        <div className="pointer-events-none absolute bottom-4 right-4 z-20 w-56">
          <div className="pointer-events-auto">
            <TransformInspector />
          </div>
        </div>

        <Canvas
          shadows
          camera={{ position: [3.2, 2.4, 3.8], fov: 45, near: 0.1, far: 100 }}
          gl={{ antialias: true }}
          className="h-full w-full"
          onPointerMissed={() => {
            useEditorStore.getState().select(null)
          }}
        >
          <SceneContent
            controlsEnabled={!draggingGizmo}
            onDraggingChange={setDraggingGizmo}
          />
        </Canvas>
      </div>
    </section>
  )
}
