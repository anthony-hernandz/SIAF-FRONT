<script setup>
import { ref } from 'vue'
import useAuth from '@/modules/auth/composables/useAuth';
const menu = ref(false)

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

</script>

<template>
  <v-menu max-width="200" v-model="menu">
    <template v-slot:activator="{ props }">
      <div class="bg-backgroundLay text-commonT activator-container">
        <div class="section-container">
          <span class=" text-commonT section-name">CATÁLOGOS - ESTADO FÍSICO DEL ACTIVO</span>
        </div>

        <div class="info-container">
          <span class=" text-commonT info-name">VALENTINA VILLAVICENCIO</span>
          <span class=" text-commonT info-position">
            Hospital Nacional Santa Ana SA 'San Juan de Dios'
          </span>
        </div>

        <div class="icon-container">
          <v-btn icon="" class="bg-backgroundSection icon-btn" @click="open">
            <v-icon size="30" class="icon-color">mdi-home-city-outline</v-icon>
          </v-btn>

          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn
                color="primary"
                v-bind="props"
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
