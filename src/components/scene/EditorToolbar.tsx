import { useEffect } from 'react'
import { useEditorStore } from '../../store/editorStore'
import type { EditorTool } from '../../types/editor'
import { MODEL_OBJECT_ID } from '../../types/editor'

interface ToolButtonProps {
  active?: boolean
  label: string
  shortcut?: string
  title: string
  onClick: () => void
}

function ToolButton({ active, label, shortcut, title, onClick }: ToolButtonProps) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`flex min-w-10 flex-col items-center rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition ${
        active
          ? 'border-amber-400/60 bg-amber-500/20 text-amber-200'
          : 'border-slate-700 bg-slate-950/80 text-slate-300 hover:border-slate-500 hover:bg-slate-800'
      }`}
    >
      <span>{label}</span>
      {shortcut ? (
        <span className="mt-0.5 text-[9px] uppercase tracking-wider text-slate-500">
          {shortcut}
        </span>
      ) : null}
    </button>
  )
}

export function EditorToolbar() {
  const tool = useEditorStore((state) => state.tool)
  const space = useEditorStore((state) => state.space)
  const snapEnabled = useEditorStore((state) => state.snapEnabled)
  const showGrid = useEditorStore((state) => state.showGrid)
  const selectedId = useEditorStore((state) => state.selectedId)
  const transform = useEditorStore(
    (state) => state.transforms[MODEL_OBJECT_ID],
  )
  const setTool = useEditorStore((state) => state.setTool)
  const setSpace = useEditorStore((state) => state.setSpace)
  const toggleSnap = useEditorStore((state) => state.toggleSnap)
  const toggleGrid = useEditorStore((state) => state.toggleGrid)
  const resetTransform = useEditorStore((state) => state.resetTransform)
  const select = useEditorStore((state) => state.select)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return
      }

      const key = event.key.toLowerCase()
      const toolMap: Record<string, EditorTool> = {
        q: 'select',
        w: 'move',
        e: 'rotate',
        r: 'scale',
      }

      if (toolMap[key]) {
        event.preventDefault()
        setTool(toolMap[key])
        if (!selectedId) select(MODEL_OBJECT_ID)
        return
      }

      if (key === 'x') {
        event.preventDefault()
        setSpace(space === 'world' ? 'local' : 'world')
        return
      }

      if (key === 'g') {
        event.preventDefault()
        toggleGrid()
        return
      }

      if (key === 's' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault()
        toggleSnap()
        return
      }

      if (key === 'escape') {
        select(null)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [select, selectedId, setSpace, setTool, space, toggleGrid, toggleSnap])

  return (
    <div className="pointer-events-none absolute inset-x-0 top-14 z-20 flex justify-center px-3">
      <div className="pointer-events-auto flex max-w-full flex-wrap items-center justify-center gap-1.5 rounded-2xl border border-slate-700/80 bg-slate-950/90 p-2 shadow-2xl backdrop-blur">
        <ToolButton
          active={tool === 'select'}
          label="Select"
          shortcut="Q"
          title="Seleccionar (Q)"
          onClick={() => setTool('select')}
        />
        <ToolButton
          active={tool === 'move'}
          label="Move"
          shortcut="W"
          title="Mover (W)"
          onClick={() => {
            setTool('move')
            select(MODEL_OBJECT_ID)
          }}
        />
        <ToolButton
          active={tool === 'rotate'}
          label="Rotate"
          shortcut="E"
          title="Rotar (E)"
          onClick={() => {
            setTool('rotate')
            select(MODEL_OBJECT_ID)
          }}
        />
        <ToolButton
          active={tool === 'scale'}
          label="Scale"
          shortcut="R"
          title="Escalar (R)"
          onClick={() => {
            setTool('scale')
            select(MODEL_OBJECT_ID)
          }}
        />

        <div className="mx-1 hidden h-8 w-px bg-slate-700 sm:block" />

        <ToolButton
          active={space === 'world'}
          label={space === 'world' ? 'World' : 'Local'}
          shortcut="X"
          title="Espacio World/Local (X)"
          onClick={() => setSpace(space === 'world' ? 'local' : 'world')}
        />
        <ToolButton
          active={snapEnabled}
          label="Snap"
          shortcut="S"
          title="Snap a grilla/ángulo (S)"
          onClick={toggleSnap}
        />
        <ToolButton
          active={showGrid}
          label="Grid"
          shortcut="G"
          title="Mostrar grilla (G)"
          onClick={toggleGrid}
        />
        <ToolButton
          label="Reset"
          title="Restablecer transform del modelo"
          onClick={() => resetTransform(MODEL_OBJECT_ID)}
        />

        <div className="mx-1 hidden h-8 w-px bg-slate-700 md:block" />

        <div className="hidden min-w-[9.5rem] rounded-lg border border-slate-800 bg-slate-900/80 px-2 py-1 font-mono text-[10px] leading-relaxed text-slate-400 md:block">
          <div>
            P {transform?.position.x.toFixed(2)},{transform?.position.y.toFixed(2)},
            {transform?.position.z.toFixed(2)}
          </div>
          <div>
            R {(((transform?.rotation.y ?? 0) * 180) / Math.PI).toFixed(0)}° Y
          </div>
          <div>
            S {transform?.scale.x.toFixed(2)},{transform?.scale.y.toFixed(2)},
            {transform?.scale.z.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  )
}
