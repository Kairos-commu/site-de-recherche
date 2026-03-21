/**
 * KAIROS Demo — Types, constants & demo data
 */

export function generateId(prefix = 'n') {
  return `${prefix}_${crypto.randomUUID()}`;
}

export const DEMO_DATA = {
  version: 1,
  mode: 'explorer',
  zoom: 1,
  panX: 100,
  panY: 50,
  vignettes: [
    {
      id: 'n_demo1',
      text: "Attention is a limited resource",
      x: 200, y: 150,
      status: 'priority',
      tags: ['#cognition', '#attention'],
      created: new Date().toISOString(),
    },
    {
      id: 'n_demo2',
      text: "Multitasking reduces cognitive quality",
      x: 550, y: 100,
      status: 'neutral',
      tags: ['#cognition', '#productivity'],
      created: new Date().toISOString(),
    },
    {
      id: 'n_demo3',
      text: "Friction forces clarification",
      x: 400, y: 350,
      status: 'neutral',
      tags: ['#friction', '#emergence'],
      created: new Date().toISOString(),
    },
    {
      id: 'n_demo4',
      text: "Too much alignment creates validation loops",
      x: 750, y: 300,
      status: 'neutral',
      tags: ['#bias', '#validation'],
      created: new Date().toISOString(),
    },
    {
      id: 'n_demo5',
      text: "The map is not the territory",
      x: 150, y: 450,
      status: 'neutral',
      tags: ['#epistemology'],
      created: new Date().toISOString(),
    },
  ],
  connections: [
    {
      id: 'c_demo1',
      from: 'n_demo1', to: 'n_demo2',
      type: 'implies',
      mechanism: "Limited attention makes multitasking costly",
      created: new Date().toISOString(),
    },
    {
      id: 'c_demo2',
      from: 'n_demo3', to: 'n_demo4',
      type: 'resonance',
      mechanism: "Friction prevents validation loops",
      created: new Date().toISOString(),
    },
    {
      id: 'c_demo3',
      from: 'n_demo1', to: 'n_demo3',
      type: 'implies',
      mechanism: "Focused attention enables productive friction",
      created: new Date().toISOString(),
    },
  ],
};
