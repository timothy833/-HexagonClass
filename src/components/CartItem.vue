<template>
<div class="col-md-8">
    <!-- 使用table標籤來展示購物車中的項目列表 -->
    <table class="table">
        <thead>
            <tr>
                <th row="scoped" width="50">操作</th>
                <th row="scoped">品項</th>
                <th row="scoped">甜度</th>
                <th row="scoped">冰塊</th>
                <th row="scoped">描述</th>
                <th row="scoped" width="90">數量</th>
                <th row="scoped">單價</th>
                <th row="scoped">小計</th>
            </tr>
        </thead>
        <tbody>
            <!-- 使用v-for 指令遍歷cart陣列,為每個項目渲染一行 -->
            <tr v-for="item in cart" :key="item.id">
                <td>
                    <!-- 刪除按鈕,點擊時觸發 removeFromCart方法移除該項目 -->
                    <button 
                        type="button" 
                        class="btn btn-sm"
                        @click="removeFromCart(item.id)">
                        x
                    </button>
                </td>
                <!-- 顯示項目名稱 -->
                <td>{{ item.name }}</td>
                <td>{{ item.sweetness }}</td>
                <td>{{ item.ice }}</td>
                <td>
                    <!-- 顯示項目說明 -->
                    <small>
                        {{ item.description }}
                    </small>
                </td>
                <td>
                    <!-- 下拉選單, 用於選擇購買數量，綁定item的quantity，並在變更時觸發updateCart方法 -->
                    <label id="quantity-select">選擇數量</label>
                    <select 
                        name="quantity" 
                        id="quantity-select" 
                        class="form-select"
                        v-model="item.quantity"
                        @change="updateCart(item)"    
                    >
                        <!-- 使用v-for產生生成指令選項，允許選擇1到10的數量 -->
                        <option v-for="num in 10" :key="num">{{ num }}</option>
                    </select>
                </td>
                <!-- 顯示項目的單價 -->
                <td>{{ item.price }}</td>
                <!-- 顯示項目加總小計金額 -->
                <td>{{ itemSubtotal(item) }}</td>
            </tr>
        </tbody>
    </table>

    <!-- 如果購物車為空顯示提示訊息 -->
    <div v-if="cart.length === 0" class="alert alert-primary text-center" role="alert">
        請選擇商品
    </div>
    <!-- 如果購物車顯示不為空，顯示總計金額跟訂單提交表單 -->
    <div v-else>
        <!-- 顯示總計金額並排版靠右對齊 -->
        <div class="text-end mb-3">
            <h5>總計:<span>${{ sum }}</span></h5>
        </div>
        <!-- 備註文本框，允許用戶輸入訂單的額外備註訊息 -->
        <label for="note" class="mb-2">備註說明</label>
        <textarea 
            name="note" 
            id="note" 
            class="form-control mb-3"
            rows="3"
            placeholder="請輸入說明"
            v-model="localDescription"
        ></textarea>
        <div class="text-end">
            <!-- 送出訂單按鈕，點擊時觸發createOrder 方法建立訂單 -->
            <button 
                type="button" 
                class="btn btn-primary" 
                @click.prevent="createOrder"
            >
                送出
            </button>
        </div>
    </div>
</div>
</template>
<script setup>
import { ref, watch, defineProps, defineEmits } from "vue";

//定義父組件傳進來的props
//cart: 包含購物車中品項陣列
//sum: 購物車中總金額
//description: 訂單的備註
const props = defineProps({
    cart: Array,
    sum: Number,
    description: String,
});

//定義emits發送本元件事件(子組件)回到父組件
//update:cart 更新購物車內容
//update:description 更新訂單備註
//orderCreated 訂單已成立
//itemRemoved 選定項目從購物車刪除
//resetCart 重置購物車
const emits = defineEmits([
    "update:cart",
    "update:description",
    "orderCreated",
    "itemRemoved",
    "resetCart",
])

//在這元件的 description 綁定到父元件傳入的description
const localDescription = ref(props.description);
// 監聽 props.description，當父組件的 description 改變時同步更新 localDescription
watch(()=> props.description, (newDescription) => {
    localDescription.value = newDescription
});

//監聽localDescription變化，當本地元件內的description有變化時，發送update:descripton事件到父元件
watch(localDescription, (newValue) => {
    emits("update:description",newValue)
})



// const localCart = ref(props.cart);
// watch(()=>props.cart, (newCart)=> {
//     localCart.value = newCart
// })



//計算單項小記
//接受一個購物車項目用item作為參數，返回該項目的小記金額(單價乘以數量)
const itemSubtotal = (item) => {
    return item.price*item.quantity;
};

//方法:更新購物車項目
//接收一個購物車項目item作為參數,根據item的id找到該項目並更新其數量
//發送update:cart 事件到父元件,通知購物車項目已更新。
const updateCart = (item)=> {
    const updatecart = [...props.cart];
    const index = updatecart.findIndex((cartItem) => cartItem.id === item.id);
    if(index !== -1){
        updatecart[index].quantity = parseInt(item.quantity);
        emits("update:cart", updatecart); //發送更新購物車的事件
    }
};

//方法: 從購物車中移除項目
// 接收一個項目的id作為參數, 根據該id 找到對應的項目並從購物車中刪除
//發送update:cart 事件更新購物車, 並發送itemRemoved事件通知父元件該項目已被刪除
const removeFromCart = (id) => {
    const  updatedCart = props.cart.filter(cartItem => cartItem.id !== id);
        emits("update:cart", updatedCart); //發送更新購物車事件
        emits("itemRemoved", id); //發送itemRemoved 事件到父元件
};

//方法建議訂單
//建立一個訂單對象,包含唯一的id、購物車內容、備註和總金額
//清空購物車和備註,並發送orderCreated 事件通知父元件訂單已建立
//同時發送 resetCart 事件通知父元件購物車已被清空
const createOrder = ()=> {
    const order = {
        id: new Date().getTime(),
        cart:[...props.cart], //使用展開運算符建立新購物車項目, 避免直接修改原陣列
        description: localDescription.value,
        sum: props.sum,
    }
    //重置購物車與備註
    localDescription.value = "";
    emits("orderCreated", order); //發送訂單已建立事件到父元件
    emits("resetCart"); //發送重置購物車事件，讓父元件知道購物車已被清空並允許重新添加品項
};





</script>
<style>

</style>