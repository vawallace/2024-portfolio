import './App.scss'
import Icons from './utils/Icons'
import mf from './assets/imgs/mf.png'
import wtad from './assets/imgs/wtad.png'

function App() {
  return (
    <div className="app">
      <h1>
        Vance Aaron Wallace
      </h1>
      <h2>
        {Icons.faBracketCurlyLeft} Software Engineer / Leader / Designer / Podcaster {Icons.faBracketCurlyRight}
      </h2>
      <div className="projects">
        <h3>
          My Companies: 
        </h3>
        <div className="company-list">
          <a href="https://whattheactual.dev" target='_blank'>
            <img src={wtad} alt="" />
          </a>
          <a href="https://mythosforge.co" target='_blank'>
            <img src={mf} alt="" />
          </a>
        </div>
      </div>
    </div>
  )
}

export default App
