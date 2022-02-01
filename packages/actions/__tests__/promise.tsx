import React, { useEffect, useState } from 'react'
import { act, render, screen } from '@testing-library/react'

import { Subject, firstValueFrom } from 'rxjs'
import { usePromise } from '../src/promise'
import { useExplicitRender } from '../src/utility'

describe('usePromise', () => {
  it('should update on item', async () => {
    const subj = new Subject<number>()
    let state = ''

    const Component: React.FC<{ p: Promise<number> }> = ({ p }) => {
      const box = usePromise(() => p, [p])

      if (box.isPending()) {
        state = 'pending'
        return <p>Pending!</p>
      }

      if (box.err()) {
        state = 'error'
        return <p>Error!</p>
      }

      state = box.ok()!.toString()
      return <p>{state}</p>
    }

    render(<Component p={firstValueFrom(subj)} />)

    expect(state).toBe('pending')

    // Pretend the promise completed
    subj.next(1)

    const result = await screen.findByText('1')
    expect(result).toBeInTheDocument()
  })

  it('should update on error', async () => {
    const subj = new Subject<number>()
    let state = ''

    const Component: React.FC<{ p: Promise<number> }> = ({ p }) => {
      const box = usePromise(() => p, [p])

      if (box.isPending()) {
        state = 'pending'
        return <p>Pending!</p>
      }

      if (box.err()) {
        state = 'error'
        return <p>Error!</p>
      }

      state = box.ok()!.toString()
      return <p>{state}</p>
    }

    render(<Component p={firstValueFrom(subj)} />)

    expect(state).toBe('pending')

    // Pretend the promise rejected
    subj.error(new Error('die'))

    const result = await screen.findByText('Error!')
    expect(result).toBeInTheDocument()
  })

  it('should update when deps change', async () => {
    const subj = new Subject<number>()
    let state = ''
    let callCount = 0

    const Component: React.FC<{ p: Promise<number> }> = () => {
      const { dep, rerender } = useExplicitRender()
      const box = usePromise(() => {
        callCount++
        return Promise.resolve(String(callCount))
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [dep])

      // This is a hack, we're using Subjects to reach into this Component
      // and toggle a dep
      useEffect(() => {
        subj.subscribe(() => rerender())
      }, [rerender])

      if (box.isPending()) {
        state = 'pending'
        return <p>Pending!</p>
      }

      if (box.err()) {
        state = 'error'
        return <p>Error!</p>
      }

      state = box.ok()!
      return <p>{state}</p>
    }

    const p = firstValueFrom(subj)
    const { rerender } = render(<Component p={p} />)

    expect(state).toBe('pending')
    expect(callCount).toBe(1)

    const result1 = await screen.findByText('1')
    expect(result1).toBeInTheDocument()

    expect(state).toBe('1')
    expect(callCount).toBe(1)

    // change a dep, see the usePromise block get called again
    act(() => subj.next(1))
    rerender(<Component p={p} />)

    const result2 = await screen.findByText('2')
    expect(result2).toBeInTheDocument()
    expect(callCount).toBe(2)
  })
})
