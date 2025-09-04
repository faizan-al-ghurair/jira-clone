import { nanoid } from 'nanoid'
export const initialColumns=[
  {id:'todo',name:'To Do',visible:true},
  {id:'inprogress',name:'In Progress',visible:true},
  {id:'review',name:'In Review',visible:true},
  {id:'done',name:'Done',visible:true},
]
const now=Date.now(); const ago=(h)=>new Date(now-h*3600000).toISOString()
export const initialIssues=[
  { id:nanoid(), key:'PROJ-1', title:'Set up repo & AntD theme', description:'Initialize Vite + React + Ant Design, configure theme tokens.', status:'todo', priority:'P2', assignee:'Komal', reporter:'Faizan', category:'Task', createdAt:ago(36), updatedAt:ago(10), estimate:8, tags:['setup','antd'], comments:[{id:nanoid(),author:'Faizan',at:ago(32),text:'Let’s move to AntD v5.'}] },
  { id:nanoid(), key:'PROJ-2', title:'Kanban board with DnD', description:'Drag & drop within and across columns using @hello-pangea/dnd.', status:'inprogress', priority:'P1', assignee:'Faizan', reporter:'Faizan', category:'Story', createdAt:ago(6), updatedAt:ago(1), estimate:5, tags:['kanban'], comments:[] },
  { id:nanoid(), key:'PROJ-3', title:'SLA badges & filters', description:'Compute SLA per priority, filter by ontrack/risk/breached.', status:'review', priority:'P2', assignee:'Hassan', reporter:'Komal', category:'Bug', createdAt:ago(20), updatedAt:ago(2), estimate:3, tags:['SLA','filters'], comments:[] },
  { id:nanoid(), key:'PROJ-4', title:'List view + KPIs', description:'Table view with AntD Table and small KPI cards.', status:'done', priority:'P3', assignee:'Komal', reporter:'Hassan', category:'Task', createdAt:ago(50), updatedAt:ago(40), estimate:2, tags:['list'], comments:[] },
  { id:nanoid(), key:'PROJ-5', title:'Issue details page', description:'Editable details like Jira: fields, description, comments, activity.', status:'todo', priority:'P1', assignee:'Faizan', reporter:'Komal', category:'Epic', createdAt:ago(1), updatedAt:ago(1), estimate:13, tags:['details'], comments:[] },
]
