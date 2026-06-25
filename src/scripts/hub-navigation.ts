const $ = (id: string): HTMLElement => {
  const el = document.getElementById(id)
  if (!el) throw new Error(`#${id} not found`)
  return el
}

function getFocusable(container: Element): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  )
}

// ── Mobile menu ───────────────────────────────────────────────────────────────

const mobileBtn   = $('mobile-menu-btn')
const mobileClose = $('mobile-menu-close')
const mobileMenu  = $('mobile-menu')
let previousFocus: HTMLElement | null = null

function openMobile(): void {
  mobileMenu.classList.remove('hidden')
  mobileMenu.setAttribute('aria-hidden', 'false')
  mobileBtn.setAttribute('aria-expanded', 'true')
  document.body.style.overflow = 'hidden'
  previousFocus = document.activeElement as HTMLElement
  getFocusable(mobileMenu)[0]?.focus()
}

function closeMobile(): void {
  mobileMenu.classList.add('hidden')
  mobileMenu.setAttribute('aria-hidden', 'true')
  mobileBtn.setAttribute('aria-expanded', 'false')
  document.body.style.overflow = ''
  previousFocus?.focus()
}

mobileBtn.addEventListener('click', openMobile)
mobileClose.addEventListener('click', closeMobile)

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
    closeMobile()
  }
})

// Focus trap
mobileMenu.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab') return
  const focusable = getFocusable(mobileMenu)
  const first = focusable[0]
  const last  = focusable[focusable.length - 1]
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
})

// ── Desktop dropdown ──────────────────────────────────────────────────────────

const dropdownTrigger = document.querySelector<HTMLElement>('[data-dropdown-trigger]')
const dropdown        = $('curl-types-dropdown')

function openDropdown(): void {
  dropdown.classList.remove('hidden')
  dropdownTrigger?.setAttribute('aria-expanded', 'true')
}

function closeDropdown(): void {
  dropdown.classList.add('hidden')
  dropdownTrigger?.setAttribute('aria-expanded', 'false')
}

dropdownTrigger?.addEventListener('click', (e) => {
  e.preventDefault()
  dropdown.classList.contains('hidden') ? openDropdown() : closeDropdown()
})

document.addEventListener('click', (e) => {
  if (
    !dropdown.classList.contains('hidden') &&
    !dropdown.contains(e.target as Node) &&
    e.target !== dropdownTrigger
  ) {
    closeDropdown()
  }
})

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !dropdown.classList.contains('hidden')) {
    closeDropdown()
    dropdownTrigger?.focus()
  }
})
