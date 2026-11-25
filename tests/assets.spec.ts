import { test, expect } from '@playwright/test'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const projects = JSON.parse(readFileSync(join(process.cwd(), 'content/projects.json'), 'utf8')) as {
  projects: Array<{ slug: string; media: any; gallery: Array<{ src: string }>; noAssetsNote?: string }>
}

/**
 * Privacy guard. Only screenshots that have been individually reviewed may ship.
 * The Customers List, Edit Profile and order-detail screens were excluded because they
 * contain real names, addresses and phone numbers — this test keeps them out.
 */
const APPROVED = [
  'homefoody-customers/01-otp-signin.jpg',
  'homefoody-customers/02-discovery-home.jpg',
  'homefoody-customers/03-food-filters.jpg',
  'homefoody-customers/04-dish-detail.jpg',
  'homefoody-customers/05-cart-grouped-by-supplier.jpg',
  'homefoody-customers/06-promotions.jpg',
  'homefoody-suppliers/01-signin.jpg',
  'homefoody-suppliers/02-dashboard-orders.jpg',
  'homefoody-suppliers/03-my-menu.jpg',
  'homefoody-suppliers/04-promotions-list.jpg',
  'homefoody-suppliers/05-promotion-editor.jpg',
  'homefoody-suppliers/06-menu-item-editor.jpg',
]
const FORBIDDEN = /customers-list|customer-list|edit-profile|order-detail|profile/i

test('only approved screenshots are published', () => {
  const root = join(process.cwd(), 'public/images/projects')
  const found: string[] = []
  for (const dir of readdirSync(root)) {
    for (const file of readdirSync(join(root, dir))) found.push(`${dir}/${file}`)
  }
  expect(found.sort()).toEqual(APPROVED.sort())
  expect(found.filter((f) => FORBIDDEN.test(f)), 'files whose name suggests personal data').toEqual([])
})

test('every referenced image exists in the approved set', () => {
  const referenced = new Set<string>()
  for (const p of projects.projects) {
    if (p.media?.src) referenced.add(p.media.src)
    for (const g of p.gallery || []) referenced.add(g.src)
  }
  for (const src of referenced) {
    expect(APPROVED, `${src} must be an approved screenshot`).toContain(src.replace('/images/projects/', ''))
  }
})

test('no project claims a screenshot it does not have', () => {
  for (const p of projects.projects) {
    if (p.media?.kind === 'plate') {
      expect(p.media.plateNote, `${p.slug} plate must be labelled`).toMatch(/No public screenshot|Prototype/i)
      expect(p.gallery.length, `${p.slug} has a plate but also a gallery`).toBe(0)
      expect(p.noAssetsNote, `${p.slug} needs the no-assets explanation`).toBeTruthy()
    }
  }
})
