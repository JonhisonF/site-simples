import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import Form from '@/views/Form.vue'

const vuetifyStubs = [
  'v-row','v-col','v-card','v-card-title','v-card-text','v-app-bar','v-breadcrumbs',
  'v-form','v-text-field','v-btn','v-sheet','v-divider','v-chip','v-data-table','v-spacer'
]

function mountCmp() {
  return mount(Form, {
    shallow: true,
    global: {
      stubs: vuetifyStubs.reduce((acc, k) => { acc[k] = true; return acc }, {}),
    },
  })
}

function resetStorage() { localStorage.clear() }

describe('Form.vue', () => {
  beforeEach(resetStorage)

  it('validações: required/email/max80/idade', () => {
    const wrapper = mountCmp()
    const { rules } = wrapper.vm

    expect(rules.required('x')).toBe(true)
    expect(rules.required('')).toBe('Obrigatório')

    expect(rules.email('a@b.com')).toBe(true)
    expect(rules.email('inv@lido')).toBe('E-mail inválido')

    expect(rules.max80('a'.repeat(80))).toBe(true)
    expect(rules.max80('a'.repeat(81))).toBe('Máximo de 80 caracteres')

    expect(rules.idade(0)).toBe(true)
    expect(rules.idade(120)).toBe(true)
    expect(rules.idade(121)).toBe('Idade deve estar entre 0 e 120')
  })

  it('previewUrl monta parâmetros do formulário', async () => {
    const wrapper = mountCmp()
    const vm = wrapper.vm

    vm.nome = 'Maria'
    vm.email = 'maria@exemplo.com'
    vm.idade = 28
    await wrapper.vm.$nextTick()

    expect(vm.previewUrl).toContain('formAction.html?')
    expect(vm.previewUrl).toContain('nome=Maria')
    expect(vm.previewUrl).toContain('email=maria%40exemplo.com')
    expect(vm.previewUrl).toContain('idade=28')
  })

  it('submitForm adiciona, limpa e persiste', async () => {
    const wrapper = mountCmp()
    const vm = wrapper.vm

    vm.nome = 'João'
    vm.email = 'joao@exemplo.com'
    vm.idade = 33

    vm.submitForm()
    await wrapper.vm.$nextTick()

    expect(vm.registros.length).toBe(1)
    const reg = vm.registros[0]
    expect(reg.nome).toBe('João')
    expect(vm.nome).toBe('')
    expect(vm.email).toBe('')
    expect(vm.idade).toBe(null)

    const raw = localStorage.getItem('cadastros')
    expect(raw).toBeTruthy()
    expect(JSON.parse(raw).length).toBe(1)
  })

  it('filtered busca por nome/email', async () => {
    const wrapper = mountCmp()
    const vm = wrapper.vm
    const now = new Date().toISOString()

    vm.registros = [
      { id: '1', nome: 'Alice', email: 'alice@x.com', idade: 21, data: now },
      { id: '2', nome: 'Bruno', email: 'bruno@x.com', idade: 25, data: now },
    ]

    vm.search = 'ali'
    await wrapper.vm.$nextTick()
    expect(vm.filtered.length).toBe(1)
    expect(vm.filtered[0].nome).toBe('Alice')

    vm.search = 'x.com'
    await wrapper.vm.$nextTick()
    expect(vm.filtered.length).toBe(2)
  })

  it('estatísticas total e média', async () => {
    const wrapper = mountCmp()
    const vm = wrapper.vm

    expect(vm.statTotal).toBe(0)
    expect(vm.statMedia).toBe('—')

    const now = new Date().toISOString()
    vm.registros = [
      { id: '1', nome: 'A', email: 'a@a.com', idade: 10, data: now },
      { id: '2', nome: 'B', email: 'b@b.com', idade: 20, data: now },
    ]
    await wrapper.vm.$nextTick()

    expect(vm.statTotal).toBe(2)
    expect(vm.statMedia).toBe('15.0')
  })

  it('remover elimina pelo id', async () => {
    const wrapper = mountCmp()
    const vm = wrapper.vm
    const now = new Date().toISOString()
    vm.registros = [
      { id: 'x', nome: 'X', email: 'x@x.com', idade: 1, data: now },
      { id: 'y', nome: 'Y', email: 'y@y.com', idade: 2, data: now },
    ]

    vm.remover('x')
    await wrapper.vm.$nextTick()
    expect(vm.registros.map(r => r.id)).toEqual(['y'])
  })

  it('seed adiciona 2 registros', () => {
    const wrapper = mountCmp()
    const vm = wrapper.vm
    vm.seed()
    expect(vm.registros.length).toBe(2)
  })

  it('limpar zera lista quando confirm() é true', () => {
    const wrapper = mountCmp()
    const vm = wrapper.vm

    confirm.mockReturnValueOnce(true)

    const now = new Date().toISOString()
    vm.registros = [{ id: '1', nome: 'A', email: 'a@a.com', idade: 1, data: now }]
    vm.limpar()
    expect(vm.registros.length).toBe(0)
  })

  it('exportJSON/exportCSV chamam URL.createObjectURL', () => {
    const wrapper = mountCmp()
    const vm = wrapper.vm
    const spy = URL.createObjectURL

    vm.exportJSON()
    expect(spy).toHaveBeenCalled()
    spy.mockClear()

    vm.exportCSV()
    expect(spy).toHaveBeenCalled()
  })

  it('formatDate retorna dd/mm/yyyy HH:MM', () => {
    const wrapper = mountCmp()
    const vm = wrapper.vm
    const iso = '2024-05-10T03:07:00.000Z'
    expect(vm.formatDate(iso)).toMatch(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/)
  })
})
