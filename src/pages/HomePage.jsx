import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function HomePage() {
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to LB Nagar as the flagship/homepage
    navigate('/branches/lb-nagar', { replace: true })
  }, [navigate])

  return null
}
