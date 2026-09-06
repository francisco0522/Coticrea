import { useDesignStore } from '../../store/designStore'
import { NumberField } from './NumberField'

export function DynamicControls() {
  const category = useDesignStore((state) => state.category)
  const desk = useDesignStore((state) => state.desk)
  const dining = useDesignStore((state) => state.dining)
  const closet = useDesignStore((state) => state.closet)
  const closetOptions = useDesignStore((state) => state.closetOptions)
  const structure = useDesignStore((state) => state.structure)
  const structureOptions = useDesignStore((state) => state.structureOptions)
  const updateDesk = useDesignStore((state) => state.updateDesk)
  const updateDining = useDesignStore((state) => state.updateDining)
  const updateCloset = useDesignStore((state) => state.updateCloset)
  const updateClosetOptions = useDesignStore((state) => state.updateClosetOptions)
  const updateStructure = useDesignStore((state) => state.updateStructure)
  const updateStructureOptions = useDesignStore(
    (state) => state.updateStructureOptions,
  )

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-sm font-semibold text-slate-100">Dimensiones y opciones</h2>
        <p className="mt-1 text-xs text-slate-500">
          Los controles cambian según la categoría seleccionada.
        </p>
      </div>

      <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        {category === 'escritorio' ? (
          <>
            <NumberField
              id="desk-length"
              label="Largo"
              value={desk.length}
              min={0.4}
              max={4}
              onChange={(length) => updateDesk({ length })}
            />
            <NumberField
              id="desk-width"
              label="Ancho"
              value={desk.width}
              min={0.3}
              max={2}
              onChange={(width) => updateDesk({ width })}
            />
            <NumberField
              id="desk-height"
              label="Alto"
              value={desk.height}
              min={0.5}
              max={1.2}
              onChange={(height) => updateDesk({ height })}
            />
            <NumberField
              id="desk-thickness"
              label="Grosor de tabla"
              value={desk.thickness}
              min={0.01}
              max={0.1}
              step={0.001}
              onChange={(thickness) => updateDesk({ thickness })}
            />
          </>
        ) : null}

        {category === 'comedor' ? (
          <>
            <NumberField
              id="dining-length"
              label="Largo"
              value={dining.length}
              min={0.8}
              max={5}
              onChange={(length) => updateDining({ length })}
            />
            <NumberField
              id="dining-width"
              label="Ancho"
              value={dining.width}
              min={0.6}
              max={2.5}
              onChange={(width) => updateDining({ width })}
            />
            <NumberField
              id="dining-height"
              label="Alto"
              value={dining.height}
              min={0.6}
              max={1}
              onChange={(height) => updateDining({ height })}
            />
            <NumberField
              id="dining-thickness"
              label="Grosor de tabla"
              value={dining.thickness}
              min={0.015}
              max={0.12}
              step={0.001}
              onChange={(thickness) => updateDining({ thickness })}
            />
          </>
        ) : null}

        {category === 'closet' ? (
          <>
            <NumberField
              id="closet-length"
              label="Largo"
              value={closet.length}
              min={0.6}
              max={5}
              onChange={(length) => updateCloset({ length })}
            />
            <NumberField
              id="closet-height"
              label="Alto"
              value={closet.height}
              min={1.2}
              max={3}
              onChange={(height) => updateCloset({ height })}
            />
            <NumberField
              id="closet-depth"
              label="Profundidad"
              value={closet.depth}
              min={0.3}
              max={1.2}
              onChange={(depth) => updateCloset({ depth })}
            />
            <NumberField
              id="closet-thickness"
              label="Grosor de panel"
              value={closet.thickness}
              min={0.01}
              max={0.05}
              step={0.001}
              onChange={(thickness) => updateCloset({ thickness })}
            />
            <NumberField
              id="closet-shelves"
              label="Cantidad de estantes"
              value={closetOptions.shelves}
              min={0}
              max={12}
              step={1}
              unit="uds"
              onChange={(shelves) =>
                updateClosetOptions({ shelves: Math.round(shelves) })
              }
            />
            <NumberField
              id="closet-divisions"
              label="Divisiones verticales"
              value={closetOptions.verticalDivisions}
              min={0}
              max={8}
              step={1}
              unit="uds"
              onChange={(verticalDivisions) =>
                updateClosetOptions({
                  verticalDivisions: Math.round(verticalDivisions),
                })
              }
            />
          </>
        ) : null}

        {category === 'freeform' ? (
          <div className="space-y-2 text-xs leading-relaxed text-slate-400">
            <p>
              Modo <span className="text-amber-300">Freeform</span>: crea cubos,
              muévelos con el gizmo y únelos en grupos.
            </p>
            <ul className="list-disc space-y-1 pl-4 text-slate-500">
              <li><b className="text-slate-300">A</b> o botón + Cubo</li>
              <li><b className="text-slate-300">Shift+clic</b> multi-selección</li>
              <li><b className="text-slate-300">J</b> unir · <b className="text-slate-300">U</b> separar</li>
              <li><b className="text-slate-300">Delete</b> borrar</li>
            </ul>
          </div>
        ) : null}

        {category === 'estructura' ? (
          <>
            <NumberField
              id="structure-length"
              label="Largo"
              value={structure.length}
              min={1}
              max={20}
              onChange={(length) => updateStructure({ length })}
            />
            <NumberField
              id="structure-width"
              label="Ancho"
              value={structure.width}
              min={1}
              max={15}
              onChange={(width) => updateStructure({ width })}
            />
            <NumberField
              id="structure-height"
              label="Alto"
              value={structure.height}
              min={1}
              max={10}
              onChange={(height) => updateStructure({ height })}
            />
            <NumberField
              id="structure-profile"
              label="Grosor del perfil"
              value={structure.profileThickness}
              min={0.04}
              max={0.4}
              step={0.01}
              onChange={(profileThickness) =>
                updateStructure({ profileThickness })
              }
            />
            <NumberField
              id="structure-beams"
              label="Cantidad de vigas"
              value={structureOptions.beamCount}
              min={1}
              max={20}
              step={1}
              unit="uds"
              onChange={(beamCount) =>
                updateStructureOptions({ beamCount: Math.round(beamCount) })
              }
            />
            <NumberField
              id="structure-spacing"
              label="Distancia entre pilares"
              value={structureOptions.pillarSpacing}
              min={0.5}
              max={6}
              step={0.1}
              onChange={(pillarSpacing) =>
                updateStructureOptions({ pillarSpacing })
              }
            />
          </>
        ) : null}
      </div>
    </section>
  )
}
