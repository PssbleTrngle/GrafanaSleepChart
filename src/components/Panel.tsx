import { DateTime, PanelProps } from '@grafana/data'
import { stylesFactory, useTheme } from '@grafana/ui'
import { css, cx } from 'emotion'
import React, { memo, useMemo } from 'react'
import { Options } from 'types'
import Series from './Series'

interface Props extends PanelProps<Options> {}

export interface Canvas {
   height: number
   width: number
   days: number
   start: DateTime
}

const Panel: React.FC<Props> = ({ options, data, width, height }) => {
   const styles = getStyles()

   const { from, to } = data.timeRange
   const days = useMemo(() => to.diff(from, 'days'), [to, from])

   const axisHeight = 50

   const canvas = {
      height: height - axisHeight,
      days,
      width,
      start: data.timeRange.from.startOf('day'),
   }

   return (
      <div
         className={cx(
            styles.wrapper,
            css`
               width: ${width}px;
               height: ${height}px;
            `
         )}
      >
         <svg
            className={styles.svg}
            width={width}
            height={height}
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox={`0 0 ${width} ${height}`}
         >
            <DayLines {...canvas} />
            <HourLines lines={options.lines} {...canvas} />
            <g>
               {data.series.map((series, i) => (
                  <Series data={series} index={i} canvas={canvas} />
               ))}
            </g>
         </svg>

         <div className={styles.textBox}>
            <span>{days} Days</span>
         </div>
      </div>
   )
}

const DayLines = memo(({ days, width, height }: Canvas) => {
   const theme = useTheme()
   return (
      <g>
         {new Array(days + 1).fill(null).map((_, day) => (
            <line
               key={day}
               stroke={theme.colors.border2}
               width={1}
               x1={day * (width / days)}
               x2={day * (width / days)}
               y1={0}
               y2={height}
            />
         ))}
      </g>
   )
})

const HourLines = memo(({ width, height, lines }: Canvas & { lines: number }) => {
   const theme = useTheme()
   return (
      <g>
         {new Array(lines + 1).fill(null).map((_, hour) => (
            <line
               key={hour}
               stroke={theme.colors.border2}
               width={1}
               x1={0}
               x2={width}
               y1={hour * (height / lines)}
               y2={hour * (height / lines)}
            />
         ))}
      </g>
   )
})

const getStyles = stylesFactory(() => {
   return {
      wrapper: css`
         position: relative;
      `,
      svg: css`
         position: absolute;
         top: 0;
         left: 0;
      `,
      textBox: css`
         position: absolute;
         bottom: 0;
         left: 0;
         padding: 10px;
      `,
   }
})

export default Panel
