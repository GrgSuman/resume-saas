import { CardDemo } from "./components/layouts/MyCard"
import "./App.css"
import { Route, Routes } from "react-router"
import Dashboard from "./pages/dashboard/Dashboard"
import Layout from "./components/layouts/BaseLayout"
import NewResume from "./pages/new-resume/NewResume"

import { ResumeProvider } from "./context/ResumeContext"
import { ResumeProvider as ResumeProvider2 } from "./context/new/ResumeContextData"

function App() {
  return (
    <ResumeProvider2>

    <ResumeProvider>
    <Routes>
     <Route path="/" element={<Layout/>}>
     <Route path="/" element={<CardDemo/>}/>
     <Route path="/dashboard" element={<Dashboard/>}/>
     </Route>
     <Route path="/dashboard/new" element={<NewResume/>}/>
    </Routes>
    </ResumeProvider>
    </ResumeProvider2>

  )
}

export default App