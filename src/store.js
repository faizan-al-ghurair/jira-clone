import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { initialColumns, initialIssues } from './mockData'

export const useStore=create(persist((set,get)=>({
  columns: initialColumns,
  issues: initialIssues,
  filters:{ search:'', status:'all', priority:'all', assignee:'all', category:'all', sla:'all', view:'board', sortBy:'none' },
  setColumns:(columns)=>set({columns}),
  setFilters:(patch)=>set({filters:{...get().filters, ...patch}}),
  addIssue:(issue)=>set({issues:[issue, ...get().issues]}),
  updateIssue:(id, patch)=>set({issues:get().issues.map(i=>i.id===id?{...i, ...patch, updatedAt:new Date().toISOString()}:i)}),
  addComment:(issueId, comment)=>set({issues:get().issues.map(i=>i.id===issueId?{...i, comments:[comment, ...(i.comments||[])]}:i)}),
  moveWithin:(status, sIdx, dIdx)=>{ const all=[...get().issues]; const inS=all.filter(i=>i.status===status); const others=all.filter(i=>i.status!==status); const [m]=inS.splice(sIdx,1); inS.splice(dIdx,0,m); set({issues:[...inS, ...others]}) },
  moveAcross:(sStatus, sIdx, dStatus, dIdx)=>{ const all=[...get().issues]; const sList=all.filter(i=>i.status===sStatus); const dList=all.filter(i=>i.status===dStatus); const others=all.filter(i=>i.status!==sStatus && i.status!==dStatus); const [m]=sList.splice(sIdx,1); m.status=dStatus; m.updatedAt=new Date().toISOString(); dList.splice(dIdx,0,m); set({issues:[...sList, ...dList, ...others]}) },
}), {name:'jira-antd-state'}))
