<script setup lang="ts">
import { onMounted, ref } from 'vue'

const loading = ref(true)
const dados = ref<{ nome?: string; email?: string; idade?: string }>({})

onMounted(() => {
  const p = new URLSearchParams(window.location.search)
  dados.value = { nome: p.get('nome') ?? '', email: p.get('email') ?? '', idade: p.get('idade') ?? '' }
  setTimeout(() => (loading.value = false), 400)
})
</script>

<template>
  <v-card elevation="3" class="pa-4 mx-auto" max-width="520">
    <template v-if="loading">
      <div class="text-center my-8">
        <v-progress-circular indeterminate color="primary" :size="36" :width="4" />
      </div>
    </template>

    <template v-else>
      <h2 class="text-h5 mb-4">Resultado do Formulário</h2>
      <v-list lines="one">
        <v-list-item title="Nome" :subtitle="dados.nome" prepend-icon="mdi-account" />
        <v-list-item title="E-mail" :subtitle="dados.email" prepend-icon="mdi-email" />
        <v-list-item title="Idade" :subtitle="dados.idade" prepend-icon="mdi-numeric" />
      </v-list>
    </template>
  </v-card>
</template>
