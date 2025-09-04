import React from 'react'
import { Layout, Typography } from 'antd'
import { Routes, Route, Link } from 'react-router-dom'
import TopBar from './components/TopBar'
import FiltersBar from './components/FiltersBar'
import Board from './components/Board'
import ListView from './components/ListView'
import IssueDetails from './pages/IssueDetails'
import { useStore } from './store'
const { Header, Content, Footer } = Layout
const { Title } = Typography

export default function App(){
  const filters=useStore(s=>s.filters)
  return (
    <Layout style={{minHeight:'100vh', background:'#f5f5f5'}}>
      <Header style={{display:'flex', alignItems:'center', gap:12}}>
        <Link to="/"><Title level={4} style={{color:'#fff', margin:0}}>Jira AntD</Title></Link>
      </Header>
      <TopBar/>
      <FiltersBar/>
      <Content style={{background:'#f5f5f5'}}>
        <Routes>
          <Route path="/" element={filters.view==='board'?<Board/>:<ListView/>} />
          <Route path="/issue/:id" element={<IssueDetails/>} />
        </Routes>
      </Content>
      <Footer style={{textAlign:'center'}}>Mock data • Ant Design • Drag & Drop • Editable Details Page</Footer>
    </Layout>
  )
}
