<template>
  <v-app>
    <Header />

    <v-main>
      <v-container fluid class="py-8">
        <router-view />
      </v-container>
    </v-main>

    <Footer />
  </v-app>
</template>

<script setup lang="ts">
import Footer from "./components/Footer.vue";
import Header from "./components/Header.vue";
</script>
