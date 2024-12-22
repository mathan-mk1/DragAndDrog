import { Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDrop } from 'react-dnd'
import axios from 'axios'

const DragZone = ({ onDrop, dragItems, recieveData, modifiedData, modifiedIndex, callAPI, apiCalled }) => {

    const [draggedItem, setDraggedItems] = useState([])

    useEffect(() => {
        getPropertiesData()
    }, [])

    useEffect(() => {
        if (callAPI) {
            getPropertiesData()
            apiCalled(true)
        }

    }, [callAPI])

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
            dragItems?.forEach((item, index) => {
                let LicNo = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000
                let data = {
                    name: item?.name ? item?.name : `${item?.name} ${index + 1}`,
                    make: item?.name === "Car" ? 'maruthi' : item?.name === "Bike" ? "Hero" : item?.name === "Bus" ? "Ashok Leyland" : '',
                    model: item?.name === "Car" ? 'swift' : item?.name === "Bike" ? "Passion Pro" : item?.name === "Bus" ? "A1" : '',
                    year: 2023,
                    license: `TN 44 Q ${LicNo}`
                }
                setDraggedItems([...draggedItem, data])
            })
        }
    }, [dragItems])

    useEffect(() => {
        if (modifiedData) {
            draggedItem[modifiedIndex] = modifiedData
            setDraggedItems([...draggedItem])
        }
    }, [modifiedData])

    const [{ canDrop }, drop] = useDrop(() => ({
        accept: 'item',
        drop: (item) => onDrop(item),
        collect: (monitor) => ({
            canDrop: monitor.canDrop()
        })
    }))

    const handleClick = (item) => {
        recieveData(item)
    }
    return (
        <div ref={drop} style={{ height: '90%', width: '100%', padding: '1vw', overflowY: 'auto' }}>
            {draggedItem?.map((item) => (
                <Button className='menuItems' variant='outlined' color='white' style={{ margin: '1vw', width: '7vw' }} onClick={() => handleClick(item)}>{item.name}</Button>
            ))}
        </div>
    )
}

export default DragZone