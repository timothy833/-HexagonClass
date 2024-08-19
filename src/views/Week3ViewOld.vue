<template>
<div class="container mt-5">
    <div class="row">
        <div class="col-md-4">
            <div class="list-group">
                <a href="#"
                 v-for="drink in drinks" 
                 :key="drink.id" 
                 class="list-group-item list-group-item-action"
                 @click.prevent="addToCart(drink)"
                >
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">{{ drink.name }}</h5>
                    <small>${{ drink.price }}</small>
                </div>
                <p class="mb-1">{{ drink.description }}</p>
                </a>
            </div>
        </div>
        <div class="col-md-8">
            <table class="table">
                <thead>
                    <tr>
                        <th row="scoped" width="50">操作</th>
                        <th row="scoped">品項</th>
                        <th row="scoped">描述</th>
                        <th row="scoped" width="90">數量</th>
                        <th row="scoped">單價</th>
                        <th row="scoped">小計</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in cart" :key="item.id">
                        <td>
                            <button type="button" class="btn btn-sm"
                            @click="removeFromCart(item.id)">
                                x
                            </button>
                        </td>
                        <td>{{ item.name }}</td>
                        <td>
                            <small>
                                {{ item.description }}
                            </small>
                        </td>
                        <td>
                            <label id="quantity-select">點擊數量</label>
                            <select 
                                name="quantity" 
                                id="quantity-select" 
                                class="form-select"
                                v-model="item.quantity"
                                @change="updateCart(item)"    
                            >
                                <option v-for="num in 10" :key="num">{{ num }}</option>
                            </select>
                        </td>
                        <td>{{ item.price }}</td>
                        <td>{{ itemSubtotal(item) }}</td>
                    </tr>
                </tbody>
            </table>
            <div v-if="cart.length === 0" class="alert alert-primary text-center" role="alert">
                請選擇商品
            </div>
            <div v-else>
                <div class="text-end mb-3">
                    <h5>總計:<span>${{ sum }}</span></h5>
                </div>
                <textarea 
                    name="" 
                    id="" 
                    class="form-control mb-3"
                    rows="3"
                    placeholder="備註說明"
                    v-model="description"
                ></textarea>
                <div class="text-end">
                    <button class="btn btn-primary" @click.prevent="createOrder">
                        送出
                    </button>
                </div>
            </div>
        </div>
    </div>
    <hr />
    <div class="row justify-content-center">
        <div class="col-8">
            <div v-if="!order.id" class="alert alert-secondary text-center" role="alert">
                尚未建立訂單
            </div>
            <div v-else class="card">
                <div class="card-body">
                    <div class="card-title">
                        <h5>訂單</h5>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">品項</th>
                                    <th scope="col">數量</th>
                                    <th scope="col">小計</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in order.cart" :key="item.id">
                                    <td>
                                        {{ item.name }}
                                    </td>
                                    <td>
                                        {{ item.quantity }}
                                    </td>
                                    <td>
                                        {{ itemSubtotal(item) }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="text-end">
                            備註:<span>{{ order.description }}</span>
                        </div>
                        <div class="text-end">
                            <h5>總計: <span>${{ order.sum }}</span></h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

</template>

<script setup>
import { ref, computed } from 'vue';

const data = [
  {
    "id": 1,
    "name": "珍珠奶茶",
    "description": "香濃奶茶搭配QQ珍珠",
    "price": 50
  },
  {
    "id": 2,
    "name": "冬瓜檸檬",
    "description": "清新冬瓜配上新鮮檸檬",
    "price": 45
  },
  {
    "id": 3,
    "name": "翡翠檸檬",
    "description": "綠茶與檸檬的完美結合",
    "price": 55
  },
  {
    "id": 4,
    "name": "四季春茶",
    "description": "香醇四季春茶，回甘無比",
    "price": 45
  },
  {
    "id": 5,
    "name": "阿薩姆奶茶",
    "description": "阿薩姆紅茶搭配香醇鮮奶",
    "price": 50
  },
  {
    "id": 6,
    "name": "檸檬冰茶",
    "description": "檸檬與冰茶的清新組合",
    "price": 45
  },
  {
    "id": 7,
    "name": "芒果綠茶",
    "description": "芒果與綠茶的獨特風味",
    "price": 55
  },
  {
    "id": 8,
    "name": "抹茶拿鐵",
    "description": "抹茶與鮮奶的絕配",
    "price": 60
  }
]

const drinks = ref(data);
const cart = ref([]);
const description = ref('');
const order = ref({});

const sum = computed(()=> {
    return cart.value.reduce((pre, next) =>{
        return pre + next.price*next.quantity
    }, 0)
})

const addToCart = (drink) => {
    cart.value.push({
        ...drink,
        id: new Date().getTime(),
        quantity: 1
    });
};

const updateCart = (item) => {
    cart.value = cart.value.map((cartItem) => {
        if(cartItem.id === item.id){
            cartItem.quantity = parseInt(item.quantity);
        }
        return cartItem;
    });
};

const removeFromCart = (id) => {
    cart.value = cart.value.filter((cartItem) => cartItem.id !== id);
};

const createOrder = () => {
    order.value = {
        id: new Date().getTime(),
        cart: cart.value,
        description: description.value,
        sum: sum.value
    };
    cart.value = [];
    description.value = '';
};

const itemSubtotal = (item)=> {
    return item.price*item.quantity;
};
</script>

<style scoped>


</style>