<script setup lang="ts">
import publicSpec from '../../public/openapi.json'
import partnerSpec from '../../public/partner-openapi.json'
import { specTags } from '../spec-tags'

const props = withDefaults(defineProps<{ spec?: 'public' | 'partner'; prefix?: string }>(), {
  spec: 'public',
  prefix: '/api/',
})

const tags = specTags(props.spec === 'partner' ? partnerSpec : publicSpec)
</script>

<template>
  <div v-for="tag in tags" :key="tag.slug">
    <h3 :id="tag.slug">
      <a :href="`${prefix}groups/${tag.slug}`">{{ tag.name }}</a>
    </h3>
    <ul v-if="tag.operations.length">
      <li v-for="operation in tag.operations" :key="operation.operationId">
        <a :href="`${prefix}${operation.operationId}`"><code>{{ operation.method }} {{ operation.path }}</code></a>
        <template v-if="operation.summary"> — {{ operation.summary }}</template>
      </li>
    </ul>
  </div>
</template>
