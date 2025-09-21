<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

const STORAGE_KEY = 'cadastros'

const nome = ref('')
const email = ref('')
const idade = ref<number | null>(null)

const rules = {
  required: (v: unknown) => (v !== null && v !== undefined && String(v).trim().length > 0) || 'Obrigatório',
  email: (v: string) => /[^@\s]+@[^@\s]+\.[^@\s]+/.test(v) || 'E-mail inválido',
  max80: (v: string) => (v?.length ?? 0) <= 80 || 'Máximo de 80 caracteres',
  idade: (v: number | null) => (v !== null && v >= 0 && v <= 120) || 'Idade deve estar entre 0 e 120',
}

const previewUrl = computed(() => {
  const params = new URLSearchParams()
  if (nome.value) params.set('nome', nome.value)
  if (email.value) params.set('email', email.value)
  if (idade.value !== null && idade.value !== undefined && idade.value !== ('' as unknown)) {
    params.set('idade', String(idade.value))
  }
  const qs = params.toString()
  return 'formAction.html' + (qs ? `?${qs}` : '')
})

export interface Registro {
  id: string
  nome: string
  email: string
  idade: number
  data: string
}

const registros = ref<Registro[]>([])

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    registros.value = raw ? JSON.parse(raw) : []
  } catch {
    registros.value = []
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(registros.value))
}

onMounted(load)
watch(registros, save, { deep: true })

const search = ref('')

const filtered = computed(() => {
  if (!search.value) return registros.value
  const q = search.value.toLowerCase()
  return registros.value.filter(r => `${r.nome} ${r.email}`.toLowerCase().includes(q))
})

const statTotal = computed(() => filtered.value.length)
const statMedia = computed(() => {
  if (!filtered.value.length) return '—'
  const soma = filtered.value.reduce((acc, r) => acc + Number(r.idade || 0), 0)
  return (soma / filtered.value.length).toFixed(1)
})

function submitForm() {
  if (!nome.value || !email.value || idade.value === null) return
  const novo: Registro = {
    id: cryptoRandom(),
    nome: nome.value.trim(),
    email: email.value.trim(),
    idade: Number(idade.value),
    data: new Date().toISOString(),
  }
  registros.value = [...registros.value, novo]
  nome.value = ''
  email.value = ''
  idade.value = null
}

function remover(id: string) {
  registros.value = registros.value.filter(r => r.id !== id)
}

function seed() {
  const now = new Date().toISOString()
  registros.value = registros.value.concat([
    { id: cryptoRandom(), nome: 'Maria Souza', email: 'maria@exemplo.com', idade: 28, data: now },
    { id: cryptoRandom(), nome: 'João Silva', email: 'joao@exemplo.com', idade: 34, data: now },
  ])
}

function limpar() {
  if (confirm('Apagar todos os registros locais?')) {
    registros.value = []
  }
}

function exportJSON() {
  const blob = new Blob([JSON.stringify(registros.value, null, 2)], { type: 'application/json' })
  downloadBlob(blob, 'cadastros.json')
}

function exportCSV() {
  const header = ['id', 'nome', 'email', 'idade', 'data']
  const rows = registros.value.map(r => [r.id, r.nome, r.email, r.idade, r.data])
  const csv = [header, ...rows]
    .map(line => line.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    .join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  downloadBlob(blob, 'cadastros.csv')
}

function downloadBlob(blob: Blob, filename: string) {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = filename
  a.click()
  URL.revokeObjectURL(a.href)
}

function cryptoRandom(): string {
  if (window.crypto?.getRandomValues) {
    const buf = new Uint32Array(2)
    window.crypto.getRandomValues(buf)
    return Array.from(buf).map(n => n.toString(16)).join('')
  }
  return String(Math.random()).slice(2)
}

function formatDate(iso: string) {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const headers = [
  { title: 'Nome', key: 'nome', sortable: true },
  { title: 'E-mail', key: 'email', sortable: true },
  { title: 'Idade', key: 'idade', sortable: true },
  { title: 'Data', key: 'data', sortable: true },
  { title: 'Ações', key: 'actions', sortable: false },
]
</script>

<template>
  <v-row>
    <v-col cols="12" md="10" lg="8">
      <v-card color="secondary">
        <v-card-title class="text-h5 font-weight-bold">Formulário de Captação de Dados</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="8">
              <v-form @submit.prevent="submitForm">
                <v-row dense>
                  <v-col cols="12">
                    <v-text-field
                      v-model="nome"
                      label="Nome"
                      :rules="[rules.required, rules.max80]"
                      counter="80"
                      clearable
                      prepend-inner-icon="mdi-account"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="email"
                      label="E-mail"
                      type="email"
                      :rules="[rules.required, rules.email]"
                      clearable
                      prepend-inner-icon="mdi-email"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model.number="idade"
                      label="Idade"
                      type="number"
                      :rules="[rules.required, rules.idade]"
                      min="0"
                      max="120"
                      clearable
                      prepend-inner-icon="mdi-numeric"
                    />
                  </v-col>
                  <v-col>
                    <v-spacer />
                    <v-btn type="submit" color="primary">Enviar</v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-col>

            <v-col cols="12" md="4">
              <v-sheet border rounded color="secondary" class="pa-3 bg-grey-lighten-5">
                <div class="text-subtitle-1 font-weight-medium">Prévia do Envio</div>
                <div class="text-caption text-medium-emphasis mb-2">URL (GET) gerada automaticamente</div>
                <v-sheet class="pa-3 rounded" border>
                  <code style="white-space: break-spaces; word-break: break-word;">{{ previewUrl }}</code>
                </v-sheet>
                <v-divider class="my-4"/>
                <div class="text-subtitle-2 font-weight-medium mb-2">Dicas</div>
                <ul class="text-body-2 text-medium-emphasis pl-4">
                  <li>Use seu e-mail real pra testes.</li>
                  <li>Idade entre 0 e 120.</li>
                  <li>Os envios ficam salvos localmente.</li>
                </ul>
                <v-chip variant="tonal" class="mt-1">LocalStorage</v-chip>
              </v-sheet>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" md="10" lg="8">
      <v-card elevation="2" color="secondary">
        <v-card-title class="d-flex align-center justify-space-between">
          <div class="text-h6">Registros Locais</div>
          <span class="text-caption text-medium-emphasis">dados salvos no seu navegador</span>
        </v-card-title>

        <v-card-text>
          <div class="d-flex flex-wrap align-center gap-2 mb-4" style="gap: 8px;">
            <v-text-field
              v-model="search"
              placeholder="Buscar por nome ou e-mail..."
              type="search"
              hide-details
              clearable
              prepend-inner-icon="mdi-magnify"
              style="flex:1; min-width: 180px;"
            />

            <v-btn @click="exportJSON">Exportar JSON</v-btn>
            <v-btn @click="exportCSV">Exportar CSV</v-btn>
            <v-btn @click="seed">Adicionar exemplo</v-btn>
            <v-btn color="error" @click="limpar">Limpar lista</v-btn>
          </div>

          <div class="d-flex flex-wrap gap-3 mb-4">
            <v-sheet class="pa-2" border rounded>
              <div class="text-caption text-medium-emphasis">Total</div>
              <div class="text-body-1 font-weight-bold">{{ statTotal }}</div>
            </v-sheet>
            <v-sheet class="pa-2" border rounded>
              <div class="text-caption text-medium-emphasis">Média de idade</div>
              <div class="text-body-1 font-weight-bold">{{ statMedia }}</div>
            </v-sheet>
          </div>

          <v-data-table
            :headers="headers"
            :items="filtered"
            :search="search"
            item-key="id"
            class="rounded"
            density="comfortable"
          >
            <template #item.data="{ item }">
              {{ formatDate(item.data) }}
            </template>

            <template #item.actions="{ item }">
              <v-btn size="small" variant="tonal" @click="remover(item.id)">Remover</v-btn>
            </template>

            <template #no-data>
              <div class="text-body-2 text-medium-emphasis pa-6">Nenhum registro encontrado.</div>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-col>
</v-row>
</template>
