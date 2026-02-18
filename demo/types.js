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
      text: "L'attention est une ressource limitee",
      x: 200, y: 150,
      status: 'priority',
      tags: ['#cognition', '#attention'],
      created: new Date().toISOString(),
    },
    {
      id: 'n_demo2',
      text: "Le multitache reduit la qualite cognitive",
      x: 550, y: 100,
      status: 'neutral',
      tags: ['#cognition', '#productivite'],
      created: new Date().toISOString(),
    },
    {
      id: 'n_demo3',
      text: "La friction force la clarification",
      x: 400, y: 350,
      status: 'neutral',
      tags: ['#friction', '#emergence'],
      created: new Date().toISOString(),
    },
    {
      id: 'n_demo4',
      text: "Trop d'alignement cree des boucles de validation",
      x: 750, y: 300,
      status: 'neutral',
      tags: ['#biais', '#validation'],
      created: new Date().toISOString(),
    },
    {
      id: 'n_demo5',
      text: "La carte n'est pas le territoire",
      x: 150, y: 450,
      status: 'neutral',
      tags: ['#epistemologie'],
      created: new Date().toISOString(),
    },
  ],
  connections: [
    {
      id: 'c_demo1',
      from: 'n_demo1', to: 'n_demo2',
      type: 'implies',
      mechanism: "L'attention limitee rend le multitache couteux",
      created: new Date().toISOString(),
    },
    {
      id: 'c_demo2',
      from: 'n_demo3', to: 'n_demo4',
      type: 'resonance',
      mechanism: "La friction empeche les boucles de validation",
      created: new Date().toISOString(),
    },
    {
      id: 'c_demo3',
      from: 'n_demo1', to: 'n_demo3',
      type: 'implies',
      mechanism: "L'attention focalisee permet la friction productive",
      created: new Date().toISOString(),
    },
  ],
};
