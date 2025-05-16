import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LadingPages from './pages/LandingPage/index.tsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/cards/home.tsx'
import NovaColetaForm from './pages/coleta/forms.tsx'
import NovaColetaForm2 from './pages/coleta/forms2.tsx'
import Chat from './pages/ecochat/chat.tsx'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LadingPages />} />
        <Route path="/cards" element={<Home />} />
        <Route path='/coleta' element={<NovaColetaForm/>}/>
        <Route path='/coleta2' element={<NovaColetaForm2/>}/>
        <Route path='/ecochat' element={<Chat />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
