<template>
  <div class="chart-container">
    <apexchart type="bar" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script>
import XlsxPopulate from 'xlsx-populate/browser/xlsx-populate';
import VueApexCharts from 'vue3-apexcharts';

export default {
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      chartOptions: {
        chart: {
          id: 'vuechart-example'
        },
        xaxis: {
          categories: []
        }
      },
      series: [{
        name: 'series-1',
        data: []
      }],
    };
  },
  async created() {
    const response = await fetch('../../public/tabelle/tabelle-dati-meteoclimatici.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    XlsxPopulate.fromDataAsync(arrayBuffer)
      .then(workbook => {
        const sheet = workbook.sheet(0);
        const jsonData = sheet.usedRange().value();
        this.chartOptions.xaxis.categories = jsonData.map(row => row[0]);
        this.series[0].data = jsonData.map(row => row[1]);
      });
  },
};
</script>

<style scoped>
.chart-container {
  max-width: 600px;
  max-height: 400px;
  margin: auto;
}
</style>