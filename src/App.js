
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom"; // 라우팅을 위한 react-router-dom import
import Main from './components/Main'
import Movielist from './pages/movie/Movielist'
import Moviewrite from './pages/movie/Moviewrite'
import Movieedit from './pages/movie/Movieedit'
import Movieview from './pages/movie/Movieview'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/movie" element={<Movielist />} /> 
              <Route path='/movie/write' element={<Moviewrite/>}/>
              <Route path='/movie/edit/:id' element={<Movieedit/>}/>
              <Route path='/movie/:id' element={<Movieview/>}/>
            </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
