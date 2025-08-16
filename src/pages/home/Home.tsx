import { useEffect } from "react"
import { useNavigate } from "react-router"

const Home = () => {
  const navigate = useNavigate()
  useEffect(() => {
      navigate("/dashboard")
  })
  return (
    <div>
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
    </div>
  )
}

export default Home