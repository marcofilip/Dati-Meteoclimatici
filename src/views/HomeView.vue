<template>

  <div class="chart-container">
    <v-card class="vcard">
      <v-card-title>
        Seleziona il comune.
      </v-card-title>
      <v-card-item>
        <v-combobox clearable label="Combobox" :items="comuni"></v-combobox>
      </v-card-item>
    </v-card>
    <div>
      <div>
        <h1>Temperatura</h1>
        <apexchart type="line" :options="chartOptionsTemperatura" :series="seriesTemperatura"></apexchart>
      </div>
      <div>
        <h1>Precipitazioni</h1>
        <apexchart type="line" :options="chartOptionsPrecipitazioni" :series="seriesPrecipitazioni"></apexchart>
      </div>
    </div>


  </div>
</template>

<style scoped>
.vcard {
  margin: 10px auto 20px;
  justify-content: center;
  align-items: center;
  width: 300px;
}
</style>

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
          id: 'Dati Meteoclimatici',
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
          id: 'Dati Meteoclimatici',
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
      comuni: [],
    };
  },
  async created() {
    this.ExcelToJson('tabelle/tabelle-dati-meteoclimatici.xls')
      .then(() => {
        this.GetComuni();
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
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          defval: "",
          header: 1
        });

        this.datajson = jsonData;
        console.log(this.datajson);
      } catch (error) {
        console.error('Error loading the Excel file:', error);
      }
    },

    LoadGraph() {
      const cate_temperature = [];
      const cate_precipitazioni = [];

      let j;
      for (let i = 1; i < this.datajson[2].length; i++) {
        if (this.datajson[2][i] == "") {
          j = i + 1;
          break;
        }
        cate_temperature.push(this.datajson[2][i]);
      }
      for (let i = j; i < this.datajson[2].length; i++) {
        if (this.datajson[i] == "")
          break;
        cate_precipitazioni.push(this.datajson[2][i]);
      }

      this.updateCategories(cate_temperature, cate_precipitazioni);

      console.log("Categorie Temperature: ", this.chartOptionsTemperatura.xaxis.categories);
      console.log("Categorie Precipitazioni: ", this.chartOptionsPrecipitazioni.xaxis.categories);
    },

    GetComuni() {
      for (let i = 3; i < this.datajson.length; i++) {
        this.comuni.push(this.datajson[i][0]);
      }
      console.log("Comuni: ", this.comuni);
    },

    updateCategories(cate_temperature, cate_precipitazioni) {
      this.chartOptionsTemperatura.xaxis = {
        categories: cate_temperature
      }
      this.chartOptionsPrecipitazioni.xaxis = {
        categories: cate_precipitazioni
      }
    }
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
