<template>
  <div>
    <v-card class="vcard">
      <v-card-title>
        <h1 class="titolo">Grafico Dati Meteoclimatici</h1>
      </v-card-title>
      <div style="display: flex; align-items: center; width: 500px; margin: auto; margin-top: 20px">
        <h3 style="margin-right: 20px; width: 40%">
          Seleziona il comune.
        </h3>

        <v-combobox clearable chips label="Combobox" v-model="selectedComune" :items="comuni"
          style="width: 60%"></v-combobox>

      </div>
      <v-card-item>
        <div style="display: flex; justify-content: space-between">
          <div style="flex: 1;">
            <h1>Temperatura</h1>
            <apexchart type="line" :options="chartOptionsTemperatura" :series="seriesTemperatura"></apexchart>
          </div>
          <div style="flex: 1;">
            <h1>Precipitazioni</h1>
            <apexchart type="line" :options="chartOptionsPrecipitazioni" :series="seriesPrecipitazioni"></apexchart>
          </div>
        </div>
      </v-card-item>
    </v-card>
  </div>
</template>

<style scoped>
.vcard {
  margin: 100px;
  margin-top: 10px;
  justify-content: center;
  align-items: center;
}

.combobox {
  width: 600px;
}

.titolo {
  border: 5px solid #303030;
  background-color: #2c2c2c;
  border-radius: 20px;
  width: fit-content;
  padding-left: 20px;
  padding-right: 20px;
  margin: auto;
  margin-top: 10px;
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
          toolbar: {
            show: true,
            tools: {
              download: true,
              selection: true,
              zoom: true,
              zoomin: true,
              zoomout: true,
              pan: true,
              reset: true,
            },
            autoSelected: 'zoom'
          },
        },
        xaxis: {
          categories: [2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021]
        }
      },
      seriesTemperatura: [{
        name: 'Serie',
        data: []
      }],

      chartOptionsPrecipitazioni: {
        chart: {
          id: 'Dati Meteoclimatici',
          toolbar: {
            show: true,
            tools: {
              download: true,
              selection: true,
              zoom: true,
              zoomin: true,
              zoomout: true,
              pan: true,
              reset: true
            },
            autoSelected: 'zoom'
          },
        },
        xaxis: {
          categories: [2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021]
        }
      },
      seriesPrecipitazioni: [{
        name: 'Serie',
        data: []
      }],


      datajson: [],
      comuni: [],
      selectedComune: null,
    };
  },

  async created() {
    await this.getDati()
      .then(() => {
        console.log(this.datajson);
        this.GetComuni();
        this.LoadGraph();
      });
  },

  watch: {
    selectedComune(newComune) {
      this.loadDataForComune(newComune);
    },
  },

  methods: {

    async getDati() {
      if (localStorage.getItem('datajson')) {
        console.log("localstorage");
        this.datajson = JSON.parse(localStorage.getItem('datajson'));
      } else {
        console.log("fetch");
        await this.ExcelToJson('tabelle/tabelle-dati-meteoclimatici.xlsx');
      }
    },

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
        localStorage.setItem('datajson', JSON.stringify(this.datajson));
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
        if (this.datajson[2][i] == "")
          break;
        cate_precipitazioni.push(this.datajson[2][i]);
      }

      console.log("Categorie Temperature: ", this.chartOptionsTemperatura.xaxis.categories);
      console.log("Categorie Precipitazioni: ", this.chartOptionsPrecipitazioni.xaxis.categories);
    },

    GetComuni() {
      for (let i = 3; i < this.datajson.length; i++) {
        if (this.datajson[i][0] != "")
          this.comuni.push(this.datajson[i][0]);
      }
      this.comuni.sort();
      this.selectedComune = this.comuni[0];
      console.log("Comuni: ", this.comuni);
    },

    loadDataForComune(comune) {
      const temperature = [];
      const precipitazioni = [];

      for (let i = 3; i < this.datajson.length; i++) {
        if (this.datajson[i][0] == comune) {
          for (let j = 1; j < this.datajson[i].length; j++) {
            if (this.datajson[i][j] == 0)
              break;

            if (this.datajson[i][j] == "....")
              temperature.push(this.datajson[i][j - 1]);
            else
              temperature.push(this.datajson[i][j]);
          }
          i++;
          for (let j = 1; j < this.datajson[i].length; j++) {
            if (this.datajson[i][j] == 0)
              break;
            if (this.datajson[i][j] == "....")
              precipitazioni.push(this.datajson[i][j - 1]);
            else
              precipitazioni.push(this.datajson[i][j]);
          }
          break;
        }
      }

      console.log("Comune: ", comune);
      console.log("Temperature: ", temperature);
      console.log("Precipitazioni: ", precipitazioni);


      this.seriesTemperatura = [{
        name: 'Temperatura',
        data: temperature
      }];
      this.seriesPrecipitazioni = [{
        name: 'Precipitazioni',
        data: precipitazioni
      }];
    },
  }
};
</script>