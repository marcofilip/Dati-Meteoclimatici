<template>
  <div>
    <v-data-table :headers="headers" :items="datajson" class="elevation-1">
    </v-data-table>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts';
const XLSX = require('xlsx');
export default {
  components: {
    apexchart: VueApexCharts,
  },

  data() {
    return {
      datajson: [],
    }
  },

  created() {
    
  },

  methods: {
    
  },

  computed: {
    
  },
}
</script>