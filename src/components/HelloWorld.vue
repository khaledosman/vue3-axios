<template>
  <div class="hello">

  <button type="button" @click="makeRequest">Make request</button>
  <button type="button" @click="cancel"> Cancel request</button>
  <input type="checkbox" id="use-cache" v-model="useCache" />
  <label for="use-cache">use cache: {{ useCache }}</label>

    <VueAxiosComponent
      url="https://randomapi.com/api/6de6abfedb24f889e0b5f675edc50deb"
      :isOnlineFirst="!useCache"
      :shouldCancel="shouldCancel"
      :shouldRefetch="shouldRefetch"
      @refetch-completed="handleRefetchCompleted"
      @cancel-completed="handleCancelCompleted"
    >
      <template #response="{response}">
        <div 
          v-for="item of response?.results[0]" 
          :key="item.email">
        {{item}}
        </div>
      </template>
    </VueAxiosComponent>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useVueAxiosControls } from '../hooks/vue-axios-controls'
import VueAxiosComponent from './VueAxiosComponent.vue'
export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: String
  },
  components: {
    VueAxiosComponent
  },
  setup () {
    const useCache = ref(true)
    const { makeRequest, cancel, shouldCancel, shouldRefetch, handleCancelCompleted, handleRefetchCompleted } = useVueAxiosControls()
    return { useCache, makeRequest, cancel, shouldCancel, shouldRefetch, handleCancelCompleted, handleRefetchCompleted }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
