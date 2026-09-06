import { ConfigPanel } from './ConfigPanel'
import { ViewerPlaceholder } from './ViewerPlaceholder'

export function Workspace() {
  return (
    <div className="flex h-full min-h-screen w-full bg-slate-950 text-slate-100">
      <ConfigPanel />
      <ViewerPlaceholder />
    </div>
  )
}
