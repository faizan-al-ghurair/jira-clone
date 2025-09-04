import React from 'react'
import { Button, Input, Space, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useStore } from '../store'
import AddIssueModal from './modals/AddIssueModal'

export default function TopBar(){
  const [open, setOpen] = React.useState(false)
  const filters = useStore(s => s.filters)
  const setFilters = useStore(s => s.setFilters)
  return (
    <div style={{position:'sticky', top:64, zIndex:10, background:'#fff', padding:'12px 16px', borderBottom:'1px solid #f0f0f0'}}>
      <Space style={{display:'flex', justifyContent:'space-between'}} wrap>
        <Input.Search placeholder="Search issues" style={{minWidth:280, maxWidth:520}} value={filters.search} onChange={e=>setFilters({search:e.target.value})}/>
        <Space wrap>
          <Select value={filters.view} onChange={v=>setFilters({view:v})} options={[{value:'board',label:'Board'},{value:'list',label:'List'}]} style={{width:120}} />
          <Button type="primary" icon={<PlusOutlined />} onClick={()=>setOpen(true)}>New Issue</Button>
        </Space>
      </Space>
      {open && <AddIssueModal onClose={()=>setOpen(false)} />}
    </div>
  )
}
