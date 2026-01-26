<template>

  
      <div class="hmpg-header">
        <img src="@/assets/logo.png" alt="Logo" class="hmpg-logo" />
      </div>
      
      <ProductList/>

      <div class="hmpg-btmspace"></div>
</template>

<script>
import ProductList from '@/components/ProductList.vue';

export default {
  name: 'HomePage',
  components: {
    ProductList
  }
};
</script>

<style scoped>

.hmpg-header {
  text-align: center;
}

.hmpg-logo {
  max-width: 200px;
  position: relative;
  margin-top: 40px;

}

.ProductList{
  position: relative;
  margin-top:10px;
}

.hmpg-btmspace{
  height: 40px;
}

</style>