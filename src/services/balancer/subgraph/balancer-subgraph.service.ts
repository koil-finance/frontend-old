import { balancerSubgraphClient } from './balancer-subgraph.client';
import { rpcProviderService as _rpcProviderService } from '@/services/rpc-provider/rpc-provider.service';
import Pools from './entities/pools';
import PoolShares from './entities/poolShares';
import PoolActivities from './entities/poolActivities';
import PoolSwaps from './entities/poolSwaps';
import PoolSnapshots from './entities/poolSnapshots';
import TradePairSnapshots from './entities/tradePairs';

import { networkId } from '@/composables/useNetwork';
import { Network } from '@koil-finance/sdk';

export default class BalancerSubgraphService {
  pools: Pools;
  poolShares: PoolShares;
  poolActivities: PoolActivities;
  poolSwaps: PoolSwaps;
  poolSnapshots: PoolSnapshots;
  tradePairSnapshots: TradePairSnapshots;

  constructor(
    readonly client = balancerSubgraphClient,
    readonly rpcProviderService = _rpcProviderService
  ) {
    // Init entities
    this.pools = new Pools(this);
    this.poolShares = new PoolShares(this);
    this.poolActivities = new PoolActivities(this);
    this.poolSwaps = new PoolSwaps(this);
    this.poolSnapshots = new PoolSnapshots(this);
    this.tradePairSnapshots = new TradePairSnapshots(this);
  }

  public get blockTime(): number {
    switch (networkId.value) {
      case Network.FUSE:
        return 5;
      default:
        return 5;
    }
  }
}

export const balancerSubgraphService = new BalancerSubgraphService();
