import { mapGetters } from 'vuex';
import { formatTime } from '@chatwoot/utils';

export default {
  computed: {
    ...mapGetters({
      accountSummary: 'getAccountSummary',
      accountReport: 'getAccountReports',
    }),
    calculateTrend() {
      return metric_key => {
        if (!this.accountSummary.previous[metric_key]) return 0;
        const diff =
          this.accountSummary[metric_key] -
          this.accountSummary.previous[metric_key];
        return Math.round(
          (diff / this.accountSummary.previous[metric_key]) * 100
        );
      };
    },
  },
  methods: {
    displayMetric(key) {
      if (this.isAverageMetricType(key)) {
        return formatTime(this.accountSummary[key]);
      }
      return Number(this.accountSummary[key] || '').toLocaleString();
    },
    displayInfoText(key) {
      if (this.metrics[this.currentSelection].KEY !== key) {
        return '';
      }
      if (this.isAverageMetricType(key)) {
        const total = this.accountReport.data
          .map(item => item.count)
          .reduce((prev, curr) => prev + curr, 0);
        return `${this.metrics[this.currentSelection].INFO_TEXT} ${total}`;
      }
      return '';
    },
    isAverageMetricType(key) {
      return ['avg_first_response_time', 'avg_resolution_time'].includes(key);
    },
  },
};
