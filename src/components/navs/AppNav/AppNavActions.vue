<template>
  <div>
    <div v-if="account" class="flex items-center">
      <AppNavActivityBtn />
      <AppNavClaimBtn v-if="liquidityMiningSupported" />
      <AppNavAccountBtn />
    </div>
    <BalBtn
      v-else
      color="red"
      class="connect-wallet-btn"
      @click="toggleWalletSelectModal"
    >
      <span class="hidden lg:inline-block" v-text="$t('connectWallet')" />
      <span class="lg:hidden" v-text="$t('connect')" />
    </BalBtn>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

import { EXTERNAL_LINKS } from '@/constants/links';

import useFathom from '@/composables/useFathom';
import useBreakpoints from '@/composables/useBreakpoints';
import useNumbers from '@/composables/useNumbers';

import AppNavAccountBtn from './AppNavAccountBtn.vue';
import AppNavClaimBtn from './AppNavClaimBtn.vue';
import useWeb3 from '@/services/web3/useWeb3';
import AppNavActivityBtn from './AppNavActivityBtn/AppNavActivityBtn.vue';

export default defineComponent({
  name: 'AppNavActions',

  components: {
    AppNavAccountBtn,
    AppNavClaimBtn,
    AppNavActivityBtn
  },

  setup() {
    // COMPOSABLES
    const { upToSmallBreakpoint, upToLargeBreakpoint } = useBreakpoints();
    const { fNum } = useNumbers();
    const { trackGoal, Goals } = useFathom();
    const { connectWallet, account, toggleWalletSelectModal } = useWeb3();

    // COMPUTED
    const liquidityMiningSupported = computed(() => false);

    // METHODS
    function onClickConnect() {
      trackGoal(Goals.ClickNavConnectWallet);
    }

    return {
      // computed
      liquidityMiningSupported,
      account,
      upToSmallBreakpoint,
      upToLargeBreakpoint,
      // methods
      fNum,
      onClickConnect,
      connectWallet,
      toggleWalletSelectModal,
      // constants
      EXTERNAL_LINKS
    };
  }
});
</script>

<style scoped>
.connect-wallet-btn {
  @apply h-11;
  border-radius: 10px;
}
</style>
