<template>
<div class="col-md-4">
    <div class="list-group">
        <div
            v-for="drink in drinks" 
            :key="drink.id" 
            class="list-group-item"
        >
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">{{ drink.name }}</h5>
                <small>${{ drink.price }}</small>
            </div>
            <p class="mb-1">{{ drink.description }}</p>
                <!-- 新增甜度冰塊欄位 -->
            <div class="d-flex mt-2">
                <div class="flex-fill me-2">
                    <label for="sweetness-select">甜度</label>
                    <select id="sweetness-select" 
                        class="form-select"
                        v-model="drink.sweetness">
                        <option value="全糖">全糖</option>
                        <option value="少糖">少糖</option>
                        <option value="半糖">半糖</option>
                        <option value="微糖">微糖</option>
                        <option value="無糖">無糖</option>
                    </select>
                </div>

                <div class="flex-fill">
                    <label for="ice-select">冰塊</label>
                    <select 
                        id="ice-select" 
                        class="form-select" 
                        v-model="drink.ice">
                            <option value="正常冰">正常冰</option>
                            <option value="少冰">少冰</option>
                            <option value="微冰">微冰</option>
                            <option value="去冰">去冰</option>
                            <option value="溫">溫</option>
                            <option value="熱">熱</option>
                    </select>
                </div>              
            </div>

        <!-- 添加購物車按鈕 -->
            <button 
                type="button" 
                class="btn btn-primary mt-2"
                @click="addToCart(drink)">
                加入購物車
            </button>
        </div>
    </div>
</div>

</template>
<script setup>
import { defineProps } from 'vue';
defineProps({
    drinks: Array,
    addToCart: Function,
    cart: Array,
});

</script>

<style scoped>


</style>