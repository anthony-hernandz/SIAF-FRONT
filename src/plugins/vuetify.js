import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { createVuetify } from 'vuetify'
import { es } from 'vuetify/locale'

const light = {
  dark: false,
  colors: {

    textWhite           : '#ffffff',
    background          : '#ffffff',

    primaryBackground   : '#111E60',
    secondaryBackground : '#6A83BE',
    errorBackground     : '#FCF2F2',
    infoBackground      : '#E5FFFD',
    warningBackground   : '#FFF3C9',
    succesBackground    : '#E5FFE9',

    backgroundLay       : '#F4F7FD',
    backgroundSection   : '#E0E5F1',

    errorMargin         : '#E63946',
    warningMargin       : '#FFDA58',
    successMargin       : '#9AECA4',
    infoMargin          : '#9AE7EC',

    warningT            : '#A99240',
    successT            : '#37AB47',
    infoT               : '#34B1AA',
    errorT              : '#B94A48',
    commonT              : '#333A45'

  }
}

export default createVuetify({
  components: {
    VDateInput,
  },
  locale: {
    locale: 'es',
    messages: { es }
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light
    }
  }
})
