import { useState, useEffect, useRef } from 'react'
import useSound from 'use-sound';
import simon from './assets/sounds/sprite.mp3';
import './App.css'

function App() {
  const blueRef = useRef(null);
  const yellowRef = useRef(null);
  const greenRef = useRef(null);
  const redRef = useRef(null);
  
  const [play] = useSound(simon, {
    sprite: {
      one: [0, 500],
      two: [1000, 500],
      three: [2000, 500],
      four: [3000, 500],
      error: [4000, 1000]
    },
  });

  const colors = [
    {
      color: '#FAF303',
      ref: yellowRef,
      sound: 'one',
    },
    {
      color: '#030AFA',
      ref: blueRef,
      sound: 'two',
    },
    {
      color: '#FA0E03',
      ref: redRef,
      sound: 'three',
    },
    {
      color: '#0AFA03',
      ref: greenRef,
      sound: 'four',
    }
  ]

  const minNumber = 0;
  const maxNumber = 3;
  const speedGame = 400;

  const [sequence, setSecuence] = useState([]);
  const [currentGame, setCurrentGame] = useState([]);
  const [isAllowedToPlay, setIsAllowedToPlay] = useState(false);
  const [speed, setSpeed] = useState(speedGame);
  const [turn, setTurn] = useState(0);
  const [turnRecord, setTurnRecord] = useState(0);
  const [pulses, setPulses] = useState(0);
  const [success, setSuccess] = useState(0);
  const [isGameOn, setIsGameOn] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false)

  const initGame = () => {
    randomNumber();
    setIsGameOn(true);
  }

  const endGame = () => {
    setIsGameOn(false)
    setIsGameFinished(false)

  }

  const randomNumber = () => {
    setIsAllowedToPlay(false);
    const randomNumber = Math.floor(Math.random() * (maxNumber - minNumber + 1) + minNumber);
    setSecuence([...sequence, randomNumber]);
    setTurn(turn + 1);
    if(turn > turnRecord) {
      setTurnRecord(turn)
    }
  }

  const handleClick = (index) => {
    if(isAllowedToPlay) {
      play({id: colors[index].sound})
      colors[index].ref.current.style.filter = "brightness(1)";
      colors[index].ref.current.style.scale = (0.9);
      setTimeout(() => {
        colors[index].ref.current.style.filter = "brightness(0.7)";
        colors[index].ref.current.style.scale = (1);
        setCurrentGame([...currentGame, index]);
        setPulses(pulses + 1);
      }, speed / 2)
    }
  }

  useEffect(() => {
    if(pulses > 0) {
      if(Number(sequence[pulses - 1]) === Number(currentGame[pulses - 1])){
        setSuccess(success + 1);
      } else {
        const index = sequence[pulses -1]
        if (index) colors[index].ref.current.style.filter = "brightness(1)";
        play({id: 'error'})
        setTimeout(() => {
          if (index) colors[index].ref.current.style.filter = "brightness(0.7)";
                     
          setIsGameFinished(true);
        }, speed * 2 )
        setIsAllowedToPlay(false);
      }
    }
  }, [pulses])

  useEffect(() => {
    if(!isGameOn) {
      setSecuence([]);
      setCurrentGame([]);
      setIsAllowedToPlay(false);
      setSpeed(speedGame);
      setSuccess(0);
      setPulses(0);
      setTurn(0);
    }
  }, [isGameOn])

  useEffect(() => {
    if(success === sequence.length && success > 0) {
      setIsAllowedToPlay(false)
      setSpeed(speed - sequence.length * 2);
      setTimeout(() => {
        setSuccess(0);
        setPulses(0);
        setCurrentGame([])
        randomNumber();
      }, 500)
    }
  }, [success])

  useEffect(() => {
    if(!isAllowedToPlay) {
      setTimeout(() => {
        sequence.map((item, index) => {

          setTimeout(() => {
            play({id: colors[item].sound})
            colors[item].ref.current.style.filter = "brightness(1)";
            
            setTimeout(() => {
              colors[item].ref.current.style.filter = "brightness(0.7)";
              
              
              
            }, speed / 2 )
            if(index === sequence.length - 1) {
              setIsAllowedToPlay(true)

            }
  
          }, speed * index)
        })
      }, 500);
      
    }
  }, [sequence])

  return (
    <>
    {
    (isGameOn && !isGameFinished)
    ?
    <>
    
    <div className='header'>
      <h1>TURN {turn}</h1>
    </div>
      <div className='container'>

      {colors.map((item, index) => {
        return (
          <div
            key={index}
            ref={item.ref}
            className={`pad pad-${index}`}
            onClick={() => handleClick(index)}
          >
          </div>
        )
      }) }
      </div>
      
    </>
  : 
    <> 
    {
    isGameFinished && isGameOn
    ?
      <>
      <div className='endScreen'>
          <h1>GAME FINISHED</h1>
          <p>I knew you wouldn't last long on my witty puzzle</p>
          <p>I dare you to try your memory once more</p>
          <h3>End turn: {turn}</h3>
          <h3>Record: {turnRecord}</h3>
      </div>
      <button onClick={endGame}>TRY AGAIN</button>
      </>
    :
    <>
      <div className='header'>
          <h1>THE POTIONS OF SIMON</h1>
      </div>
      <button onClick={initGame}>ACCEPT THE CHALLENGE</button>
    </>
  } 

      
    </>
  }
  </>

)
}

export default App
