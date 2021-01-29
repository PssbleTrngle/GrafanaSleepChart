import { DataFrame, dateTime } from '@grafana/data'
import { useTheme } from '@grafana/ui'
import React, { useState } from 'react'
import Frame from './Frame'
import { Canvas } from './Panel'

interface SeriesProps {
   data: DataFrame
   index: number
   canvas: Canvas
}
const Series = ({ canvas, data, index }: SeriesProps) => {
   const theme = useTheme()
   const [hovered, setHovered] = useState<[string, number]>()

   const colors = [
      theme.palette.blue77,
      theme.palette.greenBase,
      theme.palette.yellow,
      theme.palette.red88
   ]

   const [startField, endField] = ['start', 'end'].map(k => {
      const field = data.fields.find(s => s.name === k)
      if (!field) {
         throw new Error(`Field '${k}' missing`)
      }
      return field
   })

   const frames = startField.values
      .toArray()
      .map((v, i) => [v, endField.values.get(i)])
      .map(d => d.map(s => s.substring(0, s.length - 1)))
      .map(d => d.map(s => new Date(s)))
      .map((dates: Date[]) =>
         dates.map(d => ({
            day: dateTime(d)
               .startOf('day')
               .diff(canvas.start, 'days'),
            minute: d.getHours() * 60 + d.getMinutes(),
         }))
      )

   const key = data.refId ?? (data.name && `${data.name}-${index}`) ?? `${index}`

   return (
      <g key={key}>
         {frames.map(([start, end], i) => {
            const isHovered = hovered?.[0] === key && hovered?.[1] === i
            const color = colors[(isHovered ? index : index + 2) % colors.length]

            return (
               <g
                  key={i}
                  onMouseOver={() => setHovered([key, i])}
                  onMouseOut={() => setHovered(undefined)}
                  onClick={() => console.log(start, end)}
               >
                  <Frame
                     color={color}
                     canvas={canvas}
                     from={start.minute}
                     to={end.day === start.day ? end.minute : 24 * 60}
                     day={start.day}
                  />
                  {start.day !== end.day && (
                     <Frame color={color} canvas={canvas} from={0} to={end.minute} day={end.day} />
                  )}
               </g>
            )
         })}
      </g>
   )
}

export default Series
