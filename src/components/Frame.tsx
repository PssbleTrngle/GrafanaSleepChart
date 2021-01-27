import React, { memo } from 'react'
import { Canvas } from './Panel'

interface FrameProps {
   from: number
   to: number
   day: number
   color: string
   canvas: Canvas
}
const Frame = memo(({ from, to, day, color, canvas }: FrameProps) => {
   const height = canvas.height / (24 * 60)
   const width = canvas.width / canvas.days
   return <rect fill={color} x={day * width} width={width} y={from * height} height={(to - from) * height} />
})

export default Frame
