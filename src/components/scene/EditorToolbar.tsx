import { useEffect } from 'react'
import { useDesignStore } from '../../store/designStore'
import { useEditorStore } from '../../store/editorStore'
import type { EditorTool } from '../../types/editor'
import { MODEL_ROOT_ID } from '../../types/editor'
import { useObjectRegistry } from './objectRegistry'

interface ToolButtonProps {
  active?: boolean
  label: string
  shortcut?: string
  title: string
  onClick: () => void
  disabled?: boolean
}

function ToolButton({
  active,
  label,
  shortcut,
  title,
  onClick,
  disabled,
}: ToolButtonProps) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`flex min-w-10 flex-col items-center rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
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
  const category = useDesignStore((s) => s.category)
  const isFreeform = category === 'freeform'

  const tool = useEditorStore((state) => state.tool)
  const space = useEditorStore((state) => state.space)
  const snapEnabled = useEditorStore((state) => state.snapEnabled)
  const showGrid = useEditorStore((state) => state.showGrid)
  const selectedIds = useEditorStore((state) => state.selectedIds)
  const setTool = useEditorStore((state) => state.setTool)
  const setSpace = useEditorStore((state) => state.setSpace)
  const toggleSnap = useEditorStore((state) => state.toggleSnap)
  const toggleGrid = useEditorStore((state) => state.toggleGrid)
  const resetTransform = useEditorStore((state) => state.resetTransform)
  const select = useEditorStore((state) => state.select)
  const addCube = useEditorStore((state) => state.addCube)
  const deleteSelected = useEditorStore((state) => state.deleteSelected)
  const joinSelected = useEditorStore((state) => state.joinSelected)
  const ungroupSelected = useEditorStore((state) => state.ungroupSelected)
  const labels = useObjectRegistry((s) => s.labels)

  const primaryId = selectedIds[0] ?? null
  const primaryLabel = primaryId
    ? labels[primaryId] ?? primaryId
    : 'Ninguno'

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

      if (key === 'a' && isFreeform) {
        event.preventDefault()
        addCube()
        return
      }

      if ((key === 'delete' || key === 'backspace') && selectedIds.length > 0) {
        event.preventDefault()
        deleteSelected()
        return
      }

      if (key === 'j' && isFreeform) {
        event.preventDefault()
        joinSelected()
        return
      }

      if (key === 'u' && isFreeform) {
        event.preventDefault()
        ungroupSelected()
        return
      }

      if (key === 'escape') {
        select(null)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [
    addCube,
    deleteSelected,
    isFreeform,
    joinSelected,
    select,
    selectedIds.length,
    setSpace,
    setTool,
    space,
    toggleGrid,
    toggleSnap,
    ungroupSelected,
  ])

  return (
    <div className="pointer-events-none absolute inset-x-0 top-14 z-20 flex justify-center px-3">
      <div className="pointer-events-auto flex max-w-full flex-wrap items-center justify-center gap-1.5 rounded-2xl border border-slate-700/80 bg-slate-950/90 p-2 shadow-2xl backdrop-blur">
        <ToolButton
          active={tool === 'select'}
          label="Select"
          shortcut="Q"
          title="Seleccionar (Q). Shift+clic multi-selección"
          onClick={() => setTool('select')}
        />
        <ToolButton
          active={tool === 'move'}
          label="Move"
          shortcut="W"
          title="Mover (W)"
          onClick={() => setTool('move')}
        />
        <ToolButton
          active={tool === 'rotate'}
          label="Rotate"
          shortcut="E"
          title="Rotar (E)"
          onClick={() => setTool('rotate')}
        />
        <ToolButton
          active={tool === 'scale'}
          label="Scale"
          shortcut="R"
          title="Escalar (R)"
          onClick={() => setTool('scale')}
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
          title="Snap (S)"
          onClick={toggleSnap}
        />
        <ToolButton
          active={showGrid}
          label="Grid"
          shortcut="G"
          title="Grilla (G)"
          onClick={toggleGrid}
        />
        <ToolButton
          label="Reset"
          title="Reset transform de la selección"
          onClick={() => resetTransform(primaryId ?? undefined)}
        />

        {isFreeform ? (
          <>
            <div className="mx-1 hidden h-8 w-px bg-slate-700 sm:block" />
            <ToolButton
              label="+ Cubo"
              shortcut="A"
              title="Agregar cubo (A)"
              onClick={() => addCube()}
            />
            <ToolButton
              label="Unir"
              shortcut="J"
              title="Unir selección en grupo (J). Requiere 2+ raíces"
              onClick={() => joinSelected()}
              disabled={selectedIds.length < 2}
            />
            <ToolButton
              label="Separar"
              shortcut="U"
              title="Desagrupar (U)"
              onClick={() => ungroupSelected()}
            />
            <ToolButton
              label="Borrar"
              shortcut="Del"
              title="Eliminar selección (Delete)"
              onClick={() => deleteSelected()}
              disabled={selectedIds.length === 0}
            />
          </>
        ) : (
          <>
            <div className="mx-1 hidden h-8 w-px bg-slate-700 sm:block" />
            <ToolButton
              label="Root"
              title="Seleccionar modelo completo (clic derecho también)"
              onClick={() => select(MODEL_ROOT_ID)}
              active={primaryId === MODEL_ROOT_ID}
            />
          </>
        )}

        <div className="mx-1 hidden h-8 w-px bg-slate-700 md:block" />
        <div className="hidden max-w-[11rem] truncate rounded-lg border border-slate-800 bg-slate-900/80 px-2 py-1.5 text-[10px] text-slate-400 md:block">
          <span className="text-slate-500">Sel:</span>{' '}
          <span className="text-slate-200">
            {selectedIds.length > 1
              ? `${selectedIds.length} objetos`
              : primaryLabel}
          </span>
        </div>
      </div>
    </div>
  )
}
