<template>
<h1>Week2 Homework</h1>
<!-- 註冊 -->
<h2>註冊</h2>
<input v-model="signUpEmail" type="email" name="email" id="email-input" placeholder="請輸入電子信箱" />
<input v-model="signUpPassword" type="password" name="password" id="password-input" placeholder="請輸入密碼" />
<input v-model="signUpNikename" type="text" name="name" id="name-input" placeholder="請輸入暱稱" />
<br />
<button type="button" @click="signUp">註冊</button>
<p>{{ signUpMessage }}</p>

<!-- 登入 -->
<h2>登入</h2>
<input v-model="signInEmail" type="email" name="email" id="email-signIn" placeholder="請輸入電子信箱" />
<input v-model="signInPassword" type="password" name="password" id="password-signIn" placeholder="請輸入密碼" />
<br />
<button type="button" @click="signIn">登入</button>
<p>{{ signInMessage  }}</p>

<!-- 驗證 -->
<h2>驗證</h2>
<!-- <input v-model="token" type="text" placeholder="請輸入token" /> -->
<button type="button" @click="checkOut" >驗證</button>
<p>{{ checkOutMessage }}</p>

<!-- 登出 -->
<h2>登出</h2>
<!-- <input v-model="token" type="text" placeholder="請輸入token" /> -->
<button type="button" @click="signOut" >登出</button>
<p>{{ signOutMessage }}</p>
<hr />

<!-- Todo list -->
<div v-if="verify">
    <h2>Todo list</h2>
    <input v-model="addtodo" type="text" name="todo" id="todo-input" />
    <button @click="addTodoItem" type="button">addTodo</button>
    <ul>
        <li v-for="todo in todos" :key="todo.id">
            {{ todo.content }}
            {{ todo.status ? '完成' : '未完成' }}
            <input v-model="todoEdit[todo.id]" type="text" name="update" id="update-input" placeholder="更新值" />
            <button type="button" @click="del(todo.id)">刪除</button>
            <button type="button" @click="update(todo.id)">更新</button>
            <button type="button" @click="togglestatus(todo.id)">切換狀態</button>
        </li>
    </ul>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// 原始API網址
const api = `https://todolist-api.hexschool.io`

//註冊部分
const signUpEmail = ref('');
const signUpPassword = ref('');
const signUpNikename = ref('');
const signUpMessage = ref('');

const uid = ref('');

//註冊操作
const signUp = async () => {
    try{
        const res = await axios.post(`${api}/users/sign_up`,{
            email:signUpEmail.value,
            password: signUpPassword.value,
            nickname: signUpNikename.value
        });
        console.log(res.data);
        signUpMessage.value = '註冊成功 UID:' + res.data.uid
    }
    catch (error){
        console.log(error)
        signUpMessage.value = '錯誤'
    };    
}

//登入部分
const signInEmail = ref('');
const signInPassword = ref('');
const signInMessage = ref('');
const token = ref('');

//登入核實/驗證
const verify = ref(false);
const checkOutMessage = ref('');

//登出訊息
const signOutMessage = ref('');

//登入操作
const signIn = async () => {
    try{
        const res = await axios.post(`${api}/users/sign_in`,{
            email: signInEmail.value,
            password: signInPassword.value
        })
        console.log(res.data);
        signInMessage.value = '登入成功';
        token.value = res.data.token;
        document.cookie = `todo=${token.value};`; //存入名為todo cookies
    }
    catch (error){
        console.log(error);
        signInMessage.value = '錯誤'
    };    
}

//初始化啟動token
onMounted(() => {
    if(todoToken){
        token.value = todoToken;
        verify.value = true;
        getTodos();
    }
})

const todoToken = document.cookie.replace(
  /(?:(?:^|.*;\s*)todo\s*=\s*([^;]*).*$)|^.*$/,
  "$1",
); //取出Cookie裡面的值

console.log(todoToken);

//驗證部分
const checkOut = async () => {
    try{
        const res = await axios.get(`${api}/users/checkout`,{
            headers: {
                Authorization: todoToken
            }
        })
        console.log(res.data);
        if(todoToken){
            verify.value = true;
            getTodos();
        }
        checkOutMessage.value = '驗證成功 UID:' + uid.value
    }
    catch(error){
        console.log(error);
        checkOutMessage.value= '驗證錯誤'
    }
}





//登出部分
const signOut = async () => {
    try{
        const res = await axios.post(`${api}/users/sign_out`,{},{
            headers: {
                Authorization: todoToken
            }
        })
        console.log(res.data)
        verify.value = false;
        //移除cookie  簡化寫法 document.cookie = 'todo='
        const path = '/-HexagonClass' //獲取當前路徑
        const domain = window.location.hostname //獲取當前域名
        console.log('Path:', path);
        console.log('Domain:', domain);
        document.cookie = `todo=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; domain=${domain};`;
        signOutMessage.value = res.data.message;
    }
    catch(error){
        console.log(error);
        signOutMessage.value= '登出錯誤' + error.message;
    };
}

// Todo list清單
const todos = ref([]);
const todoEdit = ref({});
const addtodo = ref('');

//取得所有待辦事項
const getTodos = async () => {
    try{
        const res = await axios.get(`${api}/todos`,{
            headers: {
                Authorization: token.value
            }
        })
        todos.value = res.data.data;
        console.log(todos.value);

    }
    catch(error) {
        console.log(error.data);

    }
} 

//新增待辦事項
const addTodoItem = async () => {
    try{
        const res = await axios.post(`${api}/todos`,
        {
            content: addtodo.value
        },{
            headers: {
                Authorization: token.value
            }
        })
        console.log(res.data);
        getTodos();
    }
    catch(error) {
        console.log(error.data);
    }
} 

//刪除待辦事項
const del = async(id) => {
    try{
        const res = await axios.delete(`${api}/todos/${id}`,
        {
            headers: {
                Authorization: token.value
            }
        })
        console.log(res.data);
        getTodos();
    }
    catch(error) {
        console.log(error.data);
    }
}

//更新待辦事項
const update = async(id) => {
    try{
        const res = await axios.put(`${api}/todos/${id}`,
        {
            content: todoEdit.value[id]
        },
        {
            headers: {
                Authorization: token.value
            }
        })
        console.log(res.data);
        getTodos();
    }
    catch(error) {
        console.log(error.data);
    }
}

// 更新編輯待辦事項
// const updateTodoEdit = (event, id) => {
//     todoEdit.value = {...todoEdit.value, [id]:event.target.value}
// }

//更新待辦事項狀態
const togglestatus = async (id) => {
    try{
        const res = await axios.patch(`${api}/todos/${id}/toggle`,{},
        {
            headers: {
                Authorization: token.value
            }
        })
        console.log(res.data);
        getTodos();
    }
    catch(error) {
        console.log(error.data);
    }
}



</script>

<style>
</style>