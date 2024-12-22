import React from 'react'
import { useDrag } from 'react-dnd'

const DragItem = ({ name }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'item',
        item: { name },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    }))
    return (
        <div className='menuItems' ref={drag} style={{ opacity: isDragging ? 0.5 : 1, cursor: 'pointer' }}>
            {name}
        </div>
    )
}

export default DragItem