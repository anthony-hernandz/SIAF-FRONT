<script setup>
import { ref, computed } from 'vue'
import useAuth from '@/modules/auth/composables/useAuth';
import useAuthStore from '@/store/auth';
import { MENU_OPTIONS } from '@/utils/menuOptions';
import { useRoute } from 'vue-router';
const auth = useAuthStore()
const menu = ref(false)
const route = useRoute()

const emits = defineEmits(['open', 'openCambiarContraseña'])
const { logout } = useAuth()

const open = () => {
  emits('open')
}

const items = [
  { title: 'Cambiar contraseña', click: () => {
    emits('openCambiarContraseña')
  } },
  { title: 'Cerrar sesión', click: async () => {
    await logout();
  } },
];

// Realiza la busqueda en el menu de la ruta actual y devuelve los nombres de cada vista
function findMenuPath(menuList, path, parents = []) {
  for (const menu of menuList) {
    // Si encontramos la ruta, devolvemos todos los nombres
    if (menu.uri === path) {
      return [...parents, menu.name]
    }
    // Si hay rutas mas rutas que solo padre, buscamos recursivamente
    if (menu.children) {
      const result = findMenuPath(menu.children, path, [...parents, menu.name])
      if (result) return result
    }
  }
  return null
}

// Devuelve el nombre que se mostrara segun la ruta
const currentMenuName = computed(() => {
  const pathNames = findMenuPath(MENU_OPTIONS, route.path)
  // Si no se encuentra alguna coincidencia se muestra BIENVENIDO
  if (!pathNames) return 'BIENVENIDO'

  const len = pathNames.length
  // Muestra solo un nivel (padre), ejemplo: 'ADMINISTRACION'
  if (len === 1) {
    return pathNames[0]
  } else if (len === 2) {
    // Muestra solo un nivel (hijo), ejemplo: 'USUARIOS'
    return pathNames[1]
  } else {
    // Muestra dos niveles (hijo -> nieto), ejemplo: 'USUARIOS - REGISTRO DE USUARIOS'
    return pathNames.slice(-2).join(' - ')
  }
})

</script>

<template>
  <v-menu max-width="200" v-model="menu">
    <template v-slot:activator="{ props }">
      <div class="bg-backgroundLay text-commonT activator-container">
        <div class="section-container">
          <span class=" text-commonT section-name">{{ currentMenuName }}</span>
        </div>

        <div class="info-container">
          <span class=" text-commonT info-name">{{ auth.user.nombres ?? "Nombres" }} {{ auth.user.apellidos ?? "Apellidos" }}</span>
          <span class=" text-commonT info-position">
            {{ auth.establecimiento?.nombre ?? "Seleccione" }}
          </span>
        </div>

        <div class="icon-container">
          <v-btn icon="" class="bg-backgroundSection icon-btn" @click="open">
            <v-icon size="30" class="icon-color">mdi-home-city-outline</v-icon>
          </v-btn>

          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon=""
                class="bg-backgroundSection icon-btn"
              >
                <v-icon size="30" class="text-commonT icon-color">mdi-account-circle-outline</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item
                v-for="(item, index) in items"
                :key="index"
                :value="index"
              >
                <v-btn @click="item.click">{{ item.title }} </v-btn>

              </v-list-item>
            </v-list>
          </v-menu>

        </div>

      </div>
    </template>
  </v-menu>
</template>

<style scoped>

.activator-container {
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  flex-wrap: wrap;
  gap: 10px;
}

.section-container {
  flex: 1;
  min-width: 250px;
  text-align: left;
}

.section-name {
  font-weight: bold;
  font-size: 1em;
  text-transform: uppercase;
}

.info-container {
  flex: 2;
  min-width: 250px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.info-name {
  font-size: 1em;
}

.info-position {
  font-size: 0.85em;
  margin-top: 2px;
}


.icon-container {
  display: flex;
  gap: 10px;
  flex: 1;
  justify-content: flex-end;
}

.icon-btn {
  border-radius: 50%;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
}


/* 📌 RESPONSIVE DESIGN 📌 */
@media (max-width: 1024px) {
  .activator-container {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 15px;
  }

  .section-container {
    text-align: center;
    min-width: 100%;
  }

  .info-container {
    min-width: 100%;
  }

  .icon-container {
    justify-content: center;
    min-width: 100%;
    margin-top: 10px;
  }

  .icon-btn {
    width: 40px;
    height: 40px;
  }

  .info-name, .info-position {
    font-size: 0.9em;
  }
}

@media (max-width: 600px) {
  .section-name {
    font-size: 0.9em;
  }

  .info-name {
    font-size: 0.85em;
  }

  .info-position {
    font-size: 0.8em;
  }

  .icon-btn {
    width: 35px;
    height: 35px;
  }
}


</style>
