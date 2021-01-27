import { PanelPlugin } from '@grafana/data'
import Panel from './components/Panel'
import { Options } from './types'

export const plugin = new PanelPlugin<Options>(Panel).setPanelOptions(builder => {
   return builder.addRadio({
      name: 'Lines at',
      path: 'lines',
      defaultValue: 24,
      settings: {
         options: [
            {
               value: 12,
               label: 'second hours',
            },
            {
               value: 24,
               label: 'hours',
            },
            {
               value: 48,
               label: 'half-hours',
            },
         ],
      },
   })
})
