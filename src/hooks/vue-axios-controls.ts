import { ref, Ref } from 'vue'

interface VueAxiosControls { 
  shouldCancel: Ref<boolean>;
  shouldRefetch: Ref<boolean>;
  cancel: () => void;
  makeRequest: () => void;
  handleCancelCompleted: () => void;
  handleRefetchCompleted: () => void;
}

export function useVueAxiosControls (): VueAxiosControls {
  const shouldCancel = ref()
  const shouldRefetch = ref()
  const cancel = () => {
    shouldCancel.value = true
  }
  const makeRequest = () => {
    shouldRefetch.value = true
  }
  function handleCancelCompleted () {
    shouldRefetch.value = false
    shouldCancel.value = false
  }
  function handleRefetchCompleted () {
    shouldRefetch.value = false
  }
  return {
    shouldCancel,
    shouldRefetch,
    cancel,
    makeRequest,
    handleCancelCompleted,
    handleRefetchCompleted
  }
}
