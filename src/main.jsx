import { createRoot } from 'react-dom/client'
import './index.css'
// import { Logo } from '@pmndrs/branding'
import { App } from './App'



function Root() {
  return (
    <>
      <App />

    </>
  )
}

createRoot(document.getElementById('root')).render(<Root />)
