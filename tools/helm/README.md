# UA Cyber SHIELD Helm chart

This is a Helm chart for Kubernetes

## Quick start

### Prerequisites

Make sure that you installed `helm` package on your local machine and you have connection to the Kubernetes cluster.

### Install chart

```bash
cd tools/helm/
helm install --create-namespace \
    -n ua-cyber-shield \
    -f values.yaml ua-cyber-shield .
```

### Upgrade chart

```bash
helm upgrade --install \
    -n ua-cyber-shield \
    -f values.yaml ua-cyber-shield .
```

## Values

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| affinity | object | `{}` |  |
| fullnameOverride | string | `""` |  |
| image.pullPolicy | string | `"IfNotPresent"` |  |
| image.repository | string | `"ghcr.io/opengs/uashield"` |  |
| image.tag | string | `"master"` |  |
| imagePullSecrets | list | `[]` |  |
| nameOverride | string | `""` |  |
| nodeSelector | object | `{}` |  |
| podAnnotations | object | `{}` |  |
| podSecurityContext | object | `{}` |  |
| replicaCount | int | `1` |  |
| resources | object | `{}` |  |
| securityContext | object | `{}` |  |
| threadsCount | int | `256` |  |
| tolerations | list | `[]` |  |
| useProxy | bool | `false` |  |
