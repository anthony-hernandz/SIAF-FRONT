<template>
  <v-footer app color="primaryBackground">
    <v-row  justify="center" >

      <v-col class="text-center text-white" cols="12" md="6">
        <p style="font-size: 12px; letter-spacing: 3px;margin: 0;padding: 0;">COPYRIGHT © 2024 | SISTEMA DE ACTIVO FIJO | MINISTERIO DE SALUD DE EL SALVADOR</p>
      </v-col>

    </v-row>
  </v-footer>
</template>

<script setup></script>

<style scoped>
.v-sheet.v-footer:not(.v-sheet--outlined) {
  box-shadow:
    0px 0px 0px 0px rgba(0, 0, 0, 0.2),
    0px 0px 0px 0px rgba(0, 0, 0, 0.14),
    0px 0px 0px 0px rgba(0, 0, 0, 0.12);
  margin-top: 50px !important;
}
.img-render {
  width: 386px !important;
  margin-left: 30px !important;
}

@media only screen and (max-width: 450px) {
  .img-render {
    width: 260px !important;
    margin-left: 16px !important;
  }
}
</style>
