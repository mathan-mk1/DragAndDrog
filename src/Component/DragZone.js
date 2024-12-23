import { Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDrop } from 'react-dnd'
import axios from 'axios'

const DragZone = ({ onDrop, dragItems, recieveData, callAPI, apiCalled }) => {

    const [draggedItem, setDraggedItems] = useState([])
    const [selectedIndex, setSelectedIndex] = useState(null)

    useEffect(() => {
        getPropertiesData()
    }, [])

    useEffect(() => {
        if (callAPI) {
            getPropertiesData()
            setSelectedIndex(null)
            apiCalled(true)
        }
    }, [callAPI, apiCalled])

    const getPropertiesData = () => {
        try {
            axios.get('https://x8ki-letl-twmt.n7.xano.io/api:p3U13s-O/properties')
                .then((response) => {
                    if (response?.data?.length > 0) {
                        setDraggedItems(response.data)
                    }
                }).catch((e) => {
                    console.log(e.message)
                })
        } catch (e) {
            console.log(e.message)
        }
    }

    useEffect(() => {
        if (dragItems?.length > 0) {
            dragItems?.forEach((item) => {
                let data = {
                    name: item?.name ? item?.name : "",
                    make: '',
                    model: '',
                    year: null,
                    license: ''
                }
                setDraggedItems((prevDraggedItems) => [...prevDraggedItems, data]);
            })
        }
    }, [dragItems])

    const [, drop] = useDrop(() => ({
        accept: 'item',
        drop: (item) => onDrop(item),
        collect: (monitor) => ({
            canDrop: monitor.canDrop()
        })
    }))

    const handleClick = (item, i) => {
        recieveData(item)
        setSelectedIndex(i)
    }
    return (
        <div ref={drop} style={{ height: '90%', width: '100%', padding: '1vw', overflowY: 'auto' }}>
            {draggedItem?.map((item, index) => (
                <Button className='menuItems' variant={selectedIndex === index ? 'contained' : 'outlined'} color={selectedIndex === index ? 'success' : 'white'} style={{ margin: '1vw', width: '7vw' }} onClick={() => handleClick(item, index)}>{item.name}</Button>
            ))}
        </div>
    )
}

export default DragZone