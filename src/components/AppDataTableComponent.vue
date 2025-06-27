<script setup>
import { computed } from 'vue'
import { useDisplay } from 'vuetify';

const props = defineProps({
  headers: {
    type: Array,
    required: true
  },
  customHeader:{
    type: Boolean,
    default:false
  },
  items: {
    type: Array,
    required: true
  },
  totalItems: {
    type: Number,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  itemsPerPage: {
    type: Number,
    default: 2
  },
  page: {
    type: Number,
    default: 1
  },
  correlativo: {
    type: Boolean,
    default: true
  }
})

const { smAndDown } = useDisplay();

const emits = defineEmits(['changePage'])

const page = computed({
  get: () => props.page,
  set: (value) => emits('changePage', value)
})

const headersFormatted = computed(() => {
  const headers = [];
  if(!Array.isArray(props.headers)) return headers
  if(props.correlativo) {
    headers.push({
      title: 'Correlativo',
      value: 'correlativo',
      align: 'center',
      sortable: false
    })
  }
  headers.push(...props.headers)
  return headers
})

const itemsFormatted = computed(() => {
  if(!Array.isArray(props.items)) return []
  return props.items.map((item, index) => {
    if (props.correlativo) {
      item.correlativo = props.items.length < 999
      ? String(props.page * props.itemsPerPage - props.itemsPerPage + (index + 1)).padStart(3, '0')
      : props.page * props.itemsPerPage - props.itemsPerPage + (index + 1)
    }
    return item
  })
})

</script>

<template>
  <v-data-table-server
    class="dataTableVW"
    :headers="headersFormatted"
    :loading="props.loading"
    :items-per-page="props.itemsPerPage"
    :items="itemsFormatted"
    :items-length="props.totalItems"
    loading-text="Cargando... por favor espere"
    no-data-text="No hay datos disponibles"
    :hide-default-header="smAndDown"
    :mobile="smAndDown"
    hide-default-footer
    :class="customHeader ? 'customizedHeader':''"
  >
    <!-- Slot correlativo -->
    <template #correlativo="{ index }">
      <span>{{ index }}</span>
    </template>

    <template v-for="header in props.headers" #[`item.${header.value}`]="{ index, item }">
      <slot :name="header.value" v-bind="{ index, item }">
        {{ item[header.value] }}
      </slot>
    </template>
  </v-data-table-server>

  <v-row>
    <v-col cols="12" class="text-center my-4">
      <v-pagination
        v-model="page"
        color="#1d1e4c"
        :total-visible="7"
        :items-per-page="props.itemsPerPage"
        :length="Math.ceil(props.totalItems / props.itemsPerPage)"
        variant="text"
        density="comfortable"
      ></v-pagination>
    </v-col>
  </v-row>
</template>

<style scoped>
.dataTableVW {
  width: 100vw !important;
  border-radius: 5px;
  border: 1px solid silver;
}
:deep(.v-data-table__thead) {
  background: #111E60 !important;
  color: #ffffff !important;
}
:deep(v-data-table-header__content):hover{
  color: #ffffff !important
}
span:hover{
  color:#ffffff !important
}
:deep(tbody tr:nth-of-type(odd)) {
  background-color: rgba(237, 237, 241, 8) !important;
}

:deep(.v-data-table-header__content) {
  font-weight: bold;
  font-size: 15px;
  border: none;
}

:deep(tr > td) {
  border: none !important;
}

:deep(.v-pagination__item.v-pagination__item--is-active .v-btn) {
  color: #ffffff !important;
  background-color: #1d1e4c;
}

:deep( th){
 color:white !important;
  font-size: 20px !important;
}

</style>
