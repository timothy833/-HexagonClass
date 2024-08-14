<template>
<div class="container">
<h1>六角手搖店</h1>
<h2>六角Class Week1</h2>

<table>
    <thead>
    <tr>
        <th scope="col">品項</th>
        <th scope="col">描述</th>
        <th scope="col">價格</th>
        <th scope="col">庫存</th>
        <th scope="col">變更</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="cup in drink" :key="cup.id">
        <td class="name">{{ cup.name }}</td>
        <td class="descripe">{{ cup.describe }}</td>
        <td class="price">{{ cup.price }}</td>
        <td class="stock">
        <button @click="changeStock(cup.id, cup.stock - 1)" :disabled="cup.stock < 1">-</button>
        {{ cup.stock }}
        <button @click="changeStock(cup.id, cup.stock +1)">+</button>
        </td>
        <td class="edit">
        <button @click="changeEdit(cup)">編輯</button>
        </td>
    </tr>
    </tbody>
</table> 

<div v-if="productEdit.id" class="edit-area">
    <h2>編輯區域</h2>
    <label>
    編輯商品名稱區域:{{ productEdit.name }}
    <input type="text" v-model="productEdit.name" />
    </label>
    <button type="button" @click="confirmEdit">更新</button>
    <button type="button" @click="cancelEdit">取消</button>
</div>

</div>

</template>

<script setup>
import { ref } from 'vue';

const shopList = [{
    id: 1,
    name: '珍珠奶茶',
    describe: '香濃奶茶搭配QQ珍珠',
    price: 50,
    stock: 20,
},
{
    id: 2,
    name: '冬瓜檸檬',
    describe: '清新冬瓜配上新鮮檸檬',
    price: 45,
    stock: 18,
},
{
    id: 3,
    name: '翡翠檸檬',
    describe: '綠茶與檸檬的完美結合',
    price: 55,
    stock: 34,
},
{
    id: 4,
    name: '四季春茶',
    describe: '香醇四季春茶，回甘無比',
    price: 45,
    stock: 10,
},
{
    id: 5,
    name: '阿薩姆奶茶',
    describe: '阿薩姆紅茶搭配香醇鮮奶',
    price: 50,
    stock: 25,
},
{
    id: 6,
    name: '檸檬冰茶',
    describe: '檸檬與冰茶的清新組合',
    price: 45,
    stock: 20,
},
{
    id: 7,
    name: '芒果綠茶',
    describe: '芒果與綠茶的獨特風味',
    price: 55,
    stock: 18,
},
{
    id: 8,
    name: '抹茶拿鐵',
    describe: '抹茶與鮮奶的絕配',
    price: 60,
    stock: 20,
},
]

const drink = ref(shopList);

//庫存變化函式
function changeStock(id, stock){
drink.value = drink.value.map(
    (item) => {
    if(item.id === id){
        item.stock = stock;
    }
    return item;
    }
)  
}

const productEdit = ref({
    id: '',
    name: '',
})

const changeEdit = (item) => {
    productEdit.value = {...item}; //淺拷貝
    console.log(productEdit.value);
    //傳參考
}

const confirmEdit = () => {
    const index = drink.value.findIndex( item => item.id === productEdit.value.id);
    console.log(productEdit.value.id);
    //輸入值覆蓋替換原本值
    drink.value[index] = productEdit.value;

    //還原輸入框
    productEdit.value = {};
}

const cancelEdit = () =>{
    productEdit.value = {};
}


</script>


<style scoped>
th{
    color: #f8d9b5;
}

.container{
    width: 800px;
    margin: 0 auto;
    padding: 10px;
}

h1, h2 {
    text-align: center;
}


table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    margin-bottom: 20px;
}

th, td {
    border: 1px solid #3f0102;
    padding: 10px;
    text-align: center;
}

th{
    background-color: rgb(160, 3, 3);
}

tbody > tr:hover > *{
    background-color: #d68324;
    color: rgb(253, 255, 127);
}

.name, .stock {
    width: 150px;
}

.describe{
    width: 500px;
}

button{
    margin: 5px;
    color: #542602;
    border: 1px solid #3f0102;
    border-radius: 20%;
}

.edit-area{
    padding: 20px;
    border: 1px solid #3f0102;
    background-color: #f8d9b5;
}

label {
    display: block;
    margin-bottom: 10px;
}
</style>