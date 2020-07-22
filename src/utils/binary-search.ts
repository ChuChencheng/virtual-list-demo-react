export default function binarySearch (list: number[], target: number): number {
  const length = list.length
  if (!length) return -1
  let start = 0
  let end = length - 1
  while (start <= end) {
    if (start === end) return list[start] === target ? start : -1
    const mid = (end - start) >> 1
    const midValue = list[mid]
    if (midValue === target) return mid
    if (target < midValue) {
      end = mid - 1
    } else {
      start = mid + 1
    }
  }
  return -1
}
