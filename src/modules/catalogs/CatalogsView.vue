<template>
  <v-container fluid class="bg-backgroundLay catalogs-container">
    <v-row dense justify="start">
      <v-col
        v-for="option in filteredMenu"
        :key="option.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card
          class="bg-primaryBackground text-textWhite catalogs-card"
          :to="option.uri || '#'"
          elevation="4"
        >
          <v-row align="center" no-gutters>
            <v-col cols="3" class="icon-container">
              <v-icon class="text-textWhite catalogs-icon">{{ option.icon }}</v-icon>
            </v-col>
            <v-col cols="9" class="text-container">
              <span class="catalogs-text">{{ option.name }}</span>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { MENU_OPTIONS } from '@/utils/menuOptions'

const route = useRoute()


const findMenuByUri = (uri, menuItems) => {
  for (const item of menuItems) {
    if (item.uri === uri) return item
    if (item.children) {
      const found = findMenuByUri(uri, item.children)
      if (found) return found
    }
  }
  return null
}

const currentMenu = computed(() => {
  return findMenuByUri(route.path, MENU_OPTIONS)
})

const filteredMenu = computed(() => {
  if (route.path === '/administracion/catalogos') {
    const catalogMenu = findMenuByUri('/administracion/catalogos', MENU_OPTIONS)
    return catalogMenu ? catalogMenu.children : []
  }
  return currentMenu.value && currentMenu.value.children
    ? currentMenu.value.children
    : MENU_OPTIONS
})
</script>


<style>
  .catalogs-container {
    padding: 30px;
    margin-top: -30px;
    height: 820px;
  }

  .catalogs-card {
    padding: 32px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    transition: all 0.3s ease-in-out;
    cursor: pointer;
  }

  .catalogs-card:hover {
    background: #E0E5F1 !important;
    border: 2px solid #6A83BE !important;
    color: #111E60 !important;
  }

  .catalogs-icon {
    font-size: 42px !important;
  }

  .catalogs-card:hover .catalogs-icon {
    color: #111E60 !important;
  }

  .catalogs-card:hover .text-container {
    color: #111E60 !important;
  }

  .text-container {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.5rem !important;
    text-transform: uppercase;
    width: 200px;
    height: 50px;
  }
</style>
