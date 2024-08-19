<template>
<div class="container mt-5">
    <div class="row">
        <ProductList :drinks="drinks" :addToCart="addToCart" :cart="cart"  />
        <CartItem 
            :cart="cart"
            :sum="sum"
            v-model:description="description"
            @update:cart="(newCart) => (cart.value = newCart)"
            @orderCreated="handleOrderCreated"
            @itemRemoved="handleItemRemoved"
            @resetCart="resetCart"
        />

       
    </div>

    <hr />

    <ProductOrder :order="order" />

</div>
</template>

<script setup>
import { ref, computed } from 'vue';
import CartItem from '@/components/CartItem.vue';
import ProductList from '@/components/ProductList.vue';
import ProductOrder from '@/components/ProductOrder.vue';
import { data } from '@/data';

//使用一個ref 創建一個響應式變數drinks儲存所有飲品項目
const drinks = ref(data);

//使用一個ref 創建一個響應式變數cart儲存購物車中項目
const cart = ref([]);

// 使用 ref 創建一個響應式變數 description 來儲存訂單的備註
const description = ref("");

// 使用 ref 創建一個響應式變數 order 來儲存已建立的訂單訊息
const order = ref({});

// 使用計算屬性，創建變數 sum，用來計算購物車中所有項目的總金額
const sum = computed(()=>{
    return cart.value.reduce((pre, next) =>{
        return pre + next.price*next.quantity
    }, 0);
});

const addToCart = (drink) => {
    // 添加商品時將甜度和冰塊與商品一起存入
    cart.value.push({
        ...drink,  // 展開飲品項目的所有屬性
        id: new Date().getTime(), // 使用唯一 ID 區分不同的商品
        quantity: 1, // 設定初始購買數量為1
        sweetness: drink.sweetness || '全糖', //默認甜度全糖
        ice: drink.ice || '正常冰' //默認冰塊
    });
};


// 方法: 接收訂單建立的事件
// 當新的訂單建立時，接收新訂單並更新 order 變數
const handleOrderCreated = (newOrder) => {
    order.value = newOrder;
};

// 方法: 處理項目被移除的事件
// 當某個項目從購物車中移除時，接收該項目的 ID 並從購物車中移除對應的項目
const handleItemRemoved = (removedId) => {
    cart.value = cart.value.filter((item) => item.id !== removedId)
}

// 方法: 重置購物車
// 清空購物車中的所有項目，允許用戶重新選擇飲品
const resetCart = () => {
    cart.value= [];
};

</script>

<style>

</style>