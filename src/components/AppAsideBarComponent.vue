<template>
  <v-navigation-drawer
    color="primaryBackground"
    app
    v-model="drawer"
    :width="width"
    mini-variant-width="75"
    permanent
    class="overflow-y-auto"
  >

    <v-list-item class="header-container">
      <v-app-bar-nav-icon @click="toggleSidebar" class="hamburger-icon" />
      <v-col v-if="sideBar" cols="10">
        <v-img
          src="@/assets/img/logo_white.png"
          class="custom-logo"
          contain
        />
      </v-col>
    </v-list-item>

    <v-list v-model:opened="open" class="menu-content">
      <span v-for="(route, i) in menuItems" :key="route.id">
        <v-list-group
          v-if="route.children && route.children.length"
          :key="route.id"
          :value="route.name"
          link
          active-class="white--text"
        >
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" :title="route.name">
              <template #prepend>
                <v-icon class="menu-icon">{{ route.icon }}</v-icon>
              </template>
            </v-list-item>
          </template>

          <v-list-item
            v-for="(child, j) in route.children"
            :key="child.id"
            :to="child.uri"
            class="ml-4"
            active-class="white--text text--lighten-1"
          >
            <template #prepend>
              <v-icon>{{ child.icon }}</v-icon>
            </template>
            <v-list-item-title class="text-wrap white--text">{{ child.name }}</v-list-item-title>
          </v-list-item>
        </v-list-group>

        <v-list-item
          v-else
          :to="route.uri"
          link
          active-class="white--text text--lighten-1"
          exact
          :value="route.name"
        >
          <template #prepend>
            <v-icon>{{ route.icon }}</v-icon>
          </template>
          <v-list-item-title>{{ route.name }}</v-list-item-title>
        </v-list-item>
      </span>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import useDashboardStore from '@/store/dashboard'
import { useDisplay } from 'vuetify'
import { MENU_OPTIONS } from '@/utils/menuOptions'

const dashboard = useDashboardStore()
const display = useDisplay()

const drawer = ref(false)
const open = ref([])
const sideBar = computed(() => drawer.value)

const menuItems = computed(() => {
  return [...dashboard.menu]
})

const width = computed(() => (display.xs.value ? display.width.value : sideBar.value ? 300 : 75))

const toggleSidebar = () => {
  drawer.value = !drawer.value
}

onMounted(async () => {
  await dashboard.getRoutes()
})

watch(open, (newVal) => {
  if (newVal.length > 0 && !sideBar.value) {
    drawer.value = true
    setTimeout(() => {
      open.value = newVal
    }, 3000)
  }
})

watch(sideBar, (newVal) => {
  if (!newVal) {
    open.value = []
  }
})
</script>



<style scoped>
.v-navigation-drawer {
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  transition: width 0.3s ease-in-out;
}

.v-list-group.v-list-group--prepend {
  --parent-padding: calc(var(--indent-padding)) !important;
}

.v-list-group--prepend {
  padding-left: 0px !important;
}

.v-list-item {
  display: grid;
  grid-template-columns: 34px auto 56px;
}

.v-navigation-drawer__content {
  overflow-y: hidden !important;
}

.v-navigation-drawer__content:hover {
  overflow-y: scroll !important;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  position: relative;
}

.hamburger-icon {
  color: white;
  font-size: 22px;
  position: relative;
  z-index: 2;
}

.custom-logo {
  height: 20px;
  position: absolute;
  right: 16px;
}

.menu-icon {
  color: white !important;
  font-size: 22px !important;
}


.menu-content {
  margin-top: 10px;
  margin-left: 8px;
}

</style>
