<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <v-footer app elevation="2">
    <v-container class="text-center">
      © {{ year }} Desenvolvimento da Página Web
    </v-container>
  </v-footer>
</template>
