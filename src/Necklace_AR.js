import React, {Suspense, useRef, useState, useEffect, useCallback} from 'react';

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { JEELIZFACEFILTER, NN_4EXPR } from 'facefilter'
import { JeelizThreeFiberHelper } from './faceFilter/JeelizThreeFiberHelper.js'
import mergeImages from 'merge-images';

import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {Model as Head} from './model/Head.js' 
// 얼굴 3D 모델 (목부분에는 목걸이 모델이 보이지 않기 위함)

import {Model as GoldChain} from './model/GoldChain' // 확인
import {Model as Earring} from './model/Earring' // 완료
import {Model as GoldNecklace} from './model/gold_necklace' // 확인
import {Model as GothicPendant} from './model/gothic_pendant' // 확인
import {Model as JashinNecklace} from './model/jashin_necklace' // 확인
import {Model as ChristmasHat} from './model/ChristmasHat2.js' // 크리스마스 모자 (위치 수정 완료)
import {Model as BeanieHat} from './model/BeanieHat.js' // 비니모자 (위치 수정 완료)
import {Model as Hat1} from './model/Hat.js' // 처마가 넓은 모자 (위치 수정 완료)

const _maxFacesDetected = 1 // max number of detected faces
const _faceFollowers = new Array(_maxFacesDetected)
let _temporary1 = 0 // 임의로 만든 변수
let _temporary2 = false // 임의로 만든 변수
const _temporary3 = 1 // 임의로 만든 변수

let _expressions = null

const FaceFollower2 = (props) => {
  // This reference will give us direct access to the mesh
  const objRef = useRef()
  useEffect(() => {
    const threeObject3D = objRef.current
    _faceFollowers[props.faceIndex] = threeObject3D  
  })
  
  return (
    <object3D ref={objRef}>
        <Suspense fallback={null}>
          <ambientLight/>
          <ChristmasHat/>
      </Suspense>
    </object3D>
  )}

const FaceFollower0 = (props) => {
    return ( 
        <Earring/>
    ) 
  }

const FaceFollower = (props) => {
    // This reference will give us direct access to the mesh
    const objRef = useRef()
  
    function SelectHat(){
      switch(_temporary1){
        case 1 : return <Hat1/>
        case 2 : return <BeanieHat/>
        case 3 : return <ChristmasHat/>
        default:
          return null;
      }
  }
    useEffect(() => {
      const threeObject3D = objRef.current
      _faceFollowers[props.faceIndex] = threeObject3D  
      console.log(_temporary1)
      console.log(_temporary2)
    })
    
    return (
      <object3D ref={objRef} >
        <Suspense fallback={null}>
        <ambientLight/>
         {SelectHat()}
        {_temporary2 && <GoldChain/> }
        <Head/>
        </Suspense>
      </object3D>
    ) 
  }

let _threeFiber = null
const DirtyHook = (props) => {
  _threeFiber = useThree()
  useFrame(JeelizThreeFiberHelper.update_camera.bind(null, props.sizing, _threeFiber.camera))
  return null
}

const compute_sizing = () => {
  // compute  size of the canvas:
  const wheight = (window.innerHeight)
  const wWidth = (window.innerWidth)

  const height = Math.min(wWidth, wheight) 
  const width = Math.min(wWidth, wheight)
  const mode = (height === wheight) ? 0 : 1 // 0 : 웹 , 1 : 폰

  // compute position of the canvas:
  const top = (mode === 0) ? 0 : "8%"
  const left = (wWidth - width) / 2

  return {width, height, top, left, mode}
}

function App() {
  // init state:
  _expressions = []

  const [sizing, setSizing] = useState(compute_sizing())
  const [isInitialized] = useState(true)

  let _timerResize = null
  const handle_resize = () => {
    // do not resize too often:
    if (_timerResize){
      clearTimeout(_timerResize)
    }
    _timerResize = setTimeout(do_resize, 200)
  }

  const do_resize = () => {
    _timerResize = null
    const newSizing = compute_sizing()
    setSizing(newSizing)
  }

  useEffect(() => {
    if (!_timerResize) {
      JEELIZFACEFILTER.resize()
    }    
  }, [sizing])

  const callbackReady = (errCode, spec) => {
    if (errCode){
      console.log('AN ERROR HAPPENS. ERR =', errCode)
      return
    }

    console.log('INFO: JEELIZFACEFILTER IS READY')
    // there is only 1 face to track, so 1 face follower:
    JeelizThreeFiberHelper.init(spec, _faceFollowers, callbackDetect)    
  }

  const callbackTrack = (detectStatesArg) => {
    // if 1 face detection, wrap in an array:
    const detectStates = (detectStatesArg.length) ? detectStatesArg : [detectStatesArg]

    // update video and THREE faceFollowers poses:
    JeelizThreeFiberHelper.update(detectStates, _threeFiber.camera)

    // render the video texture on the faceFilter canvas:
    JEELIZFACEFILTER.render_video()

    // get expressions factors:
    detectStates.forEach((detectState, faceIndex) => {
    })    
  }

  const callbackDetect = (faceIndex, isDetected) => {
    if (isDetected) {
      console.log('DETECTED')
    } else {
      console.log('LOST')
    }
  }

  const camera = useRef(null) // 카메라 입력
  const canvasRef = useRef(null) // 3D 모델 출력
  const pictureCanvasRef = useRef(null) // 임시로 카메라 입력받은거 canvas에 출력
  const [visible1,setVisible1] = useState(true);
  const [visible2,setVisible2] = useState(true);
  const [visible3,setVisible3] = useState(true);

  const snapshot = useCallback(() => {
    const canvas = pictureCanvasRef.current;
    canvas.getContext('2d').drawImage(canvasRef.current, 0, 0, sizing.width, sizing.height);
    
    mergeImages([
      camera.current.toDataURL('image/png'),
      canvas.toDataURL('image/png'),
    ]).then(b64 => document.getElementById('preview').src = b64) // 이미지 병합
  })

  useEffect(() => {
    window.addEventListener('resize', handle_resize)
    window.addEventListener('orientationchange', handle_resize)

    JEELIZFACEFILTER.init({
      canvas: camera.current,
      NNC: NN_4EXPR,
      maxFacesDetected: 1,
      followZRot: true,
      callbackReady,
      callbackTrack
    })
    return JEELIZFACEFILTER.destroy
  }, [isInitialized])

  console.log('RENDER')

  function GuidePAgeClick(e){window.location.href = "/GuidePage"}

  console.log(sizing.mode)

  if (sizing.mode === 0) { // 0 : 출력화면이 가로가 길 경우
    return (
      <div id='camera_main' style={{position: 'fixed', zIndex: 2, top : 0, width : "100wh", height : "100vh"}}>     
        <Canvas className='camera' ref={canvasRef} style={{position: 'absolute', zIndex: 1, ...sizing}} width = {sizing.width} height = {sizing.height} 
            gl={{ preserveDrawingBuffer: true }} updatedefaultcamera = "false"> {/* allow image capture */}
              <DirtyHook sizing={sizing} />
              <FaceFollower2 faceIndex={0} expression={_expressions[0]} />
        </Canvas>
      <canvas className='camera' ref={camera} style={{position: 'absolute', zIndex: 0, ...sizing}} width = {sizing.width} height = {sizing.height} />
      <img id = "preview" style={{position: 'absolute', zIndex: 3, ...sizing}} width = {sizing.width} height = {sizing.height} />  {/* 캡쳐한 이미지 출력 */}
      <canvas className = "snap" ref={pictureCanvasRef} style={{position: 'absolute', zIndex: -1, ...sizing}} width = {sizing.width} height = {sizing.height} /> {/* 모델 저장 */}

      <div className = "camera_mamu_0" style={{position: 'absolute', height: "100%", width: "auto", top : 0, left : (sizing.left + sizing.width)}}>  {/* 메뉴 */}
      
        <div style={{zIndex: 2, height: "100%", width: "1.5vw", background : "rgba(0,0,255,0)" }}> </div>

        <div className = "list_0" style={{zIndex: 2, height: "100wh", width: "auto"}}> {/* 모델 리스트 */}
          <button className = "visible_button_1" style={{zIndex: 2, height: window.innerWidth * 0.1, width: window.innerWidth * 0.1}}
            onClick= {() => {setVisible1(!visible1) // 버튼을 보면 후크를 통해 클릭시 계속하여 true false 번갈아 가면서 할당 해줌
            if(visible1) {_temporary1 = 1; setVisible2(false);}
            else{_temporary1 = 0}}}> {visible1 ? "모자 보이는 상태 1" : "모자 숨겨진 상태 1"} </button> {/*여기에서 버튼을 통해 불러오기 각각 불러오기 시도 하려고 했으나 일부분 짤리는 현상 발생 */}
          <button className = "visible_button_2" style={{zIndex: 2, height: window.innerWidth * 0.1, width: window.innerWidth * 0.1}}
            onClick= {() => {setVisible1(!visible1) // 버튼을 보면 후크를 통해 클릭시 계속하여 true false 번갈아 가면서 할당 해줌
            if(visible1) {_temporary1 = 1; setVisible2(false);}
            else{_temporary1 = 0}}}> {visible1 ? "모자 보이는 상태 2" : "모자 숨겨진 상태 2"} </button>
          <button className = "visible_button_3" style={{zIndex: 2, height: window.innerWidth * 0.1, width: window.innerWidth * 0.1}}
            onClick= {() => {setVisible3(!visible3);_temporary3 = visible3}}> {visible3 ? "목걸이 보여진 상태 2" : "목걸이 숨겨진 상태 2"} </button>
        </div>
        
        <div className = "snap_0" style={{zIndex: 2, height: "100wh", width: "auto"}}> {/* 버튼 리스트 */}
          <button className = "snap_button" style={{zIndex: 2, height: window.innerWidth * 0.1, width: window.innerWidth * 0.1}} onClick={snapshot}>
          </button> {/* 화면을 캡쳐하는 버튼 */}
        </div>

      </div>

      <button className = "buttonshow" style={{position: 'fixed', zIndex: 2, left : window.innerWidth - 150}} onClick = {GuidePAgeClick}> 다음 페이지로 이동 </button>

    </div>
    )}

  else {
    return (
    <div id='camera_main' style={{position: 'fixed', zIndex: 2, top : 0, width : "100wh", height : "100vh"}}>  
      <div className = "Title_img" style={{zIndex: 2, width : "100%", height : "8%"}} > 
        <div style={{padding: "1% 5% 1% 5%", fontSize : '20px'}}/>
      </div>
      
      <Canvas className='camera' ref={canvasRef} style={{position: 'absolute', zIndex: 1, ...sizing}} width = {sizing.width} height = {sizing.height} 
          gl={{ preserveDrawingBuffer: true }} updatedefaultcamera = "false"> {/* allow image capture */}
            <DirtyHook sizing={sizing} />
            <FaceFollower2 faceIndex={0} expression={_expressions[0]} />
      </Canvas>
      <canvas className='camera' ref={camera} style={{position: 'absolute', zIndex: 0, ...sizing}} width = {sizing.width} height = {sizing.height} />
      <img id = "preview" style={{position: 'absolute', zIndex: 3, ...sizing}} width = {sizing.width} height = {sizing.height} />  {/* 캡쳐한 이미지 출력 */}
      <canvas className = "snap" ref={pictureCanvasRef} style={{position: 'absolute', zIndex: -1, ...sizing}} width = {sizing.width} height = {sizing.height} /> {/* 모델 저장 */}
      
      <div className = "camera_mamu" style={{position: 'absolute', height: "auto", width: "100%", top : sizing.height}}>  {/* 메뉴 */}

        <div style={{zIndex: 2, height: "4vh", width: "100%", background : "rgba(0,0,255,0)" }}> </div>

        <div className = "list" style={{zIndex: 2, height: "auto", width: "100%"}}> {/* 모델 리스트 */}
          <button className = "visible_button_1" style={{zIndex: 2, height: window.innerWidth * 0.1, width: window.innerWidth * 0.1}}
            onClick= {() => {setVisible1(!visible1) // 버튼을 보면 후크를 통해 클릭시 계속하여 true false 번갈아 가면서 할당 해줌
            if(visible1) {_temporary1 = 1; setVisible2(false);}
            else{_temporary1 = 0}}}> {visible1 ? "모자 보이는 상태 1" : "모자 숨겨진 상태 1"} </button> {/*여기에서 버튼을 통해 불러오기 각각 불러오기 시도 하려고 했으나 일부분 짤리는 현상 발생 */}
          <button className = "visible_button_2" style={{zIndex: 2, height: window.innerWidth * 0.1, width: window.innerWidth * 0.1}}
            onClick= {() => {setVisible1(!visible1) // 버튼을 보면 후크를 통해 클릭시 계속하여 true false 번갈아 가면서 할당 해줌
            if(visible1) {_temporary1 = 1; setVisible2(false);}
            else{_temporary1 = 0}}}> {visible1 ? "모자 보이는 상태 2" : "모자 숨겨진 상태 2"} </button>
          <button className = "visible_button_3" style={{zIndex: 2, height: window.innerWidth * 0.1, width: window.innerWidth * 0.1}}
            onClick= {() => {setVisible3(!visible3);_temporary3 = visible3}}> {visible3 ? "목걸이 보여진 상태 2" : "목걸이 숨겨진 상태 2"} </button>
        </div>
        
        <div className = "snap" style={{zIndex: 2, height: "auto", width: "100wh"}}> {/* 버튼 리스트 */}
          <button className = "snap_button" style={{zIndex: 2, height: window.innerWidth * 0.1, width: window.innerWidth * 0.1}} onClick={snapshot}>
          </button> {/* 화면을 캡쳐하는 버튼 */}
        </div>

      </div>
      
      <button className = "buttonshow" style={{position: 'fixed', zIndex: 2, top : window.innerHeight - 50}} onClick = {GuidePAgeClick}> 다음 페이지로 이동 </button>

    </div>
  )}  
};

export default App;