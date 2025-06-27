<template>
  <div>
    <v-row justify="center">
      <v-col cols="12" xl="12" lg="11" sm="12" md="12" xs="12"  class="text-center">
        <div class="bg-secondaryBackground py-2" style="border-radius: 7px;border: 1px solid #111E60;">
            <p>Registrar</p>
        </div>
      </v-col>
      <v-col cols="12" xl="12" lg="11" sm="12" md="12" xs="12">
        <slot name="myCatalog"></slot>
      </v-col>
      <v-col cols="6" class="text-center">
        <v-btn color="primaryBackground">Agregar</v-btn>
      </v-col>
    </v-row>
  </div>
</template>
  <script setup>
import { ref, computed } from 'vue'
import useDashboardStore from '@/store/dashboard'
import { useDisplay } from 'vuetify'

const dashboard = useDashboardStore()
const display = useDisplay()

const emit = defineEmits(['CloseBar'])

const open = ref([])

const width = computed(() => {
  if (display.xs.value) {
    return display.width.value
  }
  return '300'
})

const showClose = computed(() => {
  return display.xs.value
})

const onCloseBar = () => {
  emit('CloseBar')
}

// const closeAll = () => {
//   open.value = []
// }

// defineExpose({
//   closeAll
// })
</script>
  
  <style scoped>
.v-navigation-drawer {
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
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
</style>
  