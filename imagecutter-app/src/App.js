import './App.css';
import React, { useEffect, useRef, useState } from 'react';
import {Button, Navbar, Form} from 'react-bootstrap';
import FileSelect from './fileSelect';

const App = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false)
  const [files, setFiles] = useState([])
  const [bgImage, setBgImage] = useState(null);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const [selection, setSelection] = useState({"x":0,"y":0,"width":0,"height":0});

  useEffect(() => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d")
      contextRef.current = context;
    },[])


  const startDrawing = ({nativeEvent}) => {
      const {x, y, offsetX, offsetY} = nativeEvent;
      contextRef.current.beginPath()

      var slctn = selection;
      slctn.x = offsetX;
      slctn.y = offsetY;
      slctn.width = 0;
      slctn.height = 0;

      setSelection(slctn);
      setIsDrawing(true)
  }

  const finishDrawing = () => {
      contextRef.current.closePath()
      setIsDrawing(false)
      
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.clearRect(0,0,canvasWidth,canvasHeight);
      contextRef.current = context;
      canvasRef.current.getContext("2d").drawImage(bgImage,0,0);

      contextRef.current.beginPath()
      contextRef.current.rect(selection.x, selection.y, selection.width, selection.height);
      contextRef.current.stroke();
      contextRef.current.closePath()

  }

  const draw = ({nativeEvent}) => {
      if(!isDrawing){
          return
      }
      const {x, y, offsetX, offsetY} = nativeEvent;

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.clearRect(0,0,canvasWidth,canvasHeight);
      contextRef.current = context;
      canvasRef.current.getContext("2d").drawImage(bgImage,0,0);

      var slctn = selection;  
      slctn.width = offsetX - slctn.x;
      slctn.height = offsetY - slctn.y;
      setSelection(slctn);

      contextRef.current.beginPath()
      contextRef.current.rect(slctn.x, slctn.y, slctn.width, slctn.height);
      contextRef.current.closePath()
      contextRef.current.stroke()
  }
    
  const renderBackground = image => {
    var bg = new Image();
    bg.src = image;

    bg.onload = function() {
      setCanvasWidth(bg.naturalWidth);
      setCanvasHeight(bg.naturalHeight);
      canvasRef.current.getContext("2d").drawImage(bg,0,0);

      // Redraw selection
      contextRef.current.beginPath()
      contextRef.current.rect(selection.x, selection.y, selection.width, selection.height);
      contextRef.current.stroke()
      contextRef.current.closePath()

    }
    setBgImage(bg);
  }

  /** NB! Her er det mulig lokalhost må endres
   * @param {*} event 
   * @returns result.zip - inneholder de kuttede filene
   */
  const submit = event => {
    if(files.length < 1) {
      alert("No Files Selected")
      return;
    }

    if(selection.width == 0 || selection.height == 0) {
      alert("Make a Selection before submitting")
      return;
    }

    event.preventDefault();
    const form = new FormData();
    form.append("selection", JSON.stringify(selection));
    for (var i = 0; i < files.length; i++) {
        form.append("file"+i, files[i]);
    }

    fetch("https://localhost:5000/api/cutter/submit",{
        method:'POST',
        body:form
    })
    .then((response)=>{
        response.blob().then(blob => download(blob,"response"));      
      },
      (error)=>{
          alert(error);
    })
}

  const storeFiles = files => {
    setFiles(files)
    const reader = new FileReader();

    if (files[0]) reader.readAsDataURL(files[0]);

    reader.addEventListener("load", function () { 
      renderBackground(reader.result);
    }, false);
  }

  // Denne funksjonen lånte jeg fra Dylanbob211 på Stackoverflow
  // https://stackoverflow.com/posts/64441995/revisions, hentet 18.03.2021
  function download(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    // the filename you want
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  return (
    <>
      <Navbar className="bg-dark justify-content-left">
        <Navbar.Brand>
          <img 
          src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/google/274/scissors_2702-fe0f.png"
          width="30"
          height="30"
          />
          ImageCutter
        </Navbar.Brand>
        <Form inline>
          <FileSelect onChange={e => storeFiles(e)}/>
          <Button variant="outline-primary" onClick={submit}>Process Image</Button>
        </Form>
      </Navbar>

      <canvas ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseUp={finishDrawing}
      onMouseMove={draw}
      width={canvasWidth} 
      height={canvasHeight}
      style={{background:{bgImage}}}/>
    </>
  )
}

export default App;