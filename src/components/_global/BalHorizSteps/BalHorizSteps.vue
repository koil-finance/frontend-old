<script setup lang="ts">
import { computed } from 'vue';
import useWeb3 from '@/services/web3/useWeb3';
import { getConnectorLogo } from '@/services/web3/web3.plugin';
import { Step, StepState } from '@/types';

const stepState = StepState;

/**
 * TYPES
 */
type Props = {
  steps: Step[];
  spacerWidth: number;
};

/**
 * PROPS
 */
withDefaults(defineProps<Props>(), {
  steps: () => [
    { tooltip: 'You did this', state: StepState.Success },
    { tooltip: 'Wallet is tiggered', state: StepState.WalletOpen },
    { tooltip: 'This is pending', state: StepState.Pending },
    { tooltip: 'Do this now', state: StepState.Active },
    { tooltip: 'Do this next', state: StepState.Todo }
  ],
  spacerWidth: 16
});

/**
 * COMPOSABLES
 */
const { connector } = useWeb3();

/**
 * COMPUTED
 */
const walletLogo = computed((): string =>
  getConnectorLogo(connector?.value?.id)
);

/**
 * METHODS
 */
function stateClasses(state: StepState): string {
  switch (state) {
    case StepState.Success:
      return 'border-green-500 dark:border-green-500 text-green-500';
    case StepState.Pending:
      return 'border-none dark:border-none text-yellow-500';
    case StepState.Active:
      return 'border-ac503f text-ac503f';
    case StepState.WalletOpen:
      return 'border-ac503f text-ac503f';
    default:
      return 'border-d8ceb5';
  }
}
</script>

<template>
  <div class="flex items-center">
    <div v-for="(step, i) in steps" :key="i" class="flex items-center">
      <div v-if="i !== 0" :class="['h-px bg-d8ceb5', `w-${spacerWidth}`]" />
      <BalTooltip :text="step.tooltip" width="44" textCenter>
        <template v-slot:activator>
          <div :class="['step', stateClasses(step.state)]">
            <BalIcon v-if="step.state === stepState.Success" name="check" />
            <img
              v-else-if="step.state === stepState.WalletOpen"
              :src="walletLogo"
              class="w-4 h-4"
            />
            <template v-else-if="step.state === stepState.Pending">
              <span
                class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              >
                {{ i + 1 }}
              </span>
              <SpinnerIcon class="h-8 w-8 animate-spin" />
            </template>
            <span v-else>
              {{ i + 1 }}
            </span>
          </div>
        </template>
      </BalTooltip>
    </div>
  </div>
</template>

<style scoped>
.step {
  @apply w-8 h-8 rounded-full border shadow font-medium;
  @apply flex items-center justify-center relative;
}

.text-ac503f {
  color: #ac503f;
}
.border-ac503f {
  border-color: #ac503f;
}
.border-d8ceb5 {
  border-color: #d8ceb5;
}
.bg-d8ceb5 {
  background: #d8ceb5;
}
</style>
