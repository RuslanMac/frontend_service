<template>
    <div> 
        <label v-if="label"> {{ label }} </label>
        <select :value="value"
        :id= "label"
                @change="updateValue"
                v-bind="$attrs">
           <option v-for="option in options"
                        :selected="option === value"
                        :value="option"
                        :key="option"
                         >
                        {{ option }} 
           </option>
        </select>
    </div>
</template>
<script>
export default {
    inheritAttrs: false,
    props: {
        options: {
            type: Array,
            required: true
        }, 
        value: {
            type: [String, Number],
            default: 'Likepkt', 
        },
        label: String

    },   
    methods: {
        updateValue(event) {
            this.$emit('input', event.target.value) 
        }
    }
}
</script>

<style scoped>
    select {

  width: 100%;
  height: 52px;
  padding: 0 24px 0 10px;
  vertical-align: middle;
  background: #fff
    url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Cpath fill='%23343a40' d='M2 0L0 2h4zm0 5L0 3h4z'/%3E%3C/svg%3E")
    no-repeat right 12px center;
  background-size: 8px 10px;
  border: solid 1px rgba(0, 0, 0, 0.4);
  border-radius: 3px; 
  -webkit-appearance: none;
  -moz-appearance: none;

}
</style>
