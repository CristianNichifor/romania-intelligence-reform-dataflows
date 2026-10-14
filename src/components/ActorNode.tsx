import { Handle, Position, type NodeProps, type Node } from '@xyflow/react'
import GlossedText from './GlossedText'
import type { ActorNodeData } from '../data/types'
import { CATEGORY_GLYPHS } from '../lib/glyphs'

const HANDLES: Array<{ id: string; type: 'source' | 'target'; position: Position }> = [
  { id: 'source-left', type: 'source', position: Position.Left },
  { id: 'target-left', type: 'target', position: Position.Left },
  { id: 'source-right', type: 'source', position: Position.Right },
  { id: 'target-right', type: 'target', position: Position.Right },
  { id: 'source-top', type: 'source', position: Position.Top },
  { id: 'target-top', type: 'target', position: Position.Top },
  { id: 'source-bottom', type: 'source', position: Position.Bottom },
  { id: 'target-bottom', type: 'target', position: Position.Bottom },
]

export default function ActorNode({ data }: NodeProps<Node<ActorNodeData>>) {
  return (
    <div className="actor-node" style={{ borderColor: data.color }}>
      <div className="actor-node-bar" style={{ background: data.color }} />
      <div className="actor-node-top">
        <span className="actor-node-glyph" style={{ color: data.color }}>
          {CATEGORY_GLYPHS[data.category]}
        </span>
        <span className="actor-node-label">
          <GlossedText text={data.label} />
        </span>
      </div>
      <div className="actor-node-role">{data.role}</div>
      <div className="actor-node-tip">
        <div className="actor-node-tip-name">{data.label}</div>
        <div className="actor-node-tip-role">{data.role}</div>
        {data.note && <div className="actor-node-tip-note">{data.note}</div>}
      </div>
      {HANDLES.map((handle) => (
        <Handle
          key={handle.id}
          id={handle.id}
          type={handle.type}
          position={handle.position}
          style={{ background: data.color, width: 7, height: 7 }}
        />
      ))}
    </div>
  )
}
