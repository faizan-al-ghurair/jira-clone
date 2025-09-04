import React from 'react'
import { Modal, Form, Input, Select, InputNumber } from 'antd'
import { nanoid } from 'nanoid'
import { useStore } from '../../store'
export default function AddIssueModal({ onClose }){
  const addIssue = useStore(s=>s.addIssue); const issues = useStore(s=>s.issues)
  const [form] = Form.useForm()
  function submit(){
    form.validateFields().then(values=>{
      const createdAt=new Date().toISOString(); const key=`PROJ-${issues.length+1}`
      addIssue({
        id:nanoid(), key, title:values.title.trim(), description:values.description||'', status:values.status, priority:values.priority,
        assignee:values.assignee||'Unassigned', reporter:values.reporter||'Unassigned', category:values.category, createdAt, updatedAt:createdAt,
        estimate:values.estimate||1, tags:values.tags?values.tags.split(',').map(t=>t.trim()).filter(Boolean):[], comments:[]
      }); onClose()
    })
  }
  return (
    <Modal open title="Create Issue" onCancel={onClose} onOk={submit} okText="Create" destroyOnClose>
      <Form form={form} layout="vertical" initialValues={{status:'todo', priority:'P3', category:'Task', estimate:1}}>
        <Form.Item label="Title" name="title" rules={[{required:true}]}><Input/></Form.Item>
        <Form.Item label="Description" name="description"><Input.TextArea rows={4}/></Form.Item>
        <Form.Item label="Status" name="status"><Select options={[{value:'todo',label:'To Do'},{value:'inprogress',label:'In Progress'},{value:'review',label:'In Review'},{value:'done',label:'Done'}]}/></Form.Item>
        <Form.Item label="Priority" name="priority"><Select options={[{value:'P1'},{value:'P2'},{value:'P3'},{value:'P4'}]}/></Form.Item>
        <Form.Item label="Assignee" name="assignee"><Input/></Form.Item>
        <Form.Item label="Reporter" name="reporter"><Input/></Form.Item>
        <Form.Item label="Category" name="category"><Select options={[{value:'Task'},{value:'Story'},{value:'Bug'},{value:'Epic'}]}/></Form.Item>
        <Form.Item label="Estimate (hours)" name="estimate"><InputNumber min={1} style={{width:'100%'}}/></Form.Item>
        <Form.Item label="Tags (comma separated)" name="tags"><Input/></Form.Item>
      </Form>
    </Modal>
  )
}
