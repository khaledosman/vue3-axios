<template>
  <div>
    <div v-if="capturedError">
      {{capturedError.message}}
    </div>
    <Suspense v-if="!shouldRefetch">
      <template #fallback>
        <h3>Loading..</h3>
      </template>
      <template #default>
        <AxiosComponent
            :url="url"
            :config="config"
            :isOnlineFirst="isOnlineFirst"
            :shouldRefetch="shouldRefetch"
            :shouldCancel="shouldCancel"
            @refetch-completed="handleRefetchCompleted"
            @cancel-completed="handleCancelCompleted"
          >
            <template #response="{response}">
              <slot name="response" :response="response"></slot>
            </template>
          </AxiosComponent>
        </template>
    </Suspense>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, onErrorCaptured, toRefs, watch } from 'vue'
import AxiosComponent from './AxiosComponent.vue'
import { AxiosRequestConfig } from 'axios'

/* 
  Wrapper around AxiosComponent which provides vue-axios default loader / error handling message
  Delegated rendering of results via slots
*/
export default defineComponent({
  components: {
    AxiosComponent
  },
  emits: ['cancel-completed', 'refetch-completed'],
  props: {
    url: {
      type: String,
      required: true
    },
    config: {
      type: Object as PropType<AxiosRequestConfig>
    },
    isOnlineFirst: {
      type: Boolean,
      default: false
    },
    shouldRefetch: Boolean,
    shouldCancel: Boolean
  },
  setup (props, { emit }) {
    const capturedError = ref()
    const { shouldRefetch = ref() } = toRefs(props)
    onErrorCaptured(e => {
      // capturedError.value = new Error('Uh oh. Something went wrong!')
      capturedError.value = e
      return false
    })

    watch(shouldRefetch, (newVal, oldVal) => {
      if (newVal !== oldVal) {
        capturedError.value = undefined
      }
    })

    function handleRefetchCompleted (e: Event) {
      // debugger
      emit('refetch-completed', e)
    }

    function handleCancelCompleted (e: Event) {
      emit('cancel-completed', e)
    }

    return { capturedError, handleRefetchCompleted, handleCancelCompleted }
  }
})
</script>

<style scoped>

</style>
