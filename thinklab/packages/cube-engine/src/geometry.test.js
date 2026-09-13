import { describe, it, expect } from 'vitest'
import { rotateAxis, rotateAxisTimes, vecEquals } from './geometry.js'

const AXES = ['x', 'y', 'z']
const SAMPLE_VECTORS = [
  { x: 1, y: 0, z: 0 },
  { x: 0, y: 1, z: 0 },
  { x: 0, y: 0, z: 1 },
  { x: 1, y: 1, z: 1 },
  { x: -1, y: 1, z: -1 },
]

describe('rotateAxis', () => {
  it('applied 4 times returns the original vector, for every axis and vector', () => {
    for (const axis of AXES) {
      for (const v of SAMPLE_VECTORS) {
        let result = v
        for (let i = 0; i < 4; i++) result = rotateAxis(axis, result)
        expect(vecEquals(result, v)).toBe(true)
      }
    }
  })

  it('preserves vector length (is a true rotation, not a shear/scale)', () => {
    for (const axis of AXES) {
      for (const v of SAMPLE_VECTORS) {
        const before = v.x ** 2 + v.y ** 2 + v.z ** 2
        const r = rotateAxis(axis, v)
        const after = r.x ** 2 + r.y ** 2 + r.z ** 2
        expect(after).toBe(before)
      }
    }
  })

  it('leaves the rotation axis itself unchanged', () => {
    expect(vecEquals(rotateAxis('x', { x: 1, y: 0, z: 0 }), { x: 1, y: 0, z: 0 })).toBe(true)
    expect(vecEquals(rotateAxis('y', { x: 0, y: 1, z: 0 }), { x: 0, y: 1, z: 0 })).toBe(true)
    expect(vecEquals(rotateAxis('z', { x: 0, y: 0, z: 1 }), { x: 0, y: 0, z: 1 })).toBe(true)
  })
})

describe('rotateAxisTimes', () => {
  it('applying once equals rotateAxis once', () => {
    expect(vecEquals(rotateAxisTimes('x', { x: 1, y: 1, z: 1 }, 1), rotateAxis('x', { x: 1, y: 1, z: 1 }))).toBe(true)
  })

  it('applying 3 times is the inverse of applying 1 time', () => {
    const v = { x: 1, y: -1, z: 1 }
    const forward = rotateAxisTimes('y', v, 1)
    const back = rotateAxisTimes('y', forward, 3)
    expect(vecEquals(back, v)).toBe(true)
  })

  it('handles negative and large counts via modulo', () => {
    const v = { x: 1, y: 2, z: 3 }
    expect(vecEquals(rotateAxisTimes('z', v, -1), rotateAxisTimes('z', v, 3))).toBe(true)
    expect(vecEquals(rotateAxisTimes('z', v, 4), v)).toBe(true)
    expect(vecEquals(rotateAxisTimes('z', v, 9), rotateAxisTimes('z', v, 1))).toBe(true)
  })
})
