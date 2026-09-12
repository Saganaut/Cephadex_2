import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useArray from './useArray'

interface TestItem {
  id: number
  name: string
  value?: number
}

describe('useArray', () => {
  it('initializes with empty array when no initial items provided', () => {
    const { result } = renderHook(() => useArray<TestItem>())

    expect(result.current.items).toEqual([])
  })

  it('initializes with provided initial items', () => {
    const initialItems: TestItem[] = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ]

    const { result } = renderHook(() => useArray(initialItems))

    expect(result.current.items).toEqual(initialItems)
  })

  describe('addItem', () => {
    it('adds new item to empty array', () => {
      const { result } = renderHook(() => useArray<TestItem>())
      const newItem: TestItem = { id: 1, name: 'New Item' }

      act(() => {
        result.current.addItem(newItem)
      })

      expect(result.current.items).toEqual([newItem])
    })

    it('adds new item to existing array', () => {
      const initialItems: TestItem[] = [{ id: 1, name: 'Item 1' }]
      const { result } = renderHook(() => useArray(initialItems))
      const newItem: TestItem = { id: 2, name: 'Item 2' }

      act(() => {
        result.current.addItem(newItem)
      })

      expect(result.current.items).toEqual([
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ])
    })

    it('updates existing item when adding item with same id', () => {
      const initialItems: TestItem[] = [
        { id: 1, name: 'Original Item', value: 10 },
      ]
      const { result } = renderHook(() => useArray(initialItems))
      const updatedItem: TestItem = { id: 1, name: 'Updated Item', value: 20 }

      act(() => {
        result.current.addItem(updatedItem)
      })

      expect(result.current.items).toEqual([updatedItem])
      expect(result.current.items).toHaveLength(1)
    })

    it('maintains order when updating existing item', () => {
      const initialItems: TestItem[] = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' },
      ]
      const { result } = renderHook(() => useArray(initialItems))
      const updatedItem: TestItem = { id: 2, name: 'Updated Item 2', value: 100 }

      act(() => {
        result.current.addItem(updatedItem)
      })

      expect(result.current.items).toEqual([
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Updated Item 2', value: 100 },
        { id: 3, name: 'Item 3' },
      ])
    })
  })

  describe('removeItem', () => {
    it('removes item from array', () => {
      const initialItems: TestItem[] = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' },
      ]
      const { result } = renderHook(() => useArray(initialItems))

      act(() => {
        result.current.removeItem(2)
      })

      expect(result.current.items).toEqual([
        { id: 1, name: 'Item 1' },
        { id: 3, name: 'Item 3' },
      ])
    })

    it('does nothing when removing non-existent item', () => {
      const initialItems: TestItem[] = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ]
      const { result } = renderHook(() => useArray(initialItems))

      act(() => {
        result.current.removeItem(99)
      })

      expect(result.current.items).toEqual(initialItems)
    })

    it('handles removing from empty array', () => {
      const { result } = renderHook(() => useArray<TestItem>())

      act(() => {
        result.current.removeItem(1)
      })

      expect(result.current.items).toEqual([])
    })

    it('removes all instances of item with same id', () => {
      const initialItems: TestItem[] = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ]
      const { result } = renderHook(() => useArray(initialItems))

      act(() => {
        result.current.removeItem(1)
      })

      expect(result.current.items).toEqual([{ id: 2, name: 'Item 2' }])
    })
  })

  describe('updateItem', () => {
    it('updates item properties partially', () => {
      const initialItems: TestItem[] = [
        { id: 1, name: 'Item 1', value: 10 },
        { id: 2, name: 'Item 2', value: 20 },
      ]
      const { result } = renderHook(() => useArray(initialItems))

      act(() => {
        result.current.updateItem(1, { name: 'Updated Item 1' })
      })

      expect(result.current.items).toEqual([
        { id: 1, name: 'Updated Item 1', value: 10 },
        { id: 2, name: 'Item 2', value: 20 },
      ])
    })

    it('updates multiple properties at once', () => {
      const initialItems: TestItem[] = [
        { id: 1, name: 'Item 1', value: 10 },
      ]
      const { result } = renderHook(() => useArray(initialItems))

      act(() => {
        result.current.updateItem(1, { name: 'New Name', value: 100 })
      })

      expect(result.current.items).toEqual([
        { id: 1, name: 'New Name', value: 100 },
      ])
    })

    it('does nothing when updating non-existent item', () => {
      const initialItems: TestItem[] = [
        { id: 1, name: 'Item 1' },
      ]
      const { result } = renderHook(() => useArray(initialItems))

      act(() => {
        result.current.updateItem(99, { name: 'Should not exist' })
      })

      expect(result.current.items).toEqual(initialItems)
    })

    it('handles updating with empty partial object', () => {
      const initialItems: TestItem[] = [
        { id: 1, name: 'Item 1', value: 10 },
      ]
      const { result } = renderHook(() => useArray(initialItems))

      act(() => {
        result.current.updateItem(1, {})
      })

      expect(result.current.items).toEqual(initialItems)
    })

    it('can add new properties during update', () => {
      const initialItems: TestItem[] = [
        { id: 1, name: 'Item 1' },
      ]
      const { result } = renderHook(() => useArray(initialItems))

      act(() => {
        result.current.updateItem(1, { value: 50 })
      })

      expect(result.current.items).toEqual([
        { id: 1, name: 'Item 1', value: 50 },
      ])
    })

    it('preserves id when updating', () => {
      const initialItems: TestItem[] = [
        { id: 1, name: 'Item 1' },
      ]
      const { result } = renderHook(() => useArray(initialItems))

      act(() => {
        // Attempt to update id (should be preserved)
        result.current.updateItem(1, { id: 999, name: 'Updated' } as any)
      })

      expect(result.current.items[0].id).toBe(1)
      expect(result.current.items[0].name).toBe('Updated')
    })
  })

  describe('reset', () => {
    it('clears all items from array', () => {
      const initialItems: TestItem[] = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' },
      ]
      const { result } = renderHook(() => useArray(initialItems))

      act(() => {
        result.current.reset()
      })

      expect(result.current.items).toEqual([])
    })

    it('works on already empty array', () => {
      const { result } = renderHook(() => useArray<TestItem>())

      act(() => {
        result.current.reset()
      })

      expect(result.current.items).toEqual([])
    })
  })

  describe('complex operations', () => {
    it('handles multiple operations in sequence', () => {
      const { result } = renderHook(() => useArray<TestItem>())

      act(() => {
        result.current.addItem({ id: 1, name: 'Item 1' })
      })

      act(() => {
        result.current.addItem({ id: 2, name: 'Item 2' })
      })

      act(() => {
        result.current.updateItem(1, { value: 100 })
      })

      act(() => {
        result.current.addItem({ id: 3, name: 'Item 3' })
      })

      act(() => {
        result.current.removeItem(2)
      })

      expect(result.current.items).toEqual([
        { id: 1, name: 'Item 1', value: 100 },
        { id: 3, name: 'Item 3' },
      ])
    })

    it('maintains immutability - original arrays are not modified', () => {
      const initialItems: TestItem[] = [
        { id: 1, name: 'Item 1' },
      ]
      const originalItems = [...initialItems]
      const { result } = renderHook(() => useArray(initialItems))

      act(() => {
        result.current.addItem({ id: 2, name: 'Item 2' })
      })

      expect(initialItems).toEqual(originalItems)
    })

    it('works with different item types', () => {
      interface CustomItem {
        id: number
        title: string
        completed: boolean
        priority?: 'low' | 'medium' | 'high'
      }

      const { result } = renderHook(() => useArray<CustomItem>())

      act(() => {
        result.current.addItem({
          id: 1,
          title: 'Task 1',
          completed: false,
          priority: 'high',
        })
      })

      act(() => {
        result.current.updateItem(1, { completed: true })
      })

      expect(result.current.items).toEqual([
        {
          id: 1,
          title: 'Task 1',
          completed: true,
          priority: 'high',
        },
      ])
    })
  })

  describe('edge cases', () => {
    it('handles items with id 0', () => {
      const { result } = renderHook(() => useArray<TestItem>())

      act(() => {
        result.current.addItem({ id: 0, name: 'Zero ID Item' })
      })

      expect(result.current.items).toEqual([{ id: 0, name: 'Zero ID Item' }])

      act(() => {
        result.current.updateItem(0, { name: 'Updated Zero' })
      })

      expect(result.current.items[0].name).toBe('Updated Zero')

      act(() => {
        result.current.removeItem(0)
      })

      expect(result.current.items).toEqual([])
    })

    it('handles negative ids', () => {
      const { result } = renderHook(() => useArray<TestItem>())

      act(() => {
        result.current.addItem({ id: -1, name: 'Negative ID Item' })
      })

      expect(result.current.items).toEqual([{ id: -1, name: 'Negative ID Item' }])
    })

    it('handles large numbers of items', () => {
      const { result } = renderHook(() => useArray<TestItem>())
      const largeNumber = 1000

      act(() => {
        for (let i = 0; i < largeNumber; i++) {
          result.current.addItem({ id: i, name: `Item ${i}` })
        }
      })

      expect(result.current.items).toHaveLength(largeNumber)

      act(() => {
        result.current.removeItem(500)
      })

      expect(result.current.items).toHaveLength(largeNumber - 1)
      expect(result.current.items.find(item => item.id === 500)).toBeUndefined()
    })
  })
})