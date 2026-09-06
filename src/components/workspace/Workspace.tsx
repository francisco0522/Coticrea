import { SceneViewer } from '../scene/SceneViewer'
import { ConfigPanel } from './ConfigPanel'

export function Workspace() {
  return (
    <div className="flex h-full min-h-screen w-full bg-slate-950 text-slate-100">
      <ConfigPanel />
      <SceneViewer />
    </div>
  )
}
