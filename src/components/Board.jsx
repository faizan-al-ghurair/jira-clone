import React from 'react'
import { Row, Col } from 'antd'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { useStore } from '../store'
import { filteredIssues } from '../utils/filtering'
import Column from './Column'

export default function Board(){
  const columns = useStore(s=>s.columns)
  const issues = useStore(s=>s.issues)
  const filters = useStore(s=>s.filters)
  const moveWithin = useStore(s=>s.moveWithin)
  const moveAcross = useStore(s=>s.moveAcross)

  const visible = columns.filter(c=>c.visible)
  const itemsByCol = Object.fromEntries(visible.map(c=>[c.id, filteredIssues(issues, {...filters, status:'all'}).filter(i=>i.status===c.id)]))

  function onDragEnd(result){
    const { source, destination } = result
    if(!destination) return
    const s = source.droppableId, d = destination.droppableId
    if(s===d) moveWithin(s, source.index, destination.index)
    else moveAcross(s, source.index, d, destination.index)
  }

  return (
    <div style={{padding:16}}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Row gutter={[12,12]}>
          {visible.map(col=> (
            <Col xs={24} sm={12} md={12} lg={6} key={col.id}>
              <Droppable droppableId={col.id}>
                {(provided)=>(
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    <Column column={col} items={itemsByCol[col.id]} />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </Col>
          ))}
        </Row>
      </DragDropContext>
    </div>
  )
}
