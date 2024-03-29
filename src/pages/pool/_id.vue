<template>
  <div class="lg:container lg:mx-auto pt-8">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-y-8 gap-x-0 lg:gap-x-8">
      <div class="col-span-2">
        <BalLoadingBlock v-if="loadingPool" class="h-16" />
        <div v-else class="px-4 lg:px-0 flex flex-col">
          <div class="flex flex-wrap items-center -mt-2">
            <h3 class="pool-title">
              {{ poolTypeLabel }}
            </h3>
            <div
              v-for="([address, tokenMeta], i) in titleTokens"
              :key="i"
              class="mt-2 mr-2 flex items-center px-2 h-10 rounded-lg text-white"
              style="background: #AC503F;"
            >
              <BalAsset :address="address" />
              <span class="ml-2">
                {{ tokenMeta.symbol }}
              </span>
              <span
                v-if="!isStableLikePool"
                class="font-medium text-white text-xs mt-px ml-1"
              >
                {{
                  fNum2(tokenMeta.weight, {
                    style: 'unit',
                    unit: 'percent',
                    maximumFractionDigits: 0
                  })
                }}
              </span>
            </div>
            <!--            <BalChip-->
            <!--              v-if="pool.dynamic.isNewPool"-->
            <!--              color="red"-->
            <!--              size="sm"-->
            <!--              class="uppercase mt-2 mr-2"-->
            <!--              :outline="false"-->
            <!--            >-->
            <!--              {{ $t('new') }}-->
            <!--            </BalChip>-->
            <!--            <LiquidityAPRTooltip :pool="pool" class="-ml-1 mt-1" />-->
          </div>
          <div class="flex items-center mt-2">
            <div v-html="poolFeeLabel" class="text-sm text-gray-600" />
            <BalTooltip>
              <template v-slot:activator>
                <BalLink
                  v-if="feesManagedByGauntlet"
                  :href="EXTERNAL_LINKS.Gauntlet.Home"
                  external
                >
                  <GauntletIcon class="ml-2" />
                </BalLink>
                <BalIcon
                  v-else
                  name="info"
                  size="xs"
                  class="text-gray-400 ml-2"
                />
              </template>
              <span>
                {{ swapFeeToolTip }}
              </span>
            </BalTooltip>
          </div>
        </div>

        <BalAlert
          v-if="!appLoading && missingPrices"
          type="warning"
          :title="$t('noPriceInfo')"
          class="mt-2"
          block
        />
        <BalAlert
          v-if="!appLoading && hasCustomToken"
          type="error"
          :title="$t('highRiskPool')"
          class="mt-2"
          block
        />
        <BalAlert
          v-if="!appLoading && noInitLiquidity"
          type="warning"
          :title="$t('noInitLiquidity')"
          :description="$t('noInitLiquidityDetail')"
          class="mt-2"
          block
        />
      </div>

      <div class="hidden lg:block" />

      <div class="col-span-2 order-2 lg:order-1">
        <div class="grid grid-cols-1 gap-y-8">
          <div class="px-1 lg:px-0">
            <PoolInformationCard
              :pool="pool"
              :historicalPrices="historicalPrices"
              :snapshots="snapshots"
              :loading="isLoadingSnapshots"
            />
          </div>
          <div class="mb-4 px-1 lg:px-0">
            <PoolStatCards :pool="pool" :loading="loadingPool" />
          </div>

          <div>
            <h4
              v-text="$t('poolTransactions.title')"
              class="px-4 lg:px-0 mb-2"
            />
            <PoolTransactionsCard :pool="pool" :loading="loadingPool" />
          </div>
        </div>
      </div>

      <div
        v-if="!isLiquidityBootstrappingPool"
        class="order-1 lg:order-2 px-1 lg:px-0"
      >
        <BalLoadingBlock
          v-if="loadingPool"
          class="pool-actions-card h-60 mb-4"
        />
        <MyPoolBalancesCard
          v-else-if="!noInitLiquidity"
          :pool="pool"
          :missingPrices="missingPrices"
          class="mb-4"
        />

        <BalLoadingBlock v-if="loadingPool" class="pool-actions-card h-40" />
        <PoolActionsCard
          v-else-if="!noInitLiquidity"
          :pool="pool"
          :missingPrices="missingPrices"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, computed, watch } from 'vue';
import * as PoolPageComponents from '@/components/contextual/pages/pool';
import GauntletIcon from '@/components/images/icons/GauntletIcon.vue';
// import LiquidityAPRTooltip from '@/components/tooltips/LiquidityAPRTooltip.vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import useNumbers from '@/composables/useNumbers';
import { usePool } from '@/composables/usePool';
import usePoolQuery from '@/composables/queries/usePoolQuery';
import usePoolSnapshotsQuery from '@/composables/queries/usePoolSnapshotsQuery';
import { POOLS } from '@/constants/pools';
import { EXTERNAL_LINKS } from '@/constants/links';
import useWeb3 from '@/services/web3/useWeb3';
import useTokens from '@/composables/useTokens';
import useApp from '@/composables/useApp';
import useAlerts, { AlertPriority, AlertType } from '@/composables/useAlerts';

interface PoolPageData {
  id: string;
}

export default defineComponent({
  components: {
    ...PoolPageComponents,
    GauntletIcon
    // LiquidityAPRTooltip
  },

  setup() {
    /**
     * COMPOSABLES
     */
    const { appLoading } = useApp();
    const { t } = useI18n();
    const route = useRoute();
    const { fNum2 } = useNumbers();
    const { isWalletReady } = useWeb3();
    const { prices } = useTokens();
    const { blockNumber } = useWeb3();
    const { addAlert, removeAlert } = useAlerts();
    const { balancerTokenListTokens } = useTokens();

    /**
     * QUERIES
     */
    const poolQuery = usePoolQuery(route.params.id as string);
    const poolSnapshotsQuery = usePoolSnapshotsQuery(
      route.params.id as string,
      30
    );

    /**
     * STATE
     */
    const data = reactive<PoolPageData>({
      id: route.params.id as string
    });

    /**
     * COMPUTED
     */
    const pool = computed(() => poolQuery.data.value);
    const {
      isStableLikePool,
      isLiquidityBootstrappingPool,
      isStablePhantomPool
    } = usePool(poolQuery.data);

    const noInitLiquidity = computed(
      () =>
        !loadingPool.value &&
        pool.value &&
        Number(pool.value.onchain.totalSupply) === 0
    );

    const communityManagedFees = computed(
      () => pool.value?.owner == POOLS.DelegateOwner
    );
    const feesManagedByGauntlet = computed(
      () =>
        communityManagedFees.value &&
        POOLS.DynamicFees.Gauntlet.includes(data.id)
    );
    const feesFixed = computed(() => pool.value?.owner == POOLS.ZeroAddress);
    const swapFeeToolTip = computed(() => {
      if (feesManagedByGauntlet.value) {
        return t('feesManagedByGauntlet');
      } else if (communityManagedFees.value) {
        return t('delegateFeesTooltip');
      } else if (feesFixed.value) {
        return t('fixedFeesTooltip');
      } else {
        return t('ownerFeesTooltip');
      }
    });

    const poolQueryLoading = computed(
      () =>
        poolQuery.isLoading.value ||
        poolQuery.isIdle.value ||
        poolQuery.error.value
    );

    const loadingPool = computed(() => poolQueryLoading.value || !pool.value);

    const snapshots = computed(() => poolSnapshotsQuery.data.value?.snapshots);
    const historicalPrices = computed(
      () => poolSnapshotsQuery.data.value?.prices
    );
    const isLoadingSnapshots = computed(
      () =>
        poolSnapshotsQuery.isLoading.value || poolSnapshotsQuery.isIdle.value
    );

    const titleTokens = computed(() => {
      if (!pool.value) return [];

      return Object.entries(pool.value.onchain.tokens).sort(
        ([, a]: any[], [, b]: any[]) => b.weight - a.weight
      );
    });

    const poolTypeLabel = computed(() => {
      if (!pool.value) return '';
      const key = POOLS.Factories[pool.value.factory];

      return key ? t(key) : t('unknownPoolType');
    });

    const poolFeeLabel = computed(() => {
      if (!pool.value) return '';
      const feeLabel = `${fNum2(pool.value.onchain.swapFee, {
        style: 'unit',
        unit: 'percent',
        maximumFractionDigits: 4,
        fixedFormat: true
      })}`;

      if (feesFixed.value) {
        return t('fixedSwapFeeLabel', [feeLabel]);
      } else if (communityManagedFees.value) {
        return feesManagedByGauntlet.value
          ? t('dynamicSwapFeeLabel', [feeLabel])
          : t('communitySwapFeeLabel', [feeLabel]);
      }

      // Must be owner-controlled
      return t('dynamicSwapFeeLabel', [feeLabel]);
    });

    const missingPrices = computed(() => {
      if (pool.value) {
        const tokensWithPrice = Object.keys(prices.value);

        const tokens =
          isStablePhantomPool.value && pool.value.mainTokens
            ? pool.value.mainTokens
            : pool.value.tokenAddresses;

        return !tokens.every(token => tokensWithPrice.includes(token));
      }
      return false;
    });

    const hasCustomToken = computed(() => {
      const knownTokens = Object.keys(
        balancerTokenListTokens.value
      ).map(token => token.toLowerCase());
      return (
        !!pool.value &&
        !isLiquidityBootstrappingPool.value &&
        !isStablePhantomPool.value &&
        pool.value.tokenAddresses.some(
          address => !knownTokens.includes(address.toLowerCase())
        )
      );
    });

    /**
     * METHODS
     */
    function onNewTx(): void {
      poolQuery.refetch.value();
    }

    /**
     * WATCHERS
     */
    watch(blockNumber, () => {
      poolQuery.refetch.value();
    });

    watch(poolQuery.error, () => {
      if (poolQuery.error.value) {
        addAlert({
          id: 'pool-fetch-error',
          label: t('alerts.pool-fetch-error'),
          type: AlertType.ERROR,
          persistent: true,
          action: poolQuery.refetch.value,
          actionLabel: t('alerts.retry-label'),
          priority: AlertPriority.MEDIUM
        });
      } else {
        removeAlert('pool-fetch-error');
      }
    });

    return {
      // data
      ...toRefs(data),
      EXTERNAL_LINKS,
      // computed
      appLoading,
      pool,
      noInitLiquidity,
      poolTypeLabel,
      poolFeeLabel,
      historicalPrices,
      snapshots,
      isLoadingSnapshots,
      loadingPool,
      titleTokens,
      isWalletReady,
      missingPrices,
      feesManagedByGauntlet,
      swapFeeToolTip,
      isStableLikePool,
      isLiquidityBootstrappingPool,
      isStablePhantomPool,
      hasCustomToken,
      // methods
      fNum2,
      onNewTx
    };
  }
});
</script>

<style scoped>
.pool-title {
  @apply mr-4 capitalize mt-2;
  font-variation-settings: 'wght' 700;
}

.pool-actions-card {
  @apply relative;
}

@media (min-width: 768px) and (min-height: 600px) {
  .pool-actions-card {
    @apply sticky top-24;
  }
}
</style>
