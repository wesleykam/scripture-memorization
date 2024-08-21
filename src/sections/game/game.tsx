import spaceship from '../../assets/spaceship.png'

import './game.css'

const game = () => {
  return (
    <section className='game-section'>
        <div className='spaceship'>
            <img src={spaceship}></img>
        </div>
    </section >
  )
}

export default game
