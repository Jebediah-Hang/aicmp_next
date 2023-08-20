export function checkIsMobile() : boolean {
  const device = navigator.userAgent.toLowerCase()
  return /ipad|iphone|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/.test(device)
}
