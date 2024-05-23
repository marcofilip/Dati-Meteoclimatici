<template>

  <div class="chart-container">
    <h1>Temperatura</h1>
    <div id="chart_temperature"></div>
    <h1>Precipitazioni</h1>
    <div id="chart_precipitazioni"></div>
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
          categories: [69, 420]
        }
      },
      seriesTemperatura: [{
        name: 'Serie',
        data: [69, 420]
      }],

      chartOptionsPrecipitazioni: {
        chart: {
          id: 'Dati Meteoclimatici'
        },
        xaxis: {
          categories: [69, 420]
        }
      },
      seriesPrecipitazioni: [{
        name: 'Serie',
        data: [69, 420]
      }],

      chart_temperature: null,
      chart_precipitazioni: null,
      datajson: [],
    };
  },
  async created() {
    this.ExcelToJson('tabelle/tabelle-dati-meteoclimatici.xlsx')
      .then(() => {
        this.LoadGraph();
        this.chartOptionsTemperatura.xaxis[{
          categories: ["Hey", "Hey", 12]
        }]
      });


    var options_temperature = {
      chart: {
        type: 'temperature'
      },
      series: [{
        name: 'sales',
        data: []
      }],
      xaxis: {
        categories: []
      }
    }

    chart_temperature = new ApexCharts(document.querySelector("#chart_temperature"), options_temperature);

    chart_temperature.render();

    var options_precipitazioni = {
      chart: {
        type: 'precipitazioni'
      },
      series: [{
        name: 'sales',
        data: []
      }],
      xaxis: {
        categories: []
      }
    }

    chart_precipitazioni = new ApexCharts(document.querySelector("#chart_precipitazioni"), options_precipitazioni);

    chart_precipitazioni.render();
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

        if (i === 17) {
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
