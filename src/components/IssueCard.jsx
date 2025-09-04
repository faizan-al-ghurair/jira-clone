import React from 'react'
import { Card, Space, Tag, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import { getSLAStatus, humanizeDuration } from '../utils/sla'
const { Text } = Typography
const priorityColor=(p)=>({P1:'red',P2:'orange',P3:'gold',P4:'green'}[p]||'default')
const slaColor=(s)=>({ontrack:'green',risk:'orange',breached:'red'}[s]||'default')
export default function IssueCard({issue}){
  const nav = useNavigate()
  const sla = getSLAStatus(issue.createdAt, issue.priority)
  return (
    <Card size="small" hoverable onClick={()=>nav(`/issue/${issue.id}`)}>
      <Space direction="vertical" size={4} style={{width:'100%'}}>
        <Space style={{justifyContent:'space-between', width:'100%'}}>
          <Text strong>{issue.key} — {issue.title}</Text>
          <Tag color={priorityColor(issue.priority)}>{issue.priority}</Tag>
        </Space>
        <Space wrap>
          <Tag>{issue.category}</Tag>
          <Tag>Assignee: {issue.assignee}</Tag>
          <Tag color={slaColor(sla.status)}>
            SLA {humanizeDuration(sla.remainingMs)} {sla.remainingMs<0?'overdue':'left'}
          </Tag>
        </Space>
      </Space>
    </Card>
  )
}
