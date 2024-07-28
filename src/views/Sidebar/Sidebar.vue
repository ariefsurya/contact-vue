<template>
  <div>
    <div class="hide-on-mobile">
      <v-app-bar-title class="bg-primary header">My Contact</v-app-bar-title>
      <v-navigation-drawer>
        <v-list-item class="text-center">
          <span class="fs-3 fw-semi-bold">My Contacts</span>
        </v-list-item>

        <v-divider></v-divider>

        <v-list>
          <v-list-item to="/" icon>
            <template v-slot:prepend>
              <v-icon icon="mdi-home"></v-icon>
            </template>
            <v-list-item-title >Home</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </div>
    
    <div class="w-100 show-on-mobile">
      <v-app-bar :elevation="2">
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-app-bar-title>My Contact</v-app-bar-title>
      <v-spacer></v-spacer>

      <template v-if="!$vuetify.display.mdAndUp">
          <v-btn icon="mdi-dots-vertical" variant="text"></v-btn>
      </template>
      </v-app-bar>
      
      <v-navigation-drawer
          v-model="drawer"
          temporary
      >
        <v-list-item to="/" prepend-icon="mdi-view-dashboard" title="Home" value="home"></v-list-item>
      </v-navigation-drawer>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    drawer: false,
  }),
}
</script>
