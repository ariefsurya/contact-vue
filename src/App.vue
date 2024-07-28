<!-- src/App.vue -->
<template>
  <v-app>
    <Sidebar></Sidebar>
    <v-main class="pt-2">
      <RouterView />
    </v-main>
  </v-app>
</template>

<script>
import Sidebar from "Views/Sidebar/Sidebar.vue";

export default {
  components: {
    Sidebar
  }
}
</script>
