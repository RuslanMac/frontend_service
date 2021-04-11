<template>
<div>
    <label v-if="label">{{ label }}</label>
    <input
        :id="label"
        :value="value"
        v-bind="$attrs"
        @input="updateValue"
        type="text"
        :placeholder="placeholder"
    /> 
</div>
</template>

<script>
export default {
    inheritAttrs: false, 
    props: {
        value: [String, Number],
        label: String,
        placeholder: String 
    },
    methods: {
        updateValue(event) {
            this.$emit('input', event.target.value) 
        }
    }
}
</script>

<style scoped>
  input,
textarea {
  box-sizing: border-box;
  border: solid  1px rgba(0, 0, 0, 0.4);
  padding: 10px;
  width: 100%;
  border-radius: 3px;
  
}
</style>