import { DndProvider } from 'react-dnd';
import './App.css';
import DragItem from './DragItem';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DragZone from './DragZone';
import { useState } from 'react';
import { Button, TextField } from '@mui/material';
import axios from 'axios';

function App() {
  const [dragItems, setDragItems] = useState([])
  const [selectedProp, setSelectedProp] = useState({})
  const [errorMsg, setErrorMsg] = useState("")
  const [callAPI, setCallAPI] = useState(false)

  const handleDrop = (item) => {
    setDragItems((prevItems) => [...prevItems, item])
  }

  const handleRecieve = (item) => {
    if (item) {
      setSelectedProp(JSON.parse(JSON.stringify(item)))
    }
  }

  const handleChange = (e, fieldName) => {
    let value = e.target.value
    if (fieldName === "year") {
      let regex = /^\d+$/;
      let res = regex.test(value);
      if (res && value?.length < 5 && value <= new Date().getFullYear()) {
        selectedProp[fieldName] = value
        setErrorMsg("")
      } else {
        if (res && value?.length < 5 && !value <= new Date().getFullYear()) {
          setErrorMsg("Year must be less than current year")
        } else {
          setErrorMsg("Invalid Year")
        }
      }
    } else if (fieldName === "license") {
      let res = /[^a-zA-Z0-9]/;
      if (res.test(value)) {
        selectedProp[fieldName] = value
      }
    } else {
      selectedProp[fieldName] = value
    }
    setSelectedProp({ ...selectedProp })
  }

  const handleSave = () => {
    try {
      if (selectedProp?.id) {
        axios.put(`https://x8ki-letl-twmt.n7.xano.io/api:p3U13s-O/properties/${selectedProp?.id}`, selectedProp)
          .then((response) => {
            setSelectedProp({})
            callGetApi()
          })
      } else {
        axios.post('https://x8ki-letl-twmt.n7.xano.io/api:p3U13s-O/properties', selectedProp)
          .then((response) => {
            setSelectedProp({})
            callGetApi()
          })
      }

    } catch (e) {
      console.log(e.message);
    }
  }

  const handleDelete = () => {
    try {
      axios.delete(`https://x8ki-letl-twmt.n7.xano.io/api:p3U13s-O/properties/${selectedProp?.id}`)
        .then((response) => {
          setSelectedProp({})
          callGetApi()
        })
    } catch (e) {
      console.log(e.message);
    }
  }

  const callGetApi = () => {
    setCallAPI(true)
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ width: '100%', display: 'flex', height: '100vh' }}>
        <div className='component'>
          <div style={{ display: 'flex', flexDirection: "column", gap: '1vw', margin: '1vw', justifyContent: 'center', alignItems: 'center' }}>
            <DragItem name={'Car'} />
            <DragItem name={'Bike'} />
            <DragItem name={'Bus'} />
          </div>
        </div>
        <div className='component'>
          <DragZone onDrop={handleDrop} dragItems={dragItems} recieveData={handleRecieve} callAPI={callAPI} apiCalled={() => setCallAPI(false)} />
        </div>
        <div className='component'>
          {Object.keys(selectedProp)?.length > 0 ?
            <div style={{ padding: '2vw' }}>
              <div>
                <h3 style={{ textAlign: 'center', marginBottom: '0.5vw' }}>Details</h3>
                <p><b>Name: </b><TextField size='small' variant='standard' value={selectedProp?.name} onChange={(e) => handleChange(e, "name")} /></p>
                <p><b>Make: </b><TextField size='small' variant='standard' value={selectedProp?.make} onChange={(e) => handleChange(e, "make")} /></p>
                <p><b>Model: </b><TextField size='small' variant='standard' value={selectedProp?.model} onChange={(e) => handleChange(e, "model")} /></p>
                <p><b>Year: </b><TextField size='small' variant='standard' value={selectedProp?.year} onChange={(e) => handleChange(e, "year")} helperText={errorMsg} /></p>
                <p><b>License No: </b><TextField size='small' variant='standard' value={selectedProp?.license} onChange={(e) => handleChange(e, "license")} /></p>
              </div>
              <div style={{ display: 'flex', gap: '1vw', justifyContent: 'center', marginTop: '5vh' }}>
                <Button variant='outlined' color='success' onClick={handleDelete}>Delete</Button>
                <Button variant='contained' color='success' onClick={handleSave}>Save</Button>
              </div>
            </div>
            : null}
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
