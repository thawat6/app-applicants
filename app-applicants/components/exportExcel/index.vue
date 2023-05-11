<template>
  <!-- <v-btn color="#195E01" dark @click="onExport" class="text-right" style=" border-radius: 3px; max-height: 30px;"> -->
  <v-btn :disabled="json <= 0" @click="onExport" color="#000000" class="mr-3">
    <v-icon>mdi-microsoft-excel</v-icon>
    <span style="font-size: 20px">Export to Excel</span>
  </v-btn>
</template>

<script>
import * as XLSX from "xlsx";
export default {
  props: {
    json: Array,
  },
  methods: {
    async onExport() {
      const dataWS = XLSX.utils.json_to_sheet(this.json);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, dataWS);
      XLSX.writeFile(wb, "export.xlsx");
    },
  },
};
</script>