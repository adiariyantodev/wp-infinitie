const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      display: String,
      name: String,
      block: Object,
      contextualData: Object,
    },

    data: function () {
      return {
        loading: true,
        rendered: true,
        error: false,
        apiLoaded: false,
        errorMessage: '',
        total: 0,
        comparisonTotal: 0,
        percentChange: 0,
        fetchingQuery: false,
        requestFromGroupDate: false,
        currentRequest: false,
        chartData: {
          data: {
            main: [],
            comparison: [],
          },
          labels: {
            main: [],
            comparisons: [],
          },
          title: '',
          colors: {
            main: this.returnLineColor,
            comp: this.returnCompLineColor,
          },
        },
        strings: {
          lastPeriod: __('last period', 'uipress-pro'),
          selectDataMetric: __("Please select a chart metric in this block's options to show chart data.", 'uipress-pro'),
          changeAccount: __('Switch account', 'uipress-pro'),
        },
      };
    },
    inject: ['uipData', 'uipress', 'uiTemplate'],
    watch: {
      'block.settings.block.options.chartDataType': {
        handler(newValue, oldvalue) {
          if (this.currentRequest) {
            this.processResponse();
          }
        },
      },
      'contextualData.groupDate': {
        handler(newValue, oldValue) {
          this.getAnalytics();
        },
        deep: true,
      },
      'uiTemplate.wooComnmerce.ready': {
        handler(newValue, oldValue) {
          this.getAnalytics();
        },
        deep: true,
      },
    },
    mounted: function () {
      this.getAnalytics();
    },
    computed: {
      returnChartSettings() {
        let chartSettings = this.uipress.get_block_option(this.block, 'block', 'chartOptions');
        return chartSettings;
      },
      chartDimensions() {
        let self = this;
        this.rendered = false;

        let width = this.uipress.checkNestedValue(this.block, ['settings', 'chartCanvas', 'options', 'dimensions', 'value', 'width', 'value']);
        let widthUnits = this.uipress.checkNestedValue(this.block, ['settings', 'chartCanvas', 'options', 'dimensions', 'value', 'width', 'units']);
        let height = this.uipress.checkNestedValue(this.block, ['settings', 'chartCanvas', 'options', 'dimensions', 'value', 'height', 'value']);
        let heightUnits = this.uipress.checkNestedValue(this.block, ['settings', 'chartCanvas', 'options', 'dimensions', 'value', 'height', 'units']);

        requestAnimationFrame(function () {
          self.rendered = true;
        });

        if (!width && !height) return;

        return `width:${width}${widthUnits};height:${height}${heightUnits};`;
      },
      returnTotal() {
        let self = this;

        if (self.returnChartType == 'total_revenue') {
          if (self.currentRequest.currency_pos == 'left') {
            return self.currentRequest.currency + self.total;
          }
          if (self.currentRequest.currency_pos == 'left_space') {
            return self.currentRequest.currency + ' ' + self.total;
          }
          if (self.currentRequest.currency_pos == 'right') {
            return self.total + self.currentRequest.currency;
          }
          if (self.currentRequest.currency_pos == 'right_space') {
            return self.total + ' ' + self.currentRequest.currency;
          }
        }
        return self.total;
      },
      returnComparisonTotal() {
        return this.comparisonTotal;
      },
      returnChartData() {
        return this.chartData;
      },
      returnName() {
        let chartname = this.uipress.get_block_option(this.block, 'block', 'chartName', true);
        if (!chartname) {
          return '';
        }
        if (this.uipress.isObject(chartname)) {
          if ('string' in chartname) {
            return chartname.string;
          }
        } else {
          return chartname;
        }
      },
      returnChartType() {
        let chartDataType = this.uipress.get_block_option(this.block, 'block', 'chartDataType');
        return chartDataType;
      },
      returnChartStyle() {
        let chartDataType = this.uipress.get_block_option(this.block, 'block', 'chartStyle');
        if ('value' in chartDataType) {
          if (chartDataType.value != '') {
            return chartDataType.value;
          }
        }
        return 'line';
      },
      returnLineColor() {
        let chartDataType = this.uipress.get_block_option(this.block, 'block', 'chartColour');
        if (!this.uipress.isObject(chartDataType)) {
          return chartDataType;
        }
        if ('value' in chartDataType) {
          if (chartDataType.value != '') {
            return chartDataType.value;
          }
        }
        return chartDataType;
      },
      returnCompLineColor() {
        let chartDataType = this.uipress.get_block_option(this.block, 'block', 'chartCompColour');
        if (!this.uipress.isObject(chartDataType)) {
          return chartDataType;
        }
        if ('value' in chartDataType) {
          if (chartDataType.value != '') {
            return chartDataType.value;
          }
        }
        return chartDataType;
      },
      hideChart() {
        let hideChart = this.uipress.get_block_option(this.block, 'block', 'hideChart');
        if (!this.uipress.isObject(hideChart)) {
          return hideChart;
        }
        if ('value' in hideChart) {
          if (hideChart.value != '') {
            return hideChart.value;
          }
        }
        return false;
      },
      inlineAccountSwitch() {
        let hideChart = this.uipress.get_block_option(this.block, 'block', 'inlineAccountSwitch');
        if (!this.uipress.isObject(hideChart)) {
          return hideChart;
        }
        if ('value' in hideChart) {
          if (hideChart.value != '') {
            return hideChart.value;
          }
        }
        return false;
      },
      returnRange() {
        let range = this.uipress.get_block_option(this.block, 'block', 'dateRange');
        if (range) {
          if (isNaN(range)) {
            return 14;
          }
          if (range > 60) {
            return 60;
          }
          return range;
        } else {
          return 14;
        }
      },
      hasGlobalDate() {
        if (typeof this.contextualData === 'undefined') {
          return false;
        }
        if (!this.uipress.isObject(this.contextualData)) {
          return false;
        }
        if (!('groupDate' in this.contextualData)) {
          return false;
        }
        if (!('start' in this.contextualData.groupDate)) {
          return false;
        }
        if (!('end' in this.contextualData.groupDate)) {
          return false;
        }
        return true;
      },
    },
    methods: {
      getAnalytics() {
        let self = this;
        //Reset Vars
        self.loading = true;
        self.error = false;
        self.errorMessage = '';

        //Api is not ready yet. We will catch with attached watch
        if (!self.uipress.isObject(self.uiTemplate.wooComnmerce)) {
          self.apiLoaded = false;
          return;
        }
        if (!('ready' in self.uiTemplate.wooComnmerce)) {
          self.apiLoaded = false;
          return;
        }
        if (!self.uiTemplate.wooComnmerce.ready) {
          self.apiLoaded = false;
          return;
        }
        self.apiLoaded = true;
        //Dates//
        //Check for global dates
        //Dates//
        let startDate;
        let endDate;
        if (this.hasGlobalDate) {
          startDate = new Date(Date.parse(this.contextualData.groupDate.start));
          endDate = new Date(Date.parse(this.contextualData.groupDate.end));
        } else {
          //Build last two weeks date
          endDate = new Date();
          endDate.setDate(endDate.getDate() - 1);
          startDate = new Date();
          startDate.setDate(startDate.getDate() - self.returnRange);
        }

        //Send request to API
        self.uiTemplate.wooComnmerce.api('get', startDate, endDate).then((response) => {
          //The API returned an error so set relevant vars and return
          if (response.error) {
            self.loading = false;
            self.error = true;
            self.errorMessage = response.message;
            return;
          }
          //The call was a success, so let's process it
          self.loading = false;
          self.currentRequest = response.data;

          self.processResponse();
        });

        return;
      },
      processResponse() {
        let self = this;
        let data = this.currentRequest;
        let chartDates = data.timeline.report.dates;
        let comparisonDates = data.timeline.report_comparison.dates;
        let dataType = self.returnChartType;

        let chartData = [];
        let chartComparisonData = [];

        for (let [index, value] of data.timeline.report.data.entries()) {
          ///Fix engagement values
          chartData.push(value[dataType]);

          //Get comparison data
          if (typeof data.timeline.report_comparison.data[index] !== 'undefined') {
            if (dataType in data.timeline.report_comparison.data[index]) {
              chartComparisonData.push(data.timeline.report_comparison.data[index][dataType]);
            } else {
              chartComparisonData.push('0');
            }
          } else {
            chartComparisonData.push('0');
          }
        }

        if (self.returnChartSettings) {
          self.chartData.custom = self.returnChartSettings;
        }
        ////
        ////
        ////
        //Set data
        self.chartData.colors.main = self.returnLineColor;
        self.chartData.colors.comp = self.returnCompLineColor;
        self.chartData.title = self.returnName;
        self.chartData.type = self.returnChartStyle;
        self.chartData.data.main = chartData;
        self.chartData.data.comparison = chartComparisonData;
        self.chartData.labels.main = chartDates;
        self.chartData.labels.comparison = comparisonDates;
        self.total = data.timeline.report.totals[dataType];
        if (dataType in data.timeline.report_comparison.totals) {
          self.comparisonTotal = data.timeline.report_comparison.totals[dataType];
        } else {
          self.comparisonTotal = 'NA';
        }
        self.percentChange = data.timeline.report.totals_change[dataType];

        if (self.total != '') {
          self.total = new Intl.NumberFormat(self.uipress.uipAppData.options.locale).format(self.total);
        }
        if (self.comparisonTotal != '' && self.comparisonTotal != 'NA') {
          self.comparisonTotal = new Intl.NumberFormat(self.uipress.uipAppData.options.locale).format(self.comparisonTotal);
        }

        ///Update Cache
      },
      ///
      //Function pulled from https://stackoverflow.com/questions/3733227/javascript-seconds-to-minutes-and-seconds
      //Credit to Jakub
      secondsToTime(e) {
        if (isNaN(e)) {
          return 0;
        }
        const h = Math.floor(e / 3600)
            .toString()
            .padStart(2, '0'),
          m = Math.floor((e % 3600) / 60)
            .toString()
            .padStart(2, '0'),
          s = Math.floor(e % 60)
            .toString()
            .padStart(2, '0');

        if (m == 00) {
          return '0m ' + s + 's';
        } else {
          return m + 'm ' + s + 's';
        }
      },

      returnErrrorMessage() {
        try {
          JSON.parse(this.errorMessage);
        } catch (error) {
          return this.errorMessage;
        }

        if (this.uipress.isObject(JSON.parse(this.errorMessage))) {
          let messs = JSON.parse(this.errorMessage);
          return `
              <h5 style="margin:0">${messs.status}</h5>
              <p style="margin-bottom:0;">${messs.message}</p>
            `;
        }

        return this.errorMessage;
      },
    },
    template: `
		  <div class="uip-flex uip-flex-column">
        <div class="uip-flex uip-flex-between">
          <div class="uip-margin-bottom-xxs uip-text-normal uip-chart-title">{{returnName}}</div>
        </div>
        <div v-if="loading" class="uip-padding-m uip-flex uip-flex-center uip-flex-middle uip-min-w-200 uip-w-100p uip-ratio-16-10 uip-border-box"><loading-chart></loading-chart></div>
        <div v-else-if="error && errorMessage" class="uip-padding-xs uip-border-round uip-background-orange-wash uip-text-bold uip-margin-bottom-s uip-scale-in-top uip-max-w-100p" v-html="returnErrrorMessage()"></div>
        <div v-else-if="!returnChartType" class="uip-padding-xxs uip-border-round uip-background-green-wash uip-text-green uip-text-bold uip-margin-bottom-s uip-scale-in-top uip-max-w-200">{{strings.selectDataMetric}}</div>
        <div v-else class="uip-min-w-200">
          <div class="uip-flex uip-flex-column uip-row-gap-xs">
            <div class="uip-flex uip-flex-between uip-gap-xxs uip-flex-center">
              <div class="uip-text-xl uip-text-bold">{{returnTotal}}</div>
              <div class="uip-text-s uip-background-orange-wash uip-border-round uip-padding-xxxs uip-padding-left-xs uip-padding-right-xs uip-post-type-label uip-flex uip-gap-xxs uip-flex-center uip-text-bold uip-tag-label">
                <span v-if="percentChange > 0" class="uip-icon">arrow_upward</span>
                <span v-if="percentChange < 0" class="uip-icon">arrow_downward</span>
                <span>{{percentChange}}%</span>
              </div>
            </div>
            <div class="uip-text-muted uip-margin-bottom-xs">vs. {{returnComparisonTotal}} {{strings.lastPeriod}}</div>
            <uip-chart v-if="!hideChart && rendered" :chartData="returnChartData" :style="chartDimensions"></uip-chart>
            <div class="uip-flex uip-flex-row uip-flex-between" v-if="!hideChart">
              <div class="uip-text-s uip-text-muted uip-chart-label">{{chartData.labels.main[0]}}</div>
              <div class="uip-text-s uip-text-muted uip-chart-label">{{chartData.labels.main[chartData.labels.main.length - 1]}}</div>
            </div>
          </div>
        </div>
		 </div>`,
  };
}
