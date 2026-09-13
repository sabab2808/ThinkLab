// Runs off the main thread — solves can take anywhere from under a
// second to tens of seconds (see docs/cube-engine.md), and blocking the
// UI thread for that long would freeze the whole tab.
import { cubeFromFacelets, solveCube } from '@thinklab/cube-engine'

self.onmessage = (event) => {
  const { facelets } = event.data
  try {
    const cube = cubeFromFacelets(facelets)
    const result = solveCube(cube)
    self.postMessage({ ok: true, result })
  } catch (err) {
    self.postMessage({ ok: false, error: err.message })
  }
}
