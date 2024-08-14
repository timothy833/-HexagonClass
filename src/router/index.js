import { createRouter, createWebHashHistory } from "vue-router";
import Week1View from "@/views/Week1View.vue";
import Week2View from "@/views/Week2View.vue";
import HomeView from "@/views/HomeView.vue";

const routes = [
    {
        path: '/',
        name: "Home",
        component: HomeView,
        children:[{
            path: 'Week1',
            name: "Week1",
            component: Week1View
        },
        {
            path: 'Week2',
            name: "Week2",
            component: Week2View
        },]
    },
    
];

const router = createRouter({
    history: createWebHashHistory( import.meta.env.BASE_URL),
    routes,
});

export default router;