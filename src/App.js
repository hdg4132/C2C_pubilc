
import './App.css';
import {useReducer} from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"; // 라우팅을 위한 react-router-dom import
import Main from './components/Main'
import Movielist from './pages/movie/Movielist'
import Moviewrite from './pages/movie/Moviewrite'
import Movieedit from './pages/movie/Movieedit'
import Movieview from './pages/movie/Movieview'

const mockData = [
  {
    id:1,
    createdDate: new Date().getTime(),
    title:1,
    img:1,
    content: '1번일기내용',

  },
  {
    id:2,
    createdDate: new Date().getTime(),
    title:2,
    img:2,
    content: '2번일기내용',

  },
  {
    id:3,
    createdDate: new Date().getTime(),
    title:3,
    img:3,
    content: '3번일기내용',

  }
]

function reducer(state, action){
  return state; 
}

function App() {
  const [data, dispatch] = useReducer(reducer,[])
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
