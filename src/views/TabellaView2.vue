<template>
  <div>
    <div v-if="datajson.length > 0">
      <div class="table-style">
        <div class="table-row header">
          <div class="table-cell" v-for="(header, index) in headers" :key="'header-' + index">
            {{ header.text }}
          </div>
        </div>
        <div class="table-row" v-for="(row, rowIndex) in datajson" :key="'row-' + rowIndex">
          <div class="table-cell" v-for="(cell, cellIndex) in row" :key="'cell-' + rowIndex + '-' + cellIndex">
            <input v-model="datajson[rowIndex][cellIndex]" class="cell-input" @input="handleInput" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
html {
  overflow-y: auto !important;
}

.table-style {
  display: table;
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.table-row {
  display: table-row;
}

.table-cell {
  display: table-cell;
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}

.header .table-cell {
  font-weight: bold;
  background-color: #f0f0f0;
}

.cell-input {
  width: 100%;
  border: none;
  background-color: transparent;
  outline: none;
  padding: 6px;
}
</style>

<script>
const XLSX = require('xlsx');

export default {
  data() {
    return {
      datajson: []
    }
  },

  async created() {
    await this.getDati();
    console.log("Dati caricati");
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

    saveData() {
      localStorage.setItem('datajson', JSON.stringify(this.datajson));
      console.log('Data saved to localStorage');
    },

    handleInput() {
      this.debouncedSaveData();
    },

    debounce(func, delay) {
      let timer;
      return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          func.apply(this, args);
        }, delay);
      };
    },
  },

  computed: {
    headers() {
      if (this.datajson.length > 0) {
        return this.datajson[0].map((header, index) => ({ text: `Column ${index + 1}`, value: index }));
      }
      return [];
    }
  },

  mounted() {
    // Initialize debounced save data method
    this.debouncedSaveData = this.debounce(this.saveData, 500);
  },
}
</script>