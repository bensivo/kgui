export enum Topics {

    // Cluster list has changed. Contains new cluster list
    CLUSTERS_CHANGE = 'clusters.changed',

    // Request a clusters.changed event
    CLUSTERS_REFRESH =  'clusters.refresh',

    // Request a cluster to be added
    CLUSTERS_ADD =  'clusters.add',

    // Request a cluster to be removed
    CLUSTERS_RM =  'clusters.remove',
}