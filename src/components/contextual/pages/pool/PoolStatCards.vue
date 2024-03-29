<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
    <template v-if="loading">
      <BalLoadingBlock v-for="n in 4" :key="n" class="h-24" />
    </template>
    <template v-else>
      <BalCard v-for="(stat, i) in stats" :key="i">
        <div class="text-sm text-gray-500 font-medium mb-2">
          {{ stat.label }}
        </div>
        <div class="text-xl font-medium truncate flex items-center">
          {{ stat.value }}
          <LiquidityAPRTooltip :pool="pool" v-if="stat.id === 'apr'" />
        </div>
      </BalCard>
    </template>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent, computed } from 'vue';
import { useI18n } from 'vue-i18n';

import useNumbers, { FNumFormats } from '@/composables/useNumbers';

import { DecoratedPool } from '@/services/balancer/subgraph/types';

import LiquidityAPRTooltip from '@/components/tooltips/LiquidityAPRTooltip.vue';
import { APR_THRESHOLD } from '@/constants/poolAPR';

export default defineComponent({
  components: {
    LiquidityAPRTooltip
  },

  props: {
    pool: { type: Object as PropType<DecoratedPool> },
    loading: { type: Boolean, default: true }
  },

  setup(props) {
    // COMPOSABLES
    const { fNum2 } = useNumbers();
    const { t } = useI18n();

    // COMPUTED
    const stats = computed(() => {
      if (!props.pool) return [];

      return [
        {
          id: 'poolValue',
          label: t('poolValue'),
          value: fNum2(props.pool.totalLiquidity, FNumFormats.fiat)
        },
        {
          id: 'volumeTime',
          label: t('volumeTime', ['24h']),
          value: fNum2(props.pool.dynamic.volume, FNumFormats.fiat)
        },
        {
          id: 'feesTime',
          label: t('feesTime', ['24h']),
          value: fNum2(props.pool.dynamic.fees, FNumFormats.fiat)
        },
        {
          id: 'apr',
          label: 'APR',
          value:
            Number(props.pool.dynamic.apr.total) > APR_THRESHOLD
              ? '-'
              : fNum2(props.pool.dynamic.apr.total, FNumFormats.percent)
        }
      ];
    });

    return {
      stats
    };
  }
});
</script>
