import dayjs from 'dayjs'
export const SLA_RULES = { P1:{hours:4,label:'Critical (4h)'}, P2:{hours:8,label:'High (8h)'}, P3:{hours:24,label:'Medium (24h)'}, P4:{hours:72,label:'Low (72h)'} }
export function getDeadline(createdAt, priority){ const rule=SLA_RULES[priority]||SLA_RULES.P3; return dayjs(createdAt).add(rule.hours,'hour') }
export function getSLAStatus(createdAt, priority){
  const start = dayjs(createdAt); const deadline = getDeadline(createdAt, priority)
  const total = deadline.diff(start); const now = dayjs(); const remaining = deadline.diff(now)
  const pctRemaining = Math.max(0, remaining) / (total || 1)
  if (remaining < 0) return { status:'breached', remainingMs: remaining, pctRemaining:0 }
  if (pctRemaining <= 0.25) return { status:'risk', remainingMs: remaining, pctRemaining }
  return { status:'ontrack', remainingMs: remaining, pctRemaining }
}
export function humanizeDuration(ms){ const sign=ms<0?'-':''; const abs=Math.abs(ms); const h=Math.floor(abs/3600000); const m=Math.floor((abs%3600000)/60000); return h>0?`${sign}${h}h ${m}m`:`${sign}${m}m` }
