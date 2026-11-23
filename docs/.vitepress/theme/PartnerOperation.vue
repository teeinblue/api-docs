<script setup lang="ts">
import { OAOperation } from 'vitepress-openapi/client'
import spec from '../../public/partner-openapi.json'

// The site's default spec is the public API, so a partner endpoint names its own.
defineProps<{ operationId: string }>()
</script>

<template>
  <OAOperation :spec="spec" :operation-id="operationId" />
</template>
