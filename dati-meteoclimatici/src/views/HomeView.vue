<template>
  <div class="chart-container">
    <apexchart type="line" :options="chartOptionsTemperatura" :series="seriesTemperatura"></apexchart>
    <h1>------</h1>
    <apexchart type="line" :options="chartOptionsPrecipitazioni" :series="seriesPrecipitazioni"></apexchart>
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
      chartOptionsTemperatura: {
        chart: {
          id: 'Dati Meteoclimatici'
        },
        xaxis: {
          categories: []
        }
      },
      seriesTemperatura: [{
        name: 'Serie',
        data: []
      }],

      chartOptionsPrecipitazioni: {
        chart: {
          id: 'Dati Meteoclimatici'
        },
        xaxis: {
          categories: []
        }
      },
      seriesPrecipitazioni: [{
        name: 'Serie',
        data: []
      }],

      datajson: [],
    };
  },
  async created() {
    this.ExcelToJson('tabelle/tabelle-dati-meteoclimatici.xlsx')
      .then(() => {
        this.LoadGraph();
      });
  },

  methods: {
    async ExcelToJson(url) {
      try {
        const response = await fetch(url);
        const data = await response.arrayBuffer();
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        this.datajson = jsonData;
        console.log(this.datajson);
      } catch (error) {
        console.error('Error loading the Excel file:', error);
      }
    },

    LoadGraph() {
      const temperature = [];
      const precipitazioni = [];
      let temperatura, precipitazione;

      for (let i = 0; i < 16; i++) {

        if (i === 0) {
          temperatura = this.datajson[1][`__EMPTY`];
        }
        else {
          temperatura = this.datajson[1][`__EMPTY_${i}`];
        }

        temperature.push(temperatura);
      }
      for (let i = 17; i < 33; i++) {

        if (i === 0) {
          precipitazione = this.datajson[1][`__EMPTY`];
        }
        else {
          precipitazione = this.datajson[1][`__EMPTY_${i}`];
        }

        precipitazioni.push(precipitazione);
      }

      this.chartOptionsTemperatura.xaxis.categories = temperature;
      this.chartOptionsPrecipitazioni.xaxis.categories = precipitazioni;

      console.log("Categorie Temperature: ", this.chartOptionsTemperatura.xaxis.categories);
      console.log("Categorie Precipitazioni: ", this.chartOptionsPrecipitazioni.xaxis.categories);
    },
  }
};
</script>

<style scoped>
.chart-container {
  max-width: 600px;
  max-height: 400px;
  margin: auto;
}
</style>