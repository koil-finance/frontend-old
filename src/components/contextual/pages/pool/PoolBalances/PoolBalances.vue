<script setup lang="ts">
import { defineProps } from 'vue';

import { FullPool } from '@/services/balancer/subgraph/types';

import Pool from './Pool';
import BoostedPool from './BoostedPool';

/**
 * TYPES
 */
type Props = {
  pool: FullPool;
  loading: boolean;
};

/**
 * PROPS
 */

const props = withDefaults(defineProps<Props>(), {
  loading: false
});
</script>

<template>
  <BoostedPool v-if="props.pool.onchain?.linearPools" :pool="props.pool" />
  <Pool v-else :pool="props.pool" />
</template>
