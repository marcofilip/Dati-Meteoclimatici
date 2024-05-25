<template>
  <div>
    <v-data-table :headers="headers" :items="datajson" class="elevation-1">
    </v-data-table>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts';
import XLSX from 'xlsx';
export default {
  components: {
    apexchart: VueApexCharts,
  },

  data() {
    return {
      datajson: [],
    }
  },

  async created() {
    await this.getDati()
      .then(() => {
        console.log("Dati caricati");
      })
  },

  methods: {
    async getDati() {
      if (localStorage.getItem('datajson')) {
        this.datajson = this.cleanUpArray(JSON.parse(localStorage.getItem('datajson')));
        console.log("localstorage: ", this.datajson);
      } else {
        await this.ExcelToJson('tabelle/tabelle-dati-meteoclimatici.xlsx');
        this.datajson = this.cleanUpArray(this.datajson);
        console.log("fetch: ", this.datajson);
      }
    },

    cleanUpArray(array) {
      return array.filter(item => !item.every(element => element === "")).slice(1);
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
  },

  computed: {
    headers() {
      if (this.datajson.length > 0) {
        return Object.keys(this.datajson[0]).map(key => ({ text: key, value: key }));
      }
      return [];
    },
  },
}
</script>