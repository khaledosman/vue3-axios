<template>
  <div>
    <slot name="error" v-if="error" :error="error"></slot>
    <slot name="loading" v-else-if="isLoading" :isLoading="isLoading"></slot>
    <slot name="response" v-else :response="response"></slot>
  </div>
</template>

<script lang='ts'>
import { ref, defineComponent, PropType, onBeforeUnmount, watch, toRefs } from 'vue'
import { useApi } from '../hooks/api'
import { AxiosRequestConfig } from 'axios'

/* 
  Async component which makes API requests and delegates rendering to parent components via slots
*/
export default defineComponent({
  name: 'AxiosComponent',
  props: {
    url: {
      type: String,
      required: true
    },
    config: {
      type: Object as PropType<AxiosRequestConfig>,
      required: false
    },
    isOnlineFirst: {
      type: Boolean,
      default: false
    },
    shouldRefetch: Boolean,
    shouldCancel: Boolean
  },
  emits: ['cancel-completed', 'refetch-completed'],
  async setup (props, { emit }) {
    const { url, config, shouldRefetch = ref(), shouldCancel = ref(), isOnlineFirst } = toRefs(props)

    const { response, request, error, isLoading, cancel } = useApi(url.value, config?.value)

    const cancelRequestIfNeeded = () => {
      if (isLoading) {
        cancel()
        emit('cancel-completed')
      }
    }

    const makeRequest = async () => {
      await request({ isOnlineFirst: isOnlineFirst.value })
      emit('refetch-completed')
    }

    watch(shouldRefetch, async (newVal, oldVal) => {
      if (newVal === true && newVal !== oldVal) {
        cancelRequestIfNeeded()
        await makeRequest()
      }
    })

    watch(shouldCancel, (newVal, oldVal) => {
      if (newVal === true && newVal !== oldVal) {
        cancelRequestIfNeeded()
      }
    })

    onBeforeUnmount(() => {
      cancelRequestIfNeeded()
    })

    await makeRequest()

    return { error, response, isLoading }
  }
})
  
</script>
