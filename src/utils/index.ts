export function checkIsMobile() : boolean {
  const device = navigator.userAgent.toLowerCase()
  return /ipad|iphone|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/.test(device)
}

export function checkIsNull(value: any) : boolean {
  const type = typeof value
  if (type === 'object') {
    return !Boolean(Object.keys(value).length)
  } else if (['boolean', 'number'].includes(type)) {
    return false
  } else {
    return !Boolean(value)
  }
}
