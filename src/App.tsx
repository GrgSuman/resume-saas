import { CardDemo } from "./components/layouts/MyCard"
import "./App.css"
import { Route, Routes } from "react-router"
import Dashboard from "./pages/dashboard/Dashboard"
import Layout from "./components/layouts/BaseLayout"
import NewResume from "./pages/new-resume/NewResume"

function App() {
  return (
    <Routes>
     <Route path="/" element={<Layout/>}>
     <Route path="/" element={<CardDemo/>}/>
     <Route path="/dashboard" element={<Dashboard/>}/>
     </Route>
     <Route path="/dashboard/new" element={<NewResume/>}/>
    </Routes>
  )
}

export default App