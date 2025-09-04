import { getSLAStatus } from './sla'
const rank=(p)=>({P1:1,P2:2,P3:3,P4:4}[p]??99)
export function filteredIssues(issues,f){
  let out=issues
  if(f.search){ const q=f.search.toLowerCase(); out=out.filter(i=> i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q) || (i.key||'').toLowerCase().includes(q) || i.tags?.some(t=>t.toLowerCase().includes(q)) ) }
  if(f.status!=='all') out=out.filter(i=>i.status===f.status)
  if(f.priority!=='all') out=out.filter(i=>i.priority===f.priority)
  if(f.assignee!=='all') out=out.filter(i=>i.assignee===f.assignee)
  if(f.category!=='all') out=out.filter(i=>i.category===f.category)
  if(f.sla!=='all') out=out.filter(i=>getSLAStatus(i.createdAt, i.priority).status===f.sla)
  if(f.sortBy==='priority') out=[...out].sort((a,b)=>rank(a.priority)-rank(b.priority))
  if(f.sortBy==='sla') out=[...out].sort((a,b)=>{ const sa=getSLAStatus(a.createdAt,a.priority); const sb=getSLAStatus(b.createdAt,b.priority); return sa.remainingMs-sb.remainingMs })
  return out
}
