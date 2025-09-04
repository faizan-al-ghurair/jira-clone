import React from 'react'
import { Card, Badge, Space } from 'antd'
import { Draggable } from '@hello-pangea/dnd'
import IssueCard from './IssueCard'

export default function Column({ column, items }){
  return (
    <Card title={<Space>{column.name}<Badge count={items.length}/></Space>} bordered>
      <div style={{display:'grid', gap:8}}>
        {items.map((it, idx)=>(
          <Draggable draggableId={it.id} index={idx} key={it.id}>
            {(provided)=>(
              <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                <IssueCard issue={it} />
              </div>
            )}
          </Draggable>
        ))}
      </div>
    </Card>
  )
}
