import { COLOR_SWATCH_HEX } from '../utils/colorScan.js'

const LABELS = ['U', 'D', 'F', 'B', 'L', 'R']
const FACE_NAMES = { U: 'Up', D: 'Down', F: 'Front', R: 'Right', B: 'Back', L: 'Left' }

export default function CubeReviewGrid({ facelets, onChange }) {
  function cycle(face, index) {
    const current = facelets[face][index]
    const next = LABELS[(LABELS.indexOf(current) + 1) % LABELS.length]
    onChange(face, index, next)
  }

  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
      {Object.keys(facelets).map((face) => (
        <div key={face}>
          <p className="font-mono text-xs text-text-muted">{FACE_NAMES[face]}</p>
          <div className="mt-2 grid grid-cols-3 gap-1">
            {facelets[face].map((label, i) => (
              <button
                key={i}
                type="button"
                onClick={() => cycle(face, i)}
                style={{ backgroundColor: COLOR_SWATCH_HEX[label] }}
                className="aspect-square border border-hairline"
                title={`Tap to correct (currently ${label})`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
